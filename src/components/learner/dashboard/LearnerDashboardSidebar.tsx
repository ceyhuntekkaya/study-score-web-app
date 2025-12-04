'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  onClick?: () => void;
}

/**
 * Learner Dashboard Sidebar Component
 * Converted from template
 */
export default function LearnerDashboardSidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuth();
  const router = useRouter();

  const mainMenuItems: MenuItem[] = [
    { icon: 'feather-home', label: 'Dashboard', href: '/learner/dashboard' },
    { icon: 'feather-user', label: 'My Profile', href: '/learner/dashboard/profile' },
    { icon: 'feather-book-open', label: 'Enrolled Courses', href: '/learner/dashboard/courses' },
    { icon: 'feather-bookmark', label: 'Wishlist', href: '/learner/dashboard/wishlist' },
    { icon: 'feather-star', label: 'Reviews', href: '/learner/dashboard/reviews' },
    { icon: 'feather-help-circle', label: 'My Quiz Attempts', href: '/learner/dashboard/quiz-attempts' },
    { icon: 'feather-shopping-bag', label: 'Order History', href: '/learner/dashboard/orders' },
  ];

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const userMenuItems: MenuItem[] = [
    { icon: 'feather-settings', label: 'Settings', href: '/learner/dashboard/settings' },
    { icon: 'feather-log-out', label: 'Logout', href: '#', onClick: handleLogout },
  ];

  const isActive = (href: string) => {
    if (href === '/learner/dashboard') {
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
              <div className="section-title mb--20">
                <h6 className="rbt-title-style-2">Welcome, {user?.name || 'User'}</h6>
              </div>
              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                  {mainMenuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={isActive(item.href) ? 'active' : ''}
                      >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="section-title mt--40 mb--20">
                <h6 className="rbt-title-style-2">User</h6>
              </div>

              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                  {userMenuItems.map((item) => (
                    <li key={item.href}>
                      {item.onClick ? (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            item.onClick?.();
                          }}
                          className={isActive(item.href) ? 'active' : ''}
                        >
                          <i className={item.icon}></i>
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={isActive(item.href) ? 'active' : ''}
                        >
                          <i className={item.icon}></i>
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

