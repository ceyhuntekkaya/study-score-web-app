'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ModalPanel from '@/components/ui/ModalPanel';
import CourseReportDemo from '@/components/learner/course-report';

// Type definition for ActiveCourseInfo (temporary until generated types are available)
type ActiveCourseInfo = {
  courseId?: string | number;
  courseName?: string;
  imageUrl?: string;
  category?: string;
  progressPercentage?: number;
  completedParts?: number;
  totalParts?: number;
  nextContent?: { partId?: string | number; partName?: string };
  accessEndDate?: string;
  daysRemaining?: number;
  thisWeekTimeSpentSeconds?: number;
  thisWeekAccessCount?: number;
};

interface ActiveCourseCardProps {
  course: ActiveCourseInfo;
}

/**
 * Active Course Card Component
 * Displays course information with progress and stats
 */
export default function ActiveCourseCard({ course }: ActiveCourseCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);

  const {
    courseId,
    courseName,
    imageUrl,
    category,
    progressPercentage: backendProgressPercentage = 0,
    completedParts = 0,
    totalParts = 0,
    nextContent,
    accessEndDate,
    daysRemaining,
    thisWeekTimeSpentSeconds = 0,
    thisWeekAccessCount = 0,
  } = course;

  // Calculate progress percentage from completedParts/totalParts if available
  // This ensures consistency between the displayed fraction and the progress bar
  const calculatedProgressPercentage = totalParts > 0 
    ? (completedParts / totalParts) * 100 
    : backendProgressPercentage;

  // Use calculated percentage if it's more accurate, otherwise use backend value
  const progressPercentage = totalParts > 0 && completedParts >= 0 
    ? calculatedProgressPercentage 
    : backendProgressPercentage;

  // Format time in seconds to readable format
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Build study link
  const getStudyLink = () => {
    if (!courseId) return '#';
    if (nextContent?.partId) {
      return `/learner/content/${courseId}/${nextContent.partId}`;
    }
    return `/learner/content/${courseId}`;
  };

  return (
    <div className="col-12 mb--20">
      <div className="rbt-card variation-01 rbt-hover rbt-border-dashed">
        <div className="row g-3">
          {/* Image Section - 1/3 of card */}
          <div className="col-md-4">
            <div className="rbt-card-img h-100" style={{ minHeight: '200px' }}>
              {imageUrl ? (
                <Image
                  src={"/assets/"+imageUrl}
                  alt={courseName || 'Course'}
                  width={400}
                  height={300}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-opacity"
                  style={{ minHeight: '200px' }}
                >
                  <i className="feather-book" style={{ fontSize: '48px', color: 'var(--color-primary)' }}></i>
                </div>
              )}
            </div>
          </div>

          {/* Content Section - 2/3 of card */}
          <div className="col-md-8">
            <div className="rbt-card-body p--30">
              {/* Category Label */}
              {category && (
                <div className="mb--10 d-flex align-items-center gap-2">
                  <span className="rbt-badge variation-02 bg-primary-opacity color-primary">
                    {category}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setShowReportModal(true)}
                    style={{ fontSize: '12px', padding: '4px 12px' }}
                    title="View Progress Report"
                  >
                    <i className="feather-bar-chart-2 me-1"></i>
                    Report
                  </button>
                </div>
              )}

              {/* Course Name */}
              <h4 className="rbt-card-title mb--15">
                {courseName || 'Untitled Course'}
              </h4>

              {/* Progress Bar */}
              <div className="rbt-progress-style-1 mb--15">
                <div className="single-progress">
                  <div className="progress position-relative" style={{ height: '12px' }}>
                    <div
                      className="progress-bar wow fadeInLeft bar-color-success"
                      role="progressbar"
                      style={{ width: `${progressPercentage}%`, height: '12px' }}
                      aria-valuenow={progressPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <span className="rbt-title-style-2 progress-number position-absolute end-0" style={{ fontSize: '11px', top: '50%', transform: 'translateY(-50%)', paddingRight: '8px', color: 'var(--color-body)' }}>
                      {completedParts}/{totalParts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Content */}
              {nextContent?.partName && (
                <div className="mb--15">
                  <p className="rbt-title-style-2 mb--5" style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                    <i className="feather-arrow-right me-2"></i>
                    Next: {nextContent.partName}
                  </p>
                </div>
              )}

              {/* Stats Row */}
              <div className="row g-3 mb--15">
                <div className="col-6 col-md-3">
                  <div className="rbt-title-style-2" style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                    <i className="feather-calendar me-1"></i>
                    End: {formatDate(accessEndDate)}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="rbt-title-style-2" style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                    <i className="feather-clock me-1"></i>
                    {daysRemaining !== undefined ? `${daysRemaining} days left` : 'N/A'}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="rbt-title-style-2" style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                    <i className="feather-play-circle me-1"></i>
                    This week: {formatTime(thisWeekTimeSpentSeconds)}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="rbt-title-style-2" style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                    <i className="feather-activity me-1"></i>
                    Accesses: {thisWeekAccessCount}
                  </div>
                </div>
              </div>

              {/* Study Button */}
              <div className="rbt-card-bottom">
                <Link
                  href={getStudyLink()}
                  className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                >
                  <i className="feather-book-open me-2"></i>
                  Study
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ModalPanel
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Course Progress Report"
        size="large"
      >
        <CourseReportDemo />
      </ModalPanel>
    </div>
  );
}
