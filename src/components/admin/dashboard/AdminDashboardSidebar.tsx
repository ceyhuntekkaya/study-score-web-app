'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSidebarMenu } from '@/lib/menus';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { getAdminMenuIcon } from '@/lib/admin/menu-icons';

type AdminDashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminDashboardSidebar({ open, onClose }: AdminDashboardSidebarProps) {
  const pathname = usePathname();
  const { clearAuth } = useAuth();
  const { t } = useTranslation();
  const menu = getSidebarMenu('admin');

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    clearAuth();
  };

  return (
    <>
      <div
        className={cn('ssa-admin-sidebar-backdrop', open && 'ssa-admin-sidebar-backdrop--visible')}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="admin-sidebar"
        className={cn('ssa-admin-sidebar', open && 'ssa-admin-sidebar--open')}
        aria-label={t('menu.admin')}
      >
        <div className="ssa-admin-sidebar-brand">
          <Link href="/admin/dashboard" className="ssa-admin-sidebar-brand-link" onClick={onClose}>
            <Image
              src={BRAND_LOGOS.onDark}
              alt="Study Score"
              width={140}
              height={36}
              className="ssa-admin-sidebar-logo"
              priority
            />
            <span className="ssa-admin-sidebar-brand-sub">{t('menu.admin')}</span>
          </Link>
          <button
            type="button"
            className="ssa-admin-sidebar-close"
            onClick={onClose}
            aria-label="Menüyü kapat"
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <nav className="ssa-admin-sidebar-nav">
          {menu.sections.map((section, sectionIndex) => {
            const sectionTitle = section.titleKey ? t(section.titleKey) : (section.title || '');
            return (
              <div
                key={sectionTitle + sectionIndex}
                className={cn('ssa-admin-sidebar-group', sectionIndex > 0 && 'ssa-admin-sidebar-group--divider')}
              >
                {sectionIndex > 0 ? (
                  <p className="ssa-admin-sidebar-group-title">{sectionTitle}</p>
                ) : null}
                <ul className="ssa-admin-sidebar-list">
                  {section.items.map((item) => {
                    const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                    const Icon = getAdminMenuIcon(item.icon);

                    if (item.action === 'logout') {
                      return (
                        <li key={item.labelKey || item.label || 'logout'}>
                          <button type="button" className="ssa-admin-sidebar-link" onClick={handleLogout}>
                            <Icon className="ssa-admin-sidebar-link-icon" aria-hidden />
                            <span className="ssa-admin-sidebar-link-label">{itemLabel}</span>
                          </button>
                        </li>
                      );
                    }

                    if (!item.href) {
                      return null;
                    }

                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn('ssa-admin-sidebar-link', active && 'ssa-admin-sidebar-link--active')}
                        >
                          <Icon className="ssa-admin-sidebar-link-icon" aria-hidden />
                          <span className="ssa-admin-sidebar-link-label">{itemLabel}</span>
                          {active ? <span className="ssa-admin-sidebar-link-dot" aria-hidden /> : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="ssa-admin-sidebar-footer">
          <Link href="/" className="ssa-admin-sidebar-link" onClick={onClose}>
            <Home className="ssa-admin-sidebar-link-icon" aria-hidden />
            <span className="ssa-admin-sidebar-link-label">{t('nav.home')}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
