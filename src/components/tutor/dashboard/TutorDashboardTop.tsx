'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Tutor Dashboard Top Section Component
 * Converted from template - tutor information section
 */
export default function TutorDashboardTop() {
  const { user } = useAuth();

  return (
    <div className="rbt-dashboard-content-wrapper">
      <div className="tutor-bg-photo bg_image bg_image--23 height-350"></div>
      {/* Tutor Information */}
      <div className="rbt-tutor-information">
        <div className="rbt-tutor-information-left">
          <div className="thumbnail rbt-avatars size-lg">
            <Image
              src="/assets/images/team/avatar-2.jpg"
              alt={user?.name || 'Tutor'}
              width={100}
              height={100}
            />
          </div>
          <div className="tutor-content">
            <h5 className="title">{user?.name || 'Tutor'}</h5>
            <ul className="rbt-meta rbt-meta-white mt--5">
              <li>
                <i className="feather-book"></i>5 Courses Enroled
              </li>
              <li>
                <i className="feather-award"></i>4 Certificate
              </li>
            </ul>
          </div>
        </div>
        <div className="rbt-tutor-information-right">
          <div className="tutor-btn">
            <Link className="rbt-btn btn-md hover-icon-reverse" href="/tutor/dashboard/courses/create">
              <span className="icon-reverse-wrapper">
                <span className="btn-text">Create New Course</span>
                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

