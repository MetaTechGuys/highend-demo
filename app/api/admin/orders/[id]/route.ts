import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status } = await request.json();
    
    // Here you would update the order status in your database
    console.log('Updating order status:', params.id, status);

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}