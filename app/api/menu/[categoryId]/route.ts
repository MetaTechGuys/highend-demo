import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    const categoryId = parseInt(params.categoryId);

    console.log('Fetching menu items for category:', categoryId, 'language:', lang);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // First, get the category info
    const { data: category, error: categoryError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('id', categoryId)
      .eq('is_active', true)
      .single();

    if (categoryError) {
      console.error('Category error:', categoryError);
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Then get the menu items for this category
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_available', true)
      .order('order', { ascending: true });

    if (itemsError) {
      console.error('Items error:', itemsError);
      throw itemsError;
    }

    console.log('Raw items from database:', items);

    // Transform the items to match the expected format
    const transformedItems = items?.map(item => {
      const transformedItem: any = {
        id: item.id,
        name: typeof item.name === 'object' ? item.name[lang] || item.name['en'] : item.name,
        description: typeof item.description === 'object' ? item.description[lang] || item.description['en'] : item.description,
        image: item.image,
        isAvailable: item.is_available,
        isDiscounted: item.is_discounted,
      };

      // Handle pricing based on whether item has sizes
      if (item.has_sizes && typeof item.price === 'object') {
        transformedItem.priceSmall = item.price.small;
        transformedItem.priceLarge = item.price.large;
        transformedItem.price = item.price.small; // Default to small price
        
        if (item.original_price && typeof item.original_price === 'object') {
          transformedItem.originalPriceSmall = item.original_price.small;
          transformedItem.originalPriceLarge = item.original_price.large;
          transformedItem.originalPrice = item.original_price.small;
        }
        
        transformedItem.isDiscountedSmall = item.is_discounted_small;
        transformedItem.isDiscountedLarge = item.is_discounted_large;
      } else {
        // Single price item
        transformedItem.price = typeof item.price === 'object' ? item.price.single || item.price : item.price;
        transformedItem.originalPrice = typeof item.original_price === 'object' ? item.original_price.single || item.original_price : item.original_price;
      }

      return transformedItem;
    }) || [];

    console.log('Transformed items:', transformedItems);

    const result = {
      category: {
        id: category.id,
        title: typeof category.title === 'object' ? category.title[lang] || category.title['en'] : category.title,
        image: category.image,
        header_image: category.header_image,
      },
      items: transformedItems,
    };

    return NextResponse.json({
      success: true,
      data: result,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch menu items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}