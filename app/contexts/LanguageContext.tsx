"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "fa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: "Home",
    about: "Menu",
    services: "Contact",
    login: "Order Now",
    signup: "Gift Cards",
    language: "Language",
    getStarted: "Order Now",
    companyName: "HighEnd",
    location: "Location",
    address: "123 Main Street, City, Country",
    postalCode: "Postal Code: 12345",
    phone: "+1 (234) 567-890",
    phone2: "+0 (987) 654-321",
    contactUs: "Contact Us",
    sendMessage: "Send Message",
    support: "Support Center",
    allRightsReserved: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    ourMenu: "Our Menu",
    appetizers: "Appetizers",
    mainCourses: "Main Courses",
    desserts: "Desserts",
    beverages: "Beverages",
    salads: "Salads",
    soups: "Soups",
    seafood: "Seafood",
    specialties: "Chef Specialties",
    viewMenu: "View Menu",
    backToMenu: "Back to Menu",
    exploreOur: "Explore our",
    orderNow: "Order Now",
    menuSubtitle:
      "Discover our delicious selection of carefully crafted dishes",
    // Appetizers
    crispyMozzarellaSticks: "Crispy Mozzarella Sticks",
    crispyMozzarellaSticksDesc: "Golden fried mozzarella with marinara sauce",
    buffaloWings: "Buffalo Wings",
    buffaloWingsDesc: "Spicy buffalo wings with blue cheese dip",
    loadedNachos: "Loaded Nachos",
    loadedNachosDesc: "Tortilla chips with cheese, jalapeños, and sour cream",
    spinachArtichokeDip: "Spinach Artichoke Dip",
    spinachArtichokeDipDesc:
      "Creamy spinach and artichoke dip with tortilla chips",
    calamariRings: "Calamari Rings",
    calamariRingsDesc: "Crispy fried squid rings with spicy aioli",
    stuffedMushrooms: "Stuffed Mushrooms",
    stuffedMushroomsDesc: "Button mushrooms stuffed with herbs and cheese",

    // Main Courses
    grilledRibeyeSteak: "Grilled Ribeye Steak",
    grilledRibeyeSteakDesc:
      "Premium ribeye with garlic mashed potatoes and vegetables",
    herbCrustedSalmon: "Herb Crusted Salmon",
    herbCrustedSalmonDesc: "Fresh Atlantic salmon with lemon herb crust",
    chickenParmesan: "Chicken Parmesan",
    chickenParmesanDesc: "Breaded chicken breast with marinara and mozzarella",
    lobsterRavioli: "Lobster Ravioli",
    lobsterRavioliDesc: "Homemade ravioli filled with lobster in cream sauce",
    bbqPorkRibs: "BBQ Pork Ribs",
    bbqPorkRibsDesc: "Slow-cooked ribs with house BBQ sauce",
    vegetarianLasagna: "Vegetarian Lasagna",
    vegetarianLasagnaDesc: "Layers of pasta with vegetables and ricotta cheese",

    // Desserts
    chocolateLavaCake: "Chocolate Lava Cake",
    chocolateLavaCakeDesc:
      "Warm chocolate cake with molten center and vanilla ice cream",
    newYorkCheesecake: "New York Cheesecake",
    newYorkCheesecakeDesc: "Classic creamy cheesecake with berry compote",
    tiramisu: "Tiramisu",
    tiramisuDesc: "Traditional Italian dessert with coffee and mascarpone",
    cremeBrulee: "Crème Brûlée",
    cremeBruleeDesc: "Vanilla custard with caramelized sugar crust",
    applePieAlaMode: "Apple Pie à la Mode",
    applePieAlaModeDesc: "Homemade apple pie with cinnamon ice cream",
    chocolateBrownieSundae: "Chocolate Brownie Sundae",
    chocolateBrownieSundaeDesc:
      "Warm brownie with ice cream, whipped cream, and chocolate sauce",

    // Beverages
    freshOrangeJuice: "Fresh Orange Juice",
    freshOrangeJuiceDesc: "Freshly squeezed orange juice",
    icedCoffee: "Iced Coffee",
    icedCoffeeDesc: "Cold brew coffee with ice and cream",
    fruitSmoothie: "Fruit Smoothie",
    fruitSmoothieDesc: "Mixed berry smoothie with yogurt and honey",
    craftBeer: "Craft Beer",
    craftBeerDesc: "Local craft beer selection",
    houseWine: "House Wine",
    houseWineDesc: "Red or white wine by the glass",
    specialtyCocktail: "Specialty Cocktail",
    specialtyCocktailDesc: "Signature cocktail made with premium spirits",

    // Salads
    caesarSalad: "Caesar Salad",
    caesarSaladDesc:
      "Romaine lettuce with Caesar dressing, croutons, and parmesan",
    greekSalad: "Greek Salad",
    greekSaladDesc: "Mixed greens with feta, olives, tomatoes, and olive oil",
    quinoaPowerBowl: "Quinoa Power Bowl",
    quinoaPowerBowlDesc:
      "Quinoa with roasted vegetables, avocado, and tahini dressing",
    capreseSalad: "Caprese Salad",
    capreseSaladDesc:
      "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
    asianChickenSalad: "Asian Chicken Salad",
    asianChickenSaladDesc:
      "Grilled chicken with mixed greens and sesame ginger dressing",
    kaleAndCranberrySalad: "Kale and Cranberry Salad",
    kaleAndCranberrySaladDesc:
      "Massaged kale with dried cranberries, nuts, and lemon vinaigrette",

    // Soups
    tomatoBasilSoup: "Tomato Basil Soup",
    tomatoBasilSoupDesc: "Creamy tomato soup with fresh basil and croutons",
    chickenNoodleSoup: "Chicken Noodle Soup",
    chickenNoodleSoupDesc:
      "Classic chicken soup with vegetables and egg noodles",
    frenchOnionSoup: "French Onion Soup",
    frenchOnionSoupDesc: "Caramelized onions in beef broth with melted cheese",
    mushroomBisque: "Mushroom Bisque",
    mushroomBisqueDesc: "Rich and creamy wild mushroom soup",
    minestroneSoup: "Minestrone Soup",
    minestroneSoupDesc: "Italian vegetable soup with beans and pasta",
    clamChowder: "Clam Chowder",
    clamChowderDesc: "New England style clam chowder with potatoes",

    // Seafood
    grilledLobsterTail: "Grilled Lobster Tail",
    grilledLobsterTailDesc: "Fresh lobster tail with garlic butter and lemon",
    panSearedScallops: "Pan-Seared Scallops",
    panSearedScallopsDesc:
      "Seared scallops with cauliflower purée and pancetta",
    fishAndChips: "Fish and Chips",
    fishAndChipsDesc: "Beer-battered cod with crispy fries and tartar sauce",
    seafoodPaella: "Seafood Paella",
    seafoodPaellaDesc: "Spanish rice with shrimp, mussels, and calamari",
    blackenedMahiMahi: "Blackened Mahi-Mahi",
    blackenedMahiMahiDesc: "Cajun-spiced mahi-mahi with coconut rice",
    crabCakes: "Crab Cakes",
    crabCakesDesc: "Maryland-style crab cakes with remoulade sauce",

    // Chef Specialties
    wagyuBeefTenderloin: "Wagyu Beef Tenderloin",
    wagyuBeefTenderloinDesc:
      "Premium wagyu beef with truffle sauce and seasonal vegetables",
    duckConfit: "Duck Confit",
    duckConfitDesc: "Slow-cooked duck leg with cherry gastrique and wild rice",
    rackOfLamb: "Rack of Lamb",
    rackOfLambDesc: "Herb-crusted lamb with rosemary jus and roasted potatoes",
    stuffedPortobello: "Stuffed Portobello",
    stuffedPortobelloDesc:
      "Portobello mushroom stuffed with quinoa and goat cheese",
    surfAndTurf: "Surf and Turf",
    surfAndTurfDesc: "Filet mignon and lobster tail with béarnaise sauce",
    chefsTastingMenu: "Chef's Tasting Menu",
    chefsTastingMenuDesc:
      "Five-course tasting menu featuring chef's seasonal selections",

    // Default items
    deliciousAndFresh: "Delicious and fresh ingredients",
    chefsSpecialRecommendation: "Chef's special recommendation",
    premiumQualityIngredients: "Premium quality ingredients",
    popularChoiceAmongCustomers: "Popular choice among customers",
    traditionalRecipeWithModernTwist: "Traditional recipe with modern twist",
    lightAndHealthyOption: "Light and healthy option",
    // Additional Appetizers
    garlicBread: "Garlic Bread",
    garlicBreadDesc: "Toasted bread with garlic butter and herbs",
    potatoSkins: "Potato Skins",
    potatoSkinsDesc: "Crispy potato skins with bacon, cheese, and sour cream",

    // Additional Main Courses
    beefStroganoff: "Beef Stroganoff",
    beefStroganoffDesc: "Tender beef in creamy mushroom sauce over egg noodles",
    fishTacos: "Fish Tacos",
    fishTacosDesc:
      "Grilled fish with cabbage slaw and chipotle mayo in soft tortillas",

    // Additional Desserts
    pannaCotta: "Panna Cotta",
    pannaCottaDesc: "Silky vanilla custard with berry coulis",
    fruitTart: "Seasonal Fruit Tart",
    fruitTartDesc: "Pastry shell filled with custard and fresh seasonal fruits",

    // Additional Beverages
    hotChocolate: "Hot Chocolate",
    hotChocolateDesc: "Rich hot chocolate with whipped cream and marshmallows",
    espressoMartini: "Espresso Martini",
    espressoMartiniDesc:
      "Coffee cocktail with vodka, coffee liqueur, and espresso",

    // Additional Salads
    waldorfSalad: "Waldorf Salad",
    waldorfSaladDesc:
      "Apples, celery, grapes, and walnuts with creamy dressing",
    spinachSalad: "Spinach Salad",
    spinachSaladDesc:
      "Fresh spinach with strawberries, feta, and balsamic vinaigrette",

    // Additional Soups
    butternutSquashSoup: "Butternut Squash Soup",
    butternutSquashSoupDesc: "Roasted butternut squash soup with coconut cream",
    lobsterBisque: "Lobster Bisque",
    lobsterBisqueDesc: "Rich and creamy lobster soup with cognac",

    // Additional Seafood
    salmonTeriyaki: "Salmon Teriyaki",
    salmonTeriyakiDesc:
      "Grilled salmon glazed with teriyaki sauce and sesame seeds",
    shrimpScampi: "Shrimp Scampi",
    shrimpScampiDesc: "Sautéed shrimp in garlic, white wine, and butter sauce",

    // Additional Chef Specialties
    ossobuco: "Ossobuco",
    ossobucoDesc: "Braised veal shanks with vegetables and gremolata",
    bouillabaisse: "Bouillabaisse",
    bouillabaisseDesc:
      "Traditional French seafood stew with saffron and rouille",

    // Additional Default
    seasonalSpecialty: "Seasonal specialty with fresh ingredients",
    chefRecommended: "Chef recommended signature dish",
    cart: "Cart",
    shoppingCart: "Shopping Cart",
    cartEmpty: "Your cart is empty",
    total: "Total",
    clearCart: "Clear Cart",
    checkout: "Checkout",
    findUs: "Find us and get in touch",
    email: "Email",
    followUs: "Follow Us",
    // Form/Survey translations
    customerSurvey: "Customer Survey",
    surveyDescription: "Help us improve your dining experience",
    surveySubmitted: "Thank you for your feedback!",
    submitError: "Error submitting survey. Please try again.",

    // Form steps
    personalInfo: "Personal Information",
    visitInfo: "Visit Information",
    ratings: "Rate Your Experience",
    feedback: "Your Feedback",
    preferences: "Preferences & Marketing",

    // Step labels
    personal: "Personal",
    visit: "Visit",

    // Form fields
    name: "Name",
    email1: "Email",
    phone1: "Phone",
    ageGroup: "Age Group",
    enterName: "Enter your name",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    selectAge: "Select age group",
    over56: "56+",

    // Visit information
    visitFrequency: "How often do you visit us?",
    firstTime: "First time",
    weekly: "Weekly",
    monthly: "Monthly",
    occasionally: "Occasionally",
    rarely: "Rarely",
    lastVisit: "When was your last visit?",
    partySize: "Party size",
    selectPartySize: "Select party size",
    sevenPlus: "7+",
    occasion: "Occasion",
    selectOccasion: "Select occasion",
    casual: "Casual dining",
    business: "Business meeting",
    celebration: "Celebration",
    date: "Date night",
    family: "Family gathering",

    // Ratings
    foodQuality: "Food Quality",
    serviceQuality: "Service Quality",
    atmosphere: "Atmosphere",
    valueForMoney: "Value for Money",

    // Feedback
    mostLiked: "What did you like most?",
    describeMostLiked: "Tell us what you enjoyed most about your experience",
    improvements: "What could we improve?",
    describeImprovements: "Share your suggestions for improvement",
    recommendation: "How likely are you to recommend us?",
    notLikely: "Not likely",
    veryLikely: "Very likely",
    additionalComments: "Additional Comments",
    shareThoughts: "Share any additional thoughts or comments",

    // Preferences
    favoriteItems: "Favorite menu items",
    dietaryRestrictions: "Dietary restrictions",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten-free",
    dairyFree: "Dairy-free",
    nutFree: "Nut-free",
    halal: "Halal",
    kosher: "Kosher",
    none: "None",
    preferredTime: "Preferred dining time",
    selectTime: "Select preferred time",
    breakfast: "Breakfast (7-11 AM)",
    lunch: "Lunch (11 AM-3 PM)",
    dinner: "Dinner (5-10 PM)",
    lateNight: "Late night (10 PM+)",

    // Marketing
    hearAboutUs: "How did you hear about us?",
    socialMedia: "Social media",
    friendsFamily: "Friends/Family",
    onlineSearch: "Online search",
    advertisement: "Advertisement",
    walkBy: "Walked by",
    other: "Other",
    subscribeNewsletter: "Subscribe to our newsletter",
    receivePromotions: "Receive promotional offers",

    // Form actions
    previous: "Previous",
    next: "Next",
    submitSurvey: "Submit Survey",
    submitting: "Submitting...",

    // Validation messages
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    emailInvalid: "Email is invalid",
    visitFrequencyRequired: "Visit frequency is required",
    ratingRequired: "Rating is required",
    feedbackRequired: "This field is required",
    recommendationRequired: "Recommendation rating is required",
    // Location & Contact translations
    getDirections: "Get Directions",
    openInGoogleMaps: "Google Maps",
    openInOSM: "OpenStreetMap",
    coordinates: "Coordinates",
    copyCoordinates: "Click to copy coordinates",
    businessHours: "Business Hours",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    loading: "Loading...",

    // Form translations (additional)
    surveySubmittedDesc:
      "Your response has been recorded and will help us improve our service.",
    submitAnother: "Submit Another Response",
    enterFavoriteItems: "Enter your favorite menu items",
    selectOption: "Select an option",

    // Appetizers Prices
    crispyMozzarellaSticksPrice: "$8.99",
    buffaloWingsPrice: "$12.99",
    loadedNachosPrice: "$10.99",
    spinachArtichokeDipPrice: "$9.99",
    calamariRingsPrice: "$11.99",
    stuffedMushroomsPrice: "$9.99",
    garlicBreadPrice: "$6.99",
    potatoSkinsPrice: "$10.99",

    // Main Courses Prices
    grilledRibeyeSteakPrice: "$28.99",
    herbCrustedSalmonPrice: "$24.99",
    chickenParmesanPrice: "$19.99",
    lobsterRavioliPrice: "$26.99",
    bbqPorkRibsPrice: "$22.99",
    vegetarianLasagnaPrice: "$17.99",
    beefStroganoffPrice: "$21.99",
    fishTacosPrice: "$16.99",

    // Desserts Prices
    chocolateLavaCakePrice: "$7.99",
    newYorkCheesecakePrice: "$6.99",
    tiramisuPrice: "$8.99",
    cremeBruleePrice: "$7.99",
    applePieAlaModePrice: "$6.99",
    chocolateBrownieSundaePrice: "$8.99",
    pannaCottaPrice: "$7.99",
    fruitTartPrice: "$8.99",

    // Beverages Prices
    freshOrangeJuicePrice: "$4.99",
    icedCoffeePrice: "$3.99",
    fruitSmoothiePrice: "$5.99",
    craftBeerPrice: "$6.99",
    houseWinePrice: "$8.99",
    specialtyCocktailPrice: "$12.99",
    hotChocolatePrice: "$4.99",
    espressoMartiniPrice: "$11.99",

    // Salads Prices
    caesarSaladPrice: "$12.99",
    greekSaladPrice: "$13.99",
    quinoaPowerBowlPrice: "$14.99",
    capreseSaladPrice: "$11.99",
    asianChickenSaladPrice: "$15.99",
    kaleAndCranberrySaladPrice: "$13.99",
    waldorfSaladPrice: "$12.99",
    spinachSaladPrice: "$13.99",

    // Soups Prices
    tomatoBasilSoupPrice: "$6.99",
    chickenNoodleSoupPrice: "$7.99",
    frenchOnionSoupPrice: "$8.99",
    mushroomBisquePrice: "$8.99",
    minestroneSoupPrice: "$7.99",
    clamChowderPrice: "$9.99",
    butternutSquashSoupPrice: "$7.99",
    lobsterBisquePrice: "$12.99",

    // Seafood Prices
    grilledLobsterTailPrice: "$32.99",
    panSearedScallopsPrice: "$26.99",
    fishAndChipsPrice: "$18.99",
    seafoodPaellaPrice: "$24.99",
    blackenedMahiMahiPrice: "$22.99",
    crabCakesPrice: "$21.99",
    salmonTeriyakiPrice: "$23.99",
    shrimpScampiPrice: "$20.99",

    // Chef Specialties Prices
    wagyuBeefTenderloinPrice: "$45.99",
    duckConfitPrice: "$28.99",
    rackOfLambPrice: "$34.99",
    stuffedPortobelloPrice: "$19.99",
    surfAndTurfPrice: "$39.99",
    chefsTastingMenuPrice: "$65.99",
    ossobucoPrice: "$36.99",
    bouillabaissePrice: "$42.99",

    // Default Items Prices
    defaultItem1Price: "$12.99",
    defaultItem2Price: "$15.99",
    defaultItem3Price: "$18.99",
    defaultItem4Price: "$14.99",
    defaultItem5Price: "$16.99",
    defaultItem6Price: "$13.99",
    defaultItem7Price: "$17.99",
    defaultItem8Price: "$19.99",
  },
  fa: {
    home: "خانه",
    about: "منو",
    services: "تماس",
    login: "ثبت سفارش",
    signup: "کد تخفیف",
    language: "زبان",
    getStarted: "ثبت سفارش",
    companyName: "شرکت شما",
    location: "موقعیت",
    address: "خیابان اصلی ۱۲۳، شهر، کشور",
    address1: "آدرس",
    postalCode: "کد پستی: ۱۲۳۴۵",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    phone2: "۰۲۱۱۲۳۴۵۶۷۸",
    contactUs: "تماس با ما",
    sendMessage: "ارسال پیام",
    support: "مرکز پشتیبانی",
    allRightsReserved: "تمامی حقوق محفوظ است.",
    privacy: "حریم خصوصی",
    terms: "شرایط خدمات",
    ourMenu: "منوی ما",
    appetizers: "پیش غذا",
    mainCourses: "برگر",
    desserts: "پاستا",
    beverages: "نوشیدنی",
    salads: "سالاد",
    soups: "مرغ سوخاری",
    seafood: "پیتزا",
    specialties: "ساندویچ",
    viewMenu: "مشاهده منو",
    backToMenu: "بازگشت به منو",
    exploreOur: "کاوش کنید",
    orderNow: "سفارش دهید",
    menuSubtitle: "مجموعه‌ای از غذاهای خوشمزه و با دقت تهیه شده را کشف کنید",
    crispyMozzarellaSticks: "سیب زمینی ویژه",
    crispyMozzarellaSticksDesc: "سیب زمینی سرخ شده/ ژامبون/ پنیر/ قارچ/فلفل دلمه",
    buffaloWings: "سیب زمینی با سس آلفردو",
    buffaloWingsDesc: "سیب زمینی سرخ شده/ سس آلفردو",
    loadedNachos: "سیب زمینی با دیپ",
    loadedNachosDesc: "سیب زمینی سرخ شده/ دیپ مخصوص",
    calamariRings: "سیب زمینی کلاسیک",
    calamariRingsDesc: "سیب زمینی سرخ شده/ ادویه مخصوص/نمک",
    stuffedMushrooms: "قارچ سوخاري",
    stuffedMushroomsDesc: "قارچ دکمه‌ای سرخ شده",

    // Main Courses
    grilledRibeyeSteak: "برگر کلاسیک",
    grilledRibeyeSteakDesc: "برگر گوشت/ کاهو/ گوجه/ خیارشور/ سس مخصوص",
    herbCrustedSalmon: "چیز برگر",
    herbCrustedSalmonDesc: "برگر گوشت/ پنیر/ کاهو/ گوجه/ خیارشور/ سس مخصوص",
    chickenParmesan: "دبل برگر",
    chickenParmesanDesc: "دو عدد برگر گوشت/ کاهو/ گوجه/ خیارشور/ سس مخصوص",
    lobsterRavioli: "قارچ برگر",
    lobsterRavioliDesc: "برگر گوشت/ قارچ/ گوجه/ خیارشور/ کاهو/ سس مخصوص",
    bbqPorkRibs: "چیکن برگر",
    bbqPorkRibsDesc: "برگر مرغ/ کاهو/ گوجه/ خیارشور/ سس مخصوص",

    // Desserts
    chocolateLavaCake: "پنه مرغ",
    chocolateLavaCakeDesc: "پاستا پنه/ مرغ مزه دار شده/ سس آلفردو",
    newYorkCheesecake: "پنه گوشت",
    newYorkCheesecakeDesc: "پاستا پنه/ گوشت گوساله رست شده/ سس آلفردو",

    // Beverages
    freshOrangeJuice: "نوشابه",
    freshOrangeJuiceDesc: "کوکا/ فانتا/ اسپرایت/ زیرو",
    icedCoffee: "ماءالشعیر",
    icedCoffeeDesc: "لیمو/ استوایی/ هلو",
    fruitSmoothie: "آب معدنی",
    fruitSmoothieDesc: "",

    // Salads
    caesarSalad: "سزار با مرغ گریل",
    caesarSaladDesc: "کاهو پیچ/ فیله مرغ گریل/ نان تست/ زیتون/گوجه گیلاسی/ پنیر پارمسان/سس مخصوص",

    // Soups
    tomatoBasilSoup: "فیله سوخاري سه تیکه",
    tomatoBasilSoupDesc: "( اسپایسی و معمولی )/ به همراه سیب زمینی و سالاد کلم",
    chickenNoodleSoup: "فیله سوخاري پنج تیکه",
    chickenNoodleSoupDesc: "( اسپایسی و معمولی )/ به همراه سیب زمینی و سالاد کلم",

    // Seafood
    grilledLobsterTail: "سیر و استیک",
    grilledLobsterTailDesc: "استیک راسته گوساله/ حریر سیر/سس مخصوص/ پنیر",
    panSearedScallops: "رست بیف",
    panSearedScallopsDesc: "گوشت رست شده/ قارچ/ پنیر/سس مخصوص/ زیتون",
    fishAndChips: "میت لاور",
    fishAndChipsDesc: "گوشت چرخ کرده/ رست بیف/چیکن/ فلفل دلمه/ قارچ/ پنیر/سس مخصوص",
    seafoodPaella: "چیکن بیف",
    seafoodPaellaDesc: "گوشت راسته/ چیکن/ قارچ/سس مخصوص/ پنیر",
    blackenedMahiMahi: "چیکن آلفردو",
    blackenedMahiMahiDesc: "مرغ مرینت شده/ سس آلفردو/قارچ/ پنیر",
    crabCakes: "مخلوط",
    crabCakesDesc: "کوکتل / ژامبون مرغ و گوشت 90/ قارچ/ زیتون/ فلفل دلمه/ دودي 90رنگی/ پنیر/ سس مخصوص",

    // Chef Specialties
    wagyuBeefTenderloin: "رست بیف",
    wagyuBeefTenderloinDesc: "مغز ران گوساله/ پنیر/ سس آلفردو/ کاهو/ پیاز جعفري/گوجه/ خیارشور",
    duckConfit: "سوسیس بندري",
    duckConfitDesc: "خوراك سوسیس بندري/ نان باگت",
    rackOfLamb: "فیله مرغ",
    rackOfLambDesc: "فیله مرغ/ کاهو/ گوجه/ خیار شور/سس مخصوص",
    stuffedPortobello: "ژامبون تنوري مرغ",
    stuffedPortobelloDesc: "گوجه/ کاهو/ ژامبون مرغ تنوري %90 /خیارشور/ سس مخصوص",
    surfAndTurf: "فیله مرغ با قارچ و پنیر",
    surfAndTurfDesc: "فیله مرغ/ قارچ و پنیر/ کاهو/گوجه/ خیار شور/ سس مخصوص",
    chefsTastingMenu: "هات داگ با قارچ و پنیر",
    chefsTastingMenuDesc: "هات داگ/ قارچ و پنیر/ سس مخصوص/ گوجه/ کاهو/خیارشور",

    // Default items
    deliciousAndFresh: "مواد تازه و خوشمزه",
    chefsSpecialRecommendation: "پیشنهاد ویژه سرآشپز",
    premiumQualityIngredients: "مواد با کیفیت درجه یک",
    popularChoiceAmongCustomers: "انتخاب محبوب مشتریان",
    traditionalRecipeWithModernTwist: "دستور سنتی با لمس مدرن",
    lightAndHealthyOption: "گزینه سبک و سالم",

    // Additional Appetizers
    garlicBread: "نان سیر",
    garlicBreadDesc: "نان برشته شده با کره سیر و سبزیجات",

    // Additional Seafood
    salmonTeriyaki: "سبزیجات",
    salmonTeriyakiDesc: "بادمجان/ کدو/ هویج/ فلفل دلمه رنگی/ گوجه/ قارچ/ زیتون سیاه",
    shrimpScampi: "پپرونی",
    shrimpScampiDesc: "پپرونی/ سس مخصوص/ پنیر/هالوپینو",

    // Additional Chef Specialties
    ossobuco: "ژامبون گوشت سرد",
    ossobucoDesc: "گوجه/ کاهو/ ژامبون گوشت %90/خیارشور/ سس مخصوص",
    bouillabaisse: "ژامبون مرغ سرد",
    bouillabaisseDesc: "گوجه/ کاهو/ژامبون مرغ %90/خیارشور/ سس مخصوص",
    // Salad names and descriptions
cobbSalad: "ژامبون تنوري گوشت",
cobbSaladDesc: "ژامبون تنوري گوشت %90/گوجه/ کاهو/ خیارشور/سس مخصوص",
nicoiseSalad: "هات داگ کلاسیک",
nicoiseSaladDesc: "هات داگ/ سس خردل",


    // Additional Default
    seasonalSpecialty: "تخصص فصلی با مواد تازه",
    chefRecommended: "غذای امضا پیشنهادی سرآشپز",
    cart: "سبد خرید",
    shoppingCart: "سبد خرید",
    cartEmpty: "سبد خرید شما خالی است",
    total: "مجموع",
    clearCart: "پاک کردن سبد",
    checkout: "پرداخت",
    findUs: "ما را پیدا کنید و در تماس باشید",
    email: "ایمیل",
    followUs: "ما را دنبال کنید",
    // Form/Survey translations
    customerSurvey: "نظرسنجی مشتریان",
    surveyDescription: "به ما کمک کنید تا تجربه غذاخوری شما را بهبود دهیم",
    surveySubmitted: "از بازخورد شما متشکریم!",
    submitError: "خطا در ارسال نظرسنجی. لطفاً دوباره تلاش کنید.",

    // Form steps
    personalInfo: "اطلاعات شخصی",
    visitInfo: "اطلاعات بازدید",
    ratings: "امتیاز دهی به تجربه شما",
    feedback: "بازخورد شما",
    preferences: "ترجیحات و بازاریابی",

    // Step labels
    personal: "شخصی",
    visit: "بازدید",

    // Form fields
    name: "نام",
    email1: "ایمیل",
    phone1: "تلفن",
    ageGroup: "گروه سنی",
    enterName: "نام خود را وارد کنید",
    enterEmail: "ایمیل خود را وارد کنید",
    enterPhone: "شماره تلفن خود را وارد کنید",
    selectAge: "گروه سنی را انتخاب کنید",
    over56: "۵۶+",

    // Visit information
    visitFrequency: "چند وقت یکبار از ما بازدید می‌کنید؟",
    firstTime: "اولین بار",
    weekly: "هفتگی",
    monthly: "ماهانه",
    occasionally: "گاهی اوقات",
    rarely: "به ندرت",
    lastVisit: "آخرین بازدید شما کی بود؟",
    partySize: "تعداد افراد",
    selectPartySize: "تعداد افراد را انتخاب کنید",
    sevenPlus: "۷+",
    occasion: "مناسبت",
    selectOccasion: "مناسبت را انتخاب کنید",
    casual: "غذاخوری معمولی",
    business: "جلسه کاری",
    celebration: "جشن",
    date: "قرار عاشقانه",
    family: "گردهمایی خانوادگی",

    // Ratings
    foodQuality: "کیفیت غذا",
    serviceQuality: "کیفیت سرویس",
    atmosphere: "فضا",
    valueForMoney: "ارزش در برابر پول",

    // Feedback
    mostLiked: "بیشترین چیزی که دوست داشتید چه بود؟",
    describeMostLiked: "بگویید بیشترین لذت را از چه چیزی در تجربه‌تان بردید",
    improvements: "چه چیزی را می‌توانیم بهبود دهیم؟",
    describeImprovements: "پیشنهادات خود برای بهبود را با ما در میان بگذارید",
    recommendation: "چقدر احتمال دارد ما را توصیه کنید؟",
    notLikely: "احتمال کم",
    veryLikely: "احتمال زیاد",
    additionalComments: "نظرات اضافی",
    shareThoughts: "هر نظر یا پیشنهاد اضافی را با ما در میان بگذارید",

    // Preferences
    favoriteItems: "آیتم‌های مورد علاقه منو",
    dietaryRestrictions: "محدودیت‌های غذایی",
    vegetarian: "گیاهخوار",
    vegan: "وگان",
    glutenFree: "بدون گلوتن",
    dairyFree: "بدون لبنیات",
    nutFree: "بدون آجیل",
    halal: "حلال",
    kosher: "کوشر",
    none: "هیچ",
    preferredTime: "زمان ترجیحی غذاخوری",
    selectTime: "زمان ترجیحی را انتخاب کنید",
    breakfast: "صبحانه (۷-۱۱ صبح)",
    lunch: "ناهار (۱۱ صبح-۳ بعدازظهر)",
    dinner: "شام (۵-۱۰ شب)",
    lateNight: "شب دیر (۱۰ شب+)",

    // Marketing
    hearAboutUs: "چطور از ما باخبر شدید؟",
    socialMedia: "شبکه‌های اجتماعی",
    friendsFamily: "دوستان/خانواده",
    onlineSearch: "جستجوی آنلاین",
    advertisement: "تبلیغات",
    walkBy: "از کنار رد شدم",
    other: "سایر",
    subscribeNewsletter: "عضویت در خبرنامه",
    receivePromotions: "دریافت پیشنهادات تبلیغاتی",

    // Form actions
    previous: "قبلی",
    next: "بعدی",
    submitSurvey: "ارسال نظرسنجی",
    submitting: "در حال ارسال...",

    // Validation messages
    nameRequired: "نام الزامی است",
    emailRequired: "ایمیل الزامی است",
    emailInvalid: "ایمیل نامعتبر است",
    visitFrequencyRequired: "تعدد بازدید الزامی است",
    ratingRequired: "امتیاز الزامی است",
    feedbackRequired: "این فیلد الزامی است",
    recommendationRequired: "امتیاز توصیه الزامی است",
    // Location & Contact translations
    getDirections: "مسیریابی",
    openInGoogleMaps: "گوگل مپ",
    openInOSM: "نقشه آزاد",
    coordinates: "مختصات",
    copyCoordinates: "برای کپی مختصات کلیک کنید",
    businessHours: "ساعات کاری",
    monday: "دوشنبه",
    tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه",
    thursday: "پنج‌شنبه",
    friday: "جمعه",
    saturday: "شنبه",
    sunday: "یکشنبه",
    loading: "در حال بارگذاری...",

    // Form translations (additional)
    surveySubmittedDesc: "پاسخ شما ثبت شد و به بهبود خدمات ما کمک خواهد کرد.",
    submitAnother: "ارسال پاسخ دیگر",
    enterFavoriteItems: "آیتم‌های مورد علاقه خود را وارد کنید",
    selectOption: "یک گزینه انتخاب کنید",

    // Appetizers Prices (same as English)
    crispyMozzarellaSticksPrice: "208T",
    buffaloWingsPrice: "133T",
    loadedNachosPrice: "170T",
    calamariRingsPrice: "84T",
    stuffedMushroomsPrice: "97.5T",
    garlicBreadPrice: "119T",

    // Main Courses Prices (same as English)
    grilledRibeyeSteakPrice: "310T",
    herbCrustedSalmonPrice: "306T",
    chickenParmesanPrice: "387T",
    lobsterRavioliPrice: "264T",
    bbqPorkRibsPrice: "216T",

    // Desserts Prices (same as English)
    chocolateLavaCakePrice: "320T",
    newYorkCheesecakePrice: "370T",

    // Beverages Prices (same as English)
    freshOrangeJuicePrice: "$4.99",
    icedCoffeePrice: "$3.99",
    fruitSmoothiePrice: "$5.99",

    // Salads Prices (same as English)
    caesarSaladPrice: "270T",

    // Soups Prices (same as English)
    tomatoBasilSoupPrice: "289T",
    chickenNoodleSoupPrice: "380T",

    // Chef Specialties Prices (same as English)
    wagyuBeefTenderloinPrice: "380T",
    duckConfitPrice: "220T",
    rackOfLambPrice: "220T",
    stuffedPortobelloPrice: "220T",
    surfAndTurfPrice: "260T",
    chefsTastingMenuPrice: "240T",
    ossobucoPrice: "180T",
    bouillabaissePrice: "190T",
    cobbSaladPrice: "230T",
nicoiseSaladPrice: "180T",

    // Default Items Prices (same as English)
    defaultItem1Price: "$12.99",
    defaultItem2Price: "$15.99",
    defaultItem3Price: "$18.99",
    defaultItem4Price: "$14.99",
    defaultItem5Price: "$16.99",
    defaultItem6Price: "$13.99",
    defaultItem7Price: "$17.99",
    defaultItem8Price: "$19.99",
     // Size labels
    small: "کوچک",
    large: "بزرگ",
    unavailable: "اتمام موجودی",
    

    
    // Seafood prices (with sizes)
    grilledLobsterTailPriceSmall: "290T",
    grilledLobsterTailPriceLarge: "405T",
    panSearedScallopsPriceSmall: "326T",
    panSearedScallopsPriceLarge: "416T",
    fishAndChipsPriceSmall: "305T",
    fishAndChipsPriceLarge: "420T",
    seafoodPaellaPriceSmall: "220T",
    seafoodPaellaPriceLarge: "301T",
    blackenedMahiMahiPriceSmall: "185T",
    blackenedMahiMahiPriceLarge: "234T",
    crabCakesPriceSmall: "162T",
    crabCakesPriceLarge: "266T",
    salmonTeriyakiPriceSmall: "143T",
    salmonTeriyakiPriceLarge: "198T",
    shrimpScampiPriceSmall: "170T",
    shrimpScampiPriceLarge: "296T",

    // Original Price Translation Keys and Values
crispyMozzarellaSticksOriginalPrice: "260T",
buffaloWingsOriginalPrice: "190T",
loadedNachosOriginalPrice: "$15.99",
garlicBreadOriginalPrice: "119T",
calamariRingsOriginalPrice: "140T",
stuffedMushroomsOriginalPrice: "$15.99",
grilledRibeyeSteakOriginalPrice: "$15.99",
herbCrustedSalmonOriginalPrice: "340T",
chickenParmesanOriginalPrice: "430T",
lobsterRavioliOriginalPrice: "$330T",
bbqPorkRibsOriginalPrice: "360T",
chocolateLavaCakeOriginalPrice: "$15.99",
newYorkCheesecakeOriginalPrice: "$8.99",
freshOrangeJuiceOriginalPrice: "$15.99",
icedCoffeeOriginalPrice: "$15.99",
fruitSmoothieOriginalPrice: "$7.99",
caesarSaladOriginalPrice: "$15.99",
tomatoBasilSoupOriginalPrice: "340T",
chickenNoodleSoupOriginalPrice: "400T",
grilledLobsterTailOriginalPriceSmall: "$28.99",
grilledLobsterTailOriginalPriceLarge: "450T",
panSearedScallopsOriginalPriceSmall: "326T",
panSearedScallopsOriginalPriceLarge: "520T",
fishAndChipsOriginalPriceSmall: "$18.99",
fishAndChipsOriginalPriceLarge: "600T",
seafoodPaellaOriginalPriceSmall: "$32.99",
seafoodPaellaOriginalPriceLarge: "430T",
blackenedMahiMahiOriginalPriceSmall: "185T",
blackenedMahiMahiOriginalPriceLarge: "390T",
crabCakesOriginalPriceSmall: "$24.99",
crabCakesOriginalPriceLarge: "$380T",
salmonTeriyakiOriginalPriceSmall: "143T",
salmonTeriyakiOriginalPriceLarge: "330T",
shrimpScampiOriginalPriceSmall: "$22.99",
shrimpScampiOriginalPriceLarge: "370T",
wagyuBeefTenderloinOriginalPrice: "$15.99",
duckConfitOriginalPrice: "220T",
rackOfLambOriginalPrice: "220T",
stuffedPortobelloOriginalPrice: "220T",
surfAndTurfOriginalPrice: "260T",
chefsTastingMenuOriginalPrice: "$15.99",
ossobucoOriginalPrice: "$15.99",
bouillabaisseOriginalPrice: "190T",
cobbSaladOriginalPrice: "230T",
nicoiseSaladOriginalPrice: "$15.99"

    
  },
  
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fa")) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage and update document direction
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === "fa";

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
