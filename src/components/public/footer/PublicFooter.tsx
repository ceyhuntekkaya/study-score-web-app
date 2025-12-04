'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Public Footer Component
 * Converted from template without jQuery dependency
 */
export default function PublicFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic will be added later
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="rbt-footer footer-style-1 bg-color-white">
      <div className="footer-top">
        <div className="container">
          <div className="row g-5">
            {/* About Section */}
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <div className="logo logo-dark">
                  <Link href="/">
                    <Image 
                      src="/assets/images/logo/logo.png" 
                      alt="Study Score App" 
                      width={150} 
                      height={40}
                    />
                  </Link>
                </div>
                <div className="logo d-none logo-light">
                  <Link href="/">
                    <Image 
                      src="/assets/images/dark/logo/logo-light.png" 
                      alt="Study Score App" 
                      width={150} 
                      height={40}
                    />
                  </Link>
                </div>

                <p className="description mt--20">
                  We're always in search for talented and motivated people. 
                  Don't be shy introduce yourself!
                </p>

                <ul className="social-icon social-default justify-content-start">
                  <li>
                    <a href="https://www.facebook.com/" aria-label="Facebook">
                      <i className="feather-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com" aria-label="Twitter">
                      <i className="feather-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" aria-label="Instagram">
                      <i className="feather-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkdin.com/" aria-label="LinkedIn">
                      <i className="feather-linkedin"></i>
                    </a>
                  </li>
                </ul>

                <div className="contact-btn mt--30">
                  <Link className="rbt-btn hover-icon-reverse btn-border-gradient radius-round" href="/contact">
                    <div className="icon-reverse-wrapper">
                      <span className="btn-text">Contact With Us</span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="col-lg-2 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h5 className="ft-title">Useful Links</h5>
                <ul className="ft-link">
                  <li><Link href="/courses">Courses</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/instructors">Instructors</Link></li>
                  <li><Link href="/events">Events</Link></li>
                  <li><Link href="/faq">FAQ</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* Our Company */}
            <div className="col-lg-2 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h5 className="ft-title">Our Company</h5>
                <ul className="ft-link">
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/become-teacher">Become Teacher</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/instructors">Instructor</Link></li>
                  <li><Link href="/events">Events</Link></li>
                  <li><Link href="/courses">Course</Link></li>
                </ul>
              </div>
            </div>

            {/* Get Contact */}
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h5 className="ft-title">Get Contact</h5>
                <ul className="ft-link">
                  <li>
                    <span>Phone:</span> <a href="tel:+1-406-555-0120">(406) 555-0120</a>
                  </li>
                  <li>
                    <span>E-mail:</span> <a href="mailto:admin@example.com">admin@example.com</a>
                  </li>
                  <li>
                    <span>Address:</span> <a href="#">15205 North Kierland Blvd.</a>
                  </li>
                </ul>

                <h6 className="w-600 mt--25">Newsletter</h6>
                <form 
                  onSubmit={handleNewsletterSubmit}
                  className="newsletter-form-1 version-02 mt--15 radius-round"
                >
                  <input 
                    className="rbt-border" 
                    type="email" 
                    placeholder="Enter Your E-Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    className="rbt-btn rbt-switch-btn btn-gradient radius-round btn-md" 
                    type="submit"
                  >
                    <span data-text="Subscribe">Subscribe</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>

      {/* Copyright Area */}
      <div className="copyright-area copyright-style-1 ptb--20">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
              <p className="rbt-link-hover text-center text-lg-start">
                Copyright © 2025 <a href="#">Study Score App.</a> All Rights Reserved
              </p>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
              <ul className="copyright-link rbt-link-hover justify-content-center justify-content-lg-end mt_sm--10 mt_md--10">
                <li><Link href="/terms">Terms of service</Link></li>
                <li><Link href="/privacy-policy">Privacy policy</Link></li>
                <li><Link href="/subscription">Subscription</Link></li>
                <li><Link href="/login">Login & Register</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

