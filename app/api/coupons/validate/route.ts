import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount } = await request.json();

    if (!code || !orderAmount) {
      return NextResponse.json(
        { success: false, error: 'Code and order amount are required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get coupon details
    const { data: coupon, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired coupon code'
      });
    }

    // Check if coupon is still valid
    const now = new Date();
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({
        success: false,
        error: 'Coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({
        success: false,
        error: 'Coupon usage limit exceeded'
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.min_order_amount) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount is ${coupon.min_order_amount}T`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount,
        newTotal: orderAmount - discountAmount,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}