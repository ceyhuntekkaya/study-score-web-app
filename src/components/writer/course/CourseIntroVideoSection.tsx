'use client';

import { CourseFormData } from './types';

interface CourseIntroVideoSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: CourseFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Course Intro Video Section Component
 * Second accordion section for course intro video
 */
export default function CourseIntroVideoSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
}: CourseIntroVideoSectionProps) {
  return (
    <div className="accordion-item card">
      <h2 className="accordion-header card-header" id="accTwo">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="accCollapseTwo"
        >
          Course Intro Video
        </button>
      </h2>
      <div
        id="accCollapseTwo"
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        aria-labelledby="accTwo"
        data-bs-parent="#tutionaccordionExamplea1"
      >
        <div className="accordion-body card-body rbt-course-field-wrapper rbt-default-form">
          <div className="course-field mb--20">
            <div className="rbt-modern-select bg-transparent height-45 mb--10">
              <select
                className="w-100"
                id="field-5"
                name="videoSource"
                value={formData.videoSource}
                onChange={onInputChange}
              >
                <option value="" disabled>Select Video Sources</option>
                <option value="youtube">Youtube</option>
                <option value="vimeo">Vimeo</option>
                <option value="local">Local</option>
              </select>
            </div>
          </div>

          <div className="course-field mb--15">
            <label htmlFor="videoUrl">Add Your Video URL</label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="text"
              placeholder="Add Your Video URL here."
              value={formData.videoUrl}
              onChange={onInputChange}
            />
            <small className="d-block mt_dec--5">
              Example: <a href="https://www.youtube.com/watch?v=yourvideoid">https://www.youtube.com/watch?v=yourvideoid</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

