'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * Manager My Courses Page
 * Template content converted to React components
 */
export default function ManagerCoursesPage() {
  const courses = [
    {
      id: 1,
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
      enrolled: 50,
      rating: 5,
      price: '$49.00',
    },
    {
      id: 2,
      title: 'PHP Beginner + Advanced',
      image: '/assets/images/course/course-online-02.jpg',
      enrolled: 40,
      rating: 5,
      price: '$39.00',
    },
    {
      id: 3,
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      enrolled: 30,
      rating: 4,
      price: '$59.00',
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
        <h4 className="rbt-title-style-3">My Courses</h4>
      </div>

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
                  </div>
                </div>
                <h4 className="rbt-card-title">
                  <Link href="/courses/course-details">{course.title}</Link>
                </h4>
                <ul className="rbt-meta">
                  <li><i className="feather-users"></i>{course.enrolled} Students</li>
                  <li><i className="feather-dollar-sign"></i>{course.price}</li>
                </ul>
                <div className="rbt-card-bottom">
                  <a className="rbt-btn btn-sm bg-primary-opacity w-100 text-center" href="#">
                    Edit Course
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

