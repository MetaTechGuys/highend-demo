'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/app/contexts';
import './Location.scss';
import 'leaflet/dist/leaflet.css';

interface LocationProps {
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  mapHeight?: string;
  showDirectionsButton?: boolean;
  address?: string;
}

const Location: React.FC<LocationProps> = ({
  title,
  description,
  latitude = 40.7128,
  longitude = -74.0060,
  zoom = 15,
  mapHeight = '400px',
  showDirectionsButton = true,
  address
}) => {
  const { t, isRTL } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<unknown>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import react-leaflet components only on client side
    const loadMapComponents = async () => {
      if (typeof window !== 'undefined') {
        try {
          const [
            { MapContainer, TileLayer, Marker, Popup },
            { Icon }
          ] = await Promise.all([
            import('react-leaflet'),
            import('leaflet')
          ]);
          
          setMapComponents({ MapContainer, TileLayer, Marker, Popup, Icon });
        } catch (error) {
          console.error('Failed to load map components:', error);
        }
      }
    };

    loadMapComponents();
  }, []);

  const handleGetDirections = () => {
    if (typeof window !== 'undefined') {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenInMaps = () => {
    if (typeof window !== 'undefined') {
      const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=${zoom}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenInGoogleMaps = () => {
    if (typeof window !== 'undefined') {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleCopyCoordinates = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const coordinates = `${latitude}, ${longitude}`;
      navigator.clipboard.writeText(coordinates).then(() => {
        // You can add a toast notification here instead of alert
        console.log('Coordinates copied to clipboard');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = coordinates;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Coordinates copied to clipboard');
      });
    }
  };

  // Restaurant contact info
  const contactInfo = {
    address: address || t('address') || '123 Main Street, City, Country',
    phone: t('phone') || '+1 (234) 567-890',
    phone2: t('phone2') || '+0 (987) 654-321',
    email: 'info@highend-restaurant.com',
    instagram: 'https://instagram.com/yourcompany',
    whatsapp: 'https://wa.me/1234567890'
  };

  // Render loading state while components are loading
  if (!isClient || !MapComponents) {
    return (
      <section className={`location ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="location-container">
          <div className="location-header">
            <h2 className="location-title">
              {title || t('location') || 'Our Location'}
            </h2>
            <p className="location-subtitle">
              {description || t('findUs') || 'Find us and get in touch'}
            </p>
          </div>
          <div className="location__loading">
            <div className="location__spinner"></div>
            <p>{t('loading') || 'Loading map...'}</p>
          </div>
        </div>
      </section>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Icon } = MapComponents as {
    MapContainer: React.ComponentType<{
      center: [number, number];
      zoom: number;
      style: React.CSSProperties;
      className: string;
      children: React.ReactNode;
    }>;
    TileLayer: React.ComponentType<{
      attribution: string;
      url: string;
    }>;
    Marker: React.ComponentType<{
      position: [number, number];
      icon: unknown;
      children: React.ReactNode;
    }>;
    Popup: React.ComponentType<{
      children: React.ReactNode;
    }>;
    Icon: new (options: {
      iconUrl: string;
      iconSize: [number, number];
      iconAnchor: [number, number];
      popupAnchor: [number, number];
    }) => unknown;
  };

  // Custom marker icon
  const customIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="#f1592f" stroke="#fff" stroke-width="2" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.596 19.404 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <section className={`location ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="location-container">
        {/* Header */}
        <div className="location-header">
          <h2 className="location-title">
            {title || t('location') || 'Our Location'}
          </h2>
          <p className="location-subtitle">
            {description || t('findUs') || 'Find us and get in touch'}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="location-content">
          {/* Left Column - Map and Location Info */}
          <div className="location-column">
            <div className="column-header">
              <h3>{t('findUs') || 'Find Us'}</h3>
            </div>
            
            {/* Map Section */}
            <div className="map-container">
              <MapContainer
                center={[latitude, longitude]}
                zoom={zoom}
                style={{ height: mapHeight, width: '100%' }}
                className="location-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]} icon={customIcon}>
                  <Popup>
                    <div className="map-popup">
                      <h4>{t('companyName') || 'HighEnd Restaurant'}</h4>
                      <p>{contactInfo.address}</p>
                      <p><strong>{t('phone') || 'Phone'}:</strong> {contactInfo.phone}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Map Actions */}
            {showDirectionsButton && (
              <div className="map-actions">
                <button
                  className="map-btn primary"
                  onClick={handleGetDirections}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {t('getDirections') || 'Get Directions'}
                </button>
                
                <button
                  className="map-btn secondary"
                  onClick={handleOpenInGoogleMaps}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {t('openInGoogleMaps') || 'Google Maps'}
                </button>

                <button
                  className="map-btn secondary"
                  onClick={handleOpenInMaps}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {t('openInOSM') || 'OpenStreetMap'}
                </button>
              </div>
            )}

            {/* Location Details */}
            <div className="location-details">
              <div className="detail-item">
                <strong>{t('address1') || 'Address'}:</strong>
                <span>{contactInfo.address}</span>
              </div>
              <div className="detail-item">
                <strong>{t('coordinates') || 'Coordinates'}:</strong>
                <span 
                  className="coordinates-value" 
                  onClick={handleCopyCoordinates}
                  title={t('copyCoordinates') || 'Click to copy coordinates'}
                >
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="contact-column">
            <div className="column-header">
              <h3>{t('contactUs') || 'Contact Us'}</h3>
            </div>
            
            <div className="contact-info">
              {/* Address */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>{t('address1') || 'Address'}</h4>
                  <p>{contactInfo.address}</p>
                  <p>{t('postalCode') || 'Postal Code: 12345'}</p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>{t('phone1') || 'Phone'}</h4>
                  <p>
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                      {contactInfo.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`tel:${contactInfo.phone2.replace(/\s/g, '')}`}>
                      {contactInfo.phone2}
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>{t('email') || 'Email'}</h4>
                  <p>
                    <a href={`mailto:${contactInfo.email}`}>
                      {contactInfo.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>{t('businessHours') || 'Business Hours'}</h4>
                  <div className="hours-list">
                    <div className="hours-item">
                      <span>{t('monday') || 'Monday'} - {t('friday') || 'Friday'}</span>
                      <span>11:00 AM - 10:00 PM</span>
                    </div>
                    <div className="hours-item">
                      <span>{t('saturday') || 'Saturday'}</span>
                      <span>10:00 AM - 11:00 PM</span>
                    </div>
                    <div className="hours-item">
                      <span>{t('sunday') || 'Sunday'}</span>
                      <span>10:00 AM - 9:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4.5c0-1.1.9-2 2-2s2 .9 2 2V18h4v-7.5c0-1.1.9-2 2-2s2 .9 2 2V18h4V9.5c0-3.04-2.46-5.5-5.5-5.5S9 6.46 9 9.5V18H4z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>{t('followUs') || 'Follow Us'}</h4>
                  <div className="social-links">
                    <a 
                      href={contactInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                      aria-label="Instagram"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
