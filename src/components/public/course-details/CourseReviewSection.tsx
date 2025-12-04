'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Review {
  id: string;
  author: {
    name: string;
    avatar: string;
    profileLink: string;
  };
  rating: number;
  comment: string;
  helpful?: number;
  notHelpful?: number;
}

interface CourseReviewSectionProps {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    stars: number;
    percentage: number;
  }[];
  featuredReviews: Review[];
}

/**
 * Course Review Section Component
 * Converted from template
 */
export default function CourseReviewSection({
  averageRating,
  totalRatings,
  ratingBreakdown,
  featuredReviews,
}: CourseReviewSectionProps) {
  const [showMore, setShowMore] = useState(false);

  const renderStars = (rating: number, filled: boolean = true) => {
    return Array.from({ length: 5 }).map((_, i) => {
      if (filled) {
        return (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        );
      } else {
        return (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
          </svg>
        );
      }
    });
  };

  return (
    <div className="rbt-review-wrapper rbt-shadow-box review-wrapper mt--30" id="review">
      <div className="course-content">
        <div className="section-title">
          <h4 className="rbt-title-style-3">Review</h4>
        </div>
        <div className="row g-5 align-items-center">
          <div className="col-lg-3">
            <div className="rating-box">
              <div className="rating-number">{averageRating.toFixed(1)}</div>
              <div className="rating">{renderStars(Math.floor(averageRating))}</div>
              <span className="sub-title">Course Rating</span>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="review-wrapper">
              {ratingBreakdown.map((breakdown, index) => {
                const stars = 5 - index;
                const filledStars = Math.min(stars, Math.floor(averageRating));
                return (
                  <div key={index} className="single-progress-bar">
                    <div className="rating-text">{renderStars(stars, true)}</div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${breakdown.percentage}%` }}
                        aria-valuenow={breakdown.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <span className="value-text">{breakdown.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Reviews */}
      <div className="about-author-list rbt-shadow-box featured-wrapper mt--30 has-show-more">
        <div className="section-title">
          <h4 className="rbt-title-style-3">Featured review</h4>
        </div>
        <div className={`has-show-more-inner-content rbt-featured-review-list-wrapper ${showMore ? '' : 'collapsed'}`}>
          {featuredReviews.map((review) => (
            <div key={review.id} className="rbt-course-review about-author">
              <div className="media">
                <div className="thumbnail">
                  <Link href={review.author.profileLink}>
                    <Image
                      src={review.author.avatar}
                      alt={review.author.name}
                      width={60}
                      height={60}
                    />
                  </Link>
                </div>
                <div className="media-body">
                  <div className="author-info">
                    <h5 className="title">
                      <Link className="hover-flip-item-wrapper" href={review.author.profileLink}>
                        {review.author.name}
                      </Link>
                    </h5>
                    <div className="rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <a key={i} href="#">
                          <i className={`fa fa-star ${i < review.rating ? '' : 'text-muted'}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="content">
                    <p className="description">{review.comment}</p>
                    <ul className="social-icon social-default transparent-with-border justify-content-start">
                      <li>
                        <a href="#">
                          <i className="feather-thumbs-up"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="feather-thumbs-down"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {featuredReviews.length > 2 && (
          <div className="rbt-show-more-btn" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Show More'}
          </div>
        )}
      </div>
    </div>
  );
}

