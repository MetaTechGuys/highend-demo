'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/contexts';
import './Form.scss';

interface FormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  age: string;
  
  // Visit Information
  visitFrequency: string;
  lastVisit: string;
  partySize: string;
  occasion: string;
  
  // Food & Service Ratings
  foodQuality: number;
  serviceQuality: number;
  atmosphere: number;
  valueForMoney: number;
  
  // Preferences
  favoriteItems: string[];
  dietaryRestrictions: string[];
  preferredTime: string;
  
  // Feedback
  mostLiked: string;
  improvements: string;
  recommendation: number;
  additionalComments: string;
  
  // Marketing
  hearAboutUs: string;
  newsletter: boolean;
  promotions: boolean;
}

interface FormProps {
  onSubmit?: (data: FormData) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const { t, isRTL } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    visitFrequency: '',
    lastVisit: '',
    partySize: '',
    occasion: '',
    foodQuality: 0,
    serviceQuality: 0,
    atmosphere: 0,
    valueForMoney: 0,
    favoriteItems: [],
    dietaryRestrictions: [],
    preferredTime: '',
    mostLiked: '',
    improvements: '',
    recommendation: 0,
    additionalComments: '',
    hearAboutUs: '',
    newsletter: false,
    promotions: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 5;

  const handleInputChange = (field: keyof FormData, value: string | number | boolean | string[]) => {
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
  };

