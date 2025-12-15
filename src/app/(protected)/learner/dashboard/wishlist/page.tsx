'use client';

import { useGetDashboard } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';
import ActiveExamCard from '@/components/learner/dashboard/ActiveExamCard';

// Type definition for ActiveExamInfo
type ActiveExamInfo = {
  examId?: string | number;
  examName?: string;
  examType?: string;
  attemptCount?: number;
  maxAttempts?: number;
  hasAttemptsLeft?: boolean;
  bestScore?: number;
  lastAttemptDate?: string;
  accessEndDate?: string;
  daysRemaining?: number;
};

/**
 * Learner Exams Page
 * Displays all enrolled exams for the learner
 */
export default function ExamsPage() {
  const { data, isLoading, error } = useGetDashboard();

  const activeExams = (Array.isArray(data?.activeExams) ? data.activeExams : []) as ActiveExamInfo[];

  if (isLoading) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Exams</h4>
        </div>
        <div className="text-center p--40">
          <p>Loading exams...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Exams</h4>
        </div>
        <div className="text-center p--40">
          <p className="text-danger">Error loading exams. Please try again later.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Exams</h4>
      </div>

      {activeExams.length > 0 ? (
        <div className="row">
          {activeExams.map((exam) => (
            <ActiveExamCard key={exam.examId || Math.random()} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="text-center p--40">
          <p>No exams available. You will see your enrolled exams here.</p>
        </div>
      )}
    </>
  );
}

