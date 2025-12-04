'use client';

interface CourseDetailsInfoSectionProps {
  requirements: string[];
  description: string[];
}

/**
 * Course Details Info Section Component
 * Converted from template
 */
export default function CourseDetailsInfoSection({
  requirements,
  description,
}: CourseDetailsInfoSectionProps) {
  return (
    <div className="rbt-course-feature-box rbt-shadow-box details-wrapper mt--30" id="details">
      <div className="row g-5">
        <div className="col-lg-6">
          <div className="section-title">
            <h4 className="rbt-title-style-3 mb--20">Requirements</h4>
          </div>
          <ul className="rbt-list-style-1">
            {requirements.map((req, index) => (
              <li key={index}>
                <i className="feather-check"></i>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-6">
          <div className="section-title">
            <h4 className="rbt-title-style-3 mb--20">Description</h4>
          </div>
          <ul className="rbt-list-style-1">
            {description.map((desc, index) => (
              <li key={index}>
                <i className="feather-check"></i>
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

