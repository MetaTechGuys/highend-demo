import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching surveys...');
    
    const supabase = createServerSupabaseClient();
    console.log('Supabase client created');

    const { data: surveys, error } = await supabase
      .from('customer_surveys')
      .select('*')
      .order('submitted_at', { ascending: false });

    console.log('Query result:', { surveys, error });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: surveys || []
    });

  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch surveys' },
      { status: 500 }
    );
  }
}