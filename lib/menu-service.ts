import { supabase } from './supabase';
import type { MenuCategory, MenuItem, MenuDetailItem } from '@/types/database';

export class MenuService {
  static getCategoryWithItems: any;
  getCategoryWithItems(categoryId: number, arg1: string) {
      throw new Error('Method not implemented.');
  }
  // Get all menu categories
  static async getCategories(language: string = 'en'): Promise<MenuCategory[]> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch menu categories');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch menu categories');
    }
  }

  // Get category by ID
  static async getCategoryById(id: number): Promise<MenuCategory | null> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch category');
      }

      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  }

  // Get menu items by category
  static async getMenuItems(categoryId: number, language: string = 'en'): Promise<MenuDetailItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch menu items');
      }

      return (data || []).map(item => this.transformMenuItem(item, language));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  // Transform database item to MenuDetailItem format
  private static transformMenuItem(item: MenuItem, language: string): MenuDetailItem {
    const name = typeof item.name === 'object' ? 
      item.name[language] || item.name['en'] : 
      item.name;

    const description = typeof item.description === 'object' ? 
      item.description[language] || item.description['en'] : 
      item.description;

    let result: MenuDetailItem = {
      id: item.id,
      name,
      image: item.image,
      price: '',
      description,
      isDiscounted: item.is_discounted,
      isAvailable: item.is_available,
    };

    // Handle pricing based on whether item has sizes
    if (item.has_sizes && typeof item.price === 'object') {
      // Item with sizes (like pizza/seafood)
      const priceObj = item.price as Record<string, string>;
      const originalPriceObj = (item.original_price as Record<string, string>) || {};

      result.priceSmall = priceObj.small || '';
      result.priceLarge = priceObj.large || '';
      result.price = priceObj.small || ''; // Default to small price
      result.isDiscountedSmall = item.is_discounted_small;
      result.isDiscountedLarge = item.is_discounted_large;
      result.originalPriceSmall = originalPriceObj.small || undefined;
      result.originalPriceLarge = originalPriceObj.large || undefined;
    } else {
      // Regular item without sizes
      result.price = typeof item.price === 'string' ? item.price : item.price?.toString() || '';
      result.originalPrice = typeof item.original_price === 'string' ? 
        item.original_price : 
        item.original_price?.toString() || undefined;
      result.priceSmall = undefined;
      result.priceLarge = undefined;
      result.isDiscountedSmall = false;
      result.isDiscountedLarge = false;
      result.originalPriceSmall = undefined;
      result.originalPriceLarge = undefined;
    }

    return result;
  }

  // Create new menu item
  static async createMenuItem(data: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    try {
      const { data: item, error } = await supabase
        .from('menu_items')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to create menu item');
      }

      return item;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  }

  // Update menu item
  static async updateMenuItem(id: number, data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const { data: item, error } = await supabase
        .from('menu_items')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to update menu item');
      }

      return item;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  }

  // Delete menu item
  static async deleteMenuItem(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new Error('Failed to delete menu item');
    }
  }

  // Update item availability
  static async updateItemAvailability(id: number, isAvailable: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ 
          is_available: isAvailable,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to update item availability');
      }
    } catch (error) {
      console.error('Error updating item availability:', error);
      throw new Error('Failed to update item availability');
    }
  }
}