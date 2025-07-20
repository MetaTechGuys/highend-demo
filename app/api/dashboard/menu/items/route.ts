import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET - Fetch menu items
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

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Creating new menu item:', body);

    // Validate required fields
    const requiredFields = ['category_id', 'name', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Prepare the data for insertion
    const menuItemData = {
      category_id: parseInt(body.category_id),
      name: body.name,
      description: body.description || null,
      price: parseFloat(body.price),
      price_small: body.price_small ? parseFloat(body.price_small) : null,
      price_large: body.price_large ? parseFloat(body.price_large) : null,
      image: body.image || null,
      is_available: body.is_available !== undefined ? body.is_available : true,
      is_discounted: body.is_discounted !== undefined ? body.is_discounted : false,
      original_price: body.original_price ? parseFloat(body.original_price) : null,
      original_price_small: body.original_price_small ? parseFloat(body.original_price_small) : null,
      original_price_large: body.original_price_large ? parseFloat(body.original_price_large) : null,
      order: body.order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('menu_items')
      .insert([menuItemData])
      .select(`
        *,
        menu_categories(id, title, key)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Menu item created successfully:', data);

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Menu item created successfully'
    });

  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

// PUT - Update existing menu item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Updating menu item:', body);

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    // Prepare the data for update
    const updateData = {
      name: body.name,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      price_small: body.price_small ? parseFloat(body.price_small) : null,
      price_large: body.price_large ? parseFloat(body.price_large) : null,
      image: body.image,
      is_available: body.is_available,
      is_discounted: body.is_discounted,
      original_price: body.original_price ? parseFloat(body.original_price) : null,
      original_price_small: body.original_price_small ? parseFloat(body.original_price_small) : null,
      original_price_large: body.original_price_large ? parseFloat(body.original_price_large) : null,
      order: body.order,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', body.id)
      .select(`
        *,
        menu_categories(id, title, key)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Menu item updated successfully:', data);

    return NextResponse.json({
      success: true,
      data: data,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    
    console.log('Deleting menu item with ID:', itemId);

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    // First, check if the item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('menu_items')
      .select('id, name')
      .eq('id', parseInt(itemId))
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
      .eq('id', parseInt(itemId));

    if (deleteError) {
      console.error('Supabase error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    console.log('Menu item deleted successfully:', existingItem.name);

    return NextResponse.json({
      success: true,
      message: `Menu item "${existingItem.name}" deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
