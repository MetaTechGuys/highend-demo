"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts";
import "./Footer.scss";
import { track } from "@vercel/analytics/react";
import version from '../../version.json';

const Footer: React.FC = () => {
  const { isRTL, t } = useLanguage();

  return (
    <footer className={`footer ${isRTL ? "rtl" : "ltr"}`}>
      <div className="footer-container">
        <div className="footer-content">
          {/* First Column - Company Name and Social Media */}
          <div className="footer-column company-column">
            <h3 className="company-name">
              {t("companyName") || "Your Company"}
            </h3>
            <div className="social-media">
              <Link
                href="https://www.instagram.com/highend.fastfood?utm_source=ig_web_button_share_sheet&igsh=bHVseHh3YjM3M2Q3"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram"
                onClick={() => {
                  track("Instagram");
                }}
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="social-icon"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="social-text">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Second Column - Location and Contact Info */}
          <div className="footer-column location-column">
            <h4 className="column-title">{t("location") || "Location"}</h4>
            <div className="location-info">
              <div className="address">
                <div className="address-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="address-text">
                  <p>{t("address")}</p>
                </div>
              </div>
              <div className="phone">
                <div className="phone-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <div className="phone-text">
                  <Link
                    href="tel:+1234567890"
                    className="phone-link"
                    onClick={() => {
                      track("telephone");
                    }}
                  >
                    {t("phone")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Third Column - Contact Us */}
          <div className="footer-column contact-column">
            <h4 className="column-title">{t("contactUs") || "Contact Us"}</h4>
            <div className="contact-links">
              <Link
                href="/contact"
                className="contact-link"
                onClick={() => {
                  track("message");
                }}
              >
                <div className="contact-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <span>{t("sendMessage") || "Send Message"}</span>
              </Link>
              <Link
                href="/contact"
                className="contact-link"
                onClick={() => {
                  track("SUPPORT");
                }}
              >
                <div className="contact-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                  </svg>
                </div>
                <span>{t("support") || "Support Center"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} {t("companyName") || "Your Company"}.{" "}
              {t("allRightsReserved") || "All rights reserved."}
            </p>
            <div className="footer-links">
              <p>v{version.version}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
