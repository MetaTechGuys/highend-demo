import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'employee' } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'employee'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be admin, manager, or employee' },
        { status: 400 }
      );
    }

    // Check if employee already exists
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingEmployee) {
      return NextResponse.json(
        { success: false, error: 'Employee with this email already exists' },
        { status: 409 }
      );
    }

    // Insert employee - the database trigger will hash the password
    const { data: newEmployee, error } = await supabase
      .from('employees')
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: password, // Will be hashed by trigger
          name,
          role
        }
      ])
      .select('id, email, name, role, is_active, created_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      employee: newEmployee
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register employee' },
      { status: 500 }
    );
  }
}