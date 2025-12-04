'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CourseCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  author: {
    name: string;
    avatar: string;
    profileLink: string;
  };
  category: string;
  currentPrice: string;
  oldPrice?: string;
  discount?: string;
  showAddToCart?: boolean;
  viewMode?: 'grid' | 'list';
}

/**
 * Course Card Component
 * Converted from template
 */
export default function CourseCard({
  image,
  title,
  description,
  lessons,
  students,
  rating,
  reviews,
  author,
  category,
  currentPrice,
  oldPrice,
  discount,
  showAddToCart = false,
  viewMode = 'grid',
}: CourseCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? '' : 'text-muted'}`}></i>
    ));
  };

  return (
    <div className={viewMode === 'grid' ? 'course-grid-3' : 'course-list-item'}>
      <div className="rbt-card variation-01 rbt-hover">
        <div className="rbt-card-img">
          <Link href="/course-details">
            <Image
              src={image}
              alt={title}
              width={400}
              height={250}
              style={{ objectFit: 'cover' }}
            />
            {discount && (
              <div className="rbt-badge-3 bg-white">
                <span>{discount}</span>
                <span>Off</span>
              </div>
            )}
          </Link>
        </div>
        <div className="rbt-card-body">
          <div className="rbt-card-top">
            <div className="rbt-review">
              <div className="rating">{renderStars(rating)}</div>
              <span className="rating-count"> ({reviews} Reviews)</span>
            </div>
            <div className="rbt-bookmark-btn">
              <a className="rbt-round-btn" title="Bookmark" href="#">
                <i className="feather-bookmark"></i>
              </a>
            </div>
          </div>

          <h4 className="rbt-card-title">
            <Link href="/course-details">{title}</Link>
          </h4>

          <ul className="rbt-meta">
            <li>
              <i className="feather-book"></i>
              {lessons} Lessons
            </li>
            <li>
              <i className="feather-users"></i>
              {students} Students
            </li>
          </ul>

          <p className="rbt-card-text">{description}</p>

          <div className="rbt-author-meta mb--10">
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

          <div className="rbt-card-bottom">
            <div className="rbt-price">
              <span className="current-price">{currentPrice}</span>
              {oldPrice && <span className="off-price">{oldPrice}</span>}
            </div>
            {showAddToCart ? (
              <Link className="rbt-btn-link left-icon" href="/course-details">
                <i className="feather-shopping-cart"></i> Add To Cart
              </Link>
            ) : (
              <Link className="rbt-btn-link" href="/course-details">
                Learn More<i className="feather-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

