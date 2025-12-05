'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { getHeaderMenu } from '@/lib/menus';
import { useTranslation } from '@/i18n';
import { getPrimaryPhone } from '@/lib/contact';

/**
 * Manager Dashboard Header Component
 * Converted from instructor-dashboard.html template (same as tutor)
 */
export default function ManagerDashboardHeader() {
  const { user, clearAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const menu = getHeaderMenu('manager');
  const phone = getPrimaryPhone();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <header className="rbt-header rbt-header-10">
      <div className="rbt-sticky-placeholder"></div>

      {/* Header Top */}
      <div className="rbt-header-top rbt-header-top-1 header-space-betwween bg-not-transparent bg-color-darker top-expended-activation">
        <div className="container-fluid">
          <div className="top-expended-wrapper">
            <div className="top-expended-inner rbt-header-sec align-items-center">
              <div className="rbt-header-sec-col rbt-header-left d-none d-xl-block">
                <div className="rbt-header-content">
                  <div className="header-info">
                    <ul className="rbt-information-list">
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram"></i>100k <span className="d-none d-xxl-block">Followers</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-square"></i>500k <span className="d-none d-xxl-block">Followers</span>
                        </a>
                      </li>
                      <li>
                        <a href={phone.href}>
                          <i className="feather-phone"></i>{phone.display}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="rbt-header-sec-col rbt-header-center">
                <div className="rbt-header-content justify-content-start justify-content-xl-center">
                  <div className="header-info">
                    <div className="rbt-header-top-news">
                      <div className="inner">
                        <div className="content">
                          <span className="rbt-badge variation-02 bg-color-primary color-white radius-round">Hot</span>
                          <span className="news-text">
                            <Image
                              src="/assets/images/icons/hand-emojji.svg"
                              alt="Hand Emojji"
                              width={20}
                              height={20}
                            />{' '}
                            Intro price. Get Study Score for Big Sale -95% off.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rbt-header-sec-col rbt-header-right mt_md--10 mt_sm--10">
                <div className="rbt-header-content justify-content-start justify-content-lg-end">
                  <div className="header-info d-none d-xl-block">
                    <ul className="social-share-transparent">
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="rbt-separator d-none d-xl-block"></div>

                  <div className="header-info">
                    <LanguageSwitcher />
                  </div>

                  <div className="header-info">
                    <ul className="rbt-dropdown-menu currency-menu">
                      <li className="has-child-menu">
                        <a href="#">
                          <span className="menu-item">USD</span>
                          <i className="right-icon feather-chevron-down"></i>
                        </a>
                        <ul className="sub-menu hover-reverse">
                          <li>
                            <a href="#">
                              <span className="menu-item">EUR</span>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <span className="menu-item">GBP</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="header-info">
              <div className="top-bar-expended d-block d-lg-none">
                <button
                  className="topbar-expend-button rbt-round-btn"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <i className="feather-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="rbt-header-wrapper header-space-betwween header-sticky">
        <div className="container-fluid">
          <div className="mainbar-row rbt-navigation-center align-items-center">
            <div className="header-left rbt-header-content">
              <div className="header-info">
                <div className="logo logo-dark">
                  <Link href="/">
                    <Image
                      src="/assets/images/logo/logo.png"
                      alt="Study Score Logo"
                      width={200}
                      height={50}
                    />
                  </Link>
                </div>
                <div className="logo d-none logo-light">
                  <Link href="/">
                    <Image
                      src="/assets/images/dark/logo/logo-light.png"
                      alt="Study Score Logo"
                      width={200}
                      height={50}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="rbt-main-navigation d-none d-xl-block">
              <nav className="mainmenu-nav">
                <ul className="mainmenu">
                  {menu.mainMenu.map((item) => {
                    const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                    return (
                      <li 
                        key={item.href || item.labelKey || item.label} 
                        className={`${item.hasDropdown ? 'has-menu-child-item' : ''} ${item.submenu ? 'has-dropdown' : ''}`}
                      >
                        {item.href ? (
                          <Link href={item.href}>
                            {itemLabel}
                            {item.hasDropdown && <i className="feather-chevron-down"></i>}
                          </Link>
                        ) : (
                          <span>
                            {itemLabel}
                            {item.hasDropdown && <i className="feather-chevron-down"></i>}
                          </span>
                        )}
                        {item.submenu && (
                          <ul className="submenu">
                            {item.submenu.map((subItem) => {
                              const subItemLabel = subItem.labelKey ? t(subItem.labelKey) : (subItem.label || '');
                              return (
                                <li key={subItem.href}>
                                  {subItem.href ? (
                                    <Link href={subItem.href}>{subItemLabel}</Link>
                                  ) : (
                                    <span>{subItemLabel}</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div className="header-right rbt-header-content">
              {/* Navbar Icons */}
              <ul className="quick-access">
                <li className="access-icon">
                  <a className="search-trigger-active rbt-round-btn" href="#">
                    <i className="feather-search"></i>
                  </a>
                </li>

                <li className="access-icon rbt-mini-cart">
                  <a className="rbt-cart-sidenav-activation rbt-round-btn" href="#">
                    <i className="feather-shopping-cart"></i>
                    <span className="rbt-cart-count">0</span>
                  </a>
                </li>

                {user ? (
                  <li className="account-access rbt-user-wrapper d-none d-xl-block">
                    <a href="#">
                      <i className="feather-user"></i>
                      {user.name}
                    </a>
                    <div className="rbt-user-menu-list-wrapper">
                      <div className="inner">
                        <div className="rbt-admin-profile">
                          <div className="admin-thumbnail">
                            <Image
                              src="/assets/images/team/avatar.jpg"
                              alt={user.name}
                              width={60}
                              height={60}
                            />
                          </div>
                          <div className="admin-info">
                            <span className="name">{user.name}</span>
                            <Link className="rbt-btn-link color-primary" href="/manager/dashboard/profile">
                              {t('menu.viewProfile')}
                            </Link>
                          </div>
                        </div>
                        {menu.userMenu && (
                          <>
                            <ul className="user-list-wrapper">
                              {menu.userMenu.main.map((item) => {
                                const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                                return (
                                  <li key={item.href || item.labelKey || item.label}>
                                    {item.href ? (
                                      <Link href={item.href}>
                                        {item.icon && <i className={item.icon}></i>}
                                        <span>{itemLabel}</span>
                                      </Link>
                                    ) : (
                                      <span>
                                        {item.icon && <i className={item.icon}></i>}
                                        <span>{itemLabel}</span>
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                            <hr className="mt--10 mb--10" />
                            <ul className="user-list-wrapper">
                              {menu.userMenu.secondary.map((item) => {
                                const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                                return (
                                  <li key={item.href || item.action}>
                                    {item.action === 'logout' ? (
                                      <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                        {item.icon && <i className={item.icon}></i>}
                                        <span>{itemLabel}</span>
                                      </a>
                                    ) : item.href ? (
                                      <Link href={item.href}>
                                        {item.icon && <i className={item.icon}></i>}
                                        <span>{itemLabel}</span>
                                      </Link>
                                    ) : (
                                      <span>
                                        {item.icon && <i className={item.icon}></i>}
                                        <span>{itemLabel}</span>
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li>
                    <div className="rbt-btn-wrapper d-none d-xl-block">
                      <Link className="rbt-btn btn-sm btn-border-gradient" href="/login">
                        <span className="btn-text">Login</span>
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-menu-bar d-block d-xl-none">
              <div className="hamberger">
                <button
                  className="hamberger-button rbt-round-btn"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <i className="feather-menu"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

