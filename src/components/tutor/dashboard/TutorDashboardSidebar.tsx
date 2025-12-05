'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getSidebarMenu } from '@/lib/menus';
import { useTranslation } from '@/i18n';

/**
 * Tutor Dashboard Sidebar Component
 * Converted from instructor-dashboard.html template
 */
export default function TutorDashboardSidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const menu = getSidebarMenu('tutor');

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/tutor/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="col-lg-3">
      <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
        <div className="inner">
          <div className="content-item-content">
            <div className="rbt-default-sidebar-wrapper">
              {menu.sections.map((section, sectionIndex) => {
                const sectionTitle = section.titleKey ? t(section.titleKey) : (section.title || '');
                return (
                  <div key={sectionTitle}>
                    {sectionIndex === 0 ? (
                      <div className="section-title mb--20">
                        <h6 className="rbt-title-style-2">{t('common.welcome')}, {user?.name || 'User'}</h6>
                      </div>
                    ) : (
                      <div className="section-title mt--40 mb--20">
                        <h6 className="rbt-title-style-2">{sectionTitle}</h6>
                      </div>
                    )}
                    <nav className="mainmenu-nav">
                      <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                        {section.items.map((item) => {
                          const itemLabel = item.labelKey ? t(item.labelKey) : (item.label || '');
                          return (
                            <li key={item.href}>
                              {item.action === 'logout' ? (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                  }}
                                  className={isActive(item.href) ? 'active' : ''}
                                >
                                  {item.icon && <i className={item.icon}></i>}
                                  <span>{itemLabel}</span>
                                </a>
                              ) : (
                                <Link
                                  href={item.href}
                                  className={isActive(item.href) ? 'active' : ''}
                                >
                                  {item.icon && <i className={item.icon}></i>}
                                  <span>{itemLabel}</span>
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

