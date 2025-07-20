'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts';
import MenuDetail from '../MenuDetail/MenuDetail';
import './Menus.scss';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: number;
  title: string;
  image: string;
  headerImage: string;
}

const Menus: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/menu/categories?lang=${language}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories');
      }

      // Transform categories to match the expected format
      const transformedItems = result.data.map((category: {
        id: number;
        title: string | { [key: string]: string };
        image: string;
        header_image: string;
      }) => ({
        id: category.id,
        title: typeof category.title === 'object' ? 
          category.title[language] || category.title['en'] : 
          category.title,
        image: category.image,
        headerImage: category.header_image,
      }));

      setMenuItems(transformedItems);
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      setError('Failed to load menu categories');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchMenuCategories();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('menu_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories'
        },
        (payload) => {
          console.log('Menu categories changed:', payload);
          fetchMenuCategories(); // Refetch when data changes
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        (payload) => {
          console.log('Menu items changed:', payload);
          fetchMenuCategories(); // Refetch when data changes
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [language, fetchMenuCategories]);

  const handleMenuItemClick = (item: MenuItem) => {
    setSelectedMenu(item);
  };

  const handleBackToMenu = () => {
    setSelectedMenu(null);
  };

  if (loading) {
    return (
      <section className={`menus ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`menus ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">{t("errorTitle") || "Something went wrong"}</h3>
            <p className="error-message">{error}</p>
            <button onClick={fetchMenuCategories} className="retry-button">
              <span className="retry-icon">🔄</span>
              {t("retry") || "Try Again"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (selectedMenu) {
    return (
      <MenuDetail 
        menuItem={selectedMenu}
        onBack={handleBackToMenu}
      />
    );
  }

  return (
    <section className={`menus ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Full width header image */}
      <div className="menus-header">
        <div className="header-image-container">
          <Image
            src="/images/MENU.webp"
            alt="Menu Header"
            fill
            className="header-image"
            priority
            sizes="100vw"
          />
          <div className="header-overlay">
            <div className="header-content">
              <h1 className="menu-title">
                {t('ourMenu') || 'Our Menu'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items grid */}
      <div className="menus-container">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div 
              key={item.id} 
              className="menu-item"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="menu-item-image-container">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="menu-item-image"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
                <div className="menu-item-overlay">
                  <div className="overlay-content">
                    <svg 
                      className="view-icon" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="menu-item-content">
                <h3 className="menu-item-title">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menus;
