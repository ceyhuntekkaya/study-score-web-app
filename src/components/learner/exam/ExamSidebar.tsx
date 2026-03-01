'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useExam } from '@/contexts/ExamContext';
import { useTranslation } from '@/i18n';

/**
 * Exam section sidebar – same visual style as LearnerDashboardSidebar.
 * Used only in /learner/exam (not on take page).
 */
export default function ExamSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { examProgress } = useExam();

  const isActive = (href: string) => {
    if (href === '/learner/exam') {
      return pathname === href || pathname === '/learner/exam/';
    }
    return pathname?.startsWith(href);
  };

  const examNavItems = [
    { href: '/learner/exam', labelKey: 'exam.currentExam', icon: 'feather-file-text' },
    { href: '/learner/exam/schedule', labelKey: 'exam.schedule', icon: 'feather-calendar' },
    { href: '/learner/exam/results', labelKey: 'exam.results', icon: 'feather-bar-chart-2' },
    { href: '/learner/exam/archive', labelKey: 'exam.archive', icon: 'feather-archive' },
  ];

  const quickLinks = [
    { href: '/learner/dashboard', labelKey: 'menu.dashboard', icon: 'feather-home' },
    { href: '/learner/quiz', labelKey: 'menu.myQuizAttempts', icon: 'feather-help-circle' },
    { href: '/learner/content', labelKey: 'menu.content', icon: 'feather-book-open' },
  ];

  return (
    <div className="col-lg-3">
      <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
        <div className="inner">
          <div className="content-item-content">
            <div className="rbt-default-sidebar-wrapper">
              {/* Welcome + Progress */}
              <div className="section-title mb--20">
                <h6 className="rbt-title-style-2">{t('exam.examCenter')}</h6>
                <div className="mt--10 p--15 bg-secondary-opacity radius-round">
                  <span className="rbt-title-style-2" style={{ fontSize: '13px' }}>
                    {t('exam.progress')}: {examProgress}%
                  </span>
                </div>
              </div>

              {/* Exam nav */}
              <div className="section-title mt--40 mb--20">
                <h6 className="rbt-title-style-2">{t('menu.exams')}</h6>
              </div>
              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                  {examNavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={isActive(item.href) ? 'active' : ''}
                      >
                        {item.icon && <i className={item.icon}></i>}
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Quick links */}
              <div className="section-title mt--40 mb--20">
                <h6 className="rbt-title-style-2">{t('exam.quickLinks')}</h6>
              </div>
              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        {item.icon && <i className={item.icon}></i>}
                        <span>{t(item.labelKey)}</span>
                      </Link>
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
