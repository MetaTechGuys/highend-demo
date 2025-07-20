"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import { useLanguage } from "@/app/contexts";
import { useCart } from "@/app/contexts/CartContext";
import "./MenuDetail.scss";

interface MenuItem {
  id: number;
  title: string;
  image: string;
  headerImage: string;
}

interface MenuDetailItem {
  id: number;
  category_id: number;
  key: string;
  name: string | Record<string, string>; // JSONB field
  description?: string | Record<string, string>; // JSONB field
  image: string;
  price: number | Record<string, number>; // JSONB field
  original_price?: number | Record<string, number>; // JSONB field
  is_available: boolean;
  is_discounted: boolean;
  has_sizes: boolean;
  is_discounted_small: boolean;
  is_discounted_large: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  menu_categories?: {
    id: number;
    title: string | Record<string, string>;
    key: string;
  };
}

interface MenuDetailProps {
  menuItem: MenuItem;
  onBack: () => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({ menuItem, onBack }) => {
  const { isRTL, t, language } = useLanguage();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  
  const [detailItems, setDetailItems] = useState<MenuDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get localized text from JSONB field
const getLocalizedText = useCallback((
  jsonbField: string | Record<string, string> | null | undefined, 
  fallback: string = ''
): string => {
  if (!jsonbField) return fallback;
  if (typeof jsonbField === 'string') return jsonbField;
  if (typeof jsonbField === 'object') {
    return jsonbField[language] || jsonbField['en'] || jsonbField['ar'] || Object.values(jsonbField)[0] || fallback;
  }
  return fallback;
}, [language]); // Add language as dependency since the function uses it

  // Helper function to get price from JSONB field
  // Define interfaces for price structures
interface PriceObject {
  default?: number | string;
  small?: number | string;
  large?: number | string;
  [key: string]: number | string | undefined;
}

type PriceField = number | string | PriceObject | null | undefined;

const getPrice = (priceField: PriceField, size?: 'small' | 'large'): string => {
  console.log('getPrice called with:', { priceField, size, type: typeof priceField });
  
  if (!priceField) {
    console.log('No price field, returning 0T');
    return "0T";
  }
  
  if (typeof priceField === 'number') {
    console.log('Price is number:', priceField);
    return `${priceField}T`;
  }
  
  if (typeof priceField === 'object') {
    console.log('Price is object, keys:', Object.keys(priceField));
    let price = 0;
    
    if (size) {
      // For items with sizes
      const sizePrice = priceField[size];
      price = parseFloat(String(sizePrice)) || 0;
      console.log(`Price for size ${size}:`, price);
    } else {
      // For single-size items, try different keys
      console.log('Trying different keys for single-size item...');
      console.log('priceField.default:', priceField.default);
      console.log('priceField.small:', priceField.small);
      console.log('priceField.large:', priceField.large);
      console.log('Object.values(priceField):', Object.values(priceField));
      
      price = parseFloat(String(priceField.default)) || 
              parseFloat(String(priceField.small)) || 
              parseFloat(String(priceField.large)) ||
              parseFloat(String(Object.values(priceField)[0])) || 0;
      
      console.log('Final calculated price:', price);
    }
    
    if (price === 0) {
      console.warn('Price calculated as 0, something might be wrong with the data structure');
      // Let's try a more aggressive approach
      for (const [key, value] of Object.entries(priceField)) {
        console.log(`Trying key "${key}" with value:`, value, typeof value);
        const testPrice = parseFloat(String(value));
        if (!isNaN(testPrice) && testPrice > 0) {
          price = testPrice;
          console.log(`Found valid price ${price} from key "${key}"`);
          break;
        }
      }
    }
    
    console.log('Returning price:', `${price}T`);
    return `${price}T`;
  }
  
  // If it's a string, try to parse it
  if (typeof priceField === 'string') {
    console.log('Price is string:', priceField);
    const parsed = parseFloat(priceField);
    if (!isNaN(parsed)) {
      return `${parsed}T`;
    }
  }
  
  console.warn('Could not parse price field:', priceField);
  return "0T"; // Changed from "?" to "0T"
};


  // Helper function to get numeric price for cart
  const getNumericPrice = (priceField: PriceField, size?: 'small' | 'large'): number => {
  console.log('getNumericPrice called with:', { priceField, size, type: typeof priceField });
  
  if (!priceField) return 0;
  
  if (typeof priceField === 'number') return priceField;
  
  if (typeof priceField === 'object') {
    let price = 0;
    
    if (size) {
      // For items with sizes
      const sizePrice = priceField[size];
      price = parseFloat(String(sizePrice)) || 0;
    } else {
      // For single-size items, try different keys
      price = parseFloat(String(priceField.default)) || 
              parseFloat(String(priceField.small)) || 
              parseFloat(String(priceField.large)) ||
              parseFloat(String(Object.values(priceField)[0])) || 0;
      
      // If still 0, try more aggressively
      if (price === 0) {
        for (const [, value] of Object.entries(priceField)) {
          const testPrice = parseFloat(String(value));
          if (!isNaN(testPrice) && testPrice > 0) {
            price = testPrice;
            break;
          }
        }
      }
    }
    
    return price;
  }
  
  // If it's a string, try to parse it
  if (typeof priceField === 'string') {
    const parsed = parseFloat(priceField);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  
  return 0;
};


  // Fetch menu items from your existing API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching items for category:', menuItem.id);
        
        // Use your existing API route with category_id parameter
        const response = await fetch(`/api/dashboard/menu/items?category_id=${menuItem.id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Menu items response:', result);
        
        if (result.success) {
          // Filter only available items for the frontend
          const availableItems = (result.data || []).filter((item: MenuDetailItem) => item.is_available);
          console.log('Available items:', availableItems);
          
          // Debug each item's price structure
          availableItems.forEach((item: MenuDetailItem) => {
            console.log(`Item ${item.id} (${getLocalizedText(item.name)}):`, {
              has_sizes: item.has_sizes,
              price: item.price,
              original_price: item.original_price,
              is_discounted: item.is_discounted
            });
          });
          
          setDetailItems(availableItems);
        } else {
          setError(result.error || 'Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [menuItem.id,getLocalizedText]);

  const handleAddToCart = (item: MenuDetailItem, size?: "small" | "large") => {
    console.log('handleAddToCart called:', { item: item.id, size, has_sizes: item.has_sizes });
    
    if (!item.is_available) return;

    const priceToUse = getNumericPrice(item.price, size);
    let itemName = getLocalizedText(item.name);
    let itemId = item.id;

    console.log('Price to use:', priceToUse);

    // Handle different sizes
    if (item.has_sizes && size) {
      itemName = `${getLocalizedText(item.name)} (${size === "small" ? t("small") : t("large")})`;
      itemId = size === "small" ? item.id : item.id + 1000; // Different ID for large size
    }

    console.log('Adding to cart:', { id: itemId, name: itemName, price: priceToUse });

    addToCart({
      id: itemId,
      name: itemName,
      price: priceToUse,
      image: item.image,
      categoryId: menuItem.id,
    });
  };

  const getItemQuantity = (itemId: number, size?: "small" | "large") => {
    let searchId = itemId;
    if (size === "large") {
      searchId = itemId + 1000;
    }

    const cartItem = cartItems.find(
      (item) => item.id === searchId && item.categoryId === menuItem.id
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleQuantityChange = (
    itemId: number,
    newQuantity: number,
    size?: "small" | "large"
  ) => {
    let searchId = itemId;
    if (size === "large") {
      searchId = itemId + 1000;
    }

    if (newQuantity <= 0) {
      removeFromCart(searchId, menuItem.id);
    } else {
      updateQuantity(searchId, menuItem.id, newQuantity);
    }
  };

  if (loading) {
    return (
      <section className={`menu-detail ${isRTL ? "rtl" : "ltr"}`}>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`menu-detail ${isRTL ? "rtl" : "ltr"}`}>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={onBack} className="back-button">
            {t("backToMenu") || "Back to Menu"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`menu-detail ${isRTL ? "rtl" : "ltr"}`}>
      {/* Back button */}
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={onBack}
          aria-label={t("backToMenu") || "Back to Menu"}
        >
          <svg
            className="back-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span>{t("backToMenu") || "Back to Menu"}</span>
        </button>
      </div>

      {/* Header image specific to this menu category */}
      <div className="menu-detail-header">
        <div className="header-image-container">
          <Image
            src={menuItem.headerImage}
            alt={`${menuItem.title} Header`}
            fill
            className="header-image"
            priority
            sizes="100vw"
          />
          <div className="header-overlay">
            <div className="header-content">
              <h1 className="menu-detail-title">{menuItem.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Menu detail items grid */}
      <div className="menu-detail-container">
        <div className="menu-detail-grid">
          {detailItems.map((item, index) => {
            const quantitySmall = item.has_sizes
              ? getItemQuantity(item.id, "small")
              : getItemQuantity(item.id);
            const quantityLarge = item.has_sizes 
              ? getItemQuantity(item.id, "large") 
              : 0;

            const itemName = getLocalizedText(item.name);
            const itemDescription = getLocalizedText(item.description);

            console.log(`Rendering item ${item.id}:`, {
              name: itemName,
              has_sizes: item.has_sizes,
              price: item.price,
              quantitySmall,
              quantityLarge
            });

            return (
              <div
                key={item.id}
                className={`menu-detail-item ${
                  !item.is_available ? "unavailable" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="menu-detail-item-image-container">
                  <Image
                    src={item.image}
                    alt={itemName}
                    fill
                    className="menu-detail-item-image"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="menu-detail-item-overlay">
                    <div className="overlay-content">
                      {!item.is_available && (
                        <div className="unavailable-badge">
                          {t("unavailable") || "Unavailable"}
                        </div>
                      )}
                      {item.has_sizes ? (
                        <div className="price-tags">
                          <div className="price-tag-container small">
                            <span className="size-label">{t("small")}:</span>
                            <div className="price-info">
                              {item.is_discounted_small && item.original_price && (
                                <span className="original-price">
                                  {getPrice(item.original_price, 'small')}
                                </span>
                              )}
                              <span className="price-tag">{getPrice(item.price, 'small')}</span>
                            </div>
                          </div>
                          <div className="price-tag-container large">
                            <span className="size-label">{t("large")}:</span>
                            <div className="price-info">
                              {item.is_discounted_large && item.original_price && (
                                <span className="original-price">
                                </span>
                              )}
                              <span className="price-tag">{getPrice(item.price, 'large')}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="price-container">
                          {item.is_discounted && item.original_price && (
                            <span className="original-price">
                            </span>
                          )}
                          <span className="price-tag">{getPrice(item.price)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="menu-detail-item-content">
                  <h3 className="menu-detail-item-title">{itemName}</h3>
                  {itemDescription && (
                    <p className="menu-detail-item-description">
                      {itemDescription}
                    </p>
                  )}
                  <div className="menu-detail-item-footer">
                    {item.has_sizes ? (
                      // Special handling for items with two sizes
                      <div className="size-options">
                        <div className="size-option">
                          <div className="size-info">
                            <span className="size-label">{t("small")}</span>
                            <div className="price-container">
                              {item.is_discounted_small && item.original_price && (
                                <span className="original-price">
                                </span>
                              )}
                              <span className="size-price">
                                {getPrice(item.price, 'small')}
                              </span>
                            </div>
                          </div>
                          {!item.is_available ? (
                            <button className="order-button disabled" disabled>
                              {t("unavailable") || "Unavailable"}
                            </button>
                          ) : quantitySmall === 0 ? (
                            <button
                              className="order-button"
                                                            onClick={() => handleAddToCart(item, "small")}
                            >
                              {t("orderNow") || "Order Now"}
                            </button>
                          ) : (
                            <div className="quantity-controls">
                              <button
                                className="quantity-btn decrease"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    quantitySmall - 1,
                                    "small"
                                  )
                                }
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="quantity-display">
                                {quantitySmall}
                              </span>
                              <button
                                className="quantity-btn increase"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    quantitySmall + 1,
                                    "small"
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="size-option">
                          <div className="size-info">
                            <span className="size-label">{t("large")}</span>
                            <div className="price-container">
                              {item.is_discounted_large && item.original_price && (
                                <span className="original-price">
                                  {getPrice(item.original_price, 'large')}
                                </span>
                              )}
                              <span className="size-price">
                                {getPrice(item.price, 'large')}
                              </span>
                            </div>
                          </div>
                          {!item.is_available ? (
                            <button className="order-button disabled" disabled>
                              {t("unavailable") || "Unavailable"}
                            </button>
                          ) : quantityLarge === 0 ? (
                            <button
                              className="order-button"
                              onClick={() => handleAddToCart(item, "large")}
                            >
                              {t("orderNow") || "Order Now"}
                            </button>
                          ) : (
                            <div className="quantity-controls">
                              <button
                                className="quantity-btn decrease"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    quantityLarge - 1,
                                    "large"
                                  )
                                }
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="quantity-display">
                                {quantityLarge}
                              </span>
                              <button
                                className="quantity-btn increase"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    quantityLarge + 1,
                                    "large"
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Regular handling for single-size items
                      <div className="regular-option">
                        <div className="price-container">
                          {item.is_discounted && item.original_price && (
                            <span className="original-price">
                              {getPrice(item.original_price)}
                            </span>
                          )}
                          <span className="menu-detail-item-price">
                            {getPrice(item.price)}
                          </span>
                        </div>

                        {!item.is_available ? (
                          <button className="order-button disabled" disabled>
                            {t("unavailable") || "Unavailable"}
                          </button>
                        ) : quantitySmall === 0 ? (
                          <button
                            className="order-button"
                            onClick={() => {
                              console.log('Single-size order button clicked for item:', item.id);
                              handleAddToCart(item);
                            }}
                          >
                            {t("orderNow") || "Order Now"}
                          </button>
                        ) : (
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn decrease"
                              onClick={() => {
                                console.log('Decrease quantity for single-size item:', item.id);
                                handleQuantityChange(item.id, quantitySmall - 1);
                              }}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="quantity-display">
                              {quantitySmall}
                            </span>
                            <button
                              className="quantity-btn increase"
                              onClick={() => {
                                console.log('Increase quantity for single-size item:', item.id);
                                handleQuantityChange(item.id, quantitySmall + 1);
                              }}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Show message if no items found */}
        {detailItems.length === 0 && !loading && (
          <div className="no-items-message">
            <p>{t("noItemsFound") || "No items found in this category."}</p>
            <button onClick={onBack} className="back-button">
              {t("backToMenu") || "Back to Menu"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuDetail;
