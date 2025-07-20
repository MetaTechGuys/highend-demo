'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/contexts';
import Dashboard from '../Dashboard/Dashboard';
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

const LoginEmployee: React.FC<LoginEmployeeProps> = ({ onLoginSuccess }) => {
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
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
    
    // Clear login error
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
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordTooShort') || 'Password must be at least 6 characters';
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
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Store employee data
      setEmployee(result.employee);
      setIsLoggedIn(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('employee', JSON.stringify(result.employee));
      localStorage.setItem('employeeToken', result.token);
      
      // Call success callback
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
    setIsLoggedIn(false);
    setEmployee(null);
    setFormData({ email: '', password: '' });
    localStorage.removeItem('employee');
    localStorage.removeItem('employeeToken');
  };

  // Check for existing login on component mount
  React.useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    const storedToken = localStorage.getItem('employeeToken');
    
    if (storedEmployee && storedToken) {
      try {
        const employeeData = JSON.parse(storedEmployee);
        setEmployee(employeeData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored employee data:', error);
        localStorage.removeItem('employee');
        localStorage.removeItem('employeeToken');
      }
    }
  }, []);

  // If logged in, show dashboard instead of old employee dashboard
  if (isLoggedIn && employee) {
    return <Dashboard employee={employee} onLogout={handleLogout} />;
  }

  // Login form (unchanged)
  return (
    <section className={`employee-login ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2>{t('employeeLogin') || 'Employee Login'}</h2>
            <p>{t('loginDescription') || 'Access your employee dashboard'}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {loginError && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t('email') || 'Email'} *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder={t('enterEmail') || 'Enter your email'}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('password') || 'Password'} *</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={errors.password ? 'error' : ''}
                placeholder={t('enterPassword') || 'Enter your password'}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t('loggingIn') || 'Logging in...'}
                </>
              ) : (
                t('login') || 'Login'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>{t('forgotPassword') || 'Forgot your password?'} 
              <a href="#" className="link">{t('contactAdmin') || 'Contact admin'}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginEmployee;
