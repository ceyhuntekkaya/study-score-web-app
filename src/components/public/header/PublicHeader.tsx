'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { getHeaderMenu } from '@/lib/menus';
import { useTranslation } from '@/i18n';

/**
 * Public Header Component
 * Converted from template without jQuery dependency
 */
export default function PublicHeader() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const menu = getHeaderMenu('public');

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`rbt-header rbt-header-4 rbt-header-4-container-var ${isSticky ? 'header-sticky' : ''}`}>
      <div className="rbt-sticky-placeholder"></div>
      
      {/* Header Top */}
      <div className="rbt-header-top rbt-header-top-1 header-space-betwween bg-color-white rbt-border-bottom d-none d-xl-block">
        <div className="container">
          <div className="rbt-header-sec align-items-center">
            <div className="rbt-header-sec-col rbt-header-left">
              <div className="rbt-header-content">
                <div className="header-info">
                  <ul className="rbt-information-list">
                    {menu.topMenu?.left?.map((item, index) => (
                      <li key={index}>
                        <a href={item.href}>
                          {item.icon && <i className={item.icon}></i>}
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rbt-separator"></div>
                <div className="header-info">
                  <ul className="social-share-transparent version-02">
                    <li>
                      <a href="#" aria-label="Facebook">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="Twitter">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rbt-header-sec-col rbt-header-right">
              <div className="rbt-header-content">
                <div className="header-info">
                  <ul className="rbt-secondary-menu">
                    {menu.topMenu?.right?.map((item) => {
                      const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                      return (
                        <li key={item.href}>
                          <Link href={item.href}>{itemLabel}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="rbt-separator"></div>
                <div className="header-info">
                  <div className="header-right-btn d-flex">
                    <Link className="rbt-btn rbt-switch-btn btn-gradient btn-xs" href="/register">
                      <span data-text={t('menu.registerNow')}>{t('menu.registerNow')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Top */}

      {/* Main Header */}
      <div className="rbt-header-wrapper header-space-betwween shadow-none bg-color-white header-sticky">
        <div className="container">
          <div className="mainbar-row rbt-navigation-start align-items-center">
            <div className="header-left">
              <div className="logo logo-dark">
                <Link href="/">
                  <Image 
                    src="/assets/images/logo/logo-black.png" 
                    alt="Education Logo" 
                    width={150} 
                    height={40}
                    priority
                  />
                </Link>
              </div>
              <div className="logo d-none logo-light">
                <Link href="/">
                  <Image 
                    src="/assets/images/dark/logo/logo-light.png" 
                    alt="Education Logo" 
                    width={150} 
                    height={40}
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="rbt-main-navigation d-none d-xl-block">
              <nav className="mainmenu-nav">
                <ul className="mainmenu">
                  {menu.mainMenu.map((item) => {
                    const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                    return (
                      <li key={item.href} className={item.hasDropdown ? 'has-menu-child-item' : ''}>
                        <Link href={item.href}>
                          {itemLabel}
                          {item.hasDropdown && <i className="feather-chevron-down"></i>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Header Right */}
            <div className="header-right">
              <div className="rbt-header-action d-flex align-items-center">
                <div className="rbt-search-dropdown d-none d-lg-block">
                  <button className="rbt-search-btn" type="button" aria-label="Search">
                    <i className="feather-search"></i>
                  </button>
                </div>
                <div className="rbt-cart-side-menu d-none d-lg-block">
                  <button className="rbt-cart-icon" type="button" aria-label="Cart">
                    <i className="feather-shopping-cart"></i>
                    <span className="rbt-cart-count">0</span>
                  </button>
                </div>
                <Link href="/login" className="rbt-btn btn-border-gradient radius-round btn-sm">
                  <span data-text="Login">Login</span>
                </Link>
                <LanguageSwitcher />
                {/* Mobile Menu Toggle */}
                <button 
                  className="mobile-menu-btn d-block d-xl-none" 
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <span className="menu-icon">
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Main Header */}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="rbt-mobile-menu d-block d-xl-none">
          <nav className="mobile-menu-nav">
            <ul className="mainmenu">
              {menu.mainMenu.map((item) => {
                const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                return (
                  <li key={item.href}>
                    <Link href={item.href}>{itemLabel}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

