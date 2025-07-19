import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const {
      customerInfo,
      items,
      subtotal,
      discountAmount = 0,
      discountCode,
      totalAmount
    } = orderData;

    // Validate required fields
    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address || !items?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer information or items' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const orderNumber = generateOrderNumber();

    // Create payment URL (replace with your actual payment gateway)
    const paymentUrl = `https://payment-gateway.com/pay?order=${orderNumber}&amount=${totalAmount}`;

    // Insert order into database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email || null,
        customer_address: customerInfo.address,
        items: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        discount_amount: parseFloat(discountAmount),
        discount_code: discountCode || null,
        total_amount: parseFloat(totalAmount),
        payment_url: paymentUrl,
        notes: customerInfo.notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    // If discount code was used, increment its usage count
    if (discountCode) {
      await supabase
        .from('discount_coupons')
        .update({ 
          used_count: "used_count + 1",
          updated_at: new Date().toISOString()
        })
        .eq('code', discountCode.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      data: {
        orderNumber,
        paymentUrl,
        orderId: order.id
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}