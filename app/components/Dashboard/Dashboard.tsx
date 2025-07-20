'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts';
import { supabase } from '@/lib/supabase';
import './Dashboard.scss';

interface Employee {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface Order {
  id: number; // Changed from string to number (serial)
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  items: any[]; // JSONB field
  subtotal: number;
  discount_amount: number;
  discount_code: string;
  total_amount: number;
  payment_status: string; // Changed from 'status' to 'payment_status'
  payment_url: string;
  payment_reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
}
interface Survey {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  visit_frequency: string;
  last_visit: string;
  party_size: string;
  occasion: string;
  food_quality: number;
  service_quality: number;
  atmosphere: number;
  value_for_money: number;
  favorite_items: string[];
  preferred_time: string;
  most_liked: string;
  improvements: string;
  recommendation: number;
  additional_comments: string;
  hear_about_us: string;
  newsletter: boolean;
  promotions: boolean;
  language: string;
  submitted_at: string; // Changed from created_at
  ip_address?: string;
  user_agent?: string;
}


interface MenuItem {
  id: number;
  category_id: number;
  key: string;
  name: any; // JSONB field
  description: any; // JSONB field
  image: string;
  price: any; // JSONB field
  original_price?: any; // JSONB field
  is_available: boolean;
  is_discounted: boolean;
  has_sizes: boolean;
  is_discounted_small?: boolean;
  is_discounted_large?: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  menu_categories?: {
    id: number;
    title: any;
    key: string;
  };
}


interface MenuCategory {
  id: number;
  key: string;
  title: any; // JSONB field
  image: string;
  header_image: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit: number; // Changed from max_uses
  used_count: number;
  is_active: boolean;
  valid_until: string; // Changed from expires_at
  created_at: string;
}


interface DashboardProps {
  employee: Employee;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ employee, onLogout }) => {
  const { t, isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'surveys' | 'menu' | 'coupons'>('orders');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  
  // UI states
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  // Fetch data functions
const fetchOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setOrders(data || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const fetchSurveys = async () => {
  try {
    const response = await fetch('/api/dashboard/surveys');
    const result = await response.json();
    
    if (result.success) {
      setSurveys(result.data || []);
    } else {
      console.error('Error fetching surveys:', result.error);
    }
  } catch (error) {
    console.error('Error fetching surveys:', error);
  }
};


const fetchMenuCategories = async () => {
  try {
    const response = await fetch('/api/dashboard/menu/categories');
    const result = await response.json();
    
    if (result.success) {
      setMenuCategories(result.data || []);
    } else {
      console.error('Error fetching menu categories:', result.error);
    }
  } catch (error) {
    console.error('Error fetching menu categories:', error);
  }
};

const fetchMenuItems = async (categoryId?: number) => {
  try {
    const url = categoryId 
      ? `/api/dashboard/menu/items?category_id=${categoryId}`
      : '/api/dashboard/menu/items';
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      setMenuItems(result.data || []);
    } else {
      console.error('Error fetching menu items:', result.error);
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
};


const fetchCoupons = async () => {
  try {
    const response = await fetch('/api/dashboard/coupons');
    const result = await response.json();
    
    if (result.success) {
      setCoupons(result.data || []);
    } else {
      console.error('Error fetching coupons:', result.error);
    }
  } catch (error) {
    console.error('Error fetching coupons:', error);
  }
};


  // Update functions
const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    fetchOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

const updateMenuItem = async (itemData: any) => {
  try {
    setLoading(true);
    
    const response = await fetch(`/api/dashboard/menu/items/${itemData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update menu item');
    }

    // Show success message
    alert(t('itemUpdated') || 'Menu item updated successfully!');
    
    // Refresh the menu items
    if (selectedCategory) {
      await fetchMenuItems(selectedCategory);
    } else {
      await fetchMenuItems();
    }
    
    setEditingItem(null);
  } catch (error) {
    console.error('Error updating menu item:', error);
    alert(t('updateError') || 'Error updating menu item');
  } finally {
    setLoading(false);
  }
};




const updateCoupon = async (coupon: Coupon) => {
  try {
    const response = await fetch(`/api/dashboard/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount,
        max_discount_amount: coupon.max_discount_amount,
        max_uses: coupon.usage_limit, // Map to max_uses for API
        is_active: coupon.is_active,
        expires_at: coupon.valid_until.split('T')[0], // Map to expires_at for API
      }),
    });

    const result = await response.json();
    if (result.success) {
      fetchCoupons();
      setEditingCoupon(null);
    } else {
      console.error('Error updating coupon:', result.error);
    }
  } catch (error) {
    console.error('Error updating coupon:', error);
  }
};


const createCoupon = async (coupon: Omit<Coupon, 'id' | 'used_count' | 'created_at'>) => {
  try {
    const response = await fetch('/api/dashboard/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount,
        max_discount_amount: coupon.max_discount_amount,
        max_uses: coupon.usage_limit, // Map to max_uses for API
        is_active: coupon.is_active,
        expires_at: coupon.valid_until.split('T')[0], // Map to expires_at for API
      }),
    });

    const result = await response.json();
    if (result.success) {
      fetchCoupons();
      setShowAddCoupon(false);
    } else {
      console.error('Error creating coupon:', result.error);
    }
  } catch (error) {
    console.error('Error creating coupon:', error);
  }
};


