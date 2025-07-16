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
    // English translations
crispyMozzarellaSticks: "Special Potato",
crispyMozzarellaSticksDesc: "Fried potato/ Ham/ Cheese/ Mushroom/ Bell pepper",
buffaloWings: "Potato with Alfredo Sauce",
buffaloWingsDesc: "Fried potato/ Alfredo sauce",
loadedNachos: "Potato with Dip",
loadedNachosDesc: "Fried potato/ Special dip",
calamariRings: "Classic Potato",
calamariRingsDesc: "Fried potato/ Special spices/ Salt",
stuffedMushrooms: "Fried Mushroom",
stuffedMushroomsDesc: "Fried button mushroom",

// Main Courses
grilledRibeyeSteak: "Classic Burger",
grilledRibeyeSteakDesc: "Beef burger/ Lettuce/ Tomato/ Pickle/ Special sauce",
herbCrustedSalmon: "Cheese Burger",
herbCrustedSalmonDesc: "Beef burger/ Cheese/ Lettuce/ Tomato/ Pickle/ Special sauce",
chickenParmesan: "Double Burger",
chickenParmesanDesc: "Two beef burgers/ Lettuce/ Tomato/ Pickle/ Special sauce",
lobsterRavioli: "Mushroom Burger",
lobsterRavioliDesc: "Beef burger/ Mushroom/ Tomato/ Pickle/ Lettuce/ Special sauce",
bbqPorkRibs: "Chicken Burger",
bbqPorkRibsDesc: "Chicken burger/ Lettuce/ Tomato/ Pickle/ Special sauce",

// Desserts
chocolateLavaCake: "Chicken Penne",
chocolateLavaCakeDesc: "Penne pasta/ Seasoned chicken/ Alfredo sauce",
newYorkCheesecake: "Beef Penne",
newYorkCheesecakeDesc: "Penne pasta/ Roasted beef/ Alfredo sauce",

// Beverages
freshOrangeJuice: "Soft Drink",
freshOrangeJuiceDesc: "Coca/ Fanta/ Sprite/ Zero",
icedCoffee: "Malt Beverage",
icedCoffeeDesc: "Lemon/ Tropical/ Peach",
fruitSmoothie: "Mineral Water",
fruitSmoothieDesc: "",

// Salads
caesarSalad: "Caesar with Grilled Chicken",
caesarSaladDesc: "Iceberg lettuce/ Grilled chicken fillet/ Toast/ Olives/ Cherry tomatoes/ Parmesan cheese/ Special sauce",

// Soups
tomatoBasilSoup: "Three-Piece Fried Fillet",
tomatoBasilSoupDesc: "(Spicy and regular)/ Served with potato and coleslaw",
chickenNoodleSoup: "Five-Piece Fried Fillet",
chickenNoodleSoupDesc: "(Spicy and regular)/ Served with potato and coleslaw",

// Seafood
grilledLobsterTail: "Garlic & Steak",
grilledLobsterTailDesc: "Beef ribeye steak/ Garlic sauce/ Special sauce/ Cheese",
panSearedScallops: "Roast Beef",
panSearedScallopsDesc: "Roasted beef/ Mushroom/ Cheese/ Special sauce/ Olives",
fishAndChips: "Meat Lover",
fishAndChipsDesc: "Ground beef/ Roast beef/ Chicken/ Bell pepper/ Mushroom/ Cheese/ Special sauce",
seafoodPaella: "Chicken Beef",
seafoodPaellaDesc: "Ribeye beef/ Chicken/ Mushroom/ Special sauce/ Cheese",
blackenedMahiMahi: "Chicken Alfredo",
blackenedMahiMahiDesc: "Marinated chicken/ Alfredo sauce/ Mushroom/ Cheese",
crabCakes: "Mixed",
crabCakesDesc: "Cocktail/ Ham chicken and beef 90/ Mushroom/ Olives/ Bell pepper/ Smoked 90 colorful/ Cheese/ Special sauce",

