'use client';

import DashboardStatsCard from '@/components/learner/dashboard/DashboardStatsCard';

/**
 * Learner Dashboard Page
 * Template content converted to React components
 */
export default function DashboardPage() {
  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Dashboard</h4>
      </div>
      <div className="row g-5">
        {/* Enrolled Courses */}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
          <DashboardStatsCard
            icon="feather-book-open"
            iconBg="bg-primary-opacity"
            count={30}
            label="Enrolled Courses"
            color="color-primary"
          />
        </div>

        {/* Active Courses */}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
          <DashboardStatsCard
            icon="feather-monitor"
            iconBg="bg-secondary-opacity"
            count={10}
            label="ACTIVE COURSES"
            color="color-secondary"
          />
        </div>

        {/* Completed Courses */}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
          <DashboardStatsCard
            icon="feather-award"
            iconBg="bg-violet-opacity"
            count={7}
            label="Completed Courses"
            color="color-violet"
          />
        </div>
      </div>
    </>
  );
}
