'use client';

import { useGetDashboard } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';

// Type definition for ReviewFromTeacher
type ReviewFromTeacher = {
  id?: string | number;
  reviewTitle?: string;
  review?: string;
  aim?: string;
  createdAt?: string;
  teacherName?: string;
};

/**
 * Learner Reviews From Teacher Page
 * Displays feedback and reviews from teachers
 */
export default function ReviewsPage() {
  const { data, isLoading, error } = useGetDashboard();

  const reviewsFromTeacher = (Array.isArray(data?.reviewsFromTeacher) ? data.reviewsFromTeacher : []) as ReviewFromTeacher[];

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Reviews From Teacher</h4>
        </div>
        <div className="text-center p--40">
          <p>Loading reviews...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Reviews From Teacher</h4>
        </div>
        <div className="text-center p--40">
          <p className="text-danger">Error loading reviews. Please try again later.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Reviews From Teacher</h4>
      </div>

      {reviewsFromTeacher.length > 0 ? (
        <div className="row g-5">
          {reviewsFromTeacher.map((review) => (
            <div key={review.id} className="col-lg-12">
              <div className="rbt-card variation-01 rbt-hover">
                <div className="rbt-card-body p--30">
                  {/* Header Section */}
                  <div className="d-flex justify-content-between align-items-start mb--20">
                    <div className="flex-grow-1">
                      <h5 className="rbt-card-title mb--10">
                        {review.reviewTitle || 'Teacher Feedback'}
                      </h5>
                      {review.teacherName && (
                        <p className="rbt-title-style-2 mb--5" style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                          <i className="feather-user me-2"></i>
                          {review.teacherName}
                        </p>
                      )}
                      {review.createdAt && (
                        <p className="rbt-title-style-2" style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                          <i className="feather-calendar me-2"></i>
                          {formatDate(review.createdAt)}
                        </p>
                      )}
                    </div>
                    {review.aim && (
                      <div className="ms-3">
                        <span className="rbt-badge variation-02 bg-primary-opacity color-primary">
                          {review.aim}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  {review.review && (
                    <div className="rbt-card-text">
                      <div 
                        className="review-content" 
                        style={{ 
                          lineHeight: '1.8',
                          color: 'var(--color-body)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {review.review}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p--40">
          <p>No reviews from teachers yet. You will see feedback and reviews here when your teachers provide them.</p>
        </div>
      )}
    </>
  );
}

