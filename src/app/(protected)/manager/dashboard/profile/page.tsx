'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useGetCurrentUser } from '@/generated/api/auth-rest-controller/auth-rest-controller';

/**
 * Manager Profile Page
 * Template content converted to React components
 */
export default function ManagerProfilePage() {
  const { user: localUser } = useAuth();
  const { data: apiUser } = useGetCurrentUser();

  // Use API user data if available, otherwise fall back to local user
  const user = apiUser || localUser;

  // Split name into first and last name if available
  const nameParts = user?.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Get organization info from API user
  const brandName = apiUser?.brand?.name;
  const campusName = apiUser?.campus?.name;
  const institutionName = apiUser?.institution?.name;
  const branchName = apiUser?.branch?.name;
  const level = apiUser?.level;
  
  // Format level for display
  const formatLevel = (level?: string) => {
    if (!level) return '';
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  const profileData = [
    { label: 'Name', value: user?.name || '' },
    ...(firstName && lastName ? [
      { label: 'First Name', value: firstName },
      { label: 'Last Name', value: lastName },
    ] : []),
    { label: 'Email', value: user?.email || '' },
    ...(user?.email ? [
      { label: 'Username', value: user.email.split('@')[0] },
    ] : []),
    { label: 'Role', value: localUser?.role ? localUser.role.charAt(0).toUpperCase() + localUser.role.slice(1) : '' },
    ...(brandName ? [{ label: 'Brand', value: brandName }] : []),
    ...(campusName ? [{ label: 'Campus', value: campusName }] : []),
    ...(institutionName ? [{ label: 'Institution', value: institutionName }] : []),
    ...(branchName ? [{ label: 'Branch', value: branchName }] : []),
    ...(level ? [{ label: 'Level', value: formatLevel(level) }] : []),
  ].filter(item => item.value); // Only show fields with values

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

