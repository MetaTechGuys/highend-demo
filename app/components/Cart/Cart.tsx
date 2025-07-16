'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/app/contexts/CartContext';
import { useLanguage } from '@/app/contexts';
import './Cart.scss';

const Cart: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  const { isRTL, t } = useLanguage();

  const handleQuantityChange = (id: number, categoryId: number, newQuantity: number) => {
    updateQuantity(id, categoryId, newQuantity);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="cart-overlay" 
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''} ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="cart-header">
          <h2 className="cart-title">{t('shoppingCart') || 'Shopping Cart'}</h2>
          <button 
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="empty-cart-icon">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              </svg>
              <p>{t('cartEmpty') || 'Your cart is empty'}</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={`${item.categoryId}-${item.id}`} className="cart-item">
                    <div className="cart-item-image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="item-image"
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-price">{formatPrice(item.price)}</p>
                      
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.categoryId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.categoryId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id, item.categoryId)}
                        aria-label="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <div className="total-row">
                    <span className="total-label">{t('total') || 'Total'}:</span>
                    <span className="total-price">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button 
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    {t('clearCart') || 'Clear Cart'}
                  </button>
                  <button className="checkout-btn">
                    {t('checkout') || 'Checkout'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;