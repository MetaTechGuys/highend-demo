import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { status, paymentReference } = await request.json();
    const { orderNumber } = params;

    if (!status || !['paid', 'failed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        payment_status: status,
        payment_reference: paymentReference || null,
        updated_at: new Date().toISOString()
      })
      .eq('order_number', orderNumber)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}