"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/contexts";
import "./Hero.scss";
import { track } from "@vercel/analytics/react";

interface SlideData {
  id: number;
  image: string;
}

const Hero: React.FC = () => {
  const { isRTL, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Slider data - 6 slides with only images
  const slides: SlideData[] = [
    {
      id: 1,
      image: "/images/slide-1.webp",
    },
    {
      id: 2,
      image: "/images/slide-2.webp",
    },
    {
      id: 3,
      image: "/images/slide-3.webp",
    },
    {
      id: 4,
      image: "/images/slide-4.webp",
    },
    {
      id: 5,
      image: "/images/slide-5.webp",
    },
    {
      id: 6,
      image: "/images/slide-6.webp",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length, isAutoPlaying]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);

    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  }, []);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section className={`hero ${isRTL ? "rtl" : "ltr"}`}>
      <div className="hero-container">
        <div className="hero-grid">
          {/* Main large image - spans 2 rows and 3 columns */}
          <div className="hero-main-image">
            <div
              className={`image-container ${isVideoLoading ? "loading" : ""}`}
            >
              <video
                src="/videos/main.webm"
                className="main-image"
                muted
                autoPlay
                loop
                preload="metadata"
                poster="/images/slide-1.webp"
                width="1920"
                height="1080"
                onLoadStart={() => setIsVideoLoading(true)}
                onCanPlay={() => setIsVideoLoading(false)}
                onError={() => setIsVideoLoading(false)}
                aria-label="foods"
              ></video>
              <div className="image-overlay">
                <div className="overlay-content">
                  <p className="title-hero">High End</p>
                  <div className="button-container">
                    <a
                      className="cta-button"
                      href="/menu"
                      onClick={() => {
                        track("OrderNow");
                      }}
                    >
                      {t("getStarted")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top right image - spans 1 row and 1 column */}
          <div className="hero-top-image">
            <div className="image-container">
              <Image
                src="/images/Main Chef.webp"
                alt="Top Hero Image"
                fill
                className="top-image"
                sizes="(max-width: 820px) 100vw, (max-width: 1200px) 25vw, 20vw"
                priority
              />
            </div>
          </div>

          {/* Bottom right slider - spans 1 row and 1 column */}
          <div
            className="hero-slider"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="slider-container">
              <div
                className="slider-track"
                style={{
                  transform: `translateX(-${
                    currentSlide * (100 / slides.length)
                  }%)`,
                }}
              >
                {slides.map((slide, index) => (
                  <div key={slide.id} className="slide">
                    <div className="slide-image-container">
                      <Image
                        src={slide.image}
                        alt={`Slide ${slide.id}`}
                        fill
                        className="slide-image"
                        sizes="(max-width: 820px) 100vw, (max-width: 1200px) 25vw, 20vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Minimal pagination dots */}
              <div className="slider-pagination">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => {
                      track(`Slide${index + 1}`);
                      goToSlide(index);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
