'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetDashboard } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';

// Type definitions for dashboard data
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
};

/**
 * Learner Enrolled Courses Page
 * Template content converted to React components
 */
export default function EnrolledCoursesPage() {
  const [activeTab, setActiveTab] = useState('enrolled');
  const { data, isLoading, error } = useGetDashboard();

  const activeCourses = (Array.isArray(data?.activeCourses) ? data.activeCourses : []) as ActiveCourseInfo[];
  
  // Filter courses based on active tab
  const getFilteredCourses = () => {
    if (activeTab === 'enrolled') {
      return activeCourses;
    } else if (activeTab === 'active') {
      // Active courses: progress > 0 and < 100
      return activeCourses.filter(course => 
        course.progressPercentage && course.progressPercentage > 0 && course.progressPercentage < 100
      );
    } else if (activeTab === 'completed') {
      // Completed courses: progress === 100
      return activeCourses.filter(course => 
        course.progressPercentage === 100
      );
    }
    return [];
  };

  const filteredCourses = getFilteredCourses();

  if (isLoading) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Enrolled Courses</h4>
        </div>
        <div className="text-center p--40">
          <p>Loading courses...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="section-title">
          <h4 className="rbt-title-style-3">Enrolled Courses</h4>
        </div>
        <div className="text-center p--40">
          <p className="text-danger">Error loading courses. Please try again later.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Enrolled Courses</h4>
      </div>

      <div className="advance-tab-button mb--30">
        <ul className="nav nav-tabs tab-button-style-2 justify-content-start" role="tablist">
          <li role="presentation">
            <a
              href="#"
              className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('enrolled');
              }}
              role="tab"
            >
              <span className="title">Enrolled Courses</span>
              <span className="counter">({activeCourses.length})</span>
            </a>
          </li>
          <li role="presentation">
            <a
              href="#"
              className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('active');
              }}
              role="tab"
            >
              <span className="title">Active Courses</span>
              <span className="counter">
                ({activeCourses.filter(c => c.progressPercentage && c.progressPercentage > 0 && c.progressPercentage < 100).length})
              </span>
            </a>
          </li>
          <li role="presentation">
            <a
              href="#"
              className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('completed');
              }}
              role="tab"
            >
              <span className="title">Completed Courses</span>
              <span className="counter">
                ({activeCourses.filter(c => c.progressPercentage === 100).length})
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'enrolled' || activeTab === 'active' || activeTab === 'completed' ? 'active show' : ''}`}>
          {filteredCourses.length > 0 ? (
            <div className="row g-5">
              {filteredCourses.map((course) => (
                <div key={course.courseId} className="col-lg-4 col-md-6 col-12">
                  <div className="rbt-card variation-01 rbt-hover">
                    <div className="rbt-card-img">
                      <Link href={`/courses/${course.courseId}`}>
                        <Image
                          src={'/assets/'+course.imageUrl || '/assets/images/course/course-online-01.jpg'}
                          alt={course.courseName || 'Course'}
                          width={400}
                          height={250}
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="rbt-card-body">
                      <div className="rbt-card-top">
                        {course.category && (
                          <div className="rbt-review">
                            <span className="rbt-badge variation-02 bg-color-primary color-white radius-round">
                              {course.category}
                            </span>
                          </div>
                        )}
                        <div className="rbt-bookmark-btn">
                          <a className="rbt-round-btn" title="Bookmark" href="#">
                            <i className="feather-bookmark"></i>
                          </a>
                        </div>
                      </div>
                      <h4 className="rbt-card-title">
                        <Link href={`/courses/${course.courseId}`}>
                          {course.courseName || 'Untitled Course'}
                        </Link>
                      </h4>
                      <ul className="rbt-meta">
                        {course.totalParts && (
                          <li>
                            <i className="feather-book"></i>
                            {course.totalParts} {course.totalParts === 1 ? 'Part' : 'Parts'}
                          </li>
                        )}
                        {course.completedParts !== undefined && course.totalParts && (
                          <li>
                            <i className="feather-check-circle"></i>
                            {course.completedParts} / {course.totalParts} Completed
                          </li>
                        )}
                      </ul>

                      {course.progressPercentage !== undefined && (
                        <div className="rbt-progress-style-1 mb--20 mt--10">
                          <div className="single-progress">
                            <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                            <div className="progress">
                              <div
                                className="progress-bar wow fadeInLeft bar-color-success"
                                role="progressbar"
                                style={{ width: `${course.progressPercentage}%` }}
                                aria-valuenow={course.progressPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                              <span className="rbt-title-style-2 progress-number">
                                {Math.round(course.progressPercentage)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="rbt-card-bottom">
                        {course.progressPercentage === 100 ? (
                          <a className="rbt-btn btn-sm bg-primary-opacity w-100 text-center" href="#">
                            Download Certificate
                          </a>
                        ) : course.nextContent ? (
                          <Link 
                            className="rbt-btn btn-sm bg-primary-opacity w-100 text-center" 
                            href={`/courses/${course.courseId}`}
                          >
                            Continue Learning
                          </Link>
                        ) : (
                          <Link 
                            className="rbt-btn btn-sm bg-primary-opacity w-100 text-center" 
                            href={`/courses/${course.courseId}`}
                          >
                            Start Course
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-5">
              <div className="col-12">
                <div className="text-center p--40">
                  <p>No courses found in this category.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

