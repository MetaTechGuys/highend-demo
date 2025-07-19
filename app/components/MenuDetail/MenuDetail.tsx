"use client";

import React from "react";
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
  name: string;
  image: string;
  price: string;
  priceSmall?: string; // For case 7 - small size price
  priceLarge?: string; // For case 7 - large size price
  description?: string;
  isDiscounted?: boolean;
  originalPrice?: string; // Original price before discount
  isDiscountedSmall?: boolean; // For case 7 - small size discount status
  isDiscountedLarge?: boolean; // For case 7 - large size discount status
  originalPriceSmall?: string; // For case 7 - small size original price
  originalPriceLarge?: string; // For case 7 - large size original price
  isAvailable?: boolean; // Availability status
}

interface MenuDetailProps {
  menuItem: MenuItem;
  onBack: () => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({ menuItem, onBack }) => {
  const { isRTL, t } = useLanguage();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  const handleAddToCart = (item: MenuDetailItem, size?: "small" | "large") => {
    if (!item.isAvailable) return; // Don't add unavailable items

    let priceToUse = item.price;
    let itemName = item.name;
    let itemId = item.id;

    // Handle different sizes for case 7 (seafood)
    if (menuItem.id === 7 && size) {
      priceToUse =
        size === "small"
          ? item.priceSmall || item.price
          : item.priceLarge || item.price;
      itemName = `${item.name} (${size === "small" ? t("small") : t("large")})`;
      itemId = size === "small" ? item.id : item.id + 1000; // Different ID for large size
    }

    const priceNumber = parseFloat(priceToUse.replace("$", ""));
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
    if (menuItem.id === 7 && size === "large") {
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
    if (menuItem.id === 7 && size === "large") {
      searchId = itemId + 1000;
    }

    if (newQuantity <= 0) {
      removeFromCart(searchId, menuItem.id);
    } else {
      updateQuantity(searchId, menuItem.id, newQuantity);
    }
  };

  // Different items for each category
  const getMenuDetailItems = (menuId: number): MenuDetailItem[] => {
    switch (menuId) {
      case 1: // Appetizers
        return [
          {
            id: 1,
            name: t("crispyMozzarellaSticks"),
            image: `/images/menu/items/1/Whisk_78f2897719.webp`,
            price: t("crispyMozzarellaSticksPrice"),
            description: t("crispyMozzarellaSticksDesc"),
            isDiscounted: true,
            originalPrice: t("crispyMozzarellaSticksOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("buffaloWings"),
            image: `/images/menu/items/1/Whisk_f873feae78.webp`,
            price: t("buffaloWingsPrice"),
            description: t("buffaloWingsDesc"),
            isDiscounted: true,
            originalPrice: t("buffaloWingsOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 3,
            name: t("loadedNachos"),
            image: `/images/menu/items/1/Whisk_a4c4728ceb.webp`,
            price: t("loadedNachosPrice"),
            description: t("loadedNachosDesc"),
            isDiscounted: false,
            originalPrice: t("loadedNachosOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 4,
            name: t("garlicBread"),
            image: `/images/menu/items/1/Whisk_storyboard1ed31ebab3404cbf98fec067.webp`,
            price: t("garlicBreadPrice"),
            description: t("garlicBreadDesc"),
            isDiscounted: true,
            originalPrice: t("garlicBreadOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 5,
            name: t("calamariRings"),
            image: `/images/menu/items/1/ChatGPT Image May 31, 2025, 05_38_38 PM.webp`,
            price: t("calamariRingsPrice"),
            description: t("calamariRingsDesc"),
            isDiscounted: true,
            originalPrice: t("calamariRingsOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 6,
            name: t("stuffedMushrooms"),
            image: `/images/menu/items/1/Whisk_4922c0a261.webp`,
            price: t("stuffedMushroomsPrice"),
            description: t("stuffedMushroomsDesc"),
            isDiscounted: false,
            originalPrice: t("stuffedMushroomsOriginalPrice"),
            isAvailable: true,
          },
        ];

      case 2: // Main Courses
        return [
          {
            id: 1,
            name: t("grilledRibeyeSteak"),
            image: `/images/menu/items/2/Whisk_4817c78dea.webp`,
            price: t("grilledRibeyeSteakPrice"),
            description: t("grilledRibeyeSteakDesc"),
            isDiscounted: false,
            originalPrice: t("grilledRibeyeSteakOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("herbCrustedSalmon"),
            image: `/images/menu/items/2/Whisk_a4eccb0dc7 (1).webp`,
            price: t("herbCrustedSalmonPrice"),
            description: t("herbCrustedSalmonDesc"),
            isDiscounted: true,
            originalPrice: t("herbCrustedSalmonOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 3,
            name: t("chickenParmesan"),
            image: `/images/menu/items/2/Whisk_eb7913941a.webp`,
            price: t("chickenParmesanPrice"),
            description: t("chickenParmesanDesc"),
            isDiscounted: true,
            originalPrice: t("chickenParmesanOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 4,
            name: t("lobsterRavioli"),
            image: `/images/menu/items/2/Whisk_bc3ed2e9e3.webp`,
            price: t("lobsterRavioliPrice"),
            description: t("lobsterRavioliDesc"),
            isDiscounted: true,
            originalPrice: t("lobsterRavioliOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 5,
            name: t("bbqPorkRibs"),
            image: `/images/menu/items/2/Whisk_332ae6283c.webp`,
            price: t("bbqPorkRibsPrice"),
            description: t("bbqPorkRibsDesc"),
            isDiscounted: true,
            originalPrice: t("bbqPorkRibsOriginalPrice"),
            isAvailable: true,
          },
        ];

      case 3: // Desserts
        return [
          {
            id: 1,
            name: t("chocolateLavaCake"),
            image: `/images/menu/items/3/sss.webp`,
            price: t("chocolateLavaCakePrice"),
            description: t("chocolateLavaCakeDesc"),
            isDiscounted: false,
            originalPrice: t("chocolateLavaCakeOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("newYorkCheesecake"),
            image: `/images/menu/items/3/Whisk_cd4ef18eac.webp`,
            price: t("newYorkCheesecakePrice"),
            description: t("newYorkCheesecakeDesc"),
            isDiscounted: false,
            originalPrice: t("newYorkCheesecakeOriginalPrice"),
            isAvailable: true,
          },
        ];

      case 4: // Beverages
        return [
          {
            id: 1,
            name: t("freshOrangeJuice"),
            image: `/images/menu/items/4/Whisk_86a8c6fc3d.webp`,
            price: t("freshOrangeJuicePrice"),
            description: t("freshOrangeJuiceDesc"),
            isDiscounted: false,
            originalPrice: t("freshOrangeJuiceOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("icedCoffee"),
            image: `/images/menu/items/4/iced-coffee.webp`,
            price: t("icedCoffeePrice"),
            description: t("icedCoffeeDesc"),
            isDiscounted: false,
            originalPrice: t("icedCoffeeOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 3,
            name: t("fruitSmoothie"),
            image: `/images/menu/items/4/smoothie.webp`,
            price: t("fruitSmoothiePrice"),
            description: t("fruitSmoothieDesc"),
            isDiscounted: false,
            originalPrice: t("fruitSmoothieOriginalPrice"),
            isAvailable: true,
          },
        ];

      case 5: // Salads
        return [
          {
            id: 1,
            name: t("caesarSalad"),
            image: `/images/menu/items/5/Whisk_storyboardf0353922c03046f78d97b780.webp`,
            price: t("caesarSaladPrice"),
            description: t("caesarSaladDesc"),
            isDiscounted: false,
            originalPrice: t("caesarSaladOriginalPrice"),
            isAvailable: true,
          },
        ];

      case 6: // Soups
        return [
          {
            id: 1,
            name: t("tomatoBasilSoup"),
            image: `/images/menu/items/6/Whisk_9748b879db.webp`,
            price: t("tomatoBasilSoupPrice"),
            description: t("tomatoBasilSoupDesc"),
            isDiscounted: true,
            originalPrice: t("tomatoBasilSoupOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("chickenNoodleSoup"),
            image: `/images/menu/items/6/Whisk_337b2e2a77 (1).webp`,
            price: t("chickenNoodleSoupPrice"),
            description: t("chickenNoodleSoupDesc"),
            isDiscounted: true,
            originalPrice: t("chickenNoodleSoupOriginalPrice"),
            isAvailable: true,
          },
        ];

      case 7: // Seafood - Special case with two sizes
        return [
          {
            id: 1,
            name: t("grilledLobsterTail"),
            image: `/images/menu/items/7/Whisk_8c05ce1fde.webp`,
            priceSmall: t("grilledLobsterTailPriceSmall"),
            priceLarge: t("grilledLobsterTailPriceLarge"),
            price: t("grilledLobsterTailPriceSmall"),
            description: t("grilledLobsterTailDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("grilledLobsterTailOriginalPriceSmall"),
            originalPriceLarge: t("grilledLobsterTailOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("panSearedScallops"),
            image: `/images/menu/items/7/Whisk_1cfe325011.webp`,
            priceSmall: t("panSearedScallopsPriceSmall"),
            priceLarge: t("panSearedScallopsPriceLarge"),
            price: t("panSearedScallopsPriceSmall"),
            description: t("panSearedScallopsDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("panSearedScallopsOriginalPriceSmall"),
            originalPriceLarge: t("panSearedScallopsOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 3,
            name: t("fishAndChips"),
            image: `/images/menu/items/7/Whisk_d03cc08138.webp`,
            priceSmall: t("fishAndChipsPriceSmall"),
            priceLarge: t("fishAndChipsPriceLarge"),
            price: t("fishAndChipsPriceSmall"),
            description: t("fishAndChipsDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("fishAndChipsOriginalPriceSmall"),
            originalPriceLarge: t("fishAndChipsOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 4,
            name: t("seafoodPaella"),
                        image: `/images/menu/items/7/Whisk_f45e0b8faf.webp`,
            priceSmall: t("seafoodPaellaPriceSmall"),
            priceLarge: t("seafoodPaellaPriceLarge"),
            price: t("seafoodPaellaPriceSmall"),
            description: t("seafoodPaellaDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("seafoodPaellaOriginalPriceSmall"),
            originalPriceLarge: t("seafoodPaellaOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 5,
            name: t("blackenedMahiMahi"),
            image: `/images/menu/items/7/Whisk_75b1c598a0.webp`,
            priceSmall: t("blackenedMahiMahiPriceSmall"),
            priceLarge: t("blackenedMahiMahiPriceLarge"),
            price: t("blackenedMahiMahiPriceSmall"),
            description: t("blackenedMahiMahiDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("blackenedMahiMahiOriginalPriceSmall"),
            originalPriceLarge: t("blackenedMahiMahiOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 6,
            name: t("crabCakes"),
            image: `/images/menu/items/7/Whisk_25a3588e26 (2).webp`,
            priceSmall: t("crabCakesPriceSmall"),
            priceLarge: t("crabCakesPriceLarge"),
            price: t("crabCakesPriceSmall"),
            description: t("crabCakesDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("crabCakesOriginalPriceSmall"),
            originalPriceLarge: t("crabCakesOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 7,
            name: t("salmonTeriyaki"),
            image: `/images/menu/items/7/Whisk_f7c41eebda.webp`,
            priceSmall: t("salmonTeriyakiPriceSmall"),
            priceLarge: t("salmonTeriyakiPriceLarge"),
            price: t("salmonTeriyakiPriceSmall"),
            description: t("salmonTeriyakiDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("salmonTeriyakiOriginalPriceSmall"),
            originalPriceLarge: t("salmonTeriyakiOriginalPriceLarge"),
            isAvailable: true,
          },
          {
            id: 8,
            name: t("shrimpScampi"),
            image: `/images/menu/items/7/Whisk_57a840b56b.webp`,
            priceSmall: t("shrimpScampiPriceSmall"),
            priceLarge: t("shrimpScampiPriceLarge"),
            price: t("shrimpScampiPriceSmall"),
            description: t("shrimpScampiDesc"),
            isDiscountedSmall: false,
            isDiscountedLarge: true,
            originalPriceSmall: t("shrimpScampiOriginalPriceSmall"),
            originalPriceLarge: t("shrimpScampiOriginalPriceLarge"),
            isAvailable: true,
          },
        ];

      case 8: // Chef Specialties
        return [
          {
            id: 1,
            name: t("wagyuBeefTenderloin"),
            image: `/images/menu/items/8/Whisk_1299939ccb.webp`,
            price: t("wagyuBeefTenderloinPrice"),
            description: t("wagyuBeefTenderloinDesc"),
            isDiscounted: false,
            originalPrice: t("wagyuBeefTenderloinOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 2,
            name: t("duckConfit"),
            image: `/images/menu/items/8/ChatGPT Image Jun 2, 2025, 03_03_53 PM.webp`,
            price: t("duckConfitPrice"),
            description: t("duckConfitDesc"),
            isDiscounted: true,
            originalPrice: t("duckConfitOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 3,
            name: t("rackOfLamb"),
            image: `/images/menu/items/8/ChatGPT Image May 31, 2025, 05_29_58 PM.webp`,
            price: t("rackOfLambPrice"),
            description: t("rackOfLambDesc"),
            isDiscounted: true,
            originalPrice: t("rackOfLambOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 4,
            name: t("stuffedPortobello"),
            image: `/images/menu/items/8/Whisk_6f1647ddd5 (1).webp`,
            price: t("stuffedPortobelloPrice"),
            description: t("stuffedPortobelloDesc"),
            isDiscounted: true,
            originalPrice: t("stuffedPortobelloOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 5,
            name: t("surfAndTurf"),
            image: `/images/menu/items/8/ChatGPT Image Jun 8, 2025, 01_00_19 PM.webp`,
            price: t("surfAndTurfPrice"),
            description: t("surfAndTurfDesc"),
            isDiscounted: true,
            originalPrice: t("surfAndTurfOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 6,
            name: t("chefsTastingMenu"),
            image: `/images/menu/items/8/Whisk_1754a07614.webp`,
            price: t("chefsTastingMenuPrice"),
            description: t("chefsTastingMenuDesc"),
            isDiscounted: false,
            originalPrice: t("chefsTastingMenuOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 7,
            name: t("ossobuco"),
            image: `/images/menu/items/8/Whisk_3076027d69 (1).webp`,
            price: t("ossobucoPrice"),
            description: t("ossobucoDesc"),
            isDiscounted: false,
            originalPrice: t("ossobucoOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 8,
            name: t("bouillabaisse"),
            image: `/images/menu/items/8/Whisk_6f1647ddd5 (1).webp`,
            price: t("bouillabaissePrice"),
            description: t("bouillabaisseDesc"),
            isDiscounted: true,
            originalPrice: t("bouillabaisseOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 9,
            name: t("cobbSalad"),
            image: `/images/menu/items/8/Whisk_storyboard0ff93c9d1a354b18b5522efe.webp`,
            price: t("cobbSaladPrice"),
            description: t("cobbSaladDesc"),
            isDiscounted: true,
            originalPrice: t("cobbSaladOriginalPrice"),
            isAvailable: true,
          },
          {
            id: 10,
            name: t("nicoiseSalad"),
            image: `/images/menu/items/8/Whisk_storyboard652d77a82d274581a75c4be9.webp`,
            price: t("nicoiseSaladPrice"),
            description: t("nicoiseSaladDesc"),
            isDiscounted: false,
            originalPrice: t("nicoiseSaladOriginalPrice"),
            isAvailable: true,
          },
        ];

      default:
        return [
          {
            id: 1,
            name: `${menuItem.title} Item 1`,
            image: `/images/menu/items/default/item-1.webp`,
            price: "$12.99",
            description: t("deliciousAndFresh"),
            isDiscounted: false,
            originalPrice: "$15.99",
            isAvailable: true,
          },
          {
            id: 2,
            name: `${menuItem.title} Item 2`,
            image: `/images/menu/items/default/item-2.webp`,
            price: "$15.99",
            description: t("chefsSpecialRecommendation"),
            isDiscounted: true,
            originalPrice: "$18.99",
            isAvailable: true,
          },
          {
            id: 3,
            name: `${menuItem.title} Item 3`,
            image: `/images/menu/items/default/item-3.webp`,
            price: "$18.99",
            description: t("premiumQualityIngredients"),
            isDiscounted: false,
            originalPrice: "$21.99",
            isAvailable: true,
          },
        ];
    }
  };

  const detailItems = getMenuDetailItems(menuItem.id);

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
            const quantitySmall =
              menuItem.id === 7
                ? getItemQuantity(item.id, "small")
                : getItemQuantity(item.id);
            const quantityLarge =
              menuItem.id === 7 ? getItemQuantity(item.id, "large") : 0;

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
                      {menuItem.id === 7 ? (
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
                    {menuItem.id === 7 ? (
                      // Special handling for seafood with two sizes
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
                      // Regular handling for other categories
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
