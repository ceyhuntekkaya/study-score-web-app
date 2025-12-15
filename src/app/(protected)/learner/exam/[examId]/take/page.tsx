'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetExamWithUserData } from '@/generated/api/exam-controller/exam-controller';
import HeaderRenderer from '@/components/learner/exam/HeaderRenderer';
import QuestionRenderer from '@/components/learner/exam/questions/QuestionRenderer';

/**
 * Learner Exam Taking Page
 * URL: /learner/exam/[examId]/take
 * Main exam interface with timer and question navigation
 */
export default function ExamTakePage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0-based index

  // Fetch exam data with user data
  const { data, isLoading, error } = useGetExamWithUserData(examId, undefined, {
    query: {
      enabled: !!examId,
    },
  });

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get question groups from data - try multiple possible property names
  const questionGroups = 
    (data as any)?.questionGroups || 
    (data as any)?.questionGroupList || 
    (data as any)?.questionGroupsList ||
    (data as any)?.groups ||
    [];
  const questionCount = Array.isArray(questionGroups) ? questionGroups.length : 0;

  // Get exam name from data
  const examName = (data as any)?.examName || (data as any)?.name || 'Exam';

  // Handle question navigation
  const handleQuestionClick = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < questionCount) {
      setCurrentQuestionIndex(questionIndex);
      console.log(`Navigated to question ${questionIndex + 1}`);
    }
  };

  // Get current question group
  const currentQuestionGroup = questionGroups[currentQuestionIndex];
  
  // Get headers only from current question group
  const currentHeaders = (currentQuestionGroup as any)?.headers || [];
  
  // Get questions from current question group
  const currentQuestions = (currentQuestionGroup as any)?.questions || [];
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, answerData: any) => {
    console.log('Answer changed for question:', questionId, answerData);
    // TODO: Save answer to backend
  };

  // Handle exit exam
  const handleExitExam = () => {
    if (confirm('Are you sure you want to exit the exam? Your progress may be lost.')) {
      router.push(`/learner/exam/${examId}`);
    }
  };

  if (!examId) {
    return (
      <div className="rbt-lesson-rightsidebar overflow-hidden">
        <div className="inner" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="content">
            <div className="section-title">
              <h4 className="rbt-title-style-3 text-danger">Exam ID not found</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rbt-lesson-rightsidebar overflow-hidden">
        <div className="inner" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="content">
            <div className="section-title">
              <h4 className="rbt-title-style-3">Loading Exam...</h4>
              <p className="mt-3">Please wait while we load the exam.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rbt-lesson-rightsidebar overflow-hidden">
        <div className="inner" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="content">
            <div className="section-title">
              <h4 className="rbt-title-style-3 text-danger">Error Loading Exam</h4>
              <p className="mt-3 text-danger">Unable to load exam data. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f7fa', overflow: 'hidden' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #e0e0e0',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <h3
            className="rbt-title-style-3"
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            {examName}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f0f4ff',
              borderRadius: '8px',
              border: '1px solid #4d79ff',
            }}
          >
            <i className="feather-clock" style={{ fontSize: '18px', color: '#4d79ff' }}></i>
            <span
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#4d79ff',
                fontFamily: 'monospace',
              }}
            >
              {formatTime(elapsedTime)}
            </span>
          </div>

          {/* Exit Button */}
          <button
            onClick={handleExitExam}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#cc0000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ff4444';
            }}
          >
            <i className="feather-x-circle"></i>
            Exit Exam
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '30px',
          paddingBottom: '120px', // Footer için yer bırak
          backgroundColor: '#ffffff',
          margin: '20px 20px 0 20px',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <div className="content">
          <div className="section-title mb--30">
            <h4 className="rbt-title-style-3">
              Question {currentQuestionIndex + 1} of {questionCount}
            </h4>
          </div>

          {/* Headers Section - Only headers from current question group */}
          {currentHeaders.length > 0 && (
            <div className="headers-section mb--40">
              <div className="section-title mb--20">
                <h5 className="rbt-title-style-2" style={{ fontSize: '16px', color: '#666' }}>
                  <i className="feather-file-text me-2"></i>
                  Materials
                </h5>
              </div>
              {currentHeaders.map((header: any, index: number) => (
                <HeaderRenderer key={`header-${currentQuestionIndex}-${index}`} header={header} />
              ))}
            </div>
          )}

          {/* Questions Content - All questions in the group */}
          <div className="questions-content-section">
            {currentQuestions.length > 0 ? (
              currentQuestions.map((question: any, questionIndex: number) => (
                <div 
                  key={question.questionId || question.id || `question-${questionIndex}`}
                  className="question-item mb--40"
                  style={{
                    padding: '25px',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  {/* Question Number */}
                  <div className="question-header mb--20">
                    <div className="d-flex align-items-center justify-content-between mb--15">
                      <h5 className="rbt-title-style-2" style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                        Question {questionIndex + 1} of {currentQuestions.length} in this group
                      </h5>
                      {question.maximumScore && (
                        <span className="badge bg-secondary-opacity" style={{ fontSize: '12px', padding: '4px 8px' }}>
                          {question.maximumScore} points
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Renderer */}
                  <QuestionRenderer
                    question={question}
                    questionId={question.questionId || question.id || `question-${questionIndex}`}
                    onAnswerChange={(answerData) => handleAnswerChange(question.questionId || question.id, answerData)}
                  />
                </div>
              ))
            ) : (
              <div className="no-question-message">
                <p style={{ color: 'var(--color-body)', textAlign: 'center', padding: '40px' }}>
                  No questions available in this group.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Question Numbers */}
      <footer
        style={{
          backgroundColor: '#ffffff',
          borderTop: '2px solid #e0e0e0',
          padding: '20px 30px',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {questionCount > 0 ? (
            Array.from({ length: questionCount }, (_, index) => {
              const isActive = index === currentQuestionIndex;
              return (
                <button
                  key={`question-${index}`}
                  onClick={() => handleQuestionClick(index)}
                  type="button"
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
                    border: isActive ? '3px solid #4d79ff' : '2px solid #4d79ff',
                    backgroundColor: isActive ? '#4d79ff' : '#ffffff',
                    color: isActive ? '#ffffff' : '#4d79ff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 2px 8px rgba(77, 121, 255, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#4d79ff';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#4d79ff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  title={`Go to question ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })
          ) : null}
        </div>
      </footer>
    </div>
  );
}
