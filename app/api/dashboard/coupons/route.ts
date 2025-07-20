import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching coupons...');
    
    const supabase = createServerSupabaseClient();
    console.log('Supabase client created');

    const { data: coupons, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Query result:', { coupons, error });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupons || []
    });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const couponData = await request.json();
    const supabase = createServerSupabaseClient();

    // Map the form data to match your database schema
    const mappedData = {
      code: couponData.code,
      discount_type: couponData.discount_type,
      discount_value: couponData.discount_value,
      min_order_amount: couponData.min_order_amount,
      max_discount_amount: couponData.max_discount_amount || null,
      usage_limit: couponData.max_uses,
      used_count: 0,
      is_active: couponData.is_active,
      valid_from: new Date().toISOString(),
      valid_until: new Date(couponData.expires_at + 'T23:59:59.999Z').toISOString()
    };

    const { data: coupon, error } = await supabase
      .from('discount_coupons')
      .insert([mappedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon
    });

  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create coupon' },
      { status: 500 }
    );
  }
}