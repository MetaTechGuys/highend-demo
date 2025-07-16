'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts';
import { useCart } from '@/app/contexts/CartContext';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { getTotalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (lang: 'en' | 'fa') => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const totalItems = getTotalItems();

  return (
    <nav className={`navbar ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link href="/" onClick={closeMobileMenu}>
            <Image 
              src="/images/logo.webp" 
              alt="Logo" 
              width={80}
              height={80}
              className="logo-image"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <Link href="/" className="nav-link">
            {t('home')}
          </Link>
          <Link href="/menu" className="nav-link">
            {t('about')}
          </Link>
          <Link href="/contact" className="nav-link">
            {t('services')}
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="navbar-actions">
          {/* Language Toggle */}
          <div className="language-toggle">
            <button
              className="language-btn"
              onClick={toggleLanguageDropdown}
              aria-label={t('language')}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="#f1592f"
                className="language-icon"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
              </svg>
              <span className="language-text">{language.toUpperCase()}</span>
              <span className={`dropdown-arrow ${isLanguageDropdownOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>
            {isLanguageDropdownOpen && (
              <div className="language-dropdown">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('fa')}
                  className={`dropdown-item ${language === 'fa' ? 'active' : ''}`}
                >
                  فارسی
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <Link href="/login" className="btn btn-outline">
            {t('login')}
          </Link>
          
          {/* Cart Button (replaces Gift Cards) */}
          <button onClick={openCart} className="btn btn-primary cart-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="cart-icon">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
            </svg>
            <span>{t('cart') || 'Cart'}</span>
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link href="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t('home')}
          </Link>
          <Link href="/menu" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t('about')}
          </Link>
          <Link href="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t('services')}
          </Link>
          
          {/* Mobile Language Toggle */}
          <div className="mobile-language-toggle">
            <button
              className="mobile-language-btn"
              onClick={toggleLanguageDropdown}
              aria-label={t('language')}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="#f1592f"
                className="language-icon"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
              </svg>
              <span className="mobile-language-text">{t('language')}: {language.toUpperCase()}</span>
              <span className={`dropdown-arrow ${isLanguageDropdownOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>
            {isLanguageDropdownOpen && (
              <div className="mobile-language-dropdown">
                <button
                  onClick={() => { handleLanguageChange('en'); closeMobileMenu(); }}
                  className={`mobile-dropdown-item ${language === 'en' ? 'active' : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => { handleLanguageChange('fa'); closeMobileMenu(); }}
                  className={`mobile-dropdown-item ${language === 'fa' ? 'active' : ''}`}
                >
                  فارسی
                </button>
              </div>
            )}
          </div>
          
          <div className="mobile-actions">
            <Link href="/login" className="btn btn-outline" onClick={closeMobileMenu}>
              {t('login')}
            </Link>
            <button onClick={() => { openCart(); closeMobileMenu(); }} className="btn btn-primary cart-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="cart-icon">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              </svg>
              <span>{t('cart') || 'Cart'}</span>
              {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;
