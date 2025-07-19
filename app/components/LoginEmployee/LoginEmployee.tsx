'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts';
import './LoginEmployee.scss';

interface LoginFormData {
  email: string;
  password: string;
}

interface Employee {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface LoginEmployeeProps {
  onLoginSuccess?: (employee: Employee) => void;
}

interface MenuCategory {
  id: number;
  title: string | { [key: string]: string };
  image: string;
  header_image: string;
  created_at: string;
  updated_at: string;
}

interface MenuItemData {
  id: number;
  name: string | { [key: string]: string };
  price: string;
  price_small?: string;
  price_large?: string;
  description: string | { [key: string]: string };
  image: string;
  is_discounted: boolean;
  original_price?: string;
  original_price_small?: string;
  original_price_large?: string;
  is_available: boolean;
  category_id: number;
  created_at: string;
  updated_at: string;
}

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  items: any[];
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
}

interface SurveyData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: string;
  visit_frequency?: string;
  last_visit?: string;
  party_size?: string;
  occasion?: string;
  food_quality: number;
  service_quality: number;
  atmosphere: number;
  value_for_money: number;
  favorite_items?: string[];
  preferred_time?: string;
  most_liked: string;
  improvements?: string;
  recommendation: number;
  additional_comments?: string;
  hear_about_us?: string;
  newsletter: boolean;
  promotions: boolean;
  language: string;
  created_at: string;
}

