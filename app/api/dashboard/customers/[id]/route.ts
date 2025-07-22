import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, phone, email, address } = await request.json();
    const customerId = parseInt((await params).id);

    if (isNaN(customerId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid customer ID'
      }, { status: 400 });
    }

    // Validate required fields
    if (!name || !phone || !address) {
      return NextResponse.json({
        success: false,
        error: 'Name, phone, and address are required'
      }, { status: 400 });
    }

    // Check if phone already exists for another customer
    const { data: existingCustomer, error: findError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .neq('id', customerId)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error checking existing customer:', findError);
      return NextResponse.json({
        success: false,
        error: 'Database error'
      }, { status: 500 });
    }

    if (existingCustomer) {
      return NextResponse.json({
        success: false,
        error: 'Another customer with this phone number already exists'
      }, { status: 400 });
    }

    // Update customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        address: address.trim()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating customer:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update customer'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCustomer
    });

  } catch (error) {
    console.error('Update customer API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customerId = parseInt((await params).id);

    if (isNaN(customerId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid customer ID'
      }, { status: 400 });
    }

    // Check if customer has any orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('customer_id', customerId)
      .limit(1);

    if (ordersError) {
      console.error('Error checking customer orders:', ordersError);
      return NextResponse.json({
        success: false,
        error: 'Database error'
      }, { status: 500 });
    }

    if (orders && orders.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete customer with existing orders'
      }, { status: 400 });
    }

    // Delete customer
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (deleteError) {
      console.error('Error deleting customer:', deleteError);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete customer'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}