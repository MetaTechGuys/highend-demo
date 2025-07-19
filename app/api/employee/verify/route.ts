import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      );
    }

    try {
      // Try to decode as simple token first
      const tokenData = JSON.parse(atob(token));
      
      // Check if token is expired
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        return NextResponse.json(
          { success: false, error: 'Token expired' },
          { status: 401 }
        );
      }

      // Verify employee still exists and is active
      const { data: employee, error } = await supabaseAdmin
        .from('employees')
        .select('id, email, name, role, is_active')
        .eq('id', tokenData.employeeId)
        .eq('is_active', true)
        .single();

      if (error || !employee) {
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        employee
      });

    } catch (decodeError) {
      // If it's not a simple token, it might be a Supabase JWT
      return NextResponse.json(
        { success: false, error: 'Invalid token format' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}