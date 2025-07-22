import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, phone, address, email } = await request.json();

    // Validate required fields
    if (!name || !phone || !address) {
      return NextResponse.json({
        success: false,
        error: 'Name, phone, and address are required'
      }, { status: 400 });
    }

    // First, try to find existing customer by phone
    const { data: existingCustomer, error: findError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error finding customer:', findError);
      return NextResponse.json({
        success: false,
        error: 'Database error while checking customer'
      }, { status: 500 });
    }

    let customer;

    if (existingCustomer) {
      // Update existing customer if information has changed
      const needsUpdate = 
        existingCustomer.name !== name ||
        existingCustomer.address !== address ||
        existingCustomer.email !== email;

      if (needsUpdate) {
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update({
            name,
            address,
            email: email || null
          })
          .eq('id', existingCustomer.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating customer:', updateError);
          return NextResponse.json({
            success: false,
            error: 'Failed to update customer information'
          }, { status: 500 });
        }

        customer = updatedCustomer;
      } else {
        customer = existingCustomer;
      }
    } else {
      // Create new customer
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          name,
          phone,
          address,
          email: email || null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating customer:', insertError);
        return NextResponse.json({
          success: false,
          error: 'Failed to create customer'
        }, { status: 500 });
      }

      customer = newCustomer;
    }

    return NextResponse.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Customer API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}