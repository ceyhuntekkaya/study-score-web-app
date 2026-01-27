'use client';

import { useState, useMemo, useEffect } from 'react';
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

interface CourseLessonDetailDTOWithChildren extends CourseLessonDetailDTO {
  childLessons?: CourseLessonDetailDTOWithChildren[];
}
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Pencil, Plus } from 'lucide-react';

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
  
  // Form view states
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [selectedPartIdForm, setSelectedPartIdForm] = useState<string>('');

  const { data: courseDetails, isLoading, refetch } = useGetCourseWithAllDetails(courseId, {
    query: { enabled: !!courseId },
  });

  // Helper functions for form view - MUST be called before early returns to maintain hook order
  const units = useMemo(() => {
    if (!courseDetails?.lessons) return [];
    return courseDetails.lessons
      .filter(lesson => lesson.lessonLevel === 'UNIT' && !lesson.parentLessonId)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
  }, [courseDetails?.lessons]);

  const topics = useMemo(() => {
    if (!selectedUnitId || selectedUnitId === '' || !courseDetails?.lessons) return [];
    
    // Find the selected unit
    const selectedUnit = courseDetails.lessons.find(
      lesson => lesson.id === selectedUnitId
    );
    
    // Use the same logic as Accordion view's getChildLessons function
    // First check if unit has childLessons property (nested structure)
    const unitWithChildren = selectedUnit as CourseLessonDetailDTOWithChildren;
    if (unitWithChildren && unitWithChildren.childLessons && unitWithChildren.childLessons.length > 0) {
      const childTopics = unitWithChildren.childLessons
        .filter((lesson) => lesson.lessonLevel === 'TOPIC')
        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
      
      return childTopics;
    }
    
    // Fallback: Use flat array with parentLessonId (same as Accordion view line 79-81)
    const filtered = courseDetails.lessons
      .filter(lesson => {
        return lesson.lessonLevel === 'TOPIC' && lesson.parentLessonId === selectedUnitId;
      })
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
    
    return filtered;
  }, [selectedUnitId, courseDetails?.lessons]);

  const lessons = useMemo(() => {
    if (!selectedTopicId || selectedTopicId === '' || !courseDetails?.lessons) return [];
    
    // Find the selected topic - first check in topics list (which already handles nested structure)
    const selectedTopic = topics.find(topic => topic.id === selectedTopicId);
    
    // If not found in topics, try to find in flat array
    const selectedTopicFromFlat = selectedTopic || courseDetails.lessons.find(
      lesson => lesson.id === selectedTopicId
    );
    
    if (!selectedTopicFromFlat) return [];
    
    // Use the same logic as Accordion view's getChildLessons function
    // First check if topic has childLessons property (nested structure)
    const topicWithChildren = selectedTopicFromFlat as CourseLessonDetailDTOWithChildren;
    if (topicWithChildren && topicWithChildren.childLessons && topicWithChildren.childLessons.length > 0) {
      const childLessons = topicWithChildren.childLessons
        .filter((lesson) => lesson.lessonLevel === 'LESSON')
        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
      
      return childLessons;
    }
    
    // Fallback: Use flat array with parentLessonId (same as Accordion view)
    const filtered = courseDetails.lessons
      .filter(lesson => 
        lesson.lessonLevel === 'LESSON' && 
        lesson.parentLessonId === selectedTopicId
      )
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
    
    return filtered;
  }, [selectedTopicId, courseDetails?.lessons, topics]);

  const parts = useMemo(() => {
    if (!selectedLessonId || selectedLessonId === '' || !courseDetails?.lessons) return [];
    
    // Find the selected lesson - first check in lessons list (which already handles nested structure)
    const selectedLesson = lessons.find(lesson => lesson.id === selectedLessonId);
    
    // If not found in lessons, try to find in flat array
    const selectedLessonFromFlat = selectedLesson || courseDetails.lessons.find(
      lesson => lesson.id === selectedLessonId
    );
    
    if (!selectedLessonFromFlat) {
      return [];
    }
    
    // Check if lesson has lessonParts property (same as Accordion view line 557)
    if (!selectedLessonFromFlat.lessonParts || selectedLessonFromFlat.lessonParts.length === 0) {
      return [];
    }
    
    const sortedParts = selectedLessonFromFlat.lessonParts
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
    
    return sortedParts;
  }, [selectedLessonId, courseDetails?.lessons, lessons]);

  // Auto-select first item when list changes
  useEffect(() => {
    // Auto-select first topic when topics list changes and unit is selected
    if (selectedUnitId && topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id || '');
    }
    // Reset topic if unit changes or topics list becomes empty
    if (!selectedUnitId || topics.length === 0) {
      if (selectedTopicId) {
        setSelectedTopicId('');
      }
    }
  }, [topics, selectedUnitId, selectedTopicId]);

  useEffect(() => {
    // Auto-select first lesson when lessons list changes and topic is selected
    if (selectedTopicId && lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id || '');
    }
    // Reset lesson if topic changes or lessons list becomes empty
    if (!selectedTopicId || lessons.length === 0) {
      if (selectedLessonId) {
        setSelectedLessonId('');
      }
    }
  }, [lessons, selectedTopicId, selectedLessonId]);

  useEffect(() => {
    // Auto-select first part when parts list changes and lesson is selected
    if (selectedLessonId && parts.length > 0 && !selectedPartIdForm) {
      setSelectedPartIdForm(parts[0].id || '');
    }
    // Reset part if lesson changes or parts list becomes empty
    if (!selectedLessonId || parts.length === 0) {
      if (selectedPartIdForm) {
        setSelectedPartIdForm('');
      }
    }
  }, [parts, selectedLessonId, selectedPartIdForm]);

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

  // Reset dependent selects when parent changes
  const handleUnitChange = (value: string | number | (string | number)[]) => {
    let unitId: string;
    if (Array.isArray(value)) {
      unitId = value.length > 0 ? String(value[0]) : '';
    } else {
      unitId = String(value);
    }
    
    // Ensure we have a valid unit ID
    if (unitId && unitId !== '') {
      setSelectedUnitId(unitId);
      setSelectedTopicId('');
      setSelectedLessonId('');
      setSelectedPartIdForm('');
    }
  };

  const handleTopicChange = (value: string | number | (string | number)[]) => {
    const topicId = String(value);
    setSelectedTopicId(topicId);
    setSelectedLessonId('');
    setSelectedPartIdForm('');
  };

  const handleLessonChange = (value: string | number | (string | number)[]) => {
    const lessonId = String(value);
    setSelectedLessonId(lessonId);
    setSelectedPartIdForm('');
  };

  const handlePartChange = (value: string | number | (string | number)[]) => {
    if (Array.isArray(value)) {
      setSelectedPartIdForm(value.length > 0 ? String(value[0]) : '');
    } else {
      setSelectedPartIdForm(String(value));
    }
  };

  // Action handlers for form view
  const handleView = (type: 'unit' | 'topic' | 'lesson' | 'part', id: string) => {
    if (type === 'unit') {
      const unit = units.find(u => u.id === id);
      if (unit) {
        setEditingLesson(unit);
        setLessonLevel('UNIT');
        setSelectedView('lesson');
      }
    } else if (type === 'topic') {
      const topic = topics.find(t => t.id === id);
      if (topic) {
        setEditingLesson(topic);
        setLessonLevel('TOPIC');
        setSelectedView('lesson');
      }
    } else if (type === 'lesson') {
      const lesson = lessons.find((l: CourseLessonDetailDTO) => l.id === id);
      if (lesson) {
        setEditingLesson(lesson);
        setLessonLevel('LESSON');
        setSelectedView('lesson');
      }
    } else if (type === 'part') {
      const part = parts.find(p => p.id === id);
      if (part) {
        setEditingPart(part);
        setParentLessonId(part.courseLessonId);
        setSelectedView('part');
      }
    }
  };

  const handleEdit = (type: 'unit' | 'topic' | 'lesson' | 'part', id: string) => {
    handleView(type, id);
  };

  const handleAdd = (type: 'unit' | 'topic' | 'lesson' | 'part', parentId?: string) => {
    if (type === 'unit') {
      setParentLessonId(undefined);
      setLessonLevel('UNIT');
      setEditingLesson(null);
      setSelectedView('lesson');
    } else if (type === 'topic') {
      setParentLessonId(parentId || selectedUnitId);
      setLessonLevel('TOPIC');
      setEditingLesson(null);
      setSelectedView('lesson');
    } else if (type === 'lesson') {
      setParentLessonId(parentId || selectedTopicId);
      setLessonLevel('LESSON');
      setEditingLesson(null);
      setSelectedView('lesson');
    } else if (type === 'part') {
      setParentLessonId(parentId || selectedLessonId);
      setEditingPart(null);
      setSelectedView('part');
    }
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

        {/* Course Lessons - Bottom Section (2 columns) */}
        <div className="row g-5">
          <div className="col-md-6">
            <div className="rbt-card rbt-card-body">
              <Tabs defaultValue="accordion">
                <TabsList>
                  <TabsTrigger value="accordion">
                    {t('admin.lesson.accordionView') || 'Accordion View'}
                  </TabsTrigger>
                  <TabsTrigger value="form">
                    {t('admin.lesson.formView') || 'Form View'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="accordion">
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
                </TabsContent>
                
                <TabsContent value="form">
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
                      {t('admin.lesson.curriculum')}
                    </h3>
                    
                    {/* Unit Select */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        {t('admin.lesson.unit') || 'UNIT'}
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <Select
                            value={selectedUnitId || ''}
                            onValueChange={handleUnitChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin.lesson.selectUnit') || 'Select Unit...'} />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => {
                                // Ensure unit.id is a valid string
                                const unitId = unit.id || '';
                                return (
                                  <SelectItem key={unitId} value={unitId}>
                                    {unit.name || 'Unnamed Unit'}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {selectedUnitId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit('unit', selectedUnitId)}
                                title={t('common.edit') || 'Edit'}
                              >
                                <Pencil size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdd('unit')}
                              title={t('common.add') || 'Add'}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                      </div>
                    </div>

                    {/* Topic Select */}
                    {selectedUnitId && selectedUnitId !== '' && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          {t('admin.lesson.topic') || 'TOPIC'}
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Select
                              value={selectedTopicId || ''}
                              onValueChange={handleTopicChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('admin.lesson.selectTopic') || 'Select Topic...'} />
                              </SelectTrigger>
                              <SelectContent>
                                {topics.length > 0 ? (
                                  topics.map((topic) => (
                                    <SelectItem key={topic.id} value={topic.id || ''}>
                                      {topic.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div style={{ padding: '8px 16px', color: '#6b7280', fontSize: '12px' }}>
                                    {t('admin.lesson.noTopics') || 'No topics available'}
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {selectedTopicId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit('topic', selectedTopicId)}
                                title={t('common.edit') || 'Edit'}
                              >
                                <Pencil size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdd('topic', selectedUnitId)}
                              title={t('common.add') || 'Add'}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lesson Select */}
                    {selectedTopicId && selectedTopicId !== '' && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          {t('admin.lesson.lesson') || 'LESSON'}
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Select
                              value={selectedLessonId || ''}
                              onValueChange={handleLessonChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('admin.lesson.selectLesson') || 'Select Lesson...'} />
                              </SelectTrigger>
                              <SelectContent>
                                {lessons.length > 0 ? (
                                  lessons.map((lesson) => (
                                    <SelectItem key={lesson.id} value={lesson.id || ''}>
                                      {lesson.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div style={{ padding: '8px 16px', color: '#6b7280', fontSize: '12px' }}>
                                    {t('admin.lesson.noLessons') || 'No lessons available'}
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {selectedLessonId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit('lesson', selectedLessonId)}
                                title={t('common.edit') || 'Edit'}
                              >
                                <Pencil size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdd('lesson', selectedTopicId)}
                              title={t('common.add') || 'Add'}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Part Select */}
                    {selectedLessonId && selectedLessonId !== '' && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          {t('admin.part.name') || 'PART'}
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Select
                              value={selectedPartIdForm || ''}
                              onValueChange={handlePartChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('admin.part.selectPart') || 'Select Part...'} />
                              </SelectTrigger>
                              <SelectContent>
                                {parts.length > 0 ? (
                                  parts.map((part) => (
                                    <SelectItem key={part.id} value={part.id || ''}>
                                      {part.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div style={{ padding: '8px 16px', color: '#6b7280', fontSize: '12px' }}>
                                    {t('admin.part.noParts') || 'No parts available'}
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {selectedPartIdForm && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit('part', selectedPartIdForm)}
                                title={t('common.edit') || 'Edit'}
                              >
                                <Pencil size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdd('part', selectedLessonId)}
                              title={t('common.add') || 'Add'}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
                  {editingPart && editingPart.id && (
                    <div className="mt-4">
                      <h4 className="mb-3">{t('admin.material.title')}</h4>
                      <MaterialsTable
                        partId={editingPart.id}
                      />
                    </div>
                  )}
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
