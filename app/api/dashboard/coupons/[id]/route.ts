import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      usage_limit: couponData.max_uses, // Map max_uses to usage_limit
      is_active: couponData.is_active,
      valid_until: new Date(couponData.expires_at + 'T23:59:59.999Z').toISOString() // Map expires_at to valid_until
    };

    const { data: coupon, error } = await supabase
      .from('discount_coupons') // Changed from 'coupons' to 'discount_coupons'
      .update(mappedData)
      .eq('id', params.id)
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
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('discount_coupons') // Changed from 'coupons' to 'discount_coupons'
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}