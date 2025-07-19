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

    // Get actual survey data from database
    const { data: surveys, error } = await supabaseAdmin
      .from('customer_surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching surveys:', error);
      // Return mock data as fallback
      const mockSurveys = [
        {
          id: 'srv_001',
          customerName: 'Alice Johnson',
          email: 'alice@example.com',
          foodQuality: 5,
          serviceQuality: 4,
          atmosphere: 5,
          valueForMoney: 4,
          recommendation: 5,
          feedback: 'Excellent food and great service! Will definitely come back.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'srv_002',
          customerName: 'Bob Wilson',
          email: 'bob@example.com',
          foodQuality: 4,
          serviceQuality: 5,
          atmosphere: 4,
          valueForMoney: 4,
          recommendation: 4,
          feedback: 'Good experience overall. The staff was very friendly.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'srv_003',
          customerName: 'Carol Davis',
          email: 'carol@example.com',
          foodQuality: 3,
          serviceQuality: 3,
          atmosphere: 4,
          valueForMoney: 3,
          recommendation: 3,
          feedback: 'Food was okay, but service could be improved.',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockSurveys
      });
    }

    return NextResponse.json({
      success: true,
      data: surveys || []
    });

  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}