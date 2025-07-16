'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts';
import MenuDetail from '../MenuDetail/MenuDetail';
import './Menus.scss';

interface MenuItem {
  id: number;
  title: string;
  image: string;
  headerImage: string;
}

const Menus: React.FC = () => {
  const { isRTL, t } = useLanguage();
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: t('appetizers') || 'Appetizers',
      image: '/images/french-fries.webp',
      headerImage: '/images/menu/headers/Chips.webp'
    },
    {
      id: 2,
      title: t('mainCourses') || 'Main Courses',
      image: '/images/food.webp',
      headerImage: '/images/menu/headers/Burgers.webp'
    },
    {
      id: 3,
      title: t('desserts') || 'Desserts',
      image: '/images/spaghetti.webp',
      headerImage: '/images/menu/headers/Pasta.webp'
    },
    {
      id: 4,
      title: t('beverages') || 'Beverages',
      image: '/images/soda.webp',
      headerImage: '/images/menu/headers/Drinks.webp'
    },
    {
      id: 5,
      title: t('salads') || 'Salads',
      image: '/images/salads.webp',
      headerImage: '/images/menu/headers/Salad.webp'
    },
    {
      id: 6,
      title: t('soups') || 'Soups',
      image: '/images/fried-chicken.webp',
      headerImage: '/images/menu/headers/Friedchicken.webp'
    },
    {
      id: 7,
      title: t('seafood') || 'Seafood',
      image: '/images/pizzas.webp',
      headerImage: '/images/menu/headers/Pizza.webp'
    },
    {
      id: 8,
      title: t('specialties') || 'Chef Specialties',
      image: '/images/sandwiches.webp',
      headerImage: '/images/menu/headers/Sandwich.webp'
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    setSelectedMenu(item);
  };

  const handleBackToMenu = () => {
    setSelectedMenu(null);
  };

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
                    <span className="view-text">
                      {t('viewMenu') || 'View Menu'}
                    </span>
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
