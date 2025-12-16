'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Admin Dashboard Top Section Component
 */
export default function AdminDashboardTop() {
  const { user } = useAuth();

  return (
    <div className="rbt-dashboard-content-wrapper">
      <div className="tutor-bg-photo bg_image bg_image--7 height-350"></div>
      {/* Admin Information */}
      <div className="rbt-tutor-information">
        <div className="rbt-tutor-information-left">
          <div className="thumbnail rbt-avatars size-lg">
            <Image
              src="/assets/images/team/avatar-2.jpg"
              alt={user?.name || 'Admin'}
              width={100}
              height={100}
            />
          </div>
          <div className="tutor-content">
            <h5 className="title">{user?.name || 'Admin'}</h5>
            <ul className="rbt-meta rbt-meta-white mt--5">
              <li>
                <i className="feather-shield"></i>Admin Panel
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