interface CouponData {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

const LoginEmployee: React.FC<LoginEmployeeProps> = ({ onLoginSuccess }) => {
  const { t, isRTL, language } = useLanguage();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'surveys' | 'analytics' | 'coupons'>('overview');
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Load dashboard data when logged in
  useEffect(() => {
    if (isLoggedIn && employee) {
      loadDashboardData();
    }
  }, [isLoggedIn, employee, activeTab]);

  const checkExistingSession = () => {
    try {
      const storedEmployee = localStorage.getItem('employee');
      const storedToken = localStorage.getItem('employeeToken');
      
      if (storedEmployee && storedToken) {
        const tokenData = JSON.parse(atob(storedToken));
        
        if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
          localStorage.removeItem('employee');
          localStorage.removeItem('employeeToken');
          return;
        }
        
        const employeeData = JSON.parse(storedEmployee);
        setEmployee(employeeData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('employee');
      localStorage.removeItem('employeeToken');
    }
  };

  const loadDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) return;

      // Load data based on active tab
      switch (activeTab) {
        case 'overview':
          await Promise.all([
            loadOrders(),
            loadSurveys()
          ]);
          break;
        case 'menu':
          await Promise.all([
            loadMenuCategories(),
            selectedCategory ? loadMenuItems(selectedCategory) : Promise.resolve()
          ]);
          break;
        case 'orders':
          await loadOrders();
          break;
        case 'surveys':
          await loadSurveys();
          break;
        case 'analytics':
          await Promise.all([
            loadOrders(),
            loadSurveys()
          ]);
          break;
        case 'coupons':
          await loadCoupons();
          break;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const loadMenuCategories = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/menu/categories?lang=${language}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setMenuCategories(result.data);
      }
    } catch (error) {
      console.error('Error loading menu categories:', error);
    }
  };

  const loadMenuItems = async (categoryId?: number) => {
    try {
      const category = categoryId || selectedCategory;
      if (!category) return;

      const timestamp = new Date().getTime();
      const response = await fetch(`/api/menu/${category}?lang=${language}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setMenuItems(result.data.items || []);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadSurveys = async () => {
    try {
      const response = await fetch('/api/survey', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setSurveys(result.data || []);
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  };

  const loadCoupons = async () => {
    try {
      const response = await fetch('/api/coupons', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setCoupons(result.data || []);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid') || 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = t('passwordRequired') || 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await fetch('/api/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      localStorage.setItem('employee', JSON.stringify(result.employee));
      localStorage.setItem('employeeToken', result.token);
      
      setEmployee(result.employee);
      setIsLoggedIn(true);
      
      if (onLoginSuccess) {
        onLoginSuccess(result.employee);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(
        error instanceof Error 
          ? error.message 
          : t('loginError') || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employee');
    localStorage.removeItem('employeeToken');
    setIsLoggedIn(false);
    setEmployee(null);
    setFormData({ email: '', password: '' });
    setActiveTab('overview');
    setMenuCategories([]);
    setMenuItems([]);
    setOrders([]);
    setSurveys([]);
    setCoupons([]);
  };

  const updateMenuItem = async (item: MenuItemData) => {
    try {
      const response = await fetch(`/api/menu/items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          price_small: item.price_small,
          price_large: item.price_large,
          description: item.description,
          image: item.image,
          is_discounted: item.is_discounted,
          original_price: item.original_price,
          original_price_small: item.original_price_small,
          original_price_large: item.original_price_large,
          is_available: item.is_available,
          category_id: item.category_id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await loadMenuItems();
        setSelectedMenuItem(null);
        setIsEditingMenu(false);
      } else {
        alert(result.error || 'Failed to update menu item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Error updating menu item');
    }
  };

  const addMenuItem = async (item: Omit<MenuItemData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/menu/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify(item)
      });
      
      const result = await response.json();
      if (result.success) {
        await loadMenuItems();
        setSelectedMenuItem(null);
        setIsEditingMenu(false);
      } else {
        alert(result.error || 'Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Error adding menu item');
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderData['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
            if (result.success) {
        await loadOrders();
      } else {
        alert(result.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const addCoupon = async (coupon: Omit<CouponData, 'id' | 'used_count' | 'created_at'>) => {
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify(coupon)
      });
      
      const result = await response.json();
      if (result.success) {
        await loadCoupons();
        setIsAddingCoupon(false);
      } else {
        alert(result.error || 'Failed to add coupon');
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert('Error adding coupon');
    }
  };

  const updateCoupon = async (coupon: CouponData) => {
    try {
      const response = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify(coupon)
      });
      
      const result = await response.json();
      if (result.success) {
        await loadCoupons();
        setSelectedCoupon(null);
      } else {
        alert(result.error || 'Failed to update coupon');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Error updating coupon');
    }
  };

  const deleteCoupon = async (couponId: number) => {
    if (!confirm(t('confirmDelete') || 'Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        await loadCoupons();
      } else {
        alert(result.error || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Error deleting coupon');
    }
  };

  // Helper functions for analytics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total_amount, 0);
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue
    };
  };

  const getSurveyStats = () => {
    if (surveys.length === 0) return { avgRating: 0, recommendationRate: 0 };

    const totalRating = surveys.reduce((sum, s) => {
      const avgRating = (s.food_quality + s.service_quality + s.atmosphere + s.value_for_money) / 4;
      return sum + avgRating;
    }, 0);

    const avgRating = totalRating / surveys.length;
    const recommendationRate = surveys.reduce((sum, s) => sum + s.recommendation, 0) / surveys.length;

    return {
      avgRating,
      recommendationRate: (recommendationRate / 10) * 100 // Convert to percentage
    };
  };

  const getOrderStatusDistribution = () => {
    const distribution = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return distribution;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const getLocalizedText = (text: string | { [key: string]: string }) => {
    if (typeof text === 'string') return text;
    return text[language] || text['en'] || '';
  };

  // Login form render
  if (!isLoggedIn) {
    return (
      <div className={`employee-login ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">
                👤
              </div>
              <h2>{t('employeeLogin') || 'Employee Login'}</h2>
              <p>{t('loginToAccess') || 'Login to access the dashboard'}</p>
            </div>

            {loginError && (
              <div className="error-banner">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t('email')}</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  disabled={isLoading}
                  placeholder={t('enterEmail')}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">{t('password') || 'Password'}</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'error' : ''}
                  disabled={isLoading}
                  placeholder={t('enterPassword') || 'Enter password'}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading && <div className="spinner" />}
                {isLoading ? t('loggingIn') || 'Logging in...' : t('login') || 'Login'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {t('needHelp') || 'Need help?'}{' '}
                <a href="#" className="link">
                  {t('contactSupport') || 'Contact Support'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard render
  return (
    <div className={`employee-dashboard ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="employee-info">
            <h2>{t('welcome') || 'Welcome'}, {employee?.name}</h2>
            <p className="employee-role">
              {t('role') || 'Role'}: <span className={`role-badge ${employee?.role}`}>{employee?.role}</span>
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            {t('logout') || 'Logout'}
          </button>
        </div>

        {/* Dashboard Navigation */}
        <div className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📊</span>
            {t('overview') || 'Overview'}
          </button>
          
          {(employee?.role === 'admin' || employee?.role === 'manager') && (
            <button
              className={`nav-tab ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <span className="tab-icon">🍽️</span>
              {t('menuManagement') || 'Menu Management'}
            </button>
          )}
          
          <button
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="tab-icon">📋</span>
            {t('orders') || 'Orders'}
          </button>
          
          <button
            className={`nav-tab ${activeTab === 'surveys' ? 'active' : ''}`}
            onClick={() => setActiveTab('surveys')}
          >
            <span className="tab-icon">📝</span>
            {t('surveys') || 'Surveys'}
          </button>
          
          {(employee?.role === 'admin' || employee?.role === 'manager') && (
            <>
              <button
                className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <span className="tab-icon">📈</span>
                {t('analytics') || 'Analytics'}
              </button>
              
              <button
                className={`nav-tab ${activeTab === 'coupons' ? 'active' : ''}`}
                onClick={() => setActiveTab('coupons')}
              >
                <span className="tab-icon">🎫</span>
                {t('coupons') || 'Coupons'}
              </button>
            </>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {dashboardLoading ? (
            <div className="menu-loading">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>{t('loading')}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📋</div>
                      <div className="stat-info">
                        <h3>{orders.length}</h3>
                        <p>{t('totalOrders') || 'Total Orders'}</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-info">
                        <h3>{getOrderStats().completedOrders}</h3>
                        <p>{t('completedOrders') || 'Completed Orders'}</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <h3>{formatPrice(getOrderStats().totalRevenue)}</h3>
                        <p>{t('totalRevenue') || 'Total Revenue'}</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">📝</div>
                      <div className="stat-info">
                        <h3>{surveys.length}</h3>
                        <p>{t('totalSurveys') || 'Total Surveys'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="recent-activity">
                    <h3>{t('recentOrders') || 'Recent Orders'}</h3>
                    <div className="activity-list">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="activity-item">
                          <div className="activity-info">
                            <strong>#{order.order_number}</strong>
                            <span> - {order.customer_name}</span>
                            <span className={`status-badge ${order.status}`}>
                              {t(order.status) || order.status}
                            </span>
                          </div>
                          <div className="activity-meta">
                            <span>{formatPrice(order.total_amount)}</span>
                            <span>{formatDateTime(order.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Management Tab */}
              {activeTab === 'menu' && (employee?.role === 'admin' || employee?.role === 'manager') && (
                <div className="menu-tab">
                  <div className="tab-header">
                    <h3>{t('menuManagement') || 'Menu Management'}</h3>
                    <div className="menu-controls">
                      <select
                        value={selectedCategory || ''}
                        onChange={(e) => {
                          const categoryId = parseInt(e.target.value);
                          setSelectedCategory(categoryId);
                          if (categoryId) {
                            loadMenuItems(categoryId);
                          } else {
                            setMenuItems([]);
                          }
                        }}
                      >
                        <option value="">{t('selectCategory') || 'Select Category'}</option>
                        {menuCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {getLocalizedText(category.title)}
                          </option>
                        ))}
                      </select>
                      
                      {selectedCategory && (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedMenuItem(null);
                            setIsEditingMenu(true);
                          }}
                        >
                          {t('addItem') || 'Add Item'}
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedCategory && (
                    <div className="menu-items-grid">
                      {menuItems.map((item) => (
                        <div key={item.id} className="menu-item-card">
                          <div className="item-image">
                            <img src={item.image} alt={getLocalizedText(item.name)} />
                            <div className="item-status">
                              <span className={`availability-badge ${item.is_available ? 'available' : 'unavailable'}`}>
                                {item.is_available ? (t('available') || 'Available') : (t('unavailable') || 'Unavailable')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="item-info">
                            <h4>{getLocalizedText(item.name)}</h4>
                            <p className="item-description">{getLocalizedText(item.description)}</p>
                            
                            <div className="item-pricing">
                              {item.price_small && item.price_large ? (
                                <div className="size-pricing">
                                  <div className="price-row">
                                    <span>{t('small')}: </span>
                                    <span className="price">{item.price_small}</span>
                                    {item.is_discounted && item.original_price_small && (
                                      <span className="original-price">{item.original_price_small}</span>
                                    )}
                                  </div>
                                  <div className="price-row">
                                    <span>{t('large')}: </span>
                                    <span className="price">{item.price_large}</span>
                                    {item.is_discounted && item.original_price_large && (
                                      <span className="original-price">{item.original_price_large}</span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="single-pricing">
                                  <span className="price">{item.price}</span>
                                  {item.is_discounted && item.original_price && (
                                    <span className="original-price">{item.original_price}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="item-actions">
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  setSelectedMenuItem(item);
                                  setIsEditingMenu(true);
                                }}
                              >
                                {t('edit') || 'Edit'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="orders-tab">
                  <div className="tab-header">
                    <h3>{t('orderManagement') || 'Order Management'}</h3>
                    <div className="order-filters">
                      <select onChange={(e) => {
                        const status = e.target.value;
                        // Filter orders by status if needed
                      }}>
                        <option value="">{t('allStatuses') || 'All Statuses'}</option>
                        <option value="pending">{t('pending') || 'Pending'}</option>
                        <option value="preparing">{t('preparing') || 'Preparing'}</option>
                        <option value="ready">{t('ready') || 'Ready'}</option>
                        <option value="completed">{t('completed') || 'Completed'}</option>
                        <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h4>#{order.order_number}</h4>
                            <p><strong>{t('customer') || 'Customer'}:</strong> {order.customer_name}</p>
                            <p><strong>{t('phone') || 'Phone'}:</strong> {order.customer_phone}</p>
                            {order.customer_email && (
                              <p><strong>{t('email') || 'Email'}:</strong> {order.customer_email}</p>
                            )}
                            <p><strong>{t('address') || 'Address'}:</strong> {order.customer_address}</p>
                            <p className="order-time">{formatDateTime(order.created_at)}</p>
                          </div>
                          
                          <div className="order-status">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderData['status'])}
                              className={`status-select ${order.status}`}
                            >
                              <option value="pending">{t('pending') || 'Pending'}</option>
                              <option value="preparing">{t('preparing') || 'Preparing'}</option>
                              <option value="ready">{t('ready') || 'Ready'}</option>
                              <option value="completed">{t('completed') || 'Completed'}</option>
                              <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
                            </select>
                          </div>
                        </div>

                        <div className="order-items">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="order-item">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                              <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="order-summary">
                          <div className="summary-row">
                            <span>{t('subtotal') || 'Subtotal'}:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          {order.discount_amount > 0 && (
                            <div className="summary-row discount">
                              <span>{t('discount') || 'Discount'}:</span>
                              <span>-{formatPrice(order.discount_amount)}</span>
                            </div>
                          )}
                          <div className="summary-row total">
                            <strong>
                              <span>{t('total') || 'Total'}:</span>
                              <span>{formatPrice(order.total_amount)}</span>
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Surveys Tab */}
              {activeTab === 'surveys' && (
                <div className="surveys-tab">
                  <div className="tab-header">
                    <h3>{t('customerSurveys') || 'Customer Surveys'}</h3>
                    <div className="survey-stats">
                      <div className="stat-item">
                        <span className="stat-label">{t('totalResponses') || 'Total Responses'}:</span>
                        <span className="stat-value">{surveys.length}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">{t('avgRating') || 'Avg Rating'}:</span>
                        <span className="stat-value">{getSurveyStats().avgRating.toFixed(1)}/5</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">{t('recommendationRate') || 'Recommendation Rate'}:</span>
                        <span className="stat-value">{getSurveyStats().recommendationRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="surveys-list">
                    {surveys.map((survey) => (
                      <div key={survey.id} className="survey-card">
                        <div className="survey-header">
                          <div className="customer-info">
                            <h4>{survey.name}</h4>
                            <p><strong>{t('email') || 'Email'}:</strong> {survey.email}</p>
                            {survey.phone && <p><strong>{t('phone') || 'Phone'}:</strong> {survey.phone}</p>}
                            {survey.age && <p><strong>{t('age') || 'Age'}:</strong> {survey.age}</p>}
                            <p className="survey-date">{formatDateTime(survey.created_at)}</p>
                          </div>
                          
                          <div className="overall-rating">
                            <span className="rating-label">{t('overallRating') || 'Overall Rating'}</span>
                            <div className="rating-stars">
                              {renderStars(Math.round((survey.food_quality + survey.service_quality + survey.atmosphere + survey.value_for_money) / 4))}
                            </div>
                          </div>
                        </div>

                        <div className="survey-ratings">
                          <div className="rating-item">
                            <span>{t('foodQuality') || 'Food Quality'}</span>
                            <div className="rating-bar">
                              <div 
                                className="rating-fill" 
                                style={{ width: `${(survey.food_quality / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="rating-number">{survey.food_quality}/5</span>
                          </div>
                          
                          <div className="rating-item">
                            <span>{t('serviceQuality') || 'Service Quality'}</span>
                            <div className="rating-bar">
                              <div 
                                className="rating-fill" 
                                style={{ width: `${(survey.service_quality / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="rating-number">{survey.service_quality}/5</span>
                          </div>
                          
                          <div className="rating-item">
                            <span>{t('atmosphere') || 'Atmosphere'}</span>
                            <div className="rating-bar">
                              <div 
                                className="rating-fill" 
                                style={{ width: `${(survey.atmosphere / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="rating-number">{survey.atmosphere}/5</span>
                          </div>
                          
                          <div className="rating-item">
                            <span>{t('valueForMoney') || 'Value for Money'}</span>
                            <div className="rating-bar">
                              <div 
                                className="rating-fill" 
                                style={{ width: `${(survey.value_for_money / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="rating-number">{survey.value_for_money}/5</span>
                          </div>
                        </div>

                        {survey.most_liked && (
                          <div className="survey-feedback">
                            <h5>{t('mostLiked') || 'What they liked most'}</h5>
                            <p>"{survey.most_liked}"</p>
                          </div>
                        )}

                        {survey.improvements && (
                          <div className="survey-feedback">
                            <h5>{t('improvements') || 'Suggested improvements'}</h5>
                            <p>"{survey.improvements}"</p>
                          </div>
                        )}

                        {survey.additional_comments && (
                          <div className="survey-feedback">
                            <h5>{t('additionalComments') || 'Additional comments'}</h5>
                            <p>"{survey.additional_comments}"</p>
                          </div>
                        )}

                        <div className="survey-details">
                          <div className="detail-row">
                            <span>{t('visitFrequency') || 'Visit Frequency'}:</span>
                            <span>{survey.visit_frequency}</span>
                          </div>
                          {survey.party_size && (
                            <div className="detail-row">
                              <span>{t('partySize') || 'Party Size'}:</span>
                              <span>{survey.party_size}</span>
                            </div>
                          )}
                          {survey.occasion && (
                            <div className="detail-row">
                              <span>{t('occasion') || 'Occasion'}:</span>
                              <span>{survey.occasion}</span>
                            </div>
                          )}
                          <div className="detail-row">
                            <span>{t('recommendation') || 'Recommendation'}:</span>
                            <span>{survey.recommendation}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (employee?.role === 'admin' || employee?.role === 'manager') && (
                <div className="analytics-tab">
                  <div className="tab-header">
                    <h3>{t('analytics') || 'Analytics'}</h3>
                    <div className="date-filter">
                      <select>
                        <option value="today">{t('today') || 'Today'}</option>
                        <option value="week">{t('thisWeek') || 'This Week'}</option>
                        <option value="month">{t('thisMonth') || 'This Month'}</option>
                        <option value="year">{t('thisYear') || 'This Year'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h4>{t('salesOverview') || 'Sales Overview'}</h4>
                      <div className="sales-stats">
                        <div className="sales-item">
                          <span className="sales-label">{t('totalOrders') || 'Total Orders'}</span>
                          <span className="sales-value">{getOrderStats().totalOrders}</span>
                        </div>
                        <div className="sales-item">
                          <span className="sales-label">{t('completedOrders') || 'Completed Orders'}</span>
                          <span className="sales-value">{getOrderStats().completedOrders}</span>
                        </div>
                        <div className="sales-item">
                          <span className="sales-label">{t('totalRevenue') || 'Total Revenue'}</span>
                          <span className="sales-value">{formatPrice(getOrderStats().totalRevenue)}</span>
                        </div>
                        <div className="sales-item">
                          <span className="sales-label">{t('avgOrderValue') || 'Avg Order Value'}</span>
                          <span className="sales-value">{formatPrice(getOrderStats().avgOrderValue)}</span>
                        </div>
                      </div>
                    </div>

                                        <div className="analytics-card">
                      <h4>{t('orderStatus') || 'Order Status Distribution'}</h4>
                      <div className="status-distribution">
                        {Object.entries(getOrderStatusDistribution()).map(([status, count]) => (
                          <div key={status} className="status-item">
                            <div className="status-info">
                              <span className={`status-label ${status}`}>
                                {t(status) || status}
                              </span>
                              <span className="status-count">{count}</span>
                            </div>
                            <div className="status-bar">
                              <div 
                                className={`status-fill ${status}`}
                                style={{ width: `${(count / orders.length) * 100}%` }}
                              ></div>
                            </div>
                            <div className="status-percentage">
                              {((count / orders.length) * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h4>{t('customerSatisfaction') || 'Customer Satisfaction'}</h4>
                      <div className="satisfaction-stats">
                        <div className="satisfaction-item">
                          <span className="satisfaction-label">{t('avgFoodQuality') || 'Avg Food Quality'}</span>
                          <div className="satisfaction-rating">
                            <span className="rating-number">
                              {surveys.length > 0 ? (surveys.reduce((sum, s) => sum + s.food_quality, 0) / surveys.length).toFixed(1) : '0.0'}
                            </span>
                            <div className="rating-stars">
                              {renderStars(Math.round(surveys.length > 0 ? surveys.reduce((sum, s) => sum + s.food_quality, 0) / surveys.length : 0))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="satisfaction-item">
                          <span className="satisfaction-label">{t('avgServiceQuality') || 'Avg Service Quality'}</span>
                          <div className="satisfaction-rating">
                            <span className="rating-number">
                              {surveys.length > 0 ? (surveys.reduce((sum, s) => sum + s.service_quality, 0) / surveys.length).toFixed(1) : '0.0'}
                            </span>
                            <div className="rating-stars">
                              {renderStars(Math.round(surveys.length > 0 ? surveys.reduce((sum, s) => sum + s.service_quality, 0) / surveys.length : 0))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="satisfaction-item">
                          <span className="satisfaction-label">{t('avgAtmosphere') || 'Avg Atmosphere'}</span>
                          <div className="satisfaction-rating">
                            <span className="rating-number">
                              {surveys.length > 0 ? (surveys.reduce((sum, s) => sum + s.atmosphere, 0) / surveys.length).toFixed(1) : '0.0'}
                            </span>
                            <div className="rating-stars">
                              {renderStars(Math.round(surveys.length > 0 ? surveys.reduce((sum, s) => sum + s.atmosphere, 0) / surveys.length : 0))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="satisfaction-item">
                          <span className="satisfaction-label">{t('avgValueForMoney') || 'Avg Value for Money'}</span>
                          <div className="satisfaction-rating">
                            <span className="rating-number">
                              {surveys.length > 0 ? (surveys.reduce((sum, s) => sum + s.value_for_money, 0) / surveys.length).toFixed(1) : '0.0'}
                            </span>
                            <div className="rating-stars">
                              {renderStars(Math.round(surveys.length > 0 ? surveys.reduce((sum, s) => sum + s.value_for_money, 0) / surveys.length : 0))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-card">
                      <h4>{t('recentFeedback') || 'Recent Feedback'}</h4>
                      <div className="feedback-list">
                        {surveys.slice(0, 5).map((survey) => (
                          <div key={survey.id} className="feedback-item">
                            <div className="feedback-header">
                              <strong>{survey.name}</strong>
                              <div className="feedback-rating">
                                {renderStars(Math.round((survey.food_quality + survey.service_quality + survey.atmosphere + survey.value_for_money) / 4))}
                              </div>
                            </div>
                            {survey.most_liked && (
                              <p className="feedback-text">"{survey.most_liked}"</p>
                            )}
                            <div className="feedback-date">{formatDate(survey.created_at)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === 'coupons' && (employee?.role === 'admin' || employee?.role === 'manager') && (
                <div className="coupons-tab">
                  <div className="tab-header">
                    <h3>{t('couponManagement') || 'Coupon Management'}</h3>
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsAddingCoupon(true)}
                    >
                      {t('addCoupon') || 'Add Coupon'}
                    </button>
                  </div>

                  <div className="coupons-list">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="coupon-card">
                        <div className="coupon-header">
                          <div className="coupon-info">
                            <h4>{coupon.code}</h4>
                            <p>
                              <strong>{t('discount') || 'Discount'}:</strong>{' '}
                              {coupon.discount_type === 'percentage' 
                                ? `${coupon.discount_value}%` 
                                : formatPrice(coupon.discount_value)
                              }
                            </p>
                            {coupon.min_order_amount && (
                              <p>
                                <strong>{t('minOrder') || 'Min Order'}:</strong>{' '}
                                {formatPrice(coupon.min_order_amount)}
                              </p>
                            )}
                            {coupon.max_discount_amount && (
                              <p>
                                <strong>{t('maxDiscount') || 'Max Discount'}:</strong>{' '}
                                {formatPrice(coupon.max_discount_amount)}
                              </p>
                            )}
                          </div>
                          
                          <div className="coupon-status">
                            <span className={`status-badge ${coupon.is_active ? 'active' : 'inactive'}`}>
                              {coupon.is_active ? (t('active') || 'Active') : (t('inactive') || 'Inactive')}
                            </span>
                          </div>
                        </div>

                        <div className="coupon-details">
                          <div className="detail-row">
                            <span>{t('usageCount') || 'Usage Count'}:</span>
                            <span>{coupon.used_count} / {coupon.usage_limit || '∞'}</span>
                          </div>
                          {coupon.expires_at && (
                            <div className="detail-row">
                              <span>{t('expiresAt') || 'Expires At'}:</span>
                              <span>{formatDateTime(coupon.expires_at)}</span>
                            </div>
                          )}
                          <div className="detail-row">
                            <span>{t('createdAt') || 'Created At'}:</span>
                            <span>{formatDateTime(coupon.created_at)}</span>
                          </div>
                        </div>

                        <div className="coupon-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedCoupon(coupon)}
                          >
                            {t('edit') || 'Edit'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteCoupon(coupon.id)}
                          >
                            {t('delete') || 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Menu Item Edit Modal */}
      {isEditingMenu && (
        <MenuItemEditModal
          item={selectedMenuItem}
          categoryId={selectedCategory!}
          onSave={selectedMenuItem ? updateMenuItem : addMenuItem}
          onCancel={() => {
            setIsEditingMenu(false);
            setSelectedMenuItem(null);
          }}
          t={t}
          language={language}
        />
      )}

      {/* Coupon Add/Edit Modal */}
      {(isAddingCoupon || selectedCoupon) && (
        <CouponEditModal
          coupon={selectedCoupon}
          onSave={selectedCoupon ? updateCoupon : addCoupon}
          onCancel={() => {
            setIsAddingCoupon(false);
            setSelectedCoupon(null);
          }}
          t={t}
        />
      )}
    </div>
  );
};

// Menu Item Edit Modal Component
interface MenuItemEditModalProps {
  item: MenuItemData | null;
  categoryId: number;
  onSave: (item: any) => void;
  onCancel: () => void;
  t: (key: string) => string;
  language: string;
}

const MenuItemEditModal: React.FC<MenuItemEditModalProps> = ({
  item,
  categoryId,
  onSave,
  onCancel,
  t,
  language
}) => {
  const [formData, setFormData] = useState({
    name: item ? (typeof item.name === 'string' ? item.name : item.name[language] || '') : '',
    price: item?.price || '',
    price_small: item?.price_small || '',
    price_large: item?.price_large || '',
    description: item ? (typeof item.description === 'string' ? item.description : item.description[language] || '') : '',
    image: item?.image || '',
    is_discounted: item?.is_discounted || false,
    original_price: item?.original_price || '',
    original_price_small: item?.original_price_small || '',
    original_price_large: item?.original_price_large || '',
    is_available: item?.is_available ?? true,
    category_id: item?.category_id || categoryId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      name: { [language]: formData.name },
      description: { [language]: formData.description }
    };

    if (item) {
      onSave({ ...item, ...itemData });
    } else {
      onSave(itemData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{item ? (t('editItem') || 'Edit Item') : (t('addItem') || 'Add Item')}</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('name') || 'Name'}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('description') || 'Description'}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>{t('image') || 'Image URL'}</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
          </div>

          {categoryId === 7 ? (
            <div className="form-row">
              <div className="form-group">
                <label>{t('priceSmall') || 'Price (Small)'}</label>
                <input
                  type="text"
                  value={formData.price_small}
                  onChange={(e) => setFormData({ ...formData, price_small: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('priceLarge') || 'Price (Large)'}</label>
                <input
                  type="text"
                  value={formData.price_large}
                  onChange={(e) => setFormData({ ...formData, price_large: e.target.value })}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>{t('price') || 'Price'}</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_discounted}
                onChange={(e) => setFormData({ ...formData, is_discounted: e.target.checked })}
              />
              {t('isDiscounted') || 'Is Discounted'}
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              />
              {t('isAvailable') || 'Is Available'}
            </label>
          </div>

          {formData.is_discounted && (
            categoryId === 7 ? (
              <div className="form-row">
                <div className="form-group">
                  <label>{t('originalPriceSmall') || 'Original Price (Small)'}</label>
                  <input
                    type="text"
                    value={formData.original_price_small}
                                        onChange={(e) => setFormData({ ...formData, original_price_small: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('originalPriceLarge') || 'Original Price (Large)'}</label>
                  <input
                    type="text"
                    value={formData.original_price_large}
                    onChange={(e) => setFormData({ ...formData, original_price_large: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>{t('originalPrice') || 'Original Price'}</label>
                <input
                  type="text"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                />
              </div>
            )
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('save') || 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Coupon Edit Modal Component
interface CouponEditModalProps {
  coupon: CouponData | null;
  onSave: (coupon: any) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

const CouponEditModal: React.FC<CouponEditModalProps> = ({
  coupon,
  onSave,
  onCancel,
  t
}) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discount_type: coupon?.discount_type || 'percentage' as 'percentage' | 'fixed',
    discount_value: coupon?.discount_value || 0,
    min_order_amount: coupon?.min_order_amount || '',
    max_discount_amount: coupon?.max_discount_amount || '',
    usage_limit: coupon?.usage_limit || '',
    is_active: coupon?.is_active ?? true,
    expires_at: coupon?.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount.toString()) : null,
      max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount.toString()) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit.toString()) : null,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
    };

    if (coupon) {
      onSave({ ...coupon, ...couponData });
    } else {
      onSave(couponData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{coupon ? (t('editCoupon') || 'Edit Coupon') : (t('addCoupon') || 'Add Coupon')}</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('couponCode') || 'Coupon Code'}</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              placeholder="e.g., SAVE20"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('discountType') || 'Discount Type'}</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
              >
                <option value="percentage">{t('percentage') || 'Percentage'}</option>
                <option value="fixed">{t('fixedAmount') || 'Fixed Amount'}</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                {formData.discount_type === 'percentage' 
                  ? (t('discountPercentage') || 'Discount Percentage') 
                  : (t('discountAmount') || 'Discount Amount')
                }
              </label>
              <input
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                required
                min="0"
                max={formData.discount_type === 'percentage' ? "100" : undefined}
                step={formData.discount_type === 'percentage' ? "1" : "0.01"}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('minOrderAmount') || 'Minimum Order Amount'}</label>
              <input
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Optional"
              />
            </div>
            
            <div className="form-group">
              <label>{t('maxDiscountAmount') || 'Maximum Discount Amount'}</label>
              <input
                type="number"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('usageLimit') || 'Usage Limit'}</label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                min="1"
                placeholder="Optional (unlimited if empty)"
              />
            </div>
            
            <div className="form-group">
              <label>{t('expiresAt') || 'Expires At'}</label>
              <input
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              {t('isActive') || 'Is Active'}
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('save') || 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginEmployee;


