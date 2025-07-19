import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tokenData = JSON.parse(atob(token));
    if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ success: false, error: 'Token expired' }, { status: 401 });
    }

    const { data: employee } = await supabaseAdmin
      .from('employees')
      .select('role')
      .eq('id', tokenData.employeeId)
      .single();

    if (!employee || employee.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    // Mock orders data - replace with actual database query
    const mockOrders = [
      {
        id: 'ord_001',
        customerName: 'John Doe',
        items: [
          { name: 'Classic Burger', quantity: 2, price: 15.99 },
          { name: 'Fries', quantity: 1, price: 5.99 }
        ],
        total: 37.97,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'ord_002',
        customerName: 'Jane Smith',
        items: [
          { name: 'Caesar Salad', quantity: 1, price: 12.99 },
          { name: 'Soft Drink', quantity: 1, price: 2.99 }
        ],
        total: 15.98,
        status: 'preparing',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'ord_003',
        customerName: 'Mike Johnson',
        items: [
          { name: 'Pizza Margherita', quantity: 1, price: 18.99 },
          { name: 'Garlic Bread', quantity: 1, price: 6.99 }
        ],
        total: 25.98,
        status: 'ready',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockOrders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}