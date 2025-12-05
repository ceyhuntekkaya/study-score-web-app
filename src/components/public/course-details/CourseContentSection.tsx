'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  duration?: string;
  type: 'video' | 'text';
  isPreview?: boolean;
  isLocked?: boolean;
}

interface CourseSection {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface CourseContentSectionProps {
  sections: CourseSection[];
}

/**
 * Course Content Section Component
 * Converted from template - uses React state instead of Bootstrap accordion
 */
export default function CourseContentSection({ sections }: CourseContentSectionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([sections[0]?.id]));

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  return (
    <div className="course-content rbt-shadow-box coursecontent-wrapper mt--30" id="coursecontent">
      <div className="rbt-course-feature-inner">
        <div className="section-title">
          <h4 className="rbt-title-style-3">Course Content</h4>
        </div>
        <div className="rbt-accordion-style rbt-accordion-02 accordion">
          <div className="accordion">
            {sections.map((section) => (
              <div key={section.id} className="accordion-item card">
                <h2 className="accordion-header card-header">
                  <button
                    className={`accordion-button ${openSections.has(section.id) ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={openSections.has(section.id)}
                  >
                    {section.title}{' '}
                    <span className="rbt-badge-5 ml--10">{section.duration}</span>
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${openSections.has(section.id) ? 'show' : ''}`}
                  aria-labelledby={`heading-${section.id}`}
                >
                  <div className="accordion-body card-body pr--0">
                    <ul className="rbt-course-main-content liststyle">
                      {section.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link href="/lesson">
                            <div className="course-content-left">
                              <i className={lesson.type === 'video' ? 'feather-play-circle' : 'feather-file-text'}></i>{' '}
                              <span className="text">{lesson.title}</span>
                            </div>
                            <div className="course-content-right">
                              {lesson.isLocked ? (
                                <span className="course-lock">
                                  <i className="feather-lock"></i>
                                </span>
                              ) : (
                                <>
                                  {lesson.duration && (
                                    <span className="min-lable">{lesson.duration}</span>
                                  )}
                                  {lesson.isPreview && (
                                    <span className="rbt-badge variation-03 bg-primary-opacity">
                                      <i className="feather-eye"></i> Preview
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

