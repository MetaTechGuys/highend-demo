import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get employee from database
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password using the RPC function
    const { data: isValidPassword, error: verifyError } = await supabase
      .rpc('verify_password', {
        stored_hash: employee.password_hash,
        provided_password: password
      });

    if (verifyError || !isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    const employeeData = {
  id: employee.id,
  email: employee.email,
  name: employee.name,
  role: employee.role,
  is_active: employee.is_active
};

    // Generate session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        employeeId: employee.id,
        email: employee.email,
        role: employee.role,
        timestamp: Date.now()
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      employee: employeeData,
      token: sessionToken
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}