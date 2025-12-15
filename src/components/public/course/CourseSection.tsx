'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Course Section Component
 * Converted from template - uses React state instead of Bootstrap tabs
 */
export default function CourseSection() {
  const [activeTab, setActiveTab] = useState('development');

  const tabs = [
    { id: 'development', label: 'AI Smart Tutor' },
    { id: 'ui-ux', label: 'Hyper-Personalized' },
    { id: 'marketing', label: 'Micro-Precision Analysis' },
    { id: 'business', label: 'Exam-Specific Mastery' },
  ];

  const courses = [
    {
      id: 1,
      image: '/assets/images/course/university-01.jpg',
      title: 'AI-Powered Adaptive Learning',
      description: 'Your personal AI tutor adapts the curriculum in real-time based on your performance, ensuring you focus exactly on what you need to improve.',
      lessons: 'Dynamic Content',
      students: 'Personal Plan',
      rating: 5,
      reviews: 1,
      currentPrice: '',
      oldPrice: '',
    },
    {
      id: 2,
      image: '/assets/images/course/university-02.jpg',
      title: 'Real-Time Progress Tracking',
      description: 'Track your growth with microscopic precision. Our dashboard highlights your exact weak points so you can turn them into strengths instantly.',
      lessons: 'Deep Analysis',
      students: 'Success Map',
      rating: 5,
      reviews: 1,
      currentPrice: '',
      oldPrice: '',
    },
    {
      id: 3,
      image: '/assets/images/course/university-03.jpg',
      title: 'Instant Smart Feedback',
      description: 'Receive immediate, detailed critiques on your writing and speaking tasks, just like a private tutor sitting right beside you.',
      lessons: 'Real Simulations',
      students: 'Instant Grade',
      rating: 5,
      reviews: 1,
      currentPrice: '',
      oldPrice: '',
    },
  ];

  const courses2 = [
    {
      id: 1,
      image: '/assets/images/course/university-01.jpg',
      title: 'Data Science & ML',
      description: 'Orem Ipsum is that it has a more-or-less normal distribution of letters.',
      lessons: '07 Lessons',
      students: '01 Students',
      rating: 5,
      reviews: 1,
      currentPrice: '',
      oldPrice: '',
    },
    {
      id: 2,
      image: '/assets/images/course/university-02.jpg',
      title: 'English Course',
      description: 'Orem Ipsum is that it has a more-or-less normal distribution of letters.',
      lessons: '07 Lessons',
      students: '01 Students',
      rating: 5,
      reviews: 1,
      currentPrice: '',
      oldPrice: '',
    },
    {
      id: 3,
      image: '/assets/images/course/university-03.jpg',
      title: 'Graphic Design',
      description: 'Orem Ipsum is that it has a more-or-less normal distribution of letters.',
      lessons: '07 Lessons',
      students: '01 Students',
      rating: 5,
      reviews: 1,
      currentPrice: '',
      oldPrice: '',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? '' : 'text-muted'}`}></i>
    ));
  };

  return (
    <div className="rbt-course-area rbt-sec-cir-shadow-1 bg-color-extra2 rbt-section-gap rbt-section-box">
      <div className="gradient-shape-top"></div>
      <div className="gradient-shape-bottom"></div>
      <div className="container">
        <div className="row mb--30">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <h6 className="b2 mb--15">
                <span className="theme-gradient">Admission</span>
              </h6>
              <h2 className="title w-600">
                Academic Programs <br />{' '}
                <span className="theme-gradient">At Study Score</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row mb--40">
          <div className="col-lg-12">
            <div className="rbt-course-tab-button-wrap">
              <ul className="rbt-course-tab-button nav nav-tabs" role="tablist">
                {tabs.map((tab) => (
                  <li key={tab.id} className="nav-item" role="presentation">
                    <button
                      className={activeTab === tab.id ? 'active' : ''}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                      role="tab"
                    >
                      <span className="filter-text">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="tab-content">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`tab-pane fade ${activeTab === tab.id ? 'active show' : ''}`}
                  role="tabpanel"
                >
                  <div className="row g-5">
                    {courses.map((course) => (
                      <div key={course.id} className="col-lg-4 col-md-6 col-12">
                        <div className="rbt-card variation-04 rbt-hover">
                          <div className="rbt-card-img">
                            <Link href="/course-details">
                              <Image 
                                src={course.image} 
                                alt={course.title} 
                                width={400} 
                                height={250}
                                style={{ objectFit: 'cover' }}
                              />
                            </Link>
                          </div>
                          <div className="rbt-card-body">
                            <ul className="rbt-meta">
                              <li>
                                <i className="feather-book"></i>
                                {course.lessons}
                              </li>
                              <li>
                                <i className="feather-users"></i>
                                {course.students}
                              </li>
                            </ul>
                            <h4 className="rbt-card-title">
                              <Link href="/course-details">{course.title}</Link>
                            </h4>
                            <p className="rbt-card-text">{course.description}</p>
                            <div className="rbt-review">
                              <div className="rating">{renderStars(course.rating)}</div>
                              <span className="rating-count"> ({course.reviews} Reviews)</span>
                            </div>
                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <h6 className="current-price mb-0">{course.currentPrice}</h6>
                                <span className="off-price version-02">{course.oldPrice}</span>
                              </div>
                              <Link className="rbt-btn-link color-primary" href="/login">
                                Enroll Course<i className="feather-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

