'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Learner Enrolled Courses Page
 * Template content converted to React components
 */
export default function EnrolledCoursesPage() {
  const [activeTab, setActiveTab] = useState('enrolled');

  const courses = [
    {
      id: 1,
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
      rating: 5,
      reviews: 15,
      lessons: 20,
      students: 40,
      progress: 90,
    },
    {
      id: 2,
      title: 'PHP Beginner + Advanced',
      image: '/assets/images/course/course-online-02.jpg',
      rating: 5,
      reviews: 15,
      lessons: 10,
      students: 30,
      progress: 40,
    },
    {
      id: 3,
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      rating: 5,
      reviews: 4,
      lessons: 14,
      students: 26,
      progress: 65,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? '' : 'empty'}`}></i>
    ));
  };

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
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'enrolled' ? 'active show' : ''}`}>
          <div className="row g-5">
            {courses.map((course) => (
              <div key={course.id} className="col-lg-4 col-md-6 col-12">
                <div className="rbt-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <Link href="/courses/course-details">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={400}
                        height={250}
                      />
                    </Link>
                  </div>
                  <div className="rbt-card-body">
                    <div className="rbt-card-top">
                      <div className="rbt-review">
                        <div className="rating">
                          {renderStars(course.rating)}
                        </div>
                        <span className="rating-count"> ({course.reviews} Reviews)</span>
                      </div>
                      <div className="rbt-bookmark-btn">
                        <a className="rbt-round-btn" title="Bookmark" href="#">
                          <i className="feather-bookmark"></i>
                        </a>
                      </div>
                    </div>
                    <h4 className="rbt-card-title">
                      <Link href="/courses/course-details">{course.title}</Link>
                    </h4>
                    <ul className="rbt-meta">
                      <li><i className="feather-book"></i>{course.lessons} Lessons</li>
                      <li><i className="feather-users"></i>{course.students} Students</li>
                    </ul>

                    <div className="rbt-progress-style-1 mb--20 mt--10">
                      <div className="single-progress">
                        <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                        <div className="progress">
                          <div
                            className="progress-bar wow fadeInLeft bar-color-success"
                            role="progressbar"
                            style={{ width: `${course.progress}%` }}
                            aria-valuenow={course.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                          <span className="rbt-title-style-2 progress-number">{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="rbt-card-bottom">
                      <a className="rbt-btn btn-sm bg-primary-opacity w-100 text-center" href="#">
                        Download Certificate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === 'active' ? 'active show' : ''}`}>
          <div className="row g-5">
            <div className="col-12">
              <p>Active courses will be displayed here.</p>
            </div>
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === 'completed' ? 'active show' : ''}`}>
          <div className="row g-5">
            <div className="col-12">
              <p>Completed courses will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