const deleteCoupon = async (couponId: string) => {
  try {
    const response = await fetch(`/api/dashboard/coupons/${couponId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (result.success) {
      fetchCoupons();
    } else {
      console.error('Error deleting coupon:', result.error);
    }
  } catch (error) {
    console.error('Error deleting coupon:', error);
  }
};


  // Load data based on active tab
  useEffect(() => {
    setLoading(true);
    switch (activeTab) {
      case 'orders':
        fetchOrders();
        break;
      case 'surveys':
        fetchSurveys();
        break;
      case 'menu':
        fetchMenuCategories();
        if (selectedCategory) {
          fetchMenuItems(selectedCategory);
        }
        break;
      case 'coupons':
        fetchCoupons();
        break;
    }
    setLoading(false);
  }, [activeTab, selectedCategory]);

  // Render Orders Tab
const renderOrdersTab = () => (
  <div className="tab-content">
    <div className="tab-header">
      <h3>{t('ordersManagement') || 'Orders Management'}</h3>
      <div className="stats">
        <span className="stat">
          {t('totalOrders') || 'Total Orders'}: {orders.length}
        </span>
        <span className="stat">
          {t('totalRevenue') || 'Total Revenue'}: {orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0).toFixed(2)}T
        </span>
        <span className="stat">
          {t('pendingOrders') || 'Pending'}: {orders.filter(order => order.payment_status === 'pending').length}
        </span>
        <span className="stat">
          {t('paidOrders') || 'Paid'}: {orders.filter(order => order.payment_status === 'paid').length}
        </span>
      </div>
    </div>
    
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('orderNumber') || 'Order #'}</th>
            <th>{t('customer') || 'Customer'}</th>
            <th>{t('items') || 'Items'}</th>
            <th>{t('subtotal') || 'Subtotal'}</th>
            <th>{t('discount') || 'Discount'}</th>
            <th>{t('total') || 'Total'}</th>
            <th>{t('paymentStatus') || 'Payment Status'}</th>
            <th>{t('date') || 'Date'}</th>
            <th>{t('actions') || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="order-number">
                  <strong>{order.order_number}</strong>
                  {order.payment_reference && (
                    <div className="payment-ref">
                      <small>Ref: {order.payment_reference}</small>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="customer-info">
                  <div className="customer-name">{order.customer_name}</div>
                  <div className="customer-contact">
                    <div>{order.customer_phone}</div>
                    {order.customer_email && <div>{order.customer_email}</div>}
                  </div>
                </div>
              </td>
              <td>
                <div className="items-summary">
                  <span className="items-count">
                    {Array.isArray(order.items) ? order.items.length : 0} {t('items') || 'items'}
                  </span>
                  <div className="items-preview">
                    {Array.isArray(order.items) && order.items.slice(0, 2).map((item, index) => (
                      <small key={index} className="item-preview">
                        {item.name} x{item.quantity}
                      </small>
                    ))}
                    {Array.isArray(order.items) && order.items.length > 2 && (
                      <small className="more-items">+{order.items.length - 2} more</small>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span className="amount">{parseFloat(order.subtotal.toString()).toFixed(2)}T</span>
              </td>
              <td>
                {order.discount_amount > 0 ? (
                  <div className="discount-info">
                    <span className="discount-amount">-{parseFloat(order.discount_amount.toString()).toFixed(2)}T</span>
                    {order.discount_code && (
                      <div className="discount-code">{order.discount_code}</div>
                    )}
                  </div>
                ) : (
                  <span className="no-discount">-</span>
                )}
              </td>
              <td>
                <span className="total-amount">{parseFloat(order.total_amount.toString()).toFixed(2)}T</span>
              </td>
              <td>
                <select
                  value={order.payment_status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={`status-select ${order.payment_status}`}
                >
                  <option value="pending">{t('pending') || 'Pending'}</option>
                  <option value="paid">{t('paid') || 'Paid'}</option>
                  <option value="failed">{t('failed') || 'Failed'}</option>
                  <option value="refunded">{t('refunded') || 'Refunded'}</option>
                </select>
              </td>
              <td>
                <div className="date-info">
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  <small>{new Date(order.created_at).toLocaleTimeString()}</small>
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-view" 
                    onClick={() => setSelectedOrder(order)}
                    title={t('viewDetails') || 'View Details'}
                  >
                    👁️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Order Detail Modal */}
    {selectedOrder && (
      <div className="modal-overlay">
        <div className="modal large">
          <div className="modal-header">
            <h4>{t('orderDetails') || 'Order Details'} - {selectedOrder.order_number}</h4>
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="order-details">
              {/* Customer Information */}
              <div className="detail-section">
                <h5>{t('customerInfo') || 'Customer Information'}</h5>
                <div className="detail-grid">
                  <div><strong>{t('name') || 'Name'}:</strong> {selectedOrder.customer_name}</div>
                  <div><strong>{t('phone') || 'Phone'}:</strong> {selectedOrder.customer_phone}</div>
                  <div><strong>{t('email') || 'Email'}:</strong> {selectedOrder.customer_email || 'N/A'}</div>
                  <div className="full-width">
                    <strong>{t('address') || 'Address'}:</strong> {selectedOrder.customer_address}
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="detail-section">
                <h5>{t('orderInfo') || 'Order Information'}</h5>
                <div className="detail-grid">
                  <div><strong>{t('orderNumber') || 'Order Number'}:</strong> {selectedOrder.order_number}</div>
                  <div><strong>{t('paymentStatus') || 'Payment Status'}:</strong> 
                    <span className={`status-badge ${selectedOrder.payment_status}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div><strong>{t('orderDate') || 'Order Date'}:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</div>
                  {selectedOrder.payment_reference && (
                    <div><strong>{t('paymentRef') || 'Payment Reference'}:</strong> {selectedOrder.payment_reference}</div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h5>{t('orderItems') || 'Order Items'}</h5>
                <div className="items-list">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        {item.size && <div className="item-size">Size: {item.size}</div>}
                        <div className="item-price">{parseFloat(item.price).toFixed(2)}T each</div>
                      </div>
                      <div className="item-quantity">x{item.quantity}</div>
                      <div className="item-total">{(parseFloat(item.price) * item.quantity).toFixed(2)}T</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="detail-section">
                <h5>{t('orderSummary') || 'Order Summary'}</h5>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>{t('subtotal') || 'Subtotal'}:</span>
                    <span>{parseFloat(selectedOrder.subtotal.toString()).toFixed(2)}T</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="summary-row discount">
                      <span>
                        {t('discount') || 'Discount'}
                        {selectedOrder.discount_code && ` (${selectedOrder.discount_code})`}:
                      </span>
                      <span>-{parseFloat(selectedOrder.discount_amount.toString()).toFixed(2)}T</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span><strong>{t('total') || 'Total'}:</strong></span>
                    <span><strong>{parseFloat(selectedOrder.total_amount.toString()).toFixed(2)}T</strong></span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="detail-section">
                  <h5>{t('notes') || 'Notes'}</h5>
                  <p className="order-notes">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedOrder(null)}
            >
              {t('close') || 'Close'}
            </button>
            {selectedOrder.payment_url && (
              <button
                className="btn btn-primary"
                onClick={() => window.open(selectedOrder.payment_url, '_blank')}
              >
                {t('viewPayment') || 'View Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);

  // Render Surveys Tab
const renderSurveysTab = () => (
  <div className="tab-content">
    <div className="tab-header">
      <h3>{t('surveyResults') || 'Survey Results'}</h3>
      <div className="stats">
        <span className="stat">
          {t('totalResponses') || 'Total Responses'}: {surveys.length}
        </span>
        <span className="stat">
          {t('avgRating') || 'Avg Rating'}: {
            surveys.length > 0 
              ? (surveys.reduce((sum, s) => sum + (s.recommendation || 0), 0) / surveys.length).toFixed(1)
              : '0'
          }/10
        </span>
        <span className="stat">
          {t('avgFoodQuality') || 'Avg Food'}: {
            surveys.length > 0 
              ? (surveys.reduce((sum, s) => sum + (s.food_quality || 0), 0) / surveys.length).toFixed(1)
              : '0'
          }/5
        </span>
      </div>
    </div>
    
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('customer') || 'Customer'}</th>
            <th>{t('contact') || 'Contact'}</th>
            <th>{t('visitFreq') || 'Visit Frequency'}</th>
            <th>{t('foodQuality') || 'Food'}</th>
            <th>{t('serviceQuality') || 'Service'}</th>
            <th>{t('atmosphere') || 'Atmosphere'}</th>
            <th>{t('valueForMoney') || 'Value'}</th>
            <th>{t('recommendation') || 'Recommendation'}</th>
            <th>{t('language') || 'Language'}</th>
            <th>{t('date') || 'Date'}</th>
            <th>{t('actions') || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td>
                <div className="customer-info">
                  <div className="customer-name">{survey.name}</div>
                  <div className="customer-details">
                    {survey.age && <span className="age-badge">{survey.age}</span>}
                    {survey.party_size && <span className="party-size">Party: {survey.party_size}</span>}
                  </div>
                </div>
              </td>
              <td>
                <div className="contact-info">
                  {survey.email && <div className="email">{survey.email}</div>}
                  {survey.phone && <div className="phone">{survey.phone}</div>}
                </div>
              </td>
              <td>
                <span className={`frequency-badge ${survey.visit_frequency}`}>
                  {survey.visit_frequency || 'N/A'}
                </span>
              </td>
              <td>
                <div className="rating">
                  <span className="stars">
                    {'★'.repeat(survey.food_quality || 0)}
                    {'☆'.repeat(5 - (survey.food_quality || 0))}
                  </span>
                  <span className="rating-number">({survey.food_quality || 0}/5)</span>
                </div>
              </td>
              <td>
                <div className="rating">
                  <span className="stars">
                    {'★'.repeat(survey.service_quality || 0)}
                    {'☆'.repeat(5 - (survey.service_quality || 0))}
                  </span>
                  <span className="rating-number">({survey.service_quality || 0}/5)</span>
                </div>
              </td>
              <td>
                <div className="rating">
                  <span className="stars">
                    {'★'.repeat(survey.atmosphere || 0)}
                    {'☆'.repeat(5 - (survey.atmosphere || 0))}
                  </span>
                  <span className="rating-number">({survey.atmosphere || 0}/5)</span>
                </div>
              </td>
              <td>
                <div className="rating">
                  <span className="stars">
                    {'★'.repeat(survey.value_for_money || 0)}
                    {'☆'.repeat(5 - (survey.value_for_money || 0))}
                  </span>
                  <span className="rating-number">({survey.value_for_money || 0}/5)</span>
                </div>
              </td>
              <td>
                <div className={`recommendation-score ${
                  (survey.recommendation || 0) >= 9 ? 'excellent' : 
                  (survey.recommendation || 0) >= 7 ? 'good' : 
                  (survey.recommendation || 0) >= 5 ? 'average' : 'poor'
                }`}>
                  {survey.recommendation || 0}/10
                </div>
              </td>
              <td>
                <span className="language-badge">{survey.language?.toUpperCase() || 'EN'}</span>
              </td>
              <td>{new Date(survey.submitted_at).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn-view" 
                  onClick={() => setSelectedSurvey(survey)}
                  title={t('viewDetails') || 'View Details'}
                >
                  👁️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Survey Detail Modal */}
    {selectedSurvey && (
      <div className="modal-overlay">
        <div className="modal large">
          <div className="modal-header">
            <h4>{t('surveyDetails') || 'Survey Details'} - {selectedSurvey.name}</h4>
            <button
              className="modal-close"
              onClick={() => setSelectedSurvey(null)}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="survey-details">
              <div className="detail-section">
                <h5>{t('customerInfo') || 'Customer Information'}</h5>
                <div className="detail-grid">
                  <div><strong>{t('name') || 'Name'}:</strong> {selectedSurvey.name}</div>
                  <div><strong>{t('email') || 'Email'}:</strong> {selectedSurvey.email || 'N/A'}</div>
                  <div><strong>{t('phone') || 'Phone'}:</strong> {selectedSurvey.phone || 'N/A'}</div>
                  <div><strong>{t('age') || 'Age'}:</strong> {selectedSurvey.age || 'N/A'}</div>
                </div>
              </div>

              <div className="detail-section">
                <h5>{t('visitInfo') || 'Visit Information'}</h5>
                <div className="detail-grid">
                  <div><strong>{t('visitFrequency') || 'Visit Frequency'}:</strong> {selectedSurvey.visit_frequency || 'N/A'}</div>
                  <div><strong>{t('partySize') || 'Party Size'}:</strong> {selectedSurvey.party_size || 'N/A'}</div>
                  <div><strong>{t('occasion') || 'Occasion'}:</strong> {selectedSurvey.occasion || 'N/A'}</div>
                  <div><strong>{t('preferredTime') || 'Preferred Time'}:</strong> {selectedSurvey.preferred_time || 'N/A'}</div>
                </div>
              </div>

              <div className="detail-section">
                <h5>{t('ratings') || 'Ratings'}</h5>
                <div className="ratings-grid">
                  <div className="rating-item">
                    <span>{t('foodQuality') || 'Food Quality'}:</span>
                    <div className="rating">
                      {'★'.repeat(selectedSurvey.food_quality || 0)}
                      {'☆'.repeat(5 - (selectedSurvey.food_quality || 0))}
                      <span>({selectedSurvey.food_quality || 0}/5)</span>
                    </div>
                  </div>
                  <div className="rating-item">
                    <span>{t('serviceQuality') || 'Service Quality'}:</span>
                    <div className="rating">
                      {'★'.repeat(selectedSurvey.service_quality || 0)}
                      {'☆'.repeat(5 - (selectedSurvey.service_quality || 0))}
                      <span>({selectedSurvey.service_quality || 0}/5)</span>
                    </div>
                  </div>
                  <div className="rating-item">
                    <span>{t('atmosphere') || 'Atmosphere'}:</span>
                    <div className="rating">
                      {'★'.repeat(selectedSurvey.atmosphere || 0)}
                      {'☆'.repeat(5 - (selectedSurvey.atmosphere || 0))}
                      <span>({selectedSurvey.atmosphere || 0}/5)</span>
                    </div>
                  </div>
                  <div className="rating-item">
                    <span>{t('valueForMoney') || 'Value for Money'}:</span>
                    <div className="rating">
                      {'★'.repeat(selectedSurvey.value_for_money || 0)}
                      {'☆'.repeat(5 - (selectedSurvey.value_for_money || 0))}
                      <span>({selectedSurvey.value_for_money || 0}/5)</span>
                    </div>
                  </div>
                  <div className="rating-item">
                    <span>{t('recommendation') || 'Recommendation'}:</span>
                    <div className="recommendation-large">
                      {selectedSurvey.recommendation || 0}/10
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h5>{t('feedback') || 'Feedback'}</h5>
                <div className="feedback-content">
                  {selectedSurvey.most_liked && (
                    <div className="feedback-item">
                      <strong>{t('mostLiked') || 'Most Liked'}:</strong>
                      <p>{selectedSurvey.most_liked}</p>
                    </div>
                  )}
                  {selectedSurvey.improvements && (
                    <div className="feedback-item">
                      <strong>{t('improvements') || 'Improvements'}:</strong>
                      <p>{selectedSurvey.improvements}</p>
                    </div>
                  )}
                  {selectedSurvey.additional_comments && (
                    <div className="feedback-item">
                      <strong>{t('additionalComments') || 'Additional Comments'}:</strong>
                      <p>{selectedSurvey.additional_comments}</p>
                    </div>
                  )}
                  {selectedSurvey.favorite_items && Array.isArray(selectedSurvey.favorite_items) && selectedSurvey.favorite_items.length > 0 && (
                    <div className="feedback-item">
                      <strong>{t('favoriteItems') || 'Favorite Items'}:</strong>
                      <p>{selectedSurvey.favorite_items.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h5>{t('additional') || 'Additional Information'}</h5>
                <div className="detail-grid">
                  <div><strong>{t('hearAboutUs') || 'How they heard about us'}:</strong> {selectedSurvey.hear_about_us || 'N/A'}</div>
                  <div><strong>{t('newsletter') || 'Newsletter'}:</strong> {selectedSurvey.newsletter ? 'Yes' : 'No'}</div>
                                    <div><strong>{t('promotions') || 'Promotions'}:</strong> {selectedSurvey.promotions ? 'Yes' : 'No'}</div>
                  <div><strong>{t('language') || 'Language'}:</strong> {selectedSurvey.language?.toUpperCase() || 'EN'}</div>
                  <div><strong>{t('submittedAt') || 'Submitted At'}:</strong> {new Date(selectedSurvey.submitted_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedSurvey(null)}
            >
              {t('close') || 'Close'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);



  // Render Menu Tab
const renderMenuTab = () => {
  // Helper function to get text from JSONB field
  const getLocalizedText = (jsonbField: any, fallback: string = '') => {
    if (!jsonbField) return fallback;
    if (typeof jsonbField === 'string') return jsonbField;
    
    // Use current language from context
    if (typeof jsonbField === 'object') {
      return jsonbField[language] || 
             jsonbField['en'] || 
             jsonbField['fa'] || 
             Object.values(jsonbField)[0] || 
             fallback;
    }
    
    return fallback;
  };

  // Helper function to get price from JSONB field
  const getPrice = (priceField: any) => {
    if (!priceField) return 0;
    if (typeof priceField === 'number') return priceField;
    return priceField.default || priceField.small || Object.values(priceField)[0] || 0;
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h3>{t('menuManagement') || 'Menu Management'}</h3>
        <div className="menu-categories">
          <button
            className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(null);
              fetchMenuItems();
            }}
          >
            {t('allCategories') || 'All Categories'}
          </button>
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category.id);
                fetchMenuItems(category.id);
              }}
            >
              {getLocalizedText(category.title, category.key)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('image') || 'Image'}</th>
              <th>{t('category') || 'Category'}</th>
              <th>{t('name') || 'Name'}</th>
              <th>{t('description') || 'Description'}</th>
              <th>{t('price') || 'Price'}</th>
              <th>{t('available') || 'Available'}</th>
              <th>{t('discounted') || 'Discounted'}</th>
              <th>{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={getLocalizedText(item.name)} className="item-image" />
                </td>
                <td>
                  <span className="category-badge">
                    {item.menu_categories ? getLocalizedText(item.menu_categories.title) : 'N/A'}
                  </span>
                </td>
                <td className="item-name">{getLocalizedText(item.name)}</td>
                <td className="description-cell">{getLocalizedText(item.description)}</td>
                <td>
  <div className="price-info">
    {item.has_sizes ? (
      <>
        <div>S: {getPrice(item.price?.small || item.price)}T</div>
        <div>L: {getPrice(item.price?.large || item.price)}T</div>
      </>
    ) : (
      <div>{getPrice(item.price)}T</div>
    )}
  </div>
</td>

                <td>
                  <span className={`status-badge ${item.is_available ? 'available' : 'unavailable'}`}>
                    {item.is_available ? (t('yes') || 'Yes') : (t('no') || 'No')}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${item.is_discounted ? 'discounted' : 'regular'}`}>
                    {item.is_discounted ? (t('yes') || 'Yes') : (t('no') || 'No')}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => setEditingItem(item)}
                    title={t('edit') || 'Edit'}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Menu Item Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h4>{t('editMenuItem') || 'Edit Menu Item'}</h4>
              <button
                className="modal-close"
                onClick={() => setEditingItem(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <MenuItemForm
                item={editingItem}
                onSave={updateMenuItem}
                onCancel={() => setEditingItem(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


  // Render Coupons Tab
const renderCouponsTab = () => (
  <div className="tab-content">
    <div className="tab-header">
      <h3>{t('couponManagement') || 'Coupon Management'}</h3>
      <button
        className="btn btn-primary"
        onClick={() => setShowAddCoupon(true)}
      >
        {t('addCoupon') || 'Add Coupon'}
      </button>
    </div>
    
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('code') || 'Code'}</th>
            <th>{t('discount') || 'Discount'}</th>
            <th>{t('minOrder') || 'Min Order'}</th>
            <th>{t('maxDiscount') || 'Max Discount'}</th>
            <th>{t('usage') || 'Usage'}</th>
            <th>{t('status') || 'Status'}</th>
            <th>{t('expires') || 'Expires'}</th>
            <th>{t('actions') || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td className="coupon-code">{coupon.code}</td>
              <td>
                {coupon.discount_type === 'percentage' 
                  ? `${coupon.discount_value}%` 
                  : `${coupon.discount_value}T`
                }
              </td>
              <td>{coupon.min_order_amount}T</td>
              <td>
                {coupon.max_discount_amount 
                  ? `${coupon.max_discount_amount}T` 
                  : 'No limit'
                }
              </td>
              <td>
                <span className="usage-info">
                  {coupon.used_count}/{coupon.usage_limit || '∞'}
                </span>
              </td>
              <td>
                <span className={`status-badge ${coupon.is_active ? 'active' : 'inactive'}`}>
                  {coupon.is_active ? (t('active') || 'Active') : (t('inactive') || 'Inactive')}
                </span>
              </td>
              <td>
                {coupon.valid_until 
                  ? new Date(coupon.valid_until).toLocaleDateString()
                  : 'No expiry'
                }
              </td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => setEditingCoupon(coupon)}
                  title={t('edit') || 'Edit'}
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteCoupon(coupon.id)}
                  title={t('delete') || 'Delete'}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Add/Edit Coupon Modal */}
    {(showAddCoupon || editingCoupon) && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h4>{editingCoupon ? (t('editCoupon') || 'Edit Coupon') : (t('addCoupon') || 'Add Coupon')}</h4>
            <button
              className="modal-close"
              onClick={() => {
                setShowAddCoupon(false);
                setEditingCoupon(null);
              }}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <CouponForm
              coupon={editingCoupon}
              onSave={editingCoupon ? updateCoupon : createCoupon}
              onCancel={() => {
                setShowAddCoupon(false);
                setEditingCoupon(null);
              }}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);


  return (
    <section className={`dashboard ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="employee-info">
            <h2>{t('welcomeBack') || 'Welcome back'}, {employee.name}!</h2>
            <p className="employee-role">
              {t('role') || 'Role'}: <span className={`role-badge ${employee.role}`}>{employee.role}</span>
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="btn btn-secondary logout-btn"
          >
            {t('logout') || 'Logout'}
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="tab-icon">📋</span>
            {t('orders') || 'Orders'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'surveys' ? 'active' : ''}`}
            onClick={() => setActiveTab('surveys')}
          >
            <span className="tab-icon">📊</span>
            {t('surveys') || 'Surveys'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <span className="tab-icon">🍽️</span>
            {t('menu') || 'Menu'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            <span className="tab-icon">🎫</span>
            {t('coupons') || 'Coupons'}
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{t('loading') || 'Loading...'}</p>
            </div>
          ) : (
            <>
              {activeTab === 'orders' && renderOrdersTab()}
              {activeTab === 'surveys' && renderSurveysTab()}
              {activeTab === 'menu' && renderMenuTab()}
              {activeTab === 'coupons' && renderCouponsTab()}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// Coupon Form Component
interface CouponFormProps {
  coupon?: Coupon | null;
  onSave: (coupon: any) => void;
  onCancel: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupon, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discount_type: coupon?.discount_type || 'percentage' as 'percentage' | 'fixed',
    discount_value: coupon?.discount_value || 0,
    min_order_amount: coupon?.min_order_amount || 0,
    max_discount_amount: coupon?.max_discount_amount || 0,
    usage_limit: coupon?.usage_limit || 100, // Changed from max_uses
    is_active: coupon?.is_active ?? true,
    valid_until: coupon?.valid_until ? coupon.valid_until.split('T')[0] : '', // Changed from expires_at
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="coupon-form">
      <div className="form-group">
        <label>{t('couponCode') || 'Coupon Code'}</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
          placeholder="SAVE20"
          required
        />
      </div>

      <div className="form-group">
        <label>{t('discountType') || 'Discount Type'}</label>
        <select
          value={formData.discount_type}
          onChange={(e) => setFormData({...formData, discount_type: e.target.value as 'percentage' | 'fixed'})}
        >
          <option value="percentage">{t('percentage') || 'Percentage (%)'}</option>
          <option value="fixed">{t('fixedAmount') || 'Fixed Amount (T)'}</option>
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
          step={formData.discount_type === 'percentage' ? '1' : '0.01'}
          min="0"
          max={formData.discount_type === 'percentage' ? '100' : undefined}
          value={formData.discount_value}
          onChange={(e) => setFormData({...formData, discount_value: parseFloat(e.target.value)})}
          required
        />
      </div>

      <div className="form-group">
        <label>{t('minOrderAmount') || 'Minimum Order Amount'}</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.min_order_amount}
          onChange={(e) => setFormData({...formData, min_order_amount: parseFloat(e.target.value)})}
          required
        />
      </div>

      <div className="form-group">
        <label>{t('maxDiscountAmount') || 'Maximum Discount Amount'}</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.max_discount_amount}
          onChange={(e) => setFormData({...formData, max_discount_amount: parseFloat(e.target.value)})}
          placeholder="Leave empty for no limit"
        />
      </div>

      <div className="form-group">
        <label>{t('usageLimit') || 'Usage Limit'}</label>
        <input
          type="number"
          min="1"
          value={formData.usage_limit}
          onChange={(e) => setFormData({...formData, usage_limit: parseInt(e.target.value)})}
          required
        />
      </div>

      <div className="form-group">
        <label>{t('validUntil') || 'Valid Until'}</label>
        <input
          type="date"
          value={formData.valid_until}
          onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
          required
        />
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
          />
          {t('active') || 'Active'}
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('cancel') || 'Cancel'}
        </button>
        <button type="submit" className="btn btn-primary">
          {coupon ? (t('update') || 'Update') : (t('create') || 'Create')}
        </button>
      </div>
    </form>
  );
};

// Add this interface for the enhanced form
interface MenuItemFormProps {
  item: MenuItem;
  onSave: (item: any) => void;
  onCancel: () => void;
}

// Enhanced MenuItemForm component with multilingual support
const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onSave, onCancel }) => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLanguageTab, setActiveLanguageTab] = useState<'en' | 'fa'>('en');

  // Helper functions
  const getLocalizedText = (jsonbField: any, lang: string, fallback: string = '') => {
    if (!jsonbField) return fallback;
    if (typeof jsonbField === 'string') return jsonbField;
    if (typeof jsonbField === 'object') {
      return jsonbField[lang] || fallback;
    }
    return fallback;
  };

  const getPrice = (priceField: any, key?: string) => {
    if (!priceField) return 0;
    if (typeof priceField === 'number') return priceField;
    if (key && priceField[key]) return parseFloat(priceField[key]);
    if (priceField.default) return parseFloat(priceField.default);
    if (priceField.small && !key) return parseFloat(priceField.small);
    const firstValue = Object.values(priceField)[0];
    return firstValue ? parseFloat(firstValue as string) : 0;
  };

  const [formData, setFormData] = useState({
    id: item.id,
    category_id: item.category_id,
    key: item.key,
    
    // Multilingual fields
    name_en: getLocalizedText(item.name, 'en'),
    name_fa: getLocalizedText(item.name, 'fa'),
    description_en: getLocalizedText(item.description, 'en'),
    description_fa: getLocalizedText(item.description, 'fa'),
    
    // Price fields
    has_sizes: item.has_sizes || false,
    price_default: item.has_sizes ? 0 : getPrice(item.price, 'default'),
    price_small: item.has_sizes ? getPrice(item.price, 'small') : 0,
    price_large: item.has_sizes ? getPrice(item.price, 'large') : 0,
    
    // Original price fields
    original_price_default: item.has_sizes ? 0 : getPrice(item.original_price, 'default'),
    original_price_small: item.has_sizes ? getPrice(item.original_price, 'small') : 0,
    original_price_large: item.has_sizes ? getPrice(item.original_price, 'large') : 0,
    
    // Status fields
    is_available: item.is_available,
    is_discounted: item.is_discounted,
    is_discounted_small: item.is_discounted_small || false,
    is_discounted_large: item.is_discounted_large || false,
    
    // Image
    image: item.image,
    order: item.order
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the data for API submission
      const submitData = {
        ...formData,
        // Ensure we have at least English name
        name_en: formData.name_en.trim() || 'Unnamed Item',
        description_en: formData.description_en.trim(),
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="menu-item-form">
      {/* Language Tabs */}
      <div className="language-tabs">
        <button
          type="button"
          className={`language-tab ${activeLanguageTab === 'en' ? 'active' : ''}`}
          onClick={() => setActiveLanguageTab('en')}
        >
          English
        </button>
        <button
          type="button"
          className={`language-tab ${activeLanguageTab === 'fa' ? 'active' : ''}`}
          onClick={() => setActiveLanguageTab('fa')}
        >
          فارسی
        </button>
      </div>

      {/* Multilingual Content */}
      <div className="language-content">
        {activeLanguageTab === 'en' && (
          <div className="language-panel">
            <div className="form-group">
              <label>{t('name') || 'Name'} (English) *</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                required
                disabled={isSubmitting}
                placeholder="Enter English name"
              />
            </div>

            <div className="form-group">
              <label>{t('description') || 'Description'} (English)</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                rows={4}
                disabled={isSubmitting}
                placeholder="Enter English description"
              />
            </div>
          </div>
        )}

        {activeLanguageTab === 'fa' && (
          <div className="language-panel">
            <div className="form-group">
              <label>{t('name') || 'Name'} (فارسی)</label>
              <input
                type="text"
                value={formData.name_fa}
                onChange={(e) => setFormData({...formData, name_fa: e.target.value})}
                disabled={isSubmitting}
                placeholder="نام فارسی را وارد کنید"
                dir="rtl"
              />
            </div>

            <div className="form-group">
              <label>{t('description') || 'Description'} (فارسی)</label>
              <textarea
                value={formData.description_fa}
                onChange={(e) => setFormData({...formData, description_fa: e.target.value})}
                rows={4}
                disabled={isSubmitting}
                placeholder="توضیحات فارسی را وارد کنید"
                dir="rtl"
              />
            </div>
          </div>
        )}
      </div>

      {/* Size Configuration */}
      <div className="form-section">
        <h4>{t('sizeConfiguration') || 'Size Configuration'}</h4>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.has_sizes}
              onChange={(e) => setFormData({...formData, has_sizes: e.target.checked})}
              disabled={isSubmitting}
            />
            {t('hasSizes') || 'Has multiple sizes'}
          </label>
        </div>
      </div>

      {/* Price Configuration */}
      <div className="form-section">
        <h4>{t('priceConfiguration') || 'Price Configuration'}</h4>
        
        {formData.has_sizes ? (
          <div className="price-grid">
            <div className="price-group">
              <h5>{t('smallSize') || 'Small Size'}</h5>
              <div className="form-group">
                <label>{t('price') || 'Price'} (T)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_small}
                  onChange={(e) => setFormData({...formData, price_small: parseFloat(e.target.value) || 0})}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_discounted_small}
                    onChange={(e) => setFormData({...formData, is_discounted_small: e.target.checked})}
                    disabled={isSubmitting}
                  />
                  {t('discounted') || 'Discounted'}
                </label>
              </div>

              {formData.is_discounted_small && (
                <div className="form-group">
                  <label>{t('originalPrice') || 'Original Price'} (T)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.original_price_small}
                    onChange={(e) => setFormData({...formData, original_price_small: parseFloat(e.target.value) || 0})}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>

            <div className="price-group">
              <h5>{t('largeSize') || 'Large Size'}</h5>
              <div className="form-group">
                <label>{t('price') || 'Price'} (T)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_large}
                  onChange={(e) => setFormData({...formData, price_large: parseFloat(e.target.value) || 0})}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_discounted_large}
                    onChange={(e) => setFormData({...formData, is_discounted_large: e.target.checked})}
                    disabled={isSubmitting}
                  />
                  {t('discounted') || 'Discounted'}
                </label>
              </div>

              {formData.is_discounted_large && (
                <div className="form-group">
                  <label>{t('originalPrice') || 'Original Price'} (T)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.original_price_large}
                    onChange={(e) => setFormData({...formData, original_price_large: parseFloat(e.target.value) || 0})}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="price-group">
            <div className="form-group">
              <label>{t('price') || 'Price'} (T)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price_default}
                onChange={(e) => setFormData({...formData, price_default: parseFloat(e.target.value) || 0})}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_discounted}
                  onChange={(e) => setFormData({...formData, is_discounted: e.target.checked})}
                  disabled={isSubmitting}
                />
                {t('discounted') || 'Discounted'}
              </label>
            </div>

            {formData.is_discounted && (
              <div className="form-group">
                <label>{t('originalPrice') || 'Original Price'} (T)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price_default}
                  onChange={(e) => setFormData({...formData, original_price_default: parseFloat(e.target.value) || 0})}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="form-section">
        <h4>{t('availability') || 'Availability'}</h4>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
              disabled={isSubmitting}
            />
            {t('available') || 'Available for ordering'}
          </label>
        </div>
      </div>

      {/* Image URL */}
      <div className="form-section">
        <h4>{t('image') || 'Image'}</h4>
        <div className="form-group">
          <label>{t('imageUrl') || 'Image URL'}</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            disabled={isSubmitting}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {formData.image && (
          <div className="image-preview">
            <img src={formData.image} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('cancel') || 'Cancel'}
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {t('saving') || 'Saving...'}
            </>
          ) : (
            t('save') || 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};




export default Dashboard;

