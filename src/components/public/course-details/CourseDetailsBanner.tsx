'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CourseDetailsBannerProps {
  title: string;
  description: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  author: {
    name: string;
    avatar: string;
    profileLink: string;
  };
  category: string;
  lastUpdated?: string;
  language?: string;
  isCertified?: boolean;
  isBestseller?: boolean;
  breadcrumbItems?: { label: string; href: string }[];
}

/**
 * Course Details Banner Component
 * Converted from template
 */
export default function CourseDetailsBanner({
  title,
  description,
  rating,
  totalRatings,
  totalStudents,
  author,
  category,
  lastUpdated = '12/2024',
  language = 'English',
  isCertified = true,
  isBestseller = true,
  breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: category, href: '/courses' },
  ],
}: CourseDetailsBannerProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <a key={i} href="#">
        <i className={`fa fa-star ${i < Math.floor(rating) ? '' : 'text-muted'}`}></i>
      </a>
    ));
  };

  return (
    <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
      <div className="breadcrumb-inner breadcrumb-dark">
        <Image
          src="/assets/images/bg/bg-image-10.jpg"
          alt="Study Score"
          width={1920}
          height={400}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="content text-start">
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
              <h2 className="title">{title}</h2>
              <p className="description">{description}</p>

              <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                {isBestseller && (
                  <div className="feature-sin best-seller-badge">
                    <span className="rbt-badge-2">
                      <span className="image">
                        <Image
                          src="/assets/images/icons/card-icon-1.png"
                          alt="Best Seller Icon"
                          width={20}
                          height={20}
                        />
                      </span>{' '}
                      Bestseller
                    </span>
                  </div>
                )}

                <div className="feature-sin rating">
                  <a href="#">{rating}</a>
                  {renderStars(rating)}
                </div>

                <div className="feature-sin total-rating">
                  <a className="rbt-badge-4" href="#">
                    {totalRatings.toLocaleString()} rating
                  </a>
                </div>

                <div className="feature-sin total-student">
                  <span>{totalStudents.toLocaleString()} students</span>
                </div>
              </div>

              <div className="rbt-author-meta mb--20">
                <div className="rbt-avater">
                  <Link href={author.profileLink}>
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={40}
                      height={40}
                    />
                  </Link>
                </div>
                <div className="rbt-author-info">
                  By <Link href={author.profileLink}>{author.name}</Link> In{' '}
                  <Link href="#">{category}</Link>
                </div>
              </div>

              <ul className="rbt-meta">
                <li>
                  <i className="feather-calendar"></i>Last updated {lastUpdated}
                </li>
                <li>
                  <i className="feather-globe"></i>{language}
                </li>
                {isCertified && (
                  <li>
                    <i className="feather-award"></i>Certified Course
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

