'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Manager Dashboard Top Section Component
 * Converted from template - manager information section (same as tutor)
 */
export default function ManagerDashboardTop() {
  const { user } = useAuth();

  return (
    <div className="rbt-dashboard-content-wrapper">
      <div className="tutor-bg-photo bg_image bg_image--23 height-350"></div>
      {/* Manager Information */}
      <div className="rbt-tutor-information">
        <div className="rbt-tutor-information-left">
          <div className="thumbnail rbt-avatars size-lg">
            <Image
              src="/assets/images/team/avatar-2.jpg"
              alt={user?.name || 'Manager'}
              width={100}
              height={100}
            />
          </div>
          <div className="tutor-content">
            <h5 className="title">{user?.name || 'Manager'}</h5>
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
            <Link className="rbt-btn btn-md hover-icon-reverse" href="/manager/dashboard/courses/create">
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

