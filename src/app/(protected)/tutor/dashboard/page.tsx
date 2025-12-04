'use client';

import DashboardStatsCard from '@/components/learner/dashboard/DashboardStatsCard';

/**
 * Tutor Dashboard Page
 * Template content converted to React components
 */
export default function TutorDashboardPage() {
  const courses = [
    { name: 'Accounting', enrolled: 50, rating: 5 },
    { name: 'Marketing', enrolled: 40, rating: 4 },
    { name: 'Business', enrolled: 30, rating: 5 },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? '' : 'empty'}`}></i>
    ));
  };

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

        {/* Total Students */}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
          <DashboardStatsCard
            icon="feather-users"
            iconBg="bg-pink-opacity"
            count={160}
            label="Total Students"
            color="color-pink"
          />
        </div>

        {/* Total Courses */}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
          <DashboardStatsCard
            icon="feather-gift"
            iconBg="bg-coral-opacity"
            count={20}
            label="Total Courses"
            color="color-coral"
          />
        </div>

        {/* Total Earnings */}
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
          <DashboardStatsCard
            icon="feather-dollar-sign"
            iconBg="bg-warning-opacity"
            count={25000}
            label="Total Earnings"
            color="color-warning"
          />
        </div>
      </div>

      {/* My Courses Table */}
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box mb--60 mt--40">
        <div className="content">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h4 className="rbt-title-style-3">My Courses</h4>
              </div>
            </div>
          </div>
          <div className="row gy-5">
            <div className="col-lg-12">
              <div className="rbt-dashboard-table table-responsive">
                <table className="rbt-table table table-borderless">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Enrolled</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr key={index}>
                        <th>
                          <a href="#">{course.name}</a>
                        </th>
                        <td>{course.enrolled}</td>
                        <td>
                          <div className="rating">
                            {renderStars(course.rating)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
