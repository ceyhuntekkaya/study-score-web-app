'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Tutor Profile Page
 * Template content converted to React components
 */
export default function TutorProfilePage() {
  const { user } = useAuth();

  const profileData = [
    { label: 'Registration Date', value: 'February 25, 2025 6:01 am' },
    { label: 'First Name', value: user?.name?.split(' ')[0] || 'John' },
    { label: 'Last Name', value: user?.name?.split(' ')[1] || 'Due' },
    { label: 'Username', value: user?.email?.split('@')[0] || 'instructor' },
    { label: 'Email', value: user?.email || 'example@gmail.com' },
    { label: 'Phone Number', value: '+1-202-555-0174' },
    { label: 'Skill/Occupation', value: 'Full Stack Developer' },
    { label: 'Biography', value: "I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences." },
  ];

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">My Profile</h4>
      </div>

      {profileData.map((item, index) => (
        <div key={index} className={`rbt-profile-row row row--15 ${index > 0 ? 'mt--15' : ''}`}>
          <div className="col-lg-4 col-md-4">
            <div className="rbt-profile-content b2">{item.label}</div>
          </div>
          <div className="col-lg-8 col-md-8">
            <div className="rbt-profile-content b2">{item.value}</div>
          </div>
        </div>
      ))}
    </>
  );
}

