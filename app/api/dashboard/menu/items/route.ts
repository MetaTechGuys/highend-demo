import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    console.log('Fetching menu items, category_id:', categoryId);

    let query = supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(id, title, key)
      `)
      .order('order', { ascending: true });

    // If category_id is provided, filter by it
    if (categoryId) {
      query = query.eq('category_id', parseInt(categoryId));
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(`Found ${items?.length || 0} menu items`);

    return NextResponse.json({
      success: true,
      data: items || []
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// Keep your existing POST method if you have one
export async function POST(request: NextRequest) {
  // Your existing POST logic here
}