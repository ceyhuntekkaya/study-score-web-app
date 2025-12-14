'use client';

import { useEffect } from 'react';
import DashboardStatsCard from '@/components/learner/dashboard/DashboardStatsCard';
import ActiveCourseCard from '@/components/learner/dashboard/ActiveCourseCard';
import ActiveExamCard from '@/components/learner/dashboard/ActiveExamCard';
import OverallStatsCard from '@/components/learner/dashboard/OverallStatsCard';
import { useGetDashboard } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';

/**
 * Learner Dashboard Page
 * Template content converted to React components
 */
export default function DashboardPage() {
  const { data, isLoading, error } = useGetDashboard();

  useEffect(() => {
    if (data) {
      console.log('Dashboard Data:', data);
    }
    if (error) {
      console.error('Dashboard Error:', error);
    }
    if (isLoading) {
      console.log('Loading dashboard data...');
    }
  }, [data, error, isLoading]);

  if (isLoading) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Dashboard</h4>
        </div>
        <div className="text-center p--40">
          <p>Loading dashboard data...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Dashboard</h4>
        </div>
        <div className="text-center p--40">
          <p className="text-danger">Error loading dashboard data. Please try again later.</p>
        </div>
      </>
    );
  }

  const activeCourses = data?.activeCourses || [];
  const activeExams = data?.activeExams || [];

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Dashboard</h4>
      </div>

      {/* Active Courses Section */}
      {activeCourses.length > 0 && (
        <div className="mb--40">
          <div className="section-title mb--20">
            <h5 className="rbt-title-style-2">Active Courses</h5>
          </div>
          <div className="row">
            {activeCourses.map((course) => (
              <ActiveCourseCard key={course.courseId || Math.random()} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Active Exams Section */}
      {activeExams.length > 0 && (
        <div className="mb--40">
          <div className="section-title mb--20">
            <h5 className="rbt-title-style-2">Active Exams</h5>
          </div>
          <div className="row">
            {activeExams.map((exam) => (
              <ActiveExamCard key={exam.examId || Math.random()} exam={exam} />
            ))}
          </div>
        </div>
      )}

      {/* Overall Stats Section */}
      {data?.overallStats && (
        <div className="mb--40">
          <div className="row">
            <OverallStatsCard stats={data.overallStats} />
          </div>
        </div>
      )}
    </>
  );
}
