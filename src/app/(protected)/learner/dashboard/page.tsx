'use client';

import { useEffect } from 'react';
import DashboardStatsCard from '@/components/learner/dashboard/DashboardStatsCard';
import ActiveCourseCard from '@/components/learner/dashboard/ActiveCourseCard';
import ActiveExamCard from '@/components/learner/dashboard/ActiveExamCard';
import OverallStatsCard from '@/components/learner/dashboard/OverallStatsCard';
import { useGetDashboard } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';

// Type definitions for dashboard data (temporary until generated types are available)
type ActiveCourseInfo = {
  courseId?: string | number;
  courseName?: string;
  imageUrl?: string;
  category?: string;
  progressPercentage?: number;
  completedParts?: number;
  totalParts?: number;
  nextContent?: { partId?: string | number; partName?: string };
  accessEndDate?: string;
  daysRemaining?: number;
  thisWeekTimeSpentSeconds?: number;
  thisWeekAccessCount?: number;
  totalTimeSpentSeconds?: number; // Total time spent on this course
};

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

type OverallStats = {
  averageProgressPercentage?: number;
  totalStudyTimeSeconds?: number;
  [key: string]: unknown;
};

type DashboardData = {
  activeCourses?: ActiveCourseInfo[];
  activeExams?: ActiveExamInfo[];
  overallStats?: OverallStats;
  [key: string]: unknown;
};

/**
 * Learner Dashboard Page
 * Template content converted to React components
 */
export default function DashboardPage() {
  const { data, isLoading, error } = useGetDashboard();
  const dashboardData = data as DashboardData | undefined;


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

  const activeCourses = (Array.isArray(dashboardData?.activeCourses) ? dashboardData.activeCourses : []) as ActiveCourseInfo[];
  const activeExams = (Array.isArray(dashboardData?.activeExams) ? dashboardData.activeExams : []) as ActiveExamInfo[];

  // Calculate average progress percentage from activeCourses
  // This ensures consistency with what's shown in the Active Courses section
  // Uses completedParts/totalParts for accuracy, falls back to progressPercentage if parts data is missing
  const calculateAverageProgress = () => {
    if (activeCourses.length === 0) return 0;
    
    const progressValues: number[] = [];
    
    activeCourses.forEach(course => {
      // Prefer calculated progress from completedParts/totalParts for accuracy
      if (course.totalParts && course.totalParts > 0 && course.completedParts !== undefined) {
        const calculatedProgress = (course.completedParts / course.totalParts) * 100;
        progressValues.push(calculatedProgress);
      } 
      // Fall back to backend progressPercentage if parts data is not available
      else if (course.progressPercentage !== undefined && course.progressPercentage !== null) {
        progressValues.push(course.progressPercentage);
      }
    });
    
    if (progressValues.length === 0) return 0;
    
    const sum = progressValues.reduce((acc, val) => acc + val, 0);
    return sum / progressValues.length;
  };

  const calculatedAverageProgress = calculateAverageProgress();

  // Calculate total study time from activeCourses if not provided by backend
  const calculateTotalStudyTime = () => {
    // If backend provides totalStudyTimeSeconds and it's > 0, use it
    if (dashboardData?.overallStats?.totalStudyTimeSeconds && dashboardData.overallStats.totalStudyTimeSeconds > 0) {
      return dashboardData.overallStats.totalStudyTimeSeconds;
    }
    
    // Otherwise, try to sum up totalTimeSpentSeconds from activeCourses
    const totalTime = activeCourses.reduce((sum, course) => {
      return sum + (course.totalTimeSpentSeconds || 0);
    }, 0);
    
    return totalTime > 0 ? totalTime : 0;
  };

  const calculatedTotalStudyTime = calculateTotalStudyTime();

  // Use calculated average if available, otherwise fall back to backend value
  // Also use calculated total study time if backend value is missing or 0
  const overallStats = dashboardData?.overallStats ? {
    ...dashboardData.overallStats,
    averageProgressPercentage: calculatedAverageProgress > 0 ? calculatedAverageProgress : (dashboardData.overallStats.averageProgressPercentage || 0),
    totalStudyTimeSeconds: calculatedTotalStudyTime > 0 ? calculatedTotalStudyTime : (dashboardData.overallStats.totalStudyTimeSeconds || 0)
  } : undefined;

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
      {overallStats && (
        <div className="mb--40">
          <div className="row">
            <OverallStatsCard stats={overallStats} />
          </div>
        </div>
      )}
    </>
  );
}
