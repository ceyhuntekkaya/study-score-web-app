'use client';

import Link from 'next/link';

interface BreadcrumbSectionProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
  bgImageClass?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  variant?: 'default' | 'about'; // 'about' variant for about page style
}

/**
 * Breadcrumb Section Component
 * Converted from template
 */
export default function BreadcrumbSection({ 
  title, 
  subtitle, 
  bgImage = '/assets/images/bg/bg-image-1.jpg',
  bgImageClass = 'bg_image--1',
  showButton = false,
  buttonText = 'More About Us',
  buttonLink = '#',
  variant = 'default'
}: BreadcrumbSectionProps) {
  // About page variant uses different classes
  if (variant === 'about') {
    return (
      <div 
        className="slider-area rbt-banner-10 height-750 bg_image bg_image--11" 
        style={{ backgroundImage: `url(${bgImage})` }}
        data-black-overlay="5"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner text-center">
                {subtitle && (
                  <div className="section-title mb--20">
                    <span className="subtitle bg-coral-opacity">{subtitle}</span>
                  </div>
                )}
                <h1 className="title display-one text-white">{title}</h1>
                {showButton && (
                  <div className="read-more-btn mt--40">
                    <Link className="rbt-btn btn-gradient hover-icon-reverse" href={buttonLink}>
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">{buttonText}</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={`rbt-banner-area rbt-banner-1 bg_image ${bgImageClass}`} 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="inner text-center">
              {subtitle && (
                <h6 className="subtitle">
                  <span className="theme-gradient">{subtitle}</span>
                </h6>
              )}
              <h1 className="title">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

