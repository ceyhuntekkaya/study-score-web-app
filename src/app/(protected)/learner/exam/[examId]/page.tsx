'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGetExamWithUserData } from '@/generated/api/exam-controller/exam-controller';

/**
 * Learner Exam Welcome Page
 * URL: /learner/exam/[examId]
 * First page when user clicks "Take Exam" button
 */
export default function ExamWelcomePage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;

  // Fetch exam data with user data
  const { data, isLoading, error } = useGetExamWithUserData(examId, undefined, {
    query: {
      enabled: !!examId,
    },
  });


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
              <p className="mt-3">Please wait while we load the exam information.</p>
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
    <div className="rbt-lesson-rightsidebar overflow-hidden">
      <div className="inner" style={{ padding: '40px' }}>
        <div className="content">
          {/* Welcome Section */}
          <div className="section-title mb--40">
            <h2 className="rbt-title-style-3 mb--20">
              <i className="feather-check-circle me-2" style={{ color: 'var(--color-secondary)' }}></i>
              Welcome to the Exam
            </h2>
            <p className="lead" style={{ fontSize: '18px', color: 'var(--color-body)' }}>
              You are about to start an important exam. Please review the information below before beginning.
            </p>
          </div>

          {/* Exam Information Card */}
          <div className="rbt-card variation-01 rbt-hover mb--30" style={{ borderColor: 'var(--color-secondary)' }}>
            <div className="rbt-card-body p--30">
              <div className="row g-4">
                <div className="col-12">
                  <div className="d-flex align-items-center mb--20">
                    <div className="rbt-icon-box variation-01 bg-secondary-opacity" style={{ width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                      <i className="feather-file-text" style={{ fontSize: '28px', color: 'var(--color-secondary)' }}></i>
                    </div>
                    <div>
                      <h4 className="rbt-card-title mb--5">Exam Information</h4>
                      <p className="rbt-title-style-2" style={{ fontSize: '14px', color: 'var(--color-body)', margin: 0 }}>
                        Exam ID: {examId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="alert alert-info" role="alert" style={{ backgroundColor: '#f0f4ff', border: '1px solid #4d79ff', borderRadius: '8px', padding: '20px' }}>
                    <div className="d-flex align-items-start">
                      <i className="feather-info me-3" style={{ fontSize: '24px', color: '#4d79ff', marginTop: '2px' }}></i>
                      <div>
                        <h5 className="mb-2" style={{ color: '#4d79ff' }}>Ready to Begin?</h5>
                        <p className="mb-0" style={{ color: '#333' }}>
                          The exam data has been loaded successfully. Check the browser console to see the full exam details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rbt-card variation-01 rbt-hover mb--30">
            <div className="rbt-card-body p--30">
              <h5 className="rbt-card-title mb--20">Next Steps</h5>
              <ul className="rbt-list-style-1" style={{ paddingLeft: '20px' }}>
                <li>Review the exam instructions carefully</li>
                <li>Check your internet connection</li>
                <li>Ensure you have enough time to complete the exam</li>
                <li>Click "Start Exam" when you're ready to begin</li>
              </ul>
            </div>
          </div>

          {/* Start Exam Button */}
          <div className="text-center">
            <button
              onClick={() => router.push(`/learner/exam/${examId}/take`)}
              className="rbt-btn btn-lg bg-secondary-opacity"
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(77, 121, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="feather-play-circle me-2"></i>
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
