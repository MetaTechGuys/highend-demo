import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Define interfaces for type safety
interface MenuItemPrice {
  small?: number;
  large?: number;
  default?: number;
}

interface MenuItemName {
  en: string;
  [key: string]: string;
}

interface MenuItemDescription {
  en: string;
  [key: string]: string;
}

interface MenuItemUpdateData {
  name?: MenuItemName;
  description?: MenuItemDescription;
  price?: MenuItemPrice;
  original_price?: MenuItemPrice | null;
  is_available: boolean;
  is_discounted: boolean;
  has_sizes: boolean;
  is_discounted_small?: boolean;
  is_discounted_large?: boolean;
  updated_at: string;
}

interface MenuItemRequestBody {
  name_en?: string;
  description_en?: string;
  price_small?: string | number;
  price_large?: string | number;
  price_default?: string | number;
  original_price_small?: string | number;
  original_price_large?: string | number;
  original_price_default?: string | number;
  is_available: boolean;
  is_discounted: boolean;
  has_sizes: boolean;
  is_discounted_small?: boolean;
  is_discounted_large?: boolean;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemData: MenuItemRequestBody = await request.json();
    console.log('Received update data for item:', params.id, itemData);

    // Prepare the update data with proper typing
    const updateData: MenuItemUpdateData = {
      is_available: itemData.is_available,
      is_discounted: itemData.is_discounted,
      has_sizes: itemData.has_sizes,
      updated_at: new Date().toISOString()
    };

    // Handle name (JSONB)
    if (itemData.name_en) {
      updateData.name = { en: itemData.name_en };
    }

    // Handle description (JSONB)
    if (itemData.description_en) {
      updateData.description = { en: itemData.description_en };
    }

    // Handle price (JSONB) - this is crucial
    if (itemData.has_sizes) {
      updateData.price = {
        small: parseFloat(String(itemData.price_small)) || 0,
        large: parseFloat(String(itemData.price_large)) || 0
      };
      updateData.is_discounted_small = itemData.is_discounted_small || false;
      updateData.is_discounted_large = itemData.is_discounted_large || false;
      
      if (itemData.is_discounted) {
        updateData.original_price = {
          small: parseFloat(String(itemData.original_price_small)) || 0,
          large: parseFloat(String(itemData.original_price_large)) || 0
        };
      } else {
        updateData.original_price = null;
      }
    } else {
      updateData.price = { 
        default: parseFloat(String(itemData.price_default)) || 0
      };
      
      if (itemData.is_discounted) {
        updateData.original_price = { 
          default: parseFloat(String(itemData.original_price_default)) || 0
        };
      } else {
        updateData.original_price = null;
      }
    }

    console.log('Prepared update data:', updateData);

    const { data: item, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        menu_categories(id, title, key)
      `)
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Item updated successfully:', item);

    return NextResponse.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching menu item with ID:', params.id);

    const { data: item, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(id, title, key)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    console.log('Item fetched successfully:', item);

    return NextResponse.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting menu item with ID:', params.id);

    // First check if the item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('menu_items')
      .select('id, name')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    console.log('Item deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
