export interface MenuCategory {
  id: number;
  key: string;
  title: Record<string, string>;
  image: string;
  header_image: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  key: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  image: string;
  price: string | Record<string, string>;
  original_price?: string | Record<string, string>;
  is_available: boolean;
  is_discounted: boolean;
  has_sizes: boolean;
  is_discounted_small: boolean;
  is_discounted_large: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuDetailItem {
  id: number;
  name: string;
  image: string;
  price: string;
  priceSmall?: string;
  priceLarge?: string;
  description?: string;
  isDiscounted?: boolean;
  originalPrice?: string;
  isDiscountedSmall?: boolean;
  isDiscountedLarge?: boolean;
  originalPriceSmall?: string;
  originalPriceLarge?: string;
  isAvailable?: boolean;
}