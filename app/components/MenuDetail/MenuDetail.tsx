"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/contexts";
import { useCart } from "@/app/contexts/CartContext";
import type { MenuDetailItem } from "@/types/database";
import "./MenuDetail.scss";

interface MenuItem {
  id: number;
  title: string;
  image: string;
  headerImage: string;
}

interface MenuDetailProps {
  menuItem: MenuItem;
  onBack: () => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({ menuItem, onBack }) => {
  const { language, isRTL, t } = useLanguage();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [detailItems, setDetailItems] = useState<MenuDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, [menuItem.id, language]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/menu/${menuItem.id}?lang=${language}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
    
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch menu items');
      }

      setDetailItems(result.data.items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuDetailItem, size?: "small" | "large") => {
    if (!item.isAvailable) return;

    let priceToUse = item.price;
    let itemName = item.name;
    let itemId = item.id;

    // Handle different sizes for items that have sizes
    if (item.priceSmall && item.priceLarge && size) {
      priceToUse = size === "small" ? item.priceSmall : item.priceLarge;
      itemName = `${item.name} (${size === "small" ? t("small") : t("large")})`;
      itemId = size === "small" ? item.id : item.id + 1000;
    }

    const priceNumber = parseFloat(priceToUse.replace(/[^0-9.]/g, ''));
    addToCart({
      id: itemId,
      name: itemName,
      price: priceNumber,
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

  const hasSize = (item: MenuDetailItem) => {
    return item.priceSmall && item.priceLarge;
  };

  if (loading) {
    return (
      <section className={`menu-detail ${isRTL ? "rtl" : "ltr"}`}>
        <div className="menu-detail-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t("loading")}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`menu-detail ${isRTL ? "rtl" : "ltr"}`}>
        <div className="menu-detail-error">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchMenuItems} className="retry-button">
              {t("retry") || "Retry"}
            </button>
          </div>
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
            const quantitySmall = hasSize(item)
              ? getItemQuantity(item.id, "small")
              : getItemQuantity(item.id);
            const quantityLarge = hasSize(item)
              ? getItemQuantity(item.id, "large")
              : 0;

            return (
              <div
                key={item.id}
                className={`menu-detail-item ${
                  !item.isAvailable ? "unavailable" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="menu-detail-item-image-container">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="menu-detail-item-image"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="menu-detail-item-overlay">
                    <div className="overlay-content">
                      {!item.isAvailable && (
                        <div className="unavailable-badge">
                          {t("unavailable") || "Unavailable"}
                        </div>
                      )}
                      {hasSize(item) ? (
                        <div className="price-tags">
                          <div className="price-tag-container small">
                            <span className="size-label">{t("small")}:</span>
                            <div className="price-info">
                              {item.isDiscountedSmall && item.originalPriceSmall && (
                                <span className="original-price">
                                  {item.originalPriceSmall}
                                </span>
                              )}
                              <span className="price-tag">{item.priceSmall}</span>
                            </div>
                          </div>
                          <div className="price-tag-container large">
                            <span className="size-label">{t("large")}:</span>
                            <div className="price-info">
                              {item.isDiscountedLarge && item.originalPriceLarge && (
                                <span className="original-price">
                                  {item.originalPriceLarge}
                                </span>
                              )}
                              <span className="price-tag">{item.priceLarge}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="price-container">
                          {item.isDiscounted && item.originalPrice && (
                            <span className="original-price">
                              {item.originalPrice}
                            </span>
                          )}
                          <span className="price-tag">{item.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="menu-detail-item-content">
                  <h3 className="menu-detail-item-title">{item.name}</h3>
                  {item.description && (
                    <p className="menu-detail-item-description">
                      {item.description}
                    </p>
                  )}
                  <div className="menu-detail-item-footer">
                    {hasSize(item) ? (
                      // Special handling for items with two sizes
                      <div className="size-options">
                        <div className="size-option">
                          <div className="size-info">
                            <span className="size-label">{t("small")}</span>
                            <div className="price-container">
                              {item.isDiscountedSmall && item.originalPriceSmall && (
                                <span className="original-price">
                                  {item.originalPriceSmall}
                                </span>
                              )}
                              <span className="size-price">
                                {item.priceSmall}
                              </span>
                            </div>
                          </div>
                          {!item.isAvailable ? (
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
                              {item.isDiscountedLarge && item.originalPriceLarge && (
                                <span className="original-price">
                                  {item.originalPriceLarge}
                                </span>
                              )}
                              <span className="size-price">
                                {item.priceLarge}
                              </span>
                            </div>
                          </div>
                          {!item.isAvailable ? (
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
                      // Regular handling for items without sizes
                      <div className="regular-option">
                        <div className="price-container">
                          {item.isDiscounted && item.originalPrice && (
                            <span className="original-price">
                              {item.originalPrice}
                            </span>
                          )}
                          <span className="menu-detail-item-price">
                            {item.price}
                          </span>
                        </div>

                        {!item.isAvailable ? (
                          <button className="order-button disabled" disabled>
                            {t("unavailable") || "Unavailable"}
                          </button>
                        ) : quantitySmall === 0 ? (
                          <button
                            className="order-button"
                            onClick={() => handleAddToCart(item)}
                          >
                            {t("orderNow") || "Order Now"}
                          </button>
                        ) : (
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn decrease"
                              onClick={() =>
                                handleQuantityChange(item.id, quantitySmall - 1)
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
                                handleQuantityChange(item.id, quantitySmall + 1)
                              }
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
      </div>
    </section>
  );
};

export default MenuDetail;