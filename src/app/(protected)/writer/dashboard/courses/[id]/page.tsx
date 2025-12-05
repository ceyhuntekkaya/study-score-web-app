'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Topic, Lesson, CourseFormData } from '@/components/writer/course/types';
import CourseInfoSection from '@/components/writer/course/CourseInfoSection';
import CourseIntroVideoSection from '@/components/writer/course/CourseIntroVideoSection';
import CourseBuilderSection from '@/components/writer/course/CourseBuilderSection';
import AdditionalInformationSection from '@/components/writer/course/AdditionalInformationSection';
import CertificateTemplateSection from '@/components/writer/course/CertificateTemplateSection';

/**
 * Writer Create/Edit Course Page
 * Template: create-course.html
 * URL: /writer/dashboard/courses/[id]
 */
export default function WriterCreateCoursePage() {
  const params = useParams();
  const courseId = params?.id as string;
  const isEditMode = courseId && courseId !== 'new';

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['accCollapseOne']));

  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    slug: '',
    aboutCourse: '',
    maxStudents: 100,
    difficultyLevel: 'All Levels',
    isPublic: false,
    enableQA: false,
    contentDripEnabled: false,
    contentDripType: 'date',
    priceType: 'paid',
    regularPrice: '',
    discountedPrice: '',
    categories: [],
    thumbnail: null,
    videoSource: '',
    videoUrl: '',
    startDate: '',
    language: [],
    requirements: '',
    description: '',
    courseDurationHours: '',
    courseDurationMinutes: '',
    courseTags: '',
    targetedAudience: '',
    certificateTemplate: '',
  });

  // Course Builder - Topics
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 'topic-1',
      title: 'Lesson One',
      summary: 'Introduction to the course fundamentals',
      lessons: [
        { id: 'lesson-1', title: 'The Complete Study Score 20246 From Zero to Expert!', summary: 'Course introduction and overview', type: 'video', duration: '30 min', isPreview: true },
        { id: 'lesson-2', title: 'Difficult Things About Education.', summary: 'Understanding educational challenges', type: 'video', duration: '25 min' },
        { id: 'lesson-3', title: 'Five Things You Should Do In Education.', summary: 'Best practices in education', type: 'text' },
        { id: 'lesson-4', title: 'Course Fundamentals Quiz', summary: 'Test your knowledge', type: 'quiz', duration: '15 min' },
      ],
    },
    {
      id: 'topic-2',
      title: 'Lesson two',
      summary: 'Advanced concepts and practical applications',
      lessons: [
        { id: 'lesson-5', title: 'The Complete Study Score 2026: From Zero to Expert!', summary: 'Deep dive into advanced topics', type: 'video', duration: '45 min' },
        { id: 'lesson-6', title: 'Difficult Things About Education.', summary: 'Advanced educational concepts', type: 'video', duration: '35 min' },
        { id: 'lesson-7', title: 'Five Things You Should Do In Education.', summary: 'Practical implementation guide', type: 'text' },
        { id: 'lesson-8', title: 'Final Assignment', summary: 'Complete the final project', type: 'assignment' },
      ],
    },
  ]);

  const toggleAccordion = (accordionId: string) => {
    const newOpen = new Set(openAccordions);
    if (newOpen.has(accordionId)) {
      newOpen.delete(accordionId);
    } else {
      newOpen.add(accordionId);
    }
    setOpenAccordions(newOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'categories' || name === 'language') {
      // Handle multi-select
      const selected = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, thumbnail: e.target.files![0] }));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Course data:', formData, topics);
    // TODO: Implement API call to save course
  };

  return (
    <>
      {/* Create Course Area - No banner, starts directly */}
      <div className="rbt-create-course-area bg-color-white rbt-section-gap">
        <div className="container">
          <div className="row g-5">
            {/* Main Form */}
            <div className="col-lg-8">
              <div className="rbt-accordion-style rbt-accordion-01 rbt-accordion-06 accordion">
                <div className="accordion" id="tutionaccordionExamplea1">
                  {/* Course Info Section */}
                  <CourseInfoSection
                    isOpen={openAccordions.has('accCollapseOne')}
                    onToggle={() => toggleAccordion('accCollapseOne')}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                  />

                  {/* Course Intro Video Section */}
                  <CourseIntroVideoSection
                    isOpen={openAccordions.has('accCollapseTwo')}
                    onToggle={() => toggleAccordion('accCollapseTwo')}
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  {/* Course Builder Section */}
                  <CourseBuilderSection
                    isOpen={openAccordions.has('accCollapseThree')}
                    onToggle={() => toggleAccordion('accCollapseThree')}
                    topics={topics}
                    onTopicsChange={setTopics}
                  />

                  {/* Additional Information Section */}
                  <AdditionalInformationSection
                    isOpen={openAccordions.has('accCollapseSix')}
                    onToggle={() => toggleAccordion('accCollapseSix')}
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  {/* Certificate Template Section */}
                  <CertificateTemplateSection
                    isOpen={openAccordions.has('accCollapseEight')}
                    onToggle={() => toggleAccordion('accCollapseEight')}
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="mt--10 row g-5">
                  <div className="col-lg-4">
                    <a className="rbt-btn hover-icon-reverse bg-primary-opacity w-100 text-center" href="#">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Preview</span>
                        <span className="btn-icon"><i className="feather-eye"></i></span>
                        <span className="btn-icon"><i className="feather-eye"></i></span>
                      </span>
                    </a>
                  </div>
                  <div className="col-lg-8">
                    <button
                      type="button"
                      className="rbt-btn btn-gradient hover-icon-reverse w-100 text-center"
                      onClick={handleSubmit}
                    >
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">{isEditMode ? 'Update Course' : 'Create Course'}</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
                <div className="inner">
                  <div className="content-item-content">
                    <div className="rbt-default-sidebar-wrapper">
                      <div className="section-title mb--20">
                        <h6 className="rbt-title-style-2">Course Preview</h6>
                      </div>
                      <ul className="rbt-list-style-1">
                        <li><i className="feather-check"></i> Add Topics in the Course Builder section to organize your course content.</li>
                        <li><i className="feather-check"></i> Use the Course Info section to add course details.</li>
                        <li><i className="feather-check"></i> Upload a thumbnail image for your course.</li>
                        <li><i className="feather-check"></i> Set course price and categories.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
