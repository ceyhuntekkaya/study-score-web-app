'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CourseInstructorSectionProps {
  instructor: {
    name: string;
    avatar: string;
    profileLink: string;
    title: string;
    rating: number;
    totalReviews: number;
    totalStudents: number;
    totalCourses: number;
    bio: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

/**
 * Course Instructor Section Component
 * Converted from template
 */
export default function CourseInstructorSection({ instructor }: CourseInstructorSectionProps) {
  return (
    <div className="rbt-instructor rbt-shadow-box intructor-wrapper mt--30" id="intructor">
      <div className="about-author border-0 pb--0 pt--0">
        <div className="section-title mb--30">
          <h4 className="rbt-title-style-3">Instructor</h4>
        </div>
        <div className="media align-items-center">
          <div className="thumbnail">
            <Link href={instructor.profileLink}>
              <Image
                src={instructor.avatar}
                alt={instructor.name}
                width={100}
                height={100}
              />
            </Link>
          </div>
          <div className="media-body">
            <div className="author-info">
              <h5 className="title">
                <Link className="hover-flip-item-wrapper" href={instructor.profileLink}>
                  {instructor.name}
                </Link>
              </h5>
              <span className="b3 subtitle">{instructor.title}</span>
              <ul className="rbt-meta mb--20 mt--10">
                <li>
                  <i className="fa fa-star color-warning"></i>
                  {instructor.totalReviews.toLocaleString()} Reviews{' '}
                  <span className="rbt-badge-5 ml--5">{instructor.rating} Rating</span>
                </li>
                <li>
                  <i className="feather-users"></i>
                  {instructor.totalStudents.toLocaleString()} Students
                </li>
                <li>
                  <Link href={instructor.profileLink}>
                    <i className="feather-video"></i>
                    {instructor.totalCourses} Courses
                  </Link>
                </li>
              </ul>
            </div>
            <div className="content">
              <p className="description">{instructor.bio}</p>

              {instructor.socialLinks && (
                <ul className="social-icon social-default icon-naked justify-content-start">
                  {instructor.socialLinks.facebook && (
                    <li>
                      <a href={instructor.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="feather-facebook"></i>
                      </a>
                    </li>
                  )}
                  {instructor.socialLinks.twitter && (
                    <li>
                      <a href={instructor.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <i className="feather-twitter"></i>
                      </a>
                    </li>
                  )}
                  {instructor.socialLinks.instagram && (
                    <li>
                      <a href={instructor.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="feather-instagram"></i>
                      </a>
                    </li>
                  )}
                  {instructor.socialLinks.linkedin && (
                    <li>
                      <a href={instructor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <i className="feather-linkedin"></i>
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