// Chef Specialties
wagyuBeefTenderloin: "Roast Beef",
wagyuBeefTenderloinDesc: "Beef leg/ Cheese/ Alfredo sauce/ Lettuce/ Green onion/ Tomato/ Pickle",
duckConfit: "Bandari Sausage",
duckConfitDesc: "Bandari sausage dish/ Baguette bread",
rackOfLamb: "Chicken Fillet",
rackOfLambDesc: "Chicken fillet/ Lettuce/ Tomato/ Pickle/ Special sauce",
stuffedPortobello: "Oven-Baked Chicken Ham",
stuffedPortobelloDesc: "Tomato/ Lettuce/ Oven-baked chicken ham 90%/ Pickle/ Special sauce",
surfAndTurf: "Chicken Fillet with Mushroom and Cheese",
surfAndTurfDesc: "Chicken fillet/ Mushroom and cheese/ Lettuce/ Tomato/ Pickle/ Special sauce",
chefsTastingMenu: "Hot Dog with Mushroom and Cheese",
chefsTastingMenuDesc: "Hot dog/ Mushroom and cheese/ Special sauce/ Tomato/ Lettuce/ Pickle",

// Additional Appetizers
garlicBread: "Garlic Bread",
garlicBreadDesc: "Toasted bread with garlic butter and herbs",

// Additional Seafood
salmonTeriyaki: "Vegetables",
salmonTeriyakiDesc: "Eggplant/ Zucchini/ Carrot/ Colorful bell peppers/ Tomato/ Mushroom/ Black olives",
shrimpScampi: "Pepperoni",
shrimpScampiDesc: "Pepperoni/ Special sauce/ Cheese/ Jalapeño",

// Additional Chef Specialties
ossobuco: "Cold Beef Ham",
ossobucoDesc: "Tomato/ Lettuce/ Beef ham 90%/ Pickle/ Special sauce",
bouillabaisse: "Cold Chicken Ham",
bouillabaisseDesc: "Tomato/ Lettuce/ Chicken ham 90%/ Pickle/ Special sauce",
cobbSalad: "Oven-Baked Beef Ham",
cobbSaladDesc: "Oven-baked beef ham 90%/ Tomato/ Lettuce/ Pickle/ Special sauce",
nicoiseSalad: "Classic Hot Dog",
nicoiseSaladDesc: "Hot dog/ Mustard sauce",
// Additional Default
seasonalSpecialty: "Seasonal specialty with fresh ingredients",
chefRecommended: "Chef's signature recommended dish",
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
surveySubmittedDesc: "Your response has been recorded and will help us improve our service.",
submitAnother: "Submit Another Response",
enterFavoriteItems: "Enter your favorite menu items",
selectOption: "Select an option",

// Size labels
small: "Small",
large: "Large",
unavailable: "Out of Stock",

// Prices (keeping the same format as Persian)
crispyMozzarellaSticksPrice: "208T",
buffaloWingsPrice: "133T",
loadedNachosPrice: "170T",
calamariRingsPrice: "84T",
stuffedMushroomsPrice: "97.5T",
garlicBreadPrice: "119T",
grilledRibeyeSteakPrice: "310T",
herbCrustedSalmonPrice: "306T",
chickenParmesanPrice: "387T",
lobsterRavioliPrice: "264T",
bbqPorkRibsPrice: "216T",
chocolateLavaCakePrice: "320T",
newYorkCheesecakePrice: "370T",
freshOrangeJuicePrice: "$4.99",
icedCoffeePrice: "$3.99",
fruitSmoothiePrice: "$5.99",
caesarSaladPrice: "270T",
tomatoBasilSoupPrice: "289T",
chickenNoodleSoupPrice: "380T",
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
lobsterRavioliOriginalPrice: "330T",
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
crabCakesOriginalPriceLarge: "380T",
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
