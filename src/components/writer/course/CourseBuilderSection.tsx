'use client';

import { useState } from 'react';
import { Topic, Lesson } from './types';

interface CourseBuilderSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  topics: Topic[];
  onTopicsChange: (topics: Topic[]) => void;
}

/**
 * Course Builder Section Component
 * Third accordion section for managing course topics, lessons, quizzes, and assignments
 */
export default function CourseBuilderSection({
  isOpen,
  onToggle,
  topics,
  onTopicsChange,
}: CourseBuilderSectionProps) {
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showUpdateTopicModal, setShowUpdateTopicModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ topicId: string; lesson: Lesson | null } | null>(null);

  const toggleTopic = (topicId: string) => {
    const newOpen = new Set(openTopics);
    if (newOpen.has(topicId)) {
      newOpen.delete(topicId);
    } else {
      newOpen.add(topicId);
    }
    setOpenTopics(newOpen);
  };

  const handleAddTopic = (topicName: string, topicSummary: string) => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title: topicName,
      summary: topicSummary,
      lessons: [],
    };
    onTopicsChange([...topics, newTopic]);
    setShowAddTopicModal(false);
  };

  const handleUpdateTopic = (topicId: string, topicName: string, topicSummary: string) => {
    onTopicsChange(
      topics.map(topic =>
        topic.id === topicId
          ? { ...topic, title: topicName, summary: topicSummary }
          : topic
      )
    );
    setShowUpdateTopicModal(false);
    setEditingTopicId(null);
  };

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      onTopicsChange(topics.filter(topic => topic.id !== topicId));
    }
  };

  const handleAddLesson = (topicId: string, lesson: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      ...lesson,
    };
    onTopicsChange(
      topics.map(topic =>
        topic.id === topicId
          ? { ...topic, lessons: [...topic.lessons, newLesson] }
          : topic
      )
    );
  };

  const handleUpdateLesson = (topicId: string, lessonId: string, updatedLesson: Partial<Lesson>) => {
    onTopicsChange(
      topics.map(topic =>
        topic.id === topicId
          ? {
              ...topic,
              lessons: topic.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, ...updatedLesson } : lesson
              ),
            }
          : topic
      )
    );
  };

  const handleDeleteLesson = (topicId: string, lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      onTopicsChange(
        topics.map(topic =>
          topic.id === topicId
            ? { ...topic, lessons: topic.lessons.filter(lesson => lesson.id !== lessonId) }
            : topic
        )
      );
    }
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <i className="feather-play-circle"></i>;
      case 'text':
        return <i className="feather-file-text"></i>;
      case 'quiz':
        return <i className="feather-help-circle"></i>;
      case 'assignment':
        return <i className="feather-edit-3"></i>;
      default:
        return <i className="feather-file"></i>;
    }
  };

  return (
    <>
      <div className="accordion-item card">
        <h2 className="accordion-header card-header" id="accThree">
          <button
            className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="accCollapseThree"
          >
            Course Builder
          </button>
        </h2>
        <div
          id="accCollapseThree"
          className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
          aria-labelledby="accThree"
        >
          <div className="accordion-body card-body">
            {/* Topics List */}
            {topics.map((topic) => (
              <div className="accordion-item card mb--20" key={topic.id}>
                <h2 
                  className="accordion-header card-header rbt-course" 
                  id={`accOne${topic.id}`}
                  onClick={() => toggleTopic(topic.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <button
                    className={`accordion-button ${openTopics.has(topic.id) ? '' : 'collapsed'}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopic(topic.id);
                    }}
                    aria-expanded={openTopics.has(topic.id)}
                  >
                    {topic.title}
                  </button>
                  <span
                    className="rbt-course-icon rbt-course-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTopicId(topic.id);
                      setShowUpdateTopicModal(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  ></span>
                  <span
                    className="rbt-course-icon rbt-course-del"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTopic(topic.id);
                    }}
                    style={{ cursor: 'pointer' }}
                  ></span>
                </h2>
                <div
                  id={`accCollapseOne${topic.id}`}
                  className={`accordion-collapse collapse ${openTopics.has(topic.id) ? 'show' : ''}`}
                  aria-labelledby={`accOne${topic.id}`}
                >
                  <div className="accordion-body card-body" id={`dnd${topic.id}`}>
                    {/* Lessons in Topic */}
                    {topic.lessons.length > 0 ? (
                      topic.lessons.map((lesson) => (
                        <div key={lesson.id} className="d-flex justify-content-between rbt-course-wrape mb-4" role="button">
                          <div className="col-10 inner d-flex align-items-center gap-2">
                            <i className="feather-menu cursor-scroll" style={{ cursor: 'grab' }}></i>
                            <div className="d-flex align-items-center gap-2">
                              {getLessonIcon(lesson.type)}
                              <div>
                                <h6 className="rbt-title mb-0">{lesson.title}</h6>
                                {lesson.duration && (
                                  <small className="text-muted">{lesson.duration}</small>
                                )}
                                {lesson.isPreview && (
                                  <span className="badge bg-primary ms-2">Preview</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-2 inner">
                            <ul className="rbt-list-style-1 rbt-course-list d-flex gap-2">
                              <li>
                                <i
                                  className="feather-trash"
                                  onClick={() => handleDeleteLesson(topic.id, lesson.id)}
                                  style={{ cursor: 'pointer' }}
                                  title="Delete Lesson"
                                ></i>
                              </li>
                              <li>
                                <i
                                  className="feather-edit"
                                  onClick={() => {
                                    setEditingLesson({ topicId: topic.id, lesson });
                                    setShowLessonModal(true);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  title="Edit Lesson"
                                ></i>
                              </li>
                              <li>
                                <i className="feather-upload" title="Upload Files"></i>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted">
                        <p>No lessons yet. Add your first lesson, quiz, or assignment below.</p>
                      </div>
                    )}

                    {/* Add Lesson/Quiz/Assignment Buttons */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                      <div className="gap-3 d-flex flex-wrap">
                        <button
                          type="button"
                          className="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2"
                          onClick={() => {
                            setEditingLesson({ topicId: topic.id, lesson: null });
                            setShowLessonModal(true);
                          }}
                        >
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Lesson</span>
                            <span className="btn-icon"><i className="feather-plus-square"></i></span>
                            <span className="btn-icon"><i className="feather-plus-square"></i></span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2"
                          onClick={() => {
                            setEditingLesson({ topicId: topic.id, lesson: null });
                            setShowQuizModal(true);
                          }}
                        >
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Quiz</span>
                            <span className="btn-icon"><i className="feather-plus-square"></i></span>
                            <span className="btn-icon"><i className="feather-plus-square"></i></span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2"
                          onClick={() => {
                            setEditingLesson({ topicId: topic.id, lesson: null });
                            setShowAssignmentModal(true);
                          }}
                        >
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Assignments</span>
                            <span className="btn-icon"><i className="feather-plus-square"></i></span>
                            <span className="btn-icon"><i className="feather-plus-square"></i></span>
                          </span>
                        </button>
                      </div>
                      <div className="mt-3 mt-md-0">
                        <label htmlFor={`import-quiz-${topic.id}`} className="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2" style={{ cursor: 'pointer', margin: 0 }}>
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Import Quiz</span>
                            <span className="btn-icon"><i className="feather-download"></i></span>
                            <span className="btn-icon"><i className="feather-download"></i></span>
                          </span>
                        </label>
                        <input
                          id={`import-quiz-${topic.id}`}
                          type="file"
                          accept=".json,.csv"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              console.log('Import quiz file:', e.target.files[0].name);
                              // TODO: Implement quiz import
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Topic Button */}
            <button
              type="button"
              className="rbt-btn btn-md btn-gradient hover-icon-reverse"
              onClick={() => setShowAddTopicModal(true)}
            >
              <span className="icon-reverse-wrapper">
                <span className="btn-text">Add New Topic</span>
                <span className="btn-icon"><i className="feather-plus-circle"></i></span>
                <span className="btn-icon"><i className="feather-plus-circle"></i></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddTopicModal && (
        <AddTopicModal
          onClose={() => setShowAddTopicModal(false)}
          onSave={handleAddTopic}
        />
      )}

      {showUpdateTopicModal && editingTopicId && (
        <UpdateTopicModal
          topic={topics.find(t => t.id === editingTopicId)!}
          onClose={() => {
            setShowUpdateTopicModal(false);
            setEditingTopicId(null);
          }}
          onSave={handleUpdateTopic}
        />
      )}

      {showLessonModal && editingLesson && (
        <LessonModal
          topicId={editingLesson.topicId}
          lesson={editingLesson.lesson}
          onClose={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
          }}
          onSave={(lessonData) => {
            if (editingLesson.lesson) {
              handleUpdateLesson(editingLesson.topicId, editingLesson.lesson.id, lessonData);
            } else {
              handleAddLesson(editingLesson.topicId, lessonData);
            }
            setShowLessonModal(false);
            setEditingLesson(null);
          }}
        />
      )}

      {showQuizModal && editingLesson && (
        <QuizModal
          topicId={editingLesson.topicId}
          lesson={editingLesson.lesson}
          onClose={() => {
            setShowQuizModal(false);
            setEditingLesson(null);
          }}
          onSave={(lessonData) => {
            if (editingLesson.lesson) {
              handleUpdateLesson(editingLesson.topicId, editingLesson.lesson.id, lessonData);
            } else {
              handleAddLesson(editingLesson.topicId, { ...lessonData, type: 'quiz' });
            }
            setShowQuizModal(false);
            setEditingLesson(null);
          }}
        />
      )}

      {showAssignmentModal && editingLesson && (
        <AssignmentModal
          topicId={editingLesson.topicId}
          lesson={editingLesson.lesson}
          onClose={() => {
            setShowAssignmentModal(false);
            setEditingLesson(null);
          }}
          onSave={(lessonData) => {
            if (editingLesson.lesson) {
              handleUpdateLesson(editingLesson.topicId, editingLesson.lesson.id, lessonData);
            } else {
              handleAddLesson(editingLesson.topicId, { ...lessonData, type: 'assignment' });
            }
            setShowAssignmentModal(false);
            setEditingLesson(null);
          }}
        />
      )}
    </>
  );
}

// Modal Components
function AddTopicModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string, summary: string) => void }) {
  const [topicName, setTopicName] = useState('');
  const [topicSummary, setTopicSummary] = useState('');

  return (
    <div className="rbt-default-modal modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="rbt-round-btn" onClick={onClose} aria-label="Close">
              <i className="feather-x"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="inner rbt-default-form">
              <div className="row">
                <div className="col-lg-12">
                  <h5 className="modal-title mb--20">Add Topic</h5>
                  <div className="course-field mb--20">
                    <label htmlFor="modal-field-1">Topic Name</label>
                    <input
                      id="modal-field-1"
                      type="text"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                    />
                    <small>
                      <i className="feather-info"></i> Topic titles are displayed publicly wherever required. Each topic may contain one or more lessons, quiz and assignments.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="modal-field-2">Topic Summary</label>
                    <textarea
                      id="modal-field-2"
                      value={topicSummary}
                      onChange={(e) => setTopicSummary(e.target.value)}
                    ></textarea>
                    <small>
                      <i className="feather-info"></i> Add a summary of short text to prepare students for the activities for the topic. The text is shown on the course page beside the tooltip beside the topic name.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="top-circle-shape"></div>
          <div className="modal-footer pt--30">
            <button type="button" className="rbt-btn btn-border btn-md radius-round-10" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="rbt-btn btn-md btn-gradient"
              onClick={() => {
                if (topicName.trim()) {
                  onSave(topicName, topicSummary);
                }
              }}
            >
              Add Topic
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}

function UpdateTopicModal({ topic, onClose, onSave }: { topic: Topic; onClose: () => void; onSave: (id: string, name: string, summary: string) => void }) {
  const [topicName, setTopicName] = useState(topic.title);
  const [topicSummary, setTopicSummary] = useState(topic.summary);

  return (
    <div className="rbt-default-modal modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="rbt-round-btn" onClick={onClose} aria-label="Close">
              <i className="feather-x"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="inner rbt-default-form">
              <div className="row">
                <div className="col-lg-12">
                  <h5 className="modal-title mb--20">Update Topic</h5>
                  <div className="course-field mb--20">
                    <label htmlFor="modal-field-1-update">Topic Name</label>
                    <input
                      id="modal-field-1-update"
                      type="text"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                    />
                    <small>
                      <i className="feather-info"></i> Topic titles are displayed publicly wherever required. Each topic may contain one or more lessons, quiz and assignments.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="modal-field-2-update">Topic Summary</label>
                    <textarea
                      id="modal-field-2-update"
                      value={topicSummary}
                      onChange={(e) => setTopicSummary(e.target.value)}
                    ></textarea>
                    <small>
                      <i className="feather-info"></i> Add a summary of short text to prepare students for the activities for the topic. The text is shown on the course page beside the tooltip beside the topic name.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="top-circle-shape"></div>
          <div className="modal-footer pt--30">
            <button type="button" className="rbt-btn btn-border btn-md radius-round-10" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="rbt-btn btn-md btn-gradient"
              onClick={() => {
                if (topicName.trim()) {
                  onSave(topic.id, topicName, topicSummary);
                }
              }}
            >
              Update Topic
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}

function LessonModal({ topicId, lesson, onClose, onSave }: { topicId: string; lesson: Lesson | null; onClose: () => void; onSave: (data: Omit<Lesson, 'id'>) => void }) {
  const [lessonName, setLessonName] = useState(lesson?.title || '');
  const [lessonSummary, setLessonSummary] = useState(lesson?.summary || '');
  const [duration, setDuration] = useState(lesson?.duration || '');
  const [isPreview, setIsPreview] = useState(lesson?.isPreview || false);

  return (
    <div className="rbt-default-modal modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="rbt-round-btn" onClick={onClose} aria-label="Close">
              <i className="feather-x"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="inner rbt-default-form">
              <div className="row">
                <div className="col-lg-12">
                  <h5 className="modal-title mb--20">{lesson ? 'Update Lesson' : 'Add Lesson'}</h5>
                  <div className="course-field mb--20">
                    <label htmlFor="lesson-name">Lesson Name</label>
                    <input
                      id="lesson-name"
                      type="text"
                      value={lessonName}
                      onChange={(e) => setLessonName(e.target.value)}
                    />
                    <small>
                      <i className="feather-info"></i> Lesson titles are displayed publicly wherever required.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="lesson-summary">Lesson Summary</label>
                    <textarea
                      id="lesson-summary"
                      value={lessonSummary}
                      onChange={(e) => setLessonSummary(e.target.value)}
                    ></textarea>
                    <small>
                      <i className="feather-info"></i> Add a summary of short text to prepare students for the activities for the Lesson.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="lesson-duration">Duration (optional)</label>
                    <input
                      id="lesson-duration"
                      type="text"
                      placeholder="e.g., 30 min"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="course-field mb--20">
                    <p className="rbt-checkbox-wrapper mb--5 d-flex">
                      <input
                        id="lesson-preview"
                        type="checkbox"
                        checked={isPreview}
                        onChange={(e) => setIsPreview(e.target.checked)}
                      />
                      <label htmlFor="lesson-preview">Enable Course Preview</label>
                    </p>
                    <small>
                      <i className="feather-info"></i> Allow students to preview this lesson without enrollment.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="top-circle-shape"></div>
          <div className="modal-footer pt--30 justify-content-between">
            <button type="button" className="rbt-btn btn-border btn-md radius-round-10" onClick={onClose}>
              Cancel
            </button>
            <div className="content">
              <button
                type="button"
                className="rbt-btn btn-md"
                onClick={() => {
                  if (lessonName.trim()) {
                    onSave({
                      title: lessonName,
                      summary: lessonSummary,
                      type: 'video',
                      duration: duration || undefined,
                      isPreview,
                    });
                  }
                }}
              >
                {lesson ? 'Update Lesson' : 'Add Lesson'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}

function QuizModal({ topicId, lesson, onClose, onSave }: { topicId: string; lesson: Lesson | null; onClose: () => void; onSave: (data: Omit<Lesson, 'id'>) => void }) {
  const [quizName, setQuizName] = useState(lesson?.title || '');
  const [quizSummary, setQuizSummary] = useState(lesson?.summary || '');
  const [duration, setDuration] = useState(lesson?.duration || '');

  return (
    <div className="rbt-default-modal modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="rbt-round-btn" onClick={onClose} aria-label="Close">
              <i className="feather-x"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="inner rbt-default-form">
              <div className="row">
                <div className="col-lg-12">
                  <h5 className="modal-title mb--20">{lesson ? 'Update Quiz' : 'Add Quiz'}</h5>
                  <div className="course-field mb--20">
                    <label htmlFor="quiz-name">Quiz Name</label>
                    <input
                      id="quiz-name"
                      type="text"
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                    />
                    <small>
                      <i className="feather-info"></i> Quiz titles are displayed publicly wherever required.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="quiz-summary">Quiz Summary</label>
                    <textarea
                      id="quiz-summary"
                      value={quizSummary}
                      onChange={(e) => setQuizSummary(e.target.value)}
                    ></textarea>
                    <small>
                      <i className="feather-info"></i> Add a summary to help students understand what this quiz covers.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="quiz-duration">Duration (optional)</label>
                    <input
                      id="quiz-duration"
                      type="text"
                      placeholder="e.g., 15 min"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="top-circle-shape"></div>
          <div className="modal-footer pt--30 justify-content-between">
            <button type="button" className="rbt-btn btn-border btn-md radius-round-10" onClick={onClose}>
              Cancel
            </button>
            <div className="content">
              <button
                type="button"
                className="rbt-btn btn-md"
                onClick={() => {
                  if (quizName.trim()) {
                    onSave({
                      title: quizName,
                      summary: quizSummary,
                      type: 'quiz',
                      duration: duration || undefined,
                    });
                  }
                }}
              >
                {lesson ? 'Update Quiz' : 'Add Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}

function AssignmentModal({ topicId, lesson, onClose, onSave }: { topicId: string; lesson: Lesson | null; onClose: () => void; onSave: (data: Omit<Lesson, 'id'>) => void }) {
  const [assignmentName, setAssignmentName] = useState(lesson?.title || '');
  const [assignmentSummary, setAssignmentSummary] = useState(lesson?.summary || '');

  return (
    <div className="rbt-default-modal modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="rbt-round-btn" onClick={onClose} aria-label="Close">
              <i className="feather-x"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="inner rbt-default-form">
              <div className="row">
                <div className="col-lg-12">
                  <h5 className="modal-title mb--20">{lesson ? 'Update Assignment' : 'Add Assignment'}</h5>
                  <div className="course-field mb--20">
                    <label htmlFor="assignment-name">Assignment Name</label>
                    <input
                      id="assignment-name"
                      type="text"
                      value={assignmentName}
                      onChange={(e) => setAssignmentName(e.target.value)}
                    />
                    <small>
                      <i className="feather-info"></i> Assignment titles are displayed publicly wherever required.
                    </small>
                  </div>
                  <div className="course-field mb--20">
                    <label htmlFor="assignment-summary">Assignment Summary</label>
                    <textarea
                      id="assignment-summary"
                      value={assignmentSummary}
                      onChange={(e) => setAssignmentSummary(e.target.value)}
                    ></textarea>
                    <small>
                      <i className="feather-info"></i> Add instructions and requirements for this assignment.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="top-circle-shape"></div>
          <div className="modal-footer pt--30 justify-content-between">
            <button type="button" className="rbt-btn btn-border btn-md radius-round-10" onClick={onClose}>
              Cancel
            </button>
            <div className="content">
              <button
                type="button"
                className="rbt-btn btn-md"
                onClick={() => {
                  if (assignmentName.trim()) {
                    onSave({
                      title: assignmentName,
                      summary: assignmentSummary,
                      type: 'assignment',
                    });
                  }
                }}
              >
                {lesson ? 'Update Assignment' : 'Add Assignment'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}

