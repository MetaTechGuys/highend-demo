import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching menu categories...');
    
    const { data: categories, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true });

    console.log('Categories fetched:', categories);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categories || []
    });

  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu categories' },
      { status: 500 }
    );
  }
}