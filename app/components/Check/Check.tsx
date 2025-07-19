'use client';

import React, { useState} from 'react';
import Image from 'next/image';
import { useCart } from '@/app/contexts/CartContext';
import { useLanguage } from '@/app/contexts';
import './Check.scss';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

interface DiscountInfo {
  code: string;
  discountAmount: number;
  newTotal: number;
  discountType: string;
  discountValue: number;
}

const Check: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isRTL, t } = useLanguage();

  // Component state
  const [currentStep, setCurrentStep] = useState<'checkout' | 'customer-info' | 'payment' | 'success' | 'failed'>('checkout');
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  // Customer information
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Calculate totals
  const subtotal = getTotalPrice();
  const discountAmount = discountInfo?.discountAmount || 0;
  const finalTotal = subtotal - discountAmount;

  const formatPrice = (price: number) => {
    return `${price}T`;
  };

  const validateCoupon = async () => {
    if (!discountCode.trim()) {
      setDiscountError(t('enterDiscountCode') || 'Please enter a discount code');
      return;
    }

    setIsValidatingCoupon(true);
    setDiscountError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode.trim(),
          orderAmount: subtotal
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDiscountInfo(result.data);
        setDiscountError('');
      } else {
        setDiscountError(result.error);
        setDiscountInfo(null);
      }
    } catch {
      setDiscountError(t('errorValidatingCoupon') || 'Error validating coupon');
      setDiscountInfo(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscountCode('');
    setDiscountInfo(null);
    setDiscountError('');
  };

  const validateCustomerInfo = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = t('nameRequired') || 'Name is required';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = t('phoneRequired') || 'Phone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(customerInfo.phone)) {
      newErrors.phone = t('phoneInvalid') || 'Invalid phone number';
    }

    if (customerInfo.email && !/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = t('emailInvalid') || 'Invalid email address';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = t('addressRequired') || 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const proceedToCustomerInfo = () => {
    if (cartItems.length === 0) {
      alert(t('cartEmpty') || 'Your cart is empty');
      return;
    }
    setCurrentStep('customer-info');
  };

  const proceedToPayment = async () => {
    if (!validateCustomerInfo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerInfo,
        items: cartItems,
        subtotal,
        discountAmount,
        discountCode: discountInfo?.code || null,
        totalAmount: finalTotal
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setOrderNumber(result.data.orderNumber);
        setPaymentUrl(result.data.paymentUrl);
        setCurrentStep('payment');
      } else {
        alert(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(t('errorCreatingOrder') || 'Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    // Simulate payment process
    window.open(paymentUrl, '_blank');
    
    // Simulate payment result after 3 seconds (in real app, this would come from payment gateway callback)
    setTimeout(() => {
      // Randomly simulate success or failure for demo
      const isSuccess = Math.random() > 0.8; // 70% success rate
      
      if (isSuccess) {
        // Update order status
        fetch(`/api/orders/${orderNumber}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'paid',
            paymentReference: `PAY-${Date.now()}`
          }),
        });
        
        clearCart();
        setCurrentStep('success');
      } else {
        // Update order status
        fetch(`/api/orders/${orderNumber}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'failed'
          }),
        });
        
        setCurrentStep('failed');
      }
    }, 3000);
  };

  const startNewOrder = () => {
    setCurrentStep('checkout');
    setDiscountCode('');
    setDiscountInfo(null);
    setDiscountError('');
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    });
    setErrors({});
    setOrderNumber('');
    setPaymentUrl('');
  };

  const renderCheckoutStep = () => (
    <div className="checkout-step">
      <div className="checkout-header">
        <h2 className="checkout-title">{t('orderSummary') || 'Order Summary'}</h2>
      </div>

      <div className="checkout-content">
        {/* Cart Items */}
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.categoryId}`} className="checkout-item">
              <div className="item-image-container">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="item-image"
                />
              </div>
              <div className="item-details">
                <h4 className="item-name">{item.name}</h4>
                <div className="item-price-qty">
                  <span className="item-price">{formatPrice(item.price)}</span>
                  <span className="item-quantity">× {item.quantity}</span>
                </div>
              </div>
              <div className="item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Discount Code Section */}
        <div className="discount-section">
          <h3 className="discount-title">{t('discountCode') || 'Discount Code'}</h3>
          
          {!discountInfo ? (
            <div className="discount-input-group">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder={t('enterDiscountCode') || 'Enter discount code'}
                className="discount-input"
                disabled={isValidatingCoupon}
              />
              <button
                onClick={validateCoupon}
                disabled={isValidatingCoupon || !discountCode.trim()}
                className="apply-discount-btn"
              >
                {isValidatingCoupon ? (t('validating') || 'Validating...') : (t('apply') || 'Apply')}
              </button>
            </div>
          ) : (
            <div className="discount-applied">
              <div className="discount-info">
                <span className="discount-code-applied">{discountInfo.code}</span>
                <span className="discount-amount">-{formatPrice(discountInfo.discountAmount)}</span>
              </div>
              <button onClick={removeCoupon} className="remove-discount-btn">
                {t('remove') || 'Remove'}
              </button>
            </div>
          )}
          
          {discountError && (
            <div className="discount-error">{discountError}</div>
          )}
        </div>

        {/* Order Total */}
        <div className="order-total">
          <div className="total-row">
            <span>{t('subtotal') || 'Subtotal'}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="total-row discount-row">
              <span>{t('discount') || 'Discount'}</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          
          <div className="total-row final-total">
            <span>{t('total') || 'Total'}</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <button
          onClick={proceedToCustomerInfo}
          className="proceed-btn"
          disabled={cartItems.length === 0}
        >
          {t('proceedToCheckout') || 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );

  const renderCustomerInfoStep = () => (
    <div className="customer-info-step">
      <div className="step-header">
        <button onClick={() => setCurrentStep('checkout')} className="back-btn">
          ← {t('back') || 'Back'}
        </button>
        <h2 className="step-title">{t('customerInformation') || 'Customer Information'}</h2>
      </div>

      <div className="customer-form">
        <div className="form-group">
          <label className="form-label">
            {t('name') || 'Name'} <span className="required">*</span>
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder={t('enterName') || 'Enter your name'}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            {t('phone1') || 'Phone'} <span className="required">*</span>
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder={t('enterPhone') || 'Enter your phone number'}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">{t('email') || 'Email'}</label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder={t('enterEmail') || 'Enter your email (optional)'}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            {t('address1') || 'Address'} <span className="required">*</span>
          </label>
          <textarea
            value={customerInfo.address}
            onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
            className={`form-textarea ${errors.address ? 'error' : ''}`}
            placeholder={t('enterAddress') || 'Enter your full address'}
            rows={3}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">{t('notes') || 'Notes'}</label>
          <textarea
            value={customerInfo.notes}
            onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
            className="form-textarea"
            placeholder={t('enterNotes') || 'Any special instructions (optional)'}
            rows={2}
          />
        </div>

        <div className="order-summary-mini">
          <div className="summary-row">
            <span>{t('total') || 'Total'}</span>
            <span className="total-amount">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <button
          onClick={proceedToPayment}
          disabled={isSubmitting}
          className="proceed-payment-btn"
        >
          {isSubmitting ? (t('processing') || 'Processing...') : (t('proceedToPayment') || 'Proceed to Payment')}
        </button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="payment-step">
      <div className="step-header">
        <h2 className="step-title">{t('payment') || 'Payment'}</h2>
      </div>

      <div className="payment-content">
        <div className="order-details">
          <h3>{t('orderNumber') || 'Order Number'}: {orderNumber}</h3>
          <div className="payment-amount">
            <span>{t('amountToPay') || 'Amount to Pay'}: </span>
            <span className="amount">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <div className="payment-instructions">
          <p>{t('paymentInstructions') || 'Click the button below to proceed to payment gateway'}</p>
        </div>

        <button onClick={handlePayment} className="payment-btn">
          {t('payNow') || 'Pay Now'}
        </button>

        <div className="payment-info">
          <p className="info-text">
            {t('paymentInfo') || 'You will be redirected to a secure payment page. After payment, you will see the confirmation.'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="success-step">
      <div className="success-content">
        <div className="success-icon">✅</div>
        <h2 className="success-title">{t('paymentSuccessful') || 'Payment Successful!'}</h2>
        <p className="success-message">
          {t('orderConfirmed') || 'Your order has been confirmed and will be processed shortly.'}
        </p>
        <div className="order-number-display">
          <strong>{t('orderNumber') || 'Order Number'}: {orderNumber}</strong>
        </div>
        <button onClick={startNewOrder} className="new-order-btn">
          {t('placeNewOrder') || 'Place New Order'}
        </button>
      </div>
    </div>
  );

  const renderFailedStep = () => (
    <div className="failed-step">
      <div className="failed-content">
        <div className="failed-icon">❌</div>
        <h2 className="failed-title">{t('paymentFailed') || 'Payment Failed'}</h2>
        <p className="failed-message">
          {t('paymentFailedMessage') || 'There was an issue processing your payment. Please try again.'}
        </p>
        <div className="failed-actions">
          <button onClick={() => setCurrentStep('payment')} className="retry-payment-btn">
            {t('retryPayment') || 'Retry Payment'}
          </button>
          <button onClick={startNewOrder} className="new-order-btn">
            {t('startOver') || 'Start Over'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`check-container ${isRTL ? 'rtl' : ''}`}>
      <div className="check-wrapper">
        {currentStep === 'checkout' && renderCheckoutStep()}
        {currentStep === 'customer-info' && renderCustomerInfoStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'success' && renderSuccessStep()}
        {currentStep === 'failed' && renderFailedStep()}
      </div>
    </div>
  );
};

export default Check;
