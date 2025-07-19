import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface MenuCategory {
  id: number;
  title: {
    en: string;
    fa: string;
  };
  image: string;
  header_image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  id: number;
  category_id: number;
  name: {
    en: string;
    fa: string;
  };
  description?: {
    en: string;
    fa: string;
  };
  image: string;
  price?: number;
  price_small?: number;
  price_large?: number;
  original_price?: number;
  original_price_small?: number;
  original_price_large?: number;
  is_discounted: boolean;
  is_discounted_small: boolean;
  is_discounted_large: boolean;
  is_available: boolean;
  has_sizes: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    const categoryId = params.categoryId;

    // Validate categoryId
    const categoryIdNum = parseInt(categoryId);
    if (isNaN(categoryIdNum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // First, get the category to ensure it exists
    const { data: category, error: categoryError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('id', categoryIdNum)
      .eq('is_active', true)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get menu items for this category
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryIdNum)
      .order('display_order', { ascending: true });

    if (itemsError) {
      throw itemsError;
    }

    // Transform the data to match the expected format
    const transformedCategory: MenuCategory = category as MenuCategory;
    const transformedItems: MenuItem[] = (items || []) as MenuItem[];

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: transformedCategory.id,
          title: transformedCategory.title[lang as keyof typeof transformedCategory.title] || transformedCategory.title.en,
          image: transformedCategory.image,
          headerImage: transformedCategory.header_image,
        },
        items: transformedItems.map((item) => ({
          id: item.id,
          name: item.name[lang as keyof typeof item.name] || item.name.en,
          description: item.description?.[lang as keyof typeof item.description] || item.description?.en,
          image: item.image,
          price: item.price?.toString() || '0',
          priceSmall: item.price_small?.toString(),
          priceLarge: item.price_large?.toString(),
          originalPrice: item.original_price?.toString(),
          originalPriceSmall: item.original_price_small?.toString(),
          originalPriceLarge: item.original_price_large?.toString(),
          isDiscounted: item.is_discounted,
          isDiscountedSmall: item.is_discounted_small,
          isDiscountedLarge: item.is_discounted_large,
          isAvailable: item.is_available,
          hasSizes: item.has_sizes,
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}