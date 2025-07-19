import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const menuItemData = await request.json();
    
    // Here you would update the menu item in your database
    // For now, just return success
    console.log('Updating menu item:', (await params).id, menuItemData);

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully'
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
