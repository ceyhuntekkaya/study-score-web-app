'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CourseFormData } from './types';

interface CourseInfoSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: CourseFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Course Info Section Component
 * First accordion section with course basic info, settings, price, categories, and thumbnail
 */
export default function CourseInfoSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
  onFileChange,
}: CourseInfoSectionProps) {
  const [settingsTab, setSettingsTab] = useState<'general' | 'content'>('general');
  const [priceTab, setPriceTab] = useState<'paid' | 'free'>('paid');

  return (
    <div className="accordion-item card">
      <h2 className="accordion-header card-header" id="accOne">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="accCollapseOne"
        >
          Course Info
        </button>
      </h2>
      <div
        id="accCollapseOne"
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        aria-labelledby="accOne"
        data-bs-parent="#tutionaccordionExamplea1"
      >
        <div className="accordion-body card-body">
          <div className="rbt-course-field-wrapper rbt-default-form">
            <div className="course-field mb--15">
              <label htmlFor="field-1">Course Title</label>
              <input
                id="field-1"
                name="title"
                type="text"
                placeholder="New Course"
                value={formData.title}
                onChange={onInputChange}
              />
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> Title should be 30 character.
              </small>
            </div>

            <div className="course-field mb--15">
              <label htmlFor="field-2">Course Slug</label>
              <input
                id="field-2"
                name="slug"
                type="text"
                placeholder="new-course"
                value={formData.slug}
                onChange={onInputChange}
              />
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> Permalink:{' '}
                <a href={`https://yourdomain.com/${formData.slug || 'new-course'}`}>
                  https://yourdomain.com/{formData.slug || 'new-course'}
                </a>
              </small>
            </div>

            <div className="course-field mb--15">
              <label htmlFor="aboutCourse">About Course</label>
              <textarea
                id="aboutCourse"
                name="aboutCourse"
                rows={10}
                value={formData.aboutCourse}
                onChange={onInputChange}
              ></textarea>
              <small className="d-block mt_dec--5">
                <i className="feather-info"></i> HTML or plain text allowed, no emoji This field is used for search, so please be descriptive!
              </small>
            </div>

            {/* Course Settings */}
            <div className="course-field mb--15 edu-bg-gray">
              <h6>Course Settings</h6>
              <div className="rbt-course-settings-content">
                <div className="row g-5">
                  <div className="col-lg-4">
                    <div className="advance-tab-button advance-tab-button-1">
                      <ul className="rbt-default-tab-button nav nav-tabs" id="courseSetting" role="tablist">
                        <li className="nav-item" role="presentation">
                          <a
                            className={settingsTab === 'general' ? 'active' : ''}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSettingsTab('general');
                            }}
                          >
                            <span>General</span>
                          </a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a
                            className={settingsTab === 'content' ? 'active' : ''}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSettingsTab('content');
                            }}
                          >
                            <span>Content Drip</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="tab-content">
                      {settingsTab === 'general' && (
                        <div className="tab-pane fade advance-tab-content-1 active show" id="general" role="tabpanel">
                          <div className="course-field mb--20">
                            <label htmlFor="field-3">Maximum Students</label>
                            <div className="pro-quantity">
                              <div className="pro-qty m-0">
                                <input
                                  id="field-3"
                                  name="maxStudents"
                                  type="text"
                                  value={formData.maxStudents}
                                  onChange={onInputChange}
                                />
                              </div>
                            </div>
                            <small>
                              <i className="feather-info"></i> Number of students that can enrol in this course. Set 0 for no limits.
                            </small>
                          </div>

                          <div className="course-field mb--20">
                            <label htmlFor="field-4">Difficulty Level</label>
                            <div className="rbt-modern-select bg-transparent height-45 mb--10">
                              <select
                                className="w-100"
                                id="field-4"
                                name="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={onInputChange}
                              >
                                <option>All Levels</option>
                                <option>Intermediate</option>
                                <option>Beginner</option>
                                <option>Advance</option>
                                <option>Expert</option>
                              </select>
                            </div>
                            <small>
                              <i className="feather-info"></i> Course difficulty level
                            </small>
                          </div>

                          <div className="course-field mb--20">
                            <label className="form-check-label d-inline-block" htmlFor="flexSwitchCheckDefault">
                              Public Course
                            </label>
                            <div className="form-check form-switch mb--10">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={onInputChange}
                              />
                            </div>
                            <small>
                              <i className="feather-info"></i> Make This Course Public. No enrollment required.
                            </small>
                          </div>

                          <div className="course-field mb--20">
                            <label className="form-check-label d-inline-block" htmlFor="flexSwitchCheckDefault2">
                              Q&A
                            </label>
                            <div className="form-check form-switch mb--10">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault2"
                                name="enableQA"
                                checked={formData.enableQA}
                                onChange={onInputChange}
                              />
                            </div>
                            <small>
                              <i className="feather-info"></i> Enable Q&A section for your course
                            </small>
                          </div>
                        </div>
                      )}

                      {settingsTab === 'content' && (
                        <div className="tab-pane fade advance-tab-content-1 active show" id="content" role="tabpanel">
                          <div className="rbt-content-drip-content">
                            <div className="course-field pb--20">
                              <p className="rbt-checkbox-wrapper mb--5">
                                <input
                                  id="rbt-checkbox-1"
                                  name="contentDripEnabled"
                                  type="checkbox"
                                  checked={formData.contentDripEnabled}
                                  onChange={onInputChange}
                                />
                                <label htmlFor="rbt-checkbox-1">Enable</label>
                              </p>
                              <small>
                                <i className="feather-info"></i> Enable / Disable content drip
                              </small>
                            </div>
                            <hr className="rbt-separator m-0" />

                            <div className="rbt-course-drip-option pt--20">
                              <h6 className="mb--10">Content Drip Type</h6>
                              <p className="mb--10 b3">
                                You can schedule your course content using the above content drip options.
                              </p>
                              <div className="course-drop-option">
                                <div className="rbt-form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="contentDripType"
                                    id="rbt-radio-1"
                                    value="date"
                                    checked={formData.contentDripType === 'date'}
                                    onChange={onInputChange}
                                  />
                                  <label className="form-check-label" htmlFor="rbt-radio-1">
                                    Schedule course contents by date
                                  </label>
                                </div>
                                <div className="rbt-form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="contentDripType"
                                    id="rbt-radio-2"
                                    value="days"
                                    checked={formData.contentDripType === 'days'}
                                    onChange={onInputChange}
                                  />
                                  <label className="form-check-label" htmlFor="rbt-radio-2">
                                    Content available after X days from enrollment
                                  </label>
                                </div>
                                <div className="rbt-form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="contentDripType"
                                    id="rbt-radio-3"
                                    value="sequential"
                                    checked={formData.contentDripType === 'sequential'}
                                    onChange={onInputChange}
                                  />
                                  <label className="form-check-label" htmlFor="rbt-radio-3">
                                    Course content available sequentially
                                  </label>
                                </div>
                                <div className="rbt-form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="contentDripType"
                                    id="rbt-radio-4"
                                    value="prerequisites"
                                    checked={formData.contentDripType === 'prerequisites'}
                                    onChange={onInputChange}
                                  />
                                  <label className="form-check-label" htmlFor="rbt-radio-4">
                                    Course content unlocked after finishing prerequisites
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Price */}
            <div className="course-field mb--15 edu-bg-gray">
              <h6>Course Price</h6>
              <div className="rbt-course-settings-content">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="advance-tab-button advance-tab-button-1">
                      <ul className="rbt-default-tab-button nav nav-tabs" id="coursePrice" role="tablist">
                        <li className="nav-item w-100" role="presentation">
                          <a
                            className={priceTab === 'paid' ? 'active' : ''}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPriceTab('paid');
                            }}
                          >
                            <span>Paid</span>
                          </a>
                        </li>
                        <li className="nav-item w-100" role="presentation">
                          <a
                            className={priceTab === 'free' ? 'active' : ''}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPriceTab('free');
                            }}
                          >
                            <span>Free</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="tab-content">
                      {priceTab === 'paid' && (
                        <div className="tab-pane fade advance-tab-content-1 active show" id="paid" role="tabpanel">
                          <div className="course-field mb--15">
                            <label htmlFor="regularPrice-1">Regular Price ($)</label>
                            <input
                              id="regularPrice-1"
                              name="regularPrice"
                              type="number"
                              placeholder="$ Regular Price"
                              value={formData.regularPrice}
                              onChange={onInputChange}
                            />
                            <small className="d-block mt_dec--5">
                              <i className="feather-info"></i> The Course Price Includes Your Author Fee.
                            </small>
                          </div>

                          <div className="course-field mb--15">
                            <label htmlFor="discountedPrice-1">Discounted Price ($)</label>
                            <input
                              id="discountedPrice-1"
                              name="discountedPrice"
                              type="number"
                              placeholder="$ Discounted Price"
                              value={formData.discountedPrice}
                              onChange={onInputChange}
                            />
                            <small className="d-block mt_dec--5">
                              <i className="feather-info"></i> The Course Price Includes Your Author Fee.
                            </small>
                          </div>
                        </div>
                      )}

                      {priceTab === 'free' && (
                        <div className="tab-pane fade advance-tab-content-1 active show" id="free" role="tabpanel">
                          <div className="course-field">
                            <p className="b3">This Course is free for everyone.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="course-field mb--20">
              <h6>Choose Categories</h6>
              <div className="rbt-modern-select bg-transparent height-45 w-100 mb--10">
                <select
                  className="w-100"
                  multiple
                  data-live-search="true"
                  title="Search Course Category. ex. Design, Development, Business"
                  data-size="7"
                  data-actions-box="true"
                  data-selected-text-format="count > 2"
                  value={formData.categories}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    const syntheticEvent = {
                      target: { name: 'categories', value: selected },
                    } as unknown as React.ChangeEvent<HTMLSelectElement>;
                    onInputChange(syntheticEvent);
                  }}
                >
                  <option value="Web Developer">Web Developer</option>
                  <option value="App Developer">App Developer</option>
                  <option value="Javascript">Javascript</option>
                  <option value="React">React</option>
                  <option value="WordPress">WordPress</option>
                  <option value="jQuery">jQuery</option>
                  <option value="Vue Js">Vue Js</option>
                  <option value="Angular">Angular</option>
                </select>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="course-field mb--20">
              <h6>Course Thumbnail</h6>
              <div className="rbt-create-course-thumbnail upload-area">
                <div className="upload-area">
                  <div className="brows-file-wrapper" data-black-overlay="9">
                    <input
                      name="createinputfile"
                      id="createinputfile"
                      type="file"
                      className="inputfile"
                      accept="image/*"
                      onChange={onFileChange}
                    />
                    <Image
                      id="createfileImage"
                      src={formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : '/assets/images/others/thumbnail-placeholder.svg'}
                      alt="file image"
                      width={700}
                      height={430}
                      style={{ objectFit: 'cover' }}
                    />
                    <label className="d-flex" htmlFor="createinputfile" title="No File Choosen">
                      <i className="feather-upload"></i>
                      <span className="text-center">Choose a File</span>
                    </label>
                  </div>
                </div>
              </div>
              <small>
                <i className="feather-info"></i> <b>Size:</b> 700x430 pixels, <b>File Support:</b> JPG, JPEG, PNG, GIF, WEBP
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

