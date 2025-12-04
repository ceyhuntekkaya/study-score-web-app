'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * Tutor Reviews Page
 */
export default function TutorReviewsPage() {
  const reviews = [
    {
      id: 1,
      courseTitle: 'React Front To Back',
      courseImage: '/assets/images/course/course-online-01.jpg',
      rating: 5,
      comment: 'Great course! Very comprehensive and well-structured.',
      date: 'March 15, 2025',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? '' : 'empty'}`}></i>
    ));
  };

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Reviews</h4>
      </div>

      <div className="row g-5">
        {reviews.map((review) => (
          <div key={review.id} className="col-lg-12">
            <div className="rbt-card variation-01 rbt-hover">
              <div className="rbt-card-body">
                <div className="row align-items-center">
                  <div className="col-lg-3 col-md-4">
                    <div className="rbt-card-img">
                      <Link href="/courses/course-details">
                        <Image
                          src={review.courseImage}
                          alt={review.courseTitle}
                          width={200}
                          height={150}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-8">
                    <h5 className="rbt-card-title">
                      <Link href="/courses/course-details">{review.courseTitle}</Link>
                    </h5>
                    <div className="rbt-review mb--10">
                      <div className="rating">
                        {renderStars(review.rating)}
                      </div>
                      <span className="rating-count"> {review.date}</span>
                    </div>
                    <p className="rbt-card-text">{review.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

