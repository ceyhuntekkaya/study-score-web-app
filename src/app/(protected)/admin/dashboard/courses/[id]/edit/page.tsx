'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { useGetCourseWithAllDetails } from '@/generated/api/course-rest-controller/course-rest-controller';
import CourseForm from '@/components/admin/CourseForm';
import CourseLessonsAccordion from '@/components/admin/CourseLessonsAccordion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LessonForm from '@/components/admin/LessonForm';
import LessonPartForm from '@/components/admin/LessonPartForm';
import MaterialsTable from '@/components/admin/MaterialsTable';
import { CourseLessonPartDTO, CourseLessonDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

export default function EditCoursePage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params?.id as string;
  const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(false);
  
  // Right panel states
  const [selectedView, setSelectedView] = useState<'lesson' | 'part' | 'materials' | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLessonDetailDTO | null>(null);
  const [editingPart, setEditingPart] = useState<CourseLessonPartDTO | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [parentLessonId, setParentLessonId] = useState<string | undefined>(undefined);
  const [lessonLevel, setLessonLevel] = useState<string>('UNIT');

  const { data: courseDetails, isLoading, refetch } = useGetCourseWithAllDetails(courseId, {
    query: { enabled: !!courseId },
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner />
        <p className="mt-3">{t('common.loading') || 'Yükleniyor...'}</p>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="text-center py-5">
        <p>{t('message.courseNotFound')}</p>
        <Link href="/admin/dashboard/courses" className="rbt-btn-link">
          <i className="feather-arrow-left me-1"></i>
          {t('admin.course.backToList')}
        </Link>
      </div>
    );
  }

  // Convert CourseDetailDTO to Course for the form
  const courseData = {
    id: courseDetails.id,
    name: courseDetails.name,
    description: courseDetails.description,
    code: courseDetails.code,
    language: courseDetails.language,
    level: courseDetails.level,
    imageUrl: courseDetails.imageUrl,
    category: courseDetails.category,
    status: courseDetails.status,
  };

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>{t('admin.course.edit')}</h2>
          <Link href="/admin/dashboard/courses" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            {t('admin.course.backToList')}
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        {/* Course Form - Top Section with Accordion */}
        <div className="rbt-card rbt-card-body mb--30">
          <div className="accordion-item card">
            <h2 className="accordion-header card-header" id="heading-course-info">
              <button
                className={`accordion-button ${isCourseInfoOpen ? '' : 'collapsed'}`}
                type="button"
                onClick={() => setIsCourseInfoOpen(!isCourseInfoOpen)}
                aria-expanded={isCourseInfoOpen}
                aria-controls="collapse-course-info"
              >
                <h3 className="mb-0">{t('admin.course.info')}</h3>
              </button>
            </h2>
            <div
              id="collapse-course-info"
              className={`accordion-collapse collapse ${isCourseInfoOpen ? 'show' : ''}`}
              aria-labelledby="heading-course-info"
            >
              <div className="accordion-body card-body">
                <CourseForm initialData={courseData} />
              </div>
            </div>
          </div>
        </div>

        {/* Course Lessons Accordion - Bottom Section (2 columns) */}
        <div className="row g-5">
          <div className="col-md-6">
            <div className="rbt-card rbt-card-body">
              <CourseLessonsAccordion 
                lessons={courseDetails.lessons}
                courseId={courseId}
                onAddLesson={(parentId, level) => {
                  setParentLessonId(parentId);
                  setLessonLevel(level);
                  setEditingLesson(null);
                  setSelectedView('lesson');
                }}
                onEditLesson={(lesson) => {
                  setEditingLesson(lesson);
                  setLessonLevel(lesson.lessonLevel || 'LESSON');
                  setSelectedView('lesson');
                }}
                onAddPart={(lessonId) => {
                  setParentLessonId(lessonId);
                  setEditingPart(null);
                  setSelectedView('part');
                }}
                onEditPart={(part) => {
                  setEditingPart(part);
                  setSelectedView('part');
                }}
                onShowMaterials={(partId) => {
                  setSelectedPartId(partId);
                  setSelectedView('materials');
                }}
                onRefresh={refetch}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="rbt-card rbt-card-body" style={{ overflow: 'visible' }}>
              {selectedView === 'lesson' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>
                      {editingLesson 
                        ? `${t('admin.lesson.edit')} (${editingLesson.lessonLevel || 'LESSON'})` 
                        : lessonLevel === 'UNIT' 
                          ? t('admin.lesson.newUnit')
                          : lessonLevel === 'TOPIC'
                            ? t('admin.lesson.newTopic')
                            : t('admin.lesson.newLesson')}
                    </h3>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setSelectedView(null);
                        setEditingLesson(null);
                        setParentLessonId(undefined);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <LessonForm
                    courseId={courseId}
                    parentLessonId={parentLessonId}
                    initialData={editingLesson ? {
                      id: editingLesson.id,
                      name: editingLesson.name,
                      description: editingLesson.description,
                      lessonLevel: editingLesson.lessonLevel as any,
                      orderNumber: editingLesson.orderNumber,
                      courseId: courseId,
                      parentLessonId: editingLesson.parentLessonId,
                    } : {
                      courseId: courseId,
                      parentLessonId: parentLessonId,
                      lessonLevel: lessonLevel as any,
                    }}
                    onSuccess={() => {
                      setSelectedView(null);
                      setEditingLesson(null);
                      setParentLessonId(undefined);
                      refetch();
                    }}
                    onCancel={() => {
                      setSelectedView(null);
                      setEditingLesson(null);
                      setParentLessonId(undefined);
                    }}
                  />
                </div>
              )}

              {selectedView === 'part' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>{editingPart ? t('admin.part.edit') : t('admin.part.add')}</h3>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setSelectedView(null);
                        setEditingPart(null);
                        setParentLessonId(undefined);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <LessonPartForm
                    courseLessonId={parentLessonId || editingPart?.courseLessonId || ""}
                    initialData={editingPart ?? undefined}
                    onSuccess={() => {
                      setSelectedView(null);
                      setEditingPart(null);
                      setParentLessonId(undefined);
                      refetch();
                    }}
                    onCancel={() => {
                      setSelectedView(null);
                      setEditingPart(null);
                      setParentLessonId(undefined);
                    }}
                  />
                </div>
              )}

              {selectedView === 'materials' && selectedPartId && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>{t('admin.material.title')}</h3>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setSelectedView(null);
                        setSelectedPartId(null);
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <MaterialsTable
                    partId={selectedPartId}
                    onClose={() => {
                      setSelectedView(null);
                      setSelectedPartId(null);
                    }}
                  />
                </div>
              )}

              {!selectedView && (
                <div className="text-center py-5">
                  <p className="text-muted">{t('message.selectOperation')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
