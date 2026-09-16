'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Menu, Power, Settings, Shield } from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/i18n';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { getDisplayName, getInitials } from '@/lib/admin/user-display';

type AdminDashboardHeaderProps = {
  onMenuClick?: () => void;
  menuOpen?: boolean;
};

export default function AdminDashboardHeader({
  onMenuClick,
  menuOpen = false,
}: AdminDashboardHeaderProps) {
  const { user, clearAuth } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="ssa-admin-header">
      <div className="ssa-admin-header-left">
        <button
          type="button"
          onClick={onMenuClick}
          className="ssa-admin-header-menu-btn"
          aria-label="Menüyü aç"
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
        >
          <Menu size={22} strokeWidth={2} aria-hidden />
        </button>

        <Link href="/admin/dashboard" className="ssa-admin-header-logo-mobile">
          <Image src={BRAND_LOGOS.onLight} alt="Study Score" width={120} height={32} priority />
        </Link>

        <span className="ssa-admin-header-badge">
          <Shield size={16} strokeWidth={2.5} aria-hidden />
          {t('menu.admin')}
        </span>
      </div>

      <div className="ssa-admin-header-right">
        <Link
          href="/"
          className="ssa-admin-header-icon-btn ssa-admin-header-icon-btn--ghost ssa-admin-header-home"
          aria-label={t('nav.home')}
        >
          <Home size={22} strokeWidth={2} aria-hidden />
        </Link>

        <div className="ssa-admin-header-lang">
          <LanguageSwitcher />
        </div>

        <Link
          href="/admin/dashboard/settings"
          className="ssa-admin-header-icon-btn ssa-admin-header-icon-btn--ghost ssa-admin-header-settings"
          aria-label={t('nav.settings')}
        >
          <Settings size={22} strokeWidth={2} aria-hidden />
        </Link>

        <span className="ssa-admin-header-divider" aria-hidden />

        <div className="ssa-admin-header-user">
          <div className="ssa-admin-header-user-text">
            <p className="ssa-admin-header-user-name">{getDisplayName(user)}</p>
            <p className="ssa-admin-header-user-role">{t('menu.admin')}</p>
          </div>
          <div className="ssa-admin-header-avatar" aria-hidden>
            {getInitials(user)}
          </div>
        </div>

        <button
          type="button"
          className="ssa-admin-header-icon-btn ssa-admin-header-icon-btn--danger"
          onClick={() => clearAuth()}
          aria-label={t('common.logout')}
        >
          <Power size={22} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </header>
  );
}
