'use client';

import { useState } from 'react';

interface CourseOverviewSectionProps {
  description: string;
  learningPoints: string[];
  extendedDescription?: string;
}

/**
 * Course Overview Section Component
 * Converted from template
 */
export default function CourseOverviewSection({
  description,
  learningPoints,
  extendedDescription,
}: CourseOverviewSectionProps) {
  const [showMore, setShowMore] = useState(false);

  // Split learning points into two columns
  const midPoint = Math.ceil(learningPoints.length / 2);
  const leftColumn = learningPoints.slice(0, midPoint);
  const rightColumn = learningPoints.slice(midPoint);

  return (
    <div className="rbt-course-feature-box overview-wrapper rbt-shadow-box mt--30 has-show-more" id="overview">
      <div className={`rbt-course-feature-inner has-show-more-inner-content ${showMore ? '' : 'collapsed'}`}>
        <div className="section-title">
          <h4 className="rbt-title-style-3">What you'll learn</h4>
        </div>
        <p>{description}</p>

        <div className="row g-5 mb--30">
          <div className="col-lg-6">
            <ul className="rbt-list-style-1">
              {leftColumn.map((point, index) => (
                <li key={index}>
                  <i className="feather-check"></i>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-6">
            <ul className="rbt-list-style-1">
              {rightColumn.map((point, index) => (
                <li key={index}>
                  <i className="feather-check"></i>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {extendedDescription && showMore && <p>{extendedDescription}</p>}
      </div>
      {extendedDescription && (
        <div className="rbt-show-more-btn" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Show Less' : 'Show More'}
        </div>
      )}
    </div>
  );
}

