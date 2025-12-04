'use client';

import { CourseFormData } from './types';

interface AdditionalInformationSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: CourseFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Additional Information Section Component
 * Fourth accordion section with start date, language, requirements, description, duration, tags, and targeted audience
 */
export default function AdditionalInformationSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
}: AdditionalInformationSectionProps) {
  return (
    <div className="accordion-item card rbt-course-field-wrapper">
      <h2 className="accordion-header card-header" id="accSix">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="accCollapseSix"
        >
          Additional Information
        </button>
      </h2>
      <div
        id="accCollapseSix"
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        aria-labelledby="accSix"
        data-bs-parent="#tutionaccordionExamplea1"
      >
        <div className="accordion-body card-body rbt-course-field-wrapper rbt-default-form row row-15">
          <div className="col-lg-6">
            <div className="course-field mb--15">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="course-field mb--15">
              <label htmlFor="language">Language</label>
              <div className="rbt-modern-select bg-transparent height-50 mb--10">
                <select
                  className="w-100"
                  multiple
                  data-live-search="true"
                  title="English"
                  data-size="7"
                  data-actions-box="true"
                  data-selected-text-format="count > 2"
                  id="language"
                  value={formData.language}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    const syntheticEvent = {
                      target: { name: 'language', value: selected },
                    } as unknown as React.ChangeEvent<HTMLSelectElement>;
                    onInputChange(syntheticEvent);
                  }}
                >
                  <option value="English">English</option>
                  <option value="Bangla">Bangla</option>
                  <option value="Japan">Japan</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Frence">Frence</option>
                  <option value="Garmani">Garmani</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="course-field mb--15">
              <label htmlFor="whatLearn">Requirements</label>
              <textarea
                id="whatLearn"
                name="requirements"
                rows={5}
                placeholder="Add your course benefits here."
                value={formData.requirements}
                onChange={onInputChange}
              ></textarea>
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> Enter for per line.
              </small>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="course-field mb--15">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Add your course benefits here."
                value={formData.description}
                onChange={onInputChange}
              ></textarea>
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> Enter for per line.
              </small>
            </div>
          </div>

          <div className="col-lg-12">
            <hr className="mt--10 mb--20" />
          </div>

          <div className="col-lg-12">
            <div className="course-field mb--15">
              <label>Total Course Duration</label>
              <div className="row row--15">
                <div className="col-lg-6">
                  <input
                    type="number"
                    name="courseDurationHours"
                    placeholder="00"
                    value={formData.courseDurationHours}
                    onChange={onInputChange}
                  />
                  <small className="d-block mt_dec--5">
                    <i className="feather-info"></i> Hour.
                  </small>
                </div>
                <div className="col-lg-6">
                  <input
                    type="number"
                    name="courseDurationMinutes"
                    placeholder="00"
                    value={formData.courseDurationMinutes}
                    onChange={onInputChange}
                  />
                  <small className="d-block mt_dec--5">
                    <i className="feather-info"></i> Minute.
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <hr className="mt--10 mb--20" />
          </div>

          <div className="col-lg-12">
            <div className="course-field mb--15">
              <label htmlFor="courseTag">Course Tags</label>
              <textarea
                id="courseTag"
                name="courseTags"
                rows={5}
                placeholder="Add your course tag here."
                value={formData.courseTags}
                onChange={onInputChange}
              ></textarea>
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> Maximum of 15 keywords covering features, usage, and styling. Keywords should all be in lowercase and separated by commas. e.g. photography, gallery, modern, jquery, wordpress theme.
              </small>
            </div>
          </div>

          <div className="col-lg-12">
            <hr className="mt--10 mb--20" />
          </div>

          <div className="col-lg-12">
            <div className="course-field mb--15">
              <label htmlFor="targeted">Targeted Audience</label>
              <textarea
                id="targeted"
                name="targetedAudience"
                rows={5}
                placeholder="Add your course tag here."
                value={formData.targetedAudience}
                onChange={onInputChange}
              ></textarea>
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> Specify the target audience that will benefit the most from the course.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

