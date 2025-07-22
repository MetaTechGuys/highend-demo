import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch customers'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: customers || []
    });

  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, address } = await request.json();

    // Validate required fields
    if (!name || !phone || !address) {
      return NextResponse.json({
        success: false,
        error: 'Name, phone, and address are required'
      }, { status: 400 });
    }

    // Check if phone already exists
    const { data: existingCustomer, error: findError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone)
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
        error: 'A customer with this phone number already exists'
      }, { status: 400 });
    }

    // Create new customer
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        address: address.trim()
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

    return NextResponse.json({
      success: true,
      data: newCustomer
    });

  } catch (error) {
    console.error('Create customer API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}