'use client';

// Type definition for DashboardStats (temporary until generated types are available)
type DashboardStats = {
  totalActiveCourses?: number;
  totalActiveExams?: number;
  totalStudyTimeSeconds?: number;
  averageProgressPercentage?: number;
  thisWeekStudyTimeSeconds?: number;
  thisMonthStudyTimeSeconds?: number;
  thisWeekSessionCount?: number;
  thisMonthSessionCount?: number;
};

interface OverallStatsCardProps {
  stats: DashboardStats;
}

/**
 * Overall Statistics Card Component
 * Displays comprehensive dashboard statistics in a different design
 */
export default function OverallStatsCard({ stats }: OverallStatsCardProps) {
  const {
    totalActiveCourses = 0,
    totalActiveExams = 0,
    totalStudyTimeSeconds = 0,
    averageProgressPercentage = 0,
    thisWeekStudyTimeSeconds = 0,
    thisMonthStudyTimeSeconds = 0,
    thisWeekSessionCount = 0,
    thisMonthSessionCount = 0,
  } = stats;

  // Format time in seconds to readable format
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="col-12">
      <div className="rbt-card variation-02 rbt-hover" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)', color: '#ffffff' }}>
        <div className="rbt-card-body p--40">
          <div className="section-title text-center mb--30">
            <h4 className="rbt-title-style-3" style={{ color: '#ffffff', fontWeight: '600' }}>Overall Statistics</h4>
            <p className="mt--10" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Your learning progress at a glance</p>
          </div>

          <div className="row g-4">
            {/* Total Active Courses */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-book-open" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {totalActiveCourses}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>Active Courses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Active Exams */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-file-text" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {totalActiveExams}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>Active Exams</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Progress */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-trending-up" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {averageProgressPercentage.toFixed(1)}%
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>Avg. Progress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Study Time */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-clock" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {formatTime(totalStudyTimeSeconds)}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>Total Study Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* This Week Study Time */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-calendar" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {formatTime(thisWeekStudyTimeSeconds)}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>This Week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* This Month Study Time */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-calendar" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {formatTime(thisMonthStudyTimeSeconds)}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>This Month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* This Week Sessions */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-activity" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {thisWeekSessionCount}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>This Week Sessions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* This Month Sessions */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="rbt-counterup variation-01 text-center" style={{ background: 'transparent', boxShadow: 'none', padding: '20px 15px' }}>
                <div className="inner">
                  <div className="rbt-round-icon mb--15" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', width: '80px', height: '80px', lineHeight: '80px' }}>
                    <i className="feather-activity" style={{ color: '#ffffff', fontSize: '32px' }}></i>
                  </div>
                  <div className="content">
                    <h3 className="counter without-icon mb--5" style={{ color: '#ffffff', fontWeight: '700', fontSize: '36px', padding: '0', margin: '0 0 10px 0' }}>
                      {thisMonthSessionCount}
                    </h3>
                    <span className="rbt-title-style-2 d-block" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>This Month Sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
