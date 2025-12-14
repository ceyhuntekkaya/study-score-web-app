'use client';

import Link from 'next/link';
import { ActiveExamInfo } from '@/generated/api/openAPIDefinition.schemas';

interface ActiveExamCardProps {
  exam: ActiveExamInfo;
}

/**
 * Active Exam Card Component
 * Displays exam information with attempt stats
 * Similar design to ActiveCourseCard but with different border color
 */
export default function ActiveExamCard({ exam }: ActiveExamCardProps) {
  const {
    examId,
    examName,
    examType,
    attemptCount = 0,
    maxAttempts,
    hasAttemptsLeft,
    bestScore,
    lastAttemptDate,
    accessEndDate,
    daysRemaining,
  } = exam;

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

  // Build exam link
  const getExamLink = () => {
    if (!examId) return '#';
    return `/learner/exam/${examId}`;
  };

  // Calculate attempt progress
  const getAttemptProgress = () => {
    if (!maxAttempts) return 0;
    return Math.min((attemptCount / maxAttempts) * 100, 100);
  };

  return (
    <div className="col-12 mb--20">
      <div className="rbt-card variation-01 rbt-hover rbt-border-dashed" style={{ borderColor: 'var(--color-secondary)' }}>
        <div className="row g-3">
          {/* Icon Section - 1/3 of card */}
          <div className="col-md-4">
            <div className="rbt-card-img h-100 d-flex align-items-center justify-content-center bg-secondary-opacity" style={{ minHeight: '200px' }}>
              <i className="feather-file-text" style={{ fontSize: '64px', color: 'var(--color-secondary)' }}></i>
            </div>
          </div>

          {/* Content Section - 2/3 of card */}
          <div className="col-md-8">
            <div className="rbt-card-body p--30">
              {/* Exam Type Label */}
              {examType && (
                <div className="mb--10">
                  <span className="rbt-badge variation-02 bg-secondary-opacity color-secondary">
                    {examType}
                  </span>
                </div>
              )}

              {/* Exam Name */}
              <h4 className="rbt-card-title mb--15">
                {examName || 'Untitled Exam'}
              </h4>

              {/* Attempt Progress Bar */}
              <div className="rbt-progress-style-1 mb--15">
                <div className="single-progress">
                  <div className="progress position-relative" style={{ height: '12px' }}>
                    <div
                      className="progress-bar wow fadeInLeft bar-color-secondary"
                      role="progressbar"
                      style={{ width: `${getAttemptProgress()}%`, height: '12px' }}
                      aria-valuenow={getAttemptProgress()}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <span className="rbt-title-style-2 progress-number position-absolute end-0" style={{ fontSize: '11px', top: '50%', transform: 'translateY(-50%)', paddingRight: '8px', color: 'var(--color-body)' }}>
                      {attemptCount}/{maxAttempts || '∞'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Best Score */}
              {bestScore !== undefined && (
                <div className="mb--15">
                  <p className="rbt-title-style-2 mb--5" style={{ fontSize: '14px', color: 'var(--color-body)' }}>
                    <i className="feather-award me-2"></i>
                    Best Score: {bestScore}%
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
                    <i className="feather-check-circle me-1"></i>
                    Attempts: {attemptCount}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="rbt-title-style-2" style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                    <i className="feather-calendar me-1"></i>
                    Last: {formatDate(lastAttemptDate)}
                  </div>
                </div>
              </div>

              {/* Attempt Button */}
              <div className="rbt-card-bottom">
                <Link
                  href={getExamLink()}
                  className={`rbt-btn btn-sm w-100 text-center ${
                    hasAttemptsLeft !== false ? 'bg-secondary-opacity' : 'bg-gray-opacity'
                  }`}
                  style={hasAttemptsLeft === false ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  <i className="feather-play-circle me-2"></i>
                  {hasAttemptsLeft !== false ? 'Take Exam' : 'No Attempts Left'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
