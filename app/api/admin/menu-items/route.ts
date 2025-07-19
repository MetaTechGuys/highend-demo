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

    // Verify token and get employee
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

    // Get menu items (this would be from your menu items table)
    // For now, return mock data
    const mockMenuItems = [
      {
        id: 1,
        name: 'Classic Burger',
        price: '310T',
        description: 'Beef burger / Lettuce / Tomato / Pickles / Special sauce',
        image: '/images/menu/items/2/Whisk_4817c78dea.webp',
        isDiscounted: false,
        originalPrice: '350T',
        isAvailable: true,
        categoryId: 2
      },
      // Add more mock items...
    ];

    return NextResponse.json({
      success: true,
      data: mockMenuItems
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}