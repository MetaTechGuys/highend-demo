import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemData = await request.json();
    console.log('Received update data for item:', params.id, itemData);

    // Prepare the update data
    const updateData: any = {
      is_available: itemData.is_available,
      is_discounted: itemData.is_discounted,
      has_sizes: itemData.has_sizes,
      is_discounted_small: itemData.is_discounted_small || false,
      is_discounted_large: itemData.is_discounted_large || false,
      image: itemData.image,
      order: itemData.order || 0,
      updated_at: new Date().toISOString()
    };

    // Handle multilingual name (JSONB)
    const nameObj: any = {};
    if (itemData.name_en && itemData.name_en.trim()) {
      nameObj.en = itemData.name_en.trim();
    }
    if (itemData.name_fa && itemData.name_fa.trim()) {
      nameObj.fa = itemData.name_fa.trim();
    }
    if (Object.keys(nameObj).length > 0) {
      updateData.name = nameObj;
    }

    // Handle multilingual description (JSONB)
    const descObj: any = {};
    if (itemData.description_en && itemData.description_en.trim()) {
      descObj.en = itemData.description_en.trim();
    }
    if (itemData.description_fa && itemData.description_fa.trim()) {
      descObj.fa = itemData.description_fa.trim();
    }
    if (Object.keys(descObj).length > 0) {
      updateData.description = descObj;
    }

    // Handle price (JSONB) - this is crucial
    if (itemData.has_sizes) {
      updateData.price = {
        small: parseFloat(itemData.price_small) || 0,
        large: parseFloat(itemData.price_large) || 0
      };
      
      if (itemData.is_discounted_small || itemData.is_discounted_large) {
        updateData.original_price = {
          small: parseFloat(itemData.original_price_small) || 0,
          large: parseFloat(itemData.original_price_large) || 0
        };
      } else {
        updateData.original_price = null;
      }
    } else {
      updateData.price = { 
        default: parseFloat(itemData.price_default) || 0
      };
      
      if (itemData.is_discounted) {
        updateData.original_price = { 
          default: parseFloat(itemData.original_price_default) || 0
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
      data: item,
      message: 'Menu item updated successfully'
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}
