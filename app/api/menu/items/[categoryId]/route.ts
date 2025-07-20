import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    console.log('=== API Route Called ===');
    console.log('Category ID:', params.categoryId);
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    
    console.log('Language:', lang);
    
    // Fetch menu items
    const { data: items, error } = await supabase
      .from('menu_items')
      .select(`
        id,
        category_id,
        key,
        name,
        description,
        image,
        price,
        original_price,
        is_available,
        is_discounted,
        has_sizes,
        is_discounted_small,
        is_discounted_large,
        "order",
        created_at,
        updated_at
      `)
      .eq('category_id', parseInt(params.categoryId))
      .order('order', { ascending: true });

    console.log('Query executed. Error:', error);
    console.log('Items found:', items?.length || 0);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: items || []
    });

  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}