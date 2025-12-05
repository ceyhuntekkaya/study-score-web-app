'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useTranslation } from '@/i18n';

/**
 * Register Page
 * User registration form with template styling
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Handle form focus animations
  useEffect(() => {
    const formGroups = document.querySelectorAll('.form-group');
    const cleanupFunctions: (() => void)[] = [];
    
    formGroups.forEach((group) => {
      const input = group.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
      if (!input) return;

      const handleFocus = () => {
        group.classList.add('focused');
      };

      const handleBlur = () => {
        if (!input.value) {
          group.classList.remove('focused');
        }
      };

      // Check if input has value on mount
      if (input.value) {
        group.classList.add('focused');
      }

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);

      cleanupFunctions.push(() => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    // Create dummy user based on selected role
    const dummyUser = {
      id: `user-${selectedRole}-${Date.now()}`,
      email: formData.email || `${selectedRole}@example.com`,
      name: `${formData.firstName} ${formData.lastName}`.trim() || `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`,
      role: selectedRole,
      avatar: undefined,
    };

    // Create dummy tokens
    const dummyTokens = {
      accessToken: `dummy-access-token-${selectedRole}-${Date.now()}`,
      refreshToken: `dummy-refresh-token-${selectedRole}-${Date.now()}`,
    };

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setAuth(dummyUser, dummyTokens);
      router.push(`/${selectedRole}/dashboard`);
    }, 1000);
  };

  return (
    <>
      <div className="rbt-page-banner-wrapper">
        <div className="rbt-banner-image"></div>
        <div className="rbt-banner-content">
          <div className="rbt-banner-content-top">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <ul className="page-list">
                    <li className="rbt-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <div className="icon-right"><i className="feather-chevron-right"></i></div>
                    </li>
                    <li className="rbt-breadcrumb-item active">Register</li>
                  </ul>
                  <div className="title-wrapper">
                    <h1 className="title mb--0">Create Your Account</h1>
                  </div>
                  <p className="description">Join thousands of students learning with Study Score App</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rbt-section-gapTop rbt-section-gapBottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                <div className="section-title text-center mb--40">
                  <span className="subtitle bg-primary-opacity">GET STARTED</span>
                  <h3 className="title">Sign Up for Free</h3>
                  <p className="description">Fill in your details to create your account</p>
                </div>

                <form 
                  className="rainbow-dynamic-form max-width-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="row g-5">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        <label>First Name</label>
                        <span className="focus-border"></span>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        <label>Last Name</label>
                        <span className="focus-border"></span>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label>Email Address</label>
                        <span className="focus-border"></span>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <label>Phone Number (Optional)</label>
                        <span className="focus-border"></span>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                        />
                        <label>Password</label>
                        <span className="focus-border"></span>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group">
                        <input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          minLength={6}
                        />
                        <label>Confirm Password</label>
                        <span className="focus-border"></span>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group">
                        <label style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '20px' }}>
                          <input
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                            style={{ marginRight: '10px', width: 'auto' }}
                          />
                          <span>
                            I agree to the{' '}
                            <Link href="/terms" className="theme-gradient">
                              Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy-policy" className="theme-gradient">
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: 'var(--color-heading)' }}>
                          Account Type (for testing):
                        </label>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '4px',
                            border: '2px solid var(--color-border)',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <option value="learner">Learner</option>
                          <option value="tutor">Tutor</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                          <option value="writer">Writer</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-submit-group">
                        <button
                          type="submit"
                          className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                          disabled={isSubmitting}
                        >
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                            <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                            <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="text-center mt--30">
                        <p className="description">
                          Already have an account?{' '}
                          <Link href="/login" className="theme-gradient">
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