  const handleArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      handleInputChange(field, [...currentArray, value]);
    } else {
      handleInputChange(field, currentArray.filter(item => item !== value));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = t('nameRequired') || 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = t('emailRequired') || 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = t('emailInvalid') || 'Email is invalid';
        }
        break;
      case 2:
        if (!formData.visitFrequency) newErrors.visitFrequency = t('visitFrequencyRequired') || 'Visit frequency is required';
        break;
      case 3:
        if (formData.foodQuality === 0) newErrors.foodQuality = t('ratingRequired') || 'Rating is required';
        if (formData.serviceQuality === 0) newErrors.serviceQuality = t('ratingRequired') || 'Rating is required';
        break;
      case 4:
        if (!formData.mostLiked.trim()) newErrors.mostLiked = t('feedbackRequired') || 'This field is required';
        if (formData.recommendation === 0) newErrors.recommendation = t('recommendationRequired') || 'Recommendation rating is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Set submitted state to show success message
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error silently or show inline error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      visitFrequency: '',
      lastVisit: '',
      partySize: '',
      occasion: '',
      foodQuality: 0,
      serviceQuality: 0,
      atmosphere: 0,
      valueForMoney: 0,
      favoriteItems: [],
      dietaryRestrictions: [],
      preferredTime: '',
      mostLiked: '',
      improvements: '',
      recommendation: 0,
      additionalComments: '',
      hearAboutUs: '',
      newsletter: false,
      promotions: false,
    });
    setCurrentStep(1);
    setIsSubmitted(false);
    setErrors({});
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void, error?: string) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? 'active' : ''}`}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
      {error && <span className="error-message">{error}</span>}
    </div>
  );

  // Success message component
  if (isSubmitted) {
    return (
      <section className={`form-section ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="form-container">
          <div className="success-message">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h2>{t('surveySubmitted') || 'Thank you for your feedback!'}</h2>
            <p>{t('surveySubmittedDesc') || 'Your response has been recorded and will help us improve our service.'}</p>
            <button 
              onClick={resetForm}
              className="btn btn-primary"
            >
              {t('submitAnother') || 'Submit Another Response'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h3>{t('personalInfo') || 'Personal Information'}</h3>
            
            <div className="form-group">
              <label htmlFor="name">{t('name') || 'Name'} *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder={t('enterName') || 'Enter your name'}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('email1') || 'Email'} *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder={t('enterEmail') || 'Enter your email'}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('phone1') || 'Phone'}</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t('enterPhone') || 'Enter your phone number'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">{t('ageGroup') || 'Age Group'}</label>
              <select
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              >
                <option value="">{t('selectAge') || 'Select age group'}</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56+">{t('over56') || '56+'}</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h3>{t('visitInfo') || 'Visit Information'}</h3>
            
            <div className="form-group">
              <label>{t('visitFrequency') || 'How often do you visit us?'} *</label>
              <div className="radio-group">
                {[
                  { value: 'first-time', label: t('firstTime') || 'First time' },
                  { value: 'weekly', label: t('weekly') || 'Weekly' },
                  { value: 'monthly', label: t('monthly') || 'Monthly' },
                  { value: 'occasionally', label: t('occasionally') || 'Occasionally' },
                  { value: 'rarely', label: t('rarely') || 'Rarely' }
                ].map(option => (
                  <label key={option.value} className="radio-label">
                    <input
                      type="radio"
                      name="visitFrequency"
                      value={option.value}
                      checked={formData.visitFrequency === option.value}
                      onChange={(e) => handleInputChange('visitFrequency', e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.visitFrequency && <span className="error-message">{errors.visitFrequency}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastVisit">{t('lastVisit') || 'When was your last visit?'}</label>
              <input
                type="date"
                id="lastVisit"
                value={formData.lastVisit}
                onChange={(e) => handleInputChange('lastVisit', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="partySize">{t('partySize') || 'Party size'}</label>
              <select
                id="partySize"
                value={formData.partySize}
                onChange={(e) => handleInputChange('partySize', e.target.value)}
              >
                <option value="">{t('selectPartySize') || 'Select party size'}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3-4">3-4</option>
                <option value="5-6">5-6</option>
                <option value="7+">{t('sevenPlus') || '7+'}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="occasion">{t('occasion') || 'Occasion'}</label>
              <select
                id="occasion"
                value={formData.occasion}
                onChange={(e) => handleInputChange('occasion', e.target.value)}
              >
                <option value="">{t('selectOccasion') || 'Select occasion'}</option>
                <option value="casual">{t('casual') || 'Casual dining'}</option>
                <option value="business">{t('business') || 'Business meeting'}</option>
                <option value="celebration">{t('celebration') || 'Celebration'}</option>
                <option value="date">{t('date') || 'Date night'}</option>
                <option value="family">{t('family') || 'Family gathering'}</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h3>{t('ratings') || 'Rate Your Experience'}</h3>
            
            <div className="form-group">
              <label>{t('foodQuality') || 'Food Quality'} *</label>
              {renderStarRating(
                formData.foodQuality,
                (rating) => handleInputChange('foodQuality', rating),
                errors.foodQuality
              )}
            </div>

            <div className="form-group">
              <label>{t('serviceQuality') || 'Service Quality'} *</label>
              {renderStarRating(
                formData.serviceQuality,
                (rating) => handleInputChange('serviceQuality', rating),
                errors.serviceQuality
              )}
            </div>

            <div className="form-group">
              <label>{t('atmosphere') || 'Atmosphere'}</label>
              {renderStarRating(
                formData.atmosphere,
                (rating) => handleInputChange('atmosphere', rating)
              )}
            </div>

            <div className="form-group">
              <label>{t('valueForMoney') || 'Value for Money'}</label>
              {renderStarRating(
                formData.valueForMoney,
                (rating) => handleInputChange('valueForMoney', rating)
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h3>{t('feedback') || 'Your Feedback'}</h3>
            
            <div className="form-group">
              <label htmlFor="mostLiked">{t('mostLiked') || 'What did you like most?'} *</label>
              <textarea
                id="mostLiked"
                value={formData.mostLiked}
                onChange={(e) => handleInputChange('mostLiked', e.target.value)}
                className={errors.mostLiked ? 'error' : ''}
                placeholder={t('describeMostLiked') || 'Tell us what you enjoyed most about your experience'}
                rows={4}
              />
              {errors.mostLiked && <span className="error-message">{errors.mostLiked}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="improvements">{t('improvements') || 'What could we improve?'}</label>
              <textarea
                id="improvements"
                value={formData.improvements}
                onChange={(e) => handleInputChange('improvements', e.target.value)}
                placeholder={t('describeImprovements') || 'Share your suggestions for improvement'}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>{t('recommendation') || 'How likely are you to recommend us?'} *</label>
              <div className="scale-labels">
                <span>{t('notLikely') || 'Not likely'}</span>
                <span>{t('veryLikely') || 'Very likely'}</span>
              </div>
              <div className="recommendation-scale">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`scale-btn ${formData.recommendation === num ? 'active' : ''}`}
                    onClick={() => handleInputChange('recommendation', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {errors.recommendation && <span className="error-message">{errors.recommendation}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="additionalComments">{t('additionalComments') || 'Additional Comments'}</label>
              <textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                placeholder={t('shareThoughts') || 'Share any additional thoughts or comments'}
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <h3>{t('preferences') || 'Preferences & Marketing'}</h3>
            
            <div className="form-group">
              <label htmlFor="favoriteItems">{t('favoriteItems') || 'Favorite menu items'}</label>
              <textarea
                id="favoriteItems"
                value={formData.favoriteItems.join(', ')}
                onChange={(e) => handleInputChange('favoriteItems', e.target.value.split(', ').filter(item => item.trim()))}
                placeholder={t('enterFavoriteItems') || 'Enter your favorite menu items'}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>{t('dietaryRestrictions') || 'Dietary restrictions'}</label>
              <div className="checkbox-group">
                {[
                  { value: 'vegetarian', label: t('vegetarian') || 'Vegetarian' },
                  { value: 'vegan', label: t('vegan') || 'Vegan' },
                  { value: 'gluten-free', label: t('glutenFree') || 'Gluten-free' },
                  { value: 'dairy-free', label: t('dairyFree') || 'Dairy-free' },
                  { value: 'nut-free', label: t('nutFree') || 'Nut-free' },
                  { value: 'halal', label: t('halal') || 'Halal' },
                  { value: 'kosher', label: t('kosher') || 'Kosher' },
                  { value: 'none', label: t('none') || 'None' }
                ].map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.dietaryRestrictions.includes(option.value)}
                      onChange={(e) => handleArrayChange('dietaryRestrictions', option.value, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="preferredTime">{t('preferredTime') || 'Preferred dining time'}</label>
              <select
                id="preferredTime"
                value={formData.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
              >
                <option value="">{t('selectTime') || 'Select preferred time'}</option>
                <option value="breakfast">{t('breakfast') || 'Breakfast (7-11 AM)'}</option>
                <option value="lunch">{t('lunch') || 'Lunch (11 AM-3 PM)'}</option>
                <option value="dinner">{t('dinner') || 'Dinner (5-10 PM)'}</option>
                <option value="late-night">{t('lateNight') || 'Late night (10 PM+)'}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hearAboutUs">{t('hearAboutUs') || 'How did you hear about us?'}</label>
              <select
                id="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
              >
                <option value="">{t('selectOption') || 'Select an option'}</option>
                <option value="social-media">{t('socialMedia') || 'Social media'}</option>
                <option value="friends-family">{t('friendsFamily') || 'Friends/Family'}</option>
                <option value="online-search">{t('onlineSearch') || 'Online search'}</option>
                <option value="advertisement">{t('advertisement') || 'Advertisement'}</option>
                <option value="walk-by">{t('walkBy') || 'Walked by'}</option>
                <option value="other">{t('other') || 'Other'}</option>
              </select>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  />
                  <span>{t('subscribeNewsletter') || 'Subscribe to our newsletter'}</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.promotions}
                    onChange={(e) => handleInputChange('promotions', e.target.checked)}
                  />
                  <span>{t('receivePromotions') || 'Receive promotional offers'}</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={`form-section ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="form-container">
        {/* Form Header */}
        <div className="form-header">
          <h2>{t('customerSurvey') || 'Customer Survey'}</h2>
          <p>{t('surveyDescription') || 'Help us improve your dining experience'}</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && (t('personal') || 'Personal')}
                  {step === 2 && (t('visit') || 'Visit')}
                  {step === 3 && (t('ratings') || 'Ratings')}
                  {step === 4 && (t('feedback') || 'Feedback')}
                  {step === 5 && (t('preferences') || 'Preferences')}
                </div>
              </div>
            ))}
          </div>
          <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>

        {/* Form Content */}
        <form className="survey-form" onSubmit={handleSubmit}>
          {renderStep()}

          {/* Form Actions */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                {t('previous') || 'Previous'}
              </button>
            )}
            
            <div></div> {/* Spacer */}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {t('next') || 'Next'}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    {t('submitting') || 'Submitting...'}
                  </>
                ) : (
                  t('submitSurvey') || 'Submit Survey'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Form;
