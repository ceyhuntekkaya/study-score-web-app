'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getPrimaryPhone } from '@/lib/contact';

/**
 * Manager Settings Page
 * Template content converted to React components
 */
export default function ManagerSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const defaultPhone = getPrimaryPhone();

  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Due',
    username: user?.email?.split('@')[0] || 'instructor',
    phone: defaultPhone.display,
    skill: 'Full Stack Developer',
    displayName: 'John Due',
    bio: "I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences.",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
  });

  const [socialData, setSocialData] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    website: '',
    github: '',
  });

  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
  };

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Password updated');
  };

  const handleSocialSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Social links updated:', socialData);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialData({
      ...socialData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Settings</h4>
      </div>

      <div className="advance-tab-button mb--30">
        <ul className="nav nav-tabs tab-button-style-2 justify-content-start" role="tablist">
          <li role="presentation">
            <a
              href="#"
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('profile');
              }}
              role="tab"
              style={{ color: activeTab === 'profile' ? undefined : '#333' }}
            >
              <span className="title">Profile</span>
            </a>
          </li>
          <li role="presentation">
            <a
              href="#"
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('password');
              }}
              role="tab"
              style={{ color: activeTab === 'password' ? undefined : '#333' }}
            >
              <span className="title">Password</span>
            </a>
          </li>
          <li role="presentation">
            <a
              href="#"
              className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('social');
              }}
              role="tab"
              style={{ color: activeTab === 'social' ? undefined : '#333' }}
            >
              <span className="title">Social Share</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content">
        {/* Profile Tab */}
        <div className={`tab-pane fade ${activeTab === 'profile' ? 'active show' : ''}`}>
          <div className="rbt-dashboard-content-wrapper mb--30">
            <div className="manager-bg-photo bg_image bg_image--23 height-245"></div>
            <div className="rbt-manager-information">
              <div className="rbt-manager-information-left">
                <div className="thumbnail rbt-avatars size-lg position-relative">
                  <Image
                    src="/assets/images/team/avatar-2.jpg"
                    alt="Manager"
                    width={100}
                    height={100}
                  />
                  <div className="rbt-edit-photo-inner">
                    <button className="rbt-edit-photo" title="Upload Photo">
                      <i className="feather-camera"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="rbt-manager-information-right">
                <div className="manager-btn">
                  <a className="rbt-btn btn-sm btn-border color-white radius-round-10" href="#">
                    Edit Cover Photo
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="rbt-profile-row rbt-default-form row row--15">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="rbt-form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  name="firstName"
                  type="text"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="rbt-form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  name="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="rbt-form-group">
                <label htmlFor="username">User Name</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileData.username}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="rbt-form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <input
                  id="phonenumber"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="rbt-form-group">
                <label htmlFor="skill">Skill/Occupation</label>
                <input
                  id="skill"
                  name="skill"
                  type="text"
                  value={profileData.skill}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="filter-select rbt-modern-select">
                <label htmlFor="displayname">Display name publicly as</label>
                <select
                  id="displayname"
                  name="displayName"
                  className="w-100"
                  value={profileData.displayName}
                  onChange={handleProfileChange}
                >
                  <option>John Due</option>
                  <option>John</option>
                  <option>Due</option>
                  <option>Due John</option>
                  <option>johndue</option>
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  cols={20}
                  rows={5}
                  value={profileData.bio}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div className="col-12 mt--20">
              <div className="rbt-form-group">
                <button type="submit" className="rbt-btn btn-gradient">
                  Update Info
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Password Tab */}
        <div className={`tab-pane fade ${activeTab === 'password' ? 'active show' : ''}`}>
          <form onSubmit={handlePasswordSubmit} className="rbt-profile-row rbt-default-form row row--15">
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="currentpassword">Current Password</label>
                <input
                  id="currentpassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="newpassword">New Password</label>
                <input
                  id="newpassword"
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="retypenewpassword">Re-type New Password</label>
                <input
                  id="retypenewpassword"
                  name="retypePassword"
                  type="password"
                  placeholder="Re-type New Password"
                  value={passwordData.retypePassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="col-12 mt--10">
              <div className="rbt-form-group">
                <button type="submit" className="rbt-btn btn-gradient">
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Social Share Tab */}
        <div className={`tab-pane fade ${activeTab === 'social' ? 'active show' : ''}`}>
          <form onSubmit={handleSocialSubmit} className="rbt-profile-row rbt-default-form row row--15">
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="facebook">
                  <i className="feather-facebook"></i> Facebook
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  type="text"
                  placeholder="https://facebook.com/"
                  value={socialData.facebook}
                  onChange={handleSocialChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="twitter">
                  <i className="feather-twitter"></i> Twitter
                </label>
                <input
                  id="twitter"
                  name="twitter"
                  type="text"
                  placeholder="https://twitter.com/"
                  value={socialData.twitter}
                  onChange={handleSocialChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="linkedin">
                  <i className="feather-linkedin"></i> Linkedin
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  placeholder="https://linkedin.com/"
                  value={socialData.linkedin}
                  onChange={handleSocialChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="website">
                  <i className="feather-globe"></i> Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="https://website.com/"
                  value={socialData.website}
                  onChange={handleSocialChange}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="rbt-form-group">
                <label htmlFor="github">
                  <i className="feather-github"></i> Github
                </label>
                <input
                  id="github"
                  name="github"
                  type="text"
                  placeholder="https://github.com/"
                  value={socialData.github}
                  onChange={handleSocialChange}
                />
              </div>
            </div>
            <div className="col-12 mt--10">
              <div className="rbt-form-group">
                <button type="submit" className="rbt-btn btn-gradient">
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

