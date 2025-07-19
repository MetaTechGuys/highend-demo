'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleQuantityChange = (id: number, categoryId: number, newQuantity: number) => {
    updateQuantity(id, categoryId, newQuantity);
  };

  const formatPrice = (price: number) => {
    return `${price}T`;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Close the cart
    setIsCartOpen(false);
    
    // Navigate to checkout page
    router.push('/checkout');
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
      <div className={`cart-sidebar ${isRTL ? 'rtl' : ''} ${isCartOpen ? 'open' : ''}`}>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="cart-icon">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
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
                    disabled={cartItems.length === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    {t('clearCart') || 'Clear Cart'}
                  </button>
                  <button 
                    className={`checkout-btn ${cartItems.length === 0 ? 'disabled' : ''}`}
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
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
