'use client';

import Link from 'next/link';

interface CourseBannerSectionProps {
  title?: string;
  description?: string;
  courseCount?: number;
  breadcrumbItems?: { label: string; href: string }[];
}

/**
 * Course Banner Section Component
 * Converted from template
 */
export default function CourseBannerSection({
  title = 'All Courses',
  description = 'Courses that help beginner designers become true unicorns.',
  courseCount = 50,
  breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'All Courses', href: '/courses' },
  ],
}: CourseBannerSectionProps) {
  return (
    <div className="rbt-page-banner-wrapper">
      {/* Banner BG Image */}
      <div className="rbt-banner-image"></div>
      
      <div className="rbt-banner-content">
        {/* Banner Content Top */}
        <div className="rbt-banner-content-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {/* Breadcrumb Area */}
                <ul className="page-list">
                  {breadcrumbItems.map((item, index) => (
                    <li key={index} className={index === breadcrumbItems.length - 1 ? 'rbt-breadcrumb-item active' : 'rbt-breadcrumb-item'}>
                      {index < breadcrumbItems.length - 1 ? (
                        <>
                          <Link href={item.href}>{item.label}</Link>
                          <div className="icon-right"><i className="feather-chevron-right"></i></div>
                        </>
                      ) : (
                        item.label
                      )}
                    </li>
                  ))}
                </ul>

                <div className="title-wrapper">
                  <h1 className="title mb--0">{title}</h1>
                  <a href="#" className="rbt-badge-2">
                    <div className="image">🎉</div> {courseCount} Courses
                  </a>
                </div>

                <p className="description">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

