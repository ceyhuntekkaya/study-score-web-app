'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/i18n';
import { getSidebarMenu } from '@/lib/menus';

/**
 * Admin Dashboard Header Component
 * Header with menu in center, profile and language switcher on right
 */
export default function AdminDashboardHeader() {
  const { user, clearAuth } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const menu = getSidebarMenu('admin');

  const handleLogout = () => {
    clearAuth();
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Get main menu items (first section items, excluding logout)
  const mainMenuItems = menu.sections[0]?.items.filter(item => item.action !== 'logout') || [];

  return (
    <header className="rbt-header rbt-header-10">
      <div className="rbt-sticky-placeholder"></div>

      {/* Header with menu in center */}
      <div className="rbt-header-wrapper header-space-betwween header-sticky bg-color-white">
        <div className="container-fluid">
          <div className="mainbar-row rbt-navigation-center align-items-center">
            {/* Logo Left */}
            <div className="header-left rbt-header-content">
              <div className="header-info">
                <div className="logo logo-dark">
                  <Link href="/admin/dashboard">
                    <Image
                      src="/assets/images/logo/logo.png"
                      alt="Study Score Logo"
                      width={150}
                      height={40}
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Menu Center */}
            <div className="rbt-main-navigation d-none d-lg-block">
              <nav className="mainmenu-nav">
                <ul className="mainmenu">
                  {mainMenuItems.map((item) => {
                    const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                    return (
                      <li key={item.href || item.labelKey || item.label}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={isActive(item.href) ? 'active' : ''}
                          >
                            {item.icon && <i className={item.icon}></i>}
                            <span className="ms-1">{itemLabel}</span>
                          </Link>
                        ) : (
                          <span>
                            {item.icon && <i className={item.icon}></i>}
                            <span className="ms-1">{itemLabel}</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Right Side - Language & Profile */}
            <div className="header-right rbt-header-content">
              <ul className="quick-access">
                {/* Language Switcher */}
                <li className="d-none d-xl-block">
                  <div className="header-info">
                    <LanguageSwitcher />
                  </div>
                </li>

                {/* Profile Dropdown */}
                {user ? (
                  <li className="account-access rbt-user-wrapper d-none d-xl-block">
                    <a href="#">
                      <i className="feather-user"></i>
                      <span className="ms-2">{user.name}</span>
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
                            <Link className="rbt-btn-link color-primary" href="/admin/dashboard/profile">
                              {t('menu.viewProfile')}
                            </Link>
                          </div>
                        </div>
                        <ul className="user-list-wrapper">
                          <li>
                            <Link href="/admin/dashboard">
                              <i className="feather-home"></i>
                              <span>{t('menu.dashboard')}</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/admin/dashboard/profile">
                              <i className="feather-user"></i>
                              <span>{t('menu.myProfile')}</span>
                            </Link>
                          </li>
                        </ul>
                        <hr className="mt--10 mb--10" />
                        <ul className="user-list-wrapper">
                          <li>
                            <Link href="/admin/dashboard/settings">
                              <i className="feather-settings"></i>
                              <span>{t('nav.settings')}</span>
                            </Link>
                          </li>
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                              <i className="feather-log-out"></i>
                              <span>{t('common.logout')}</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li>
                    <div className="rbt-btn-wrapper d-none d-xl-block">
                      <Link className="rbt-btn btn-sm btn-border-gradient" href="/login">
                        <span className="btn-text">{t('common.login')}</span>
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-menu-bar d-block d-lg-none">
              <div className="hamberger">
                <button
                  className="hamberger-button rbt-round-btn"
                  onClick={() => {
                    // Mobile menu toggle logic can be added here
                  }}
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
