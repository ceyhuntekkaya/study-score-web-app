'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import CopyrightArea from '@/components/common/CopyrightArea';

/**
 * Manager Dashboard Footer Component
 * Converted from template - similar to tutor footer
 */
export default function ManagerDashboardFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    // TODO: Implement newsletter subscription
    setEmail('');
  };

  return (
    <footer className="rbt-footer footer-style-1 bg-color-white overflow-hidden">
      <div className="footer-top">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <div className="logo logo-dark">
                  <Link href="/">
                    <Image
                      src="/assets/images/logo/logo.png"
                      alt="Study Score"
                      width={200}
                      height={50}
                    />
                  </Link>
                </div>
                <div className="logo d-none logo-light">
                  <Link href="/">
                    <Image
                      src="/assets/images/dark/logo/logo-light.png"
                      alt="Study Score"
                      width={200}
                      height={50}
                    />
                  </Link>
                </div>

                <p className="description mt--20">
                  We're always in search for talented and motivated people. Don't be shy introduce yourself!
                </p>

                <ul className="social-icon social-default justify-content-start">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                      <i className="feather-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                      <i className="feather-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                      <i className="feather-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkdin.com/" target="_blank" rel="noopener noreferrer">
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

            <div className="col-lg-2 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h5 className="ft-title">Useful Links</h5>
                <ul className="ft-link">
                  <li>
                    <Link href="/courses">Marketplace</Link>
                  </li>
                  <li>
                    <Link href="/courses">Courses</Link>
                  </li>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy policy</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h5 className="ft-title">Our Company</h5>
                <ul className="ft-link">
                  <li>
                    <Link href="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link href="/become-instructor">Become Teacher</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/instructors">Instructor</Link>
                  </li>
                  <li>
                    <Link href="/events">Events</Link>
                  </li>
                  <li>
                    <Link href="/courses">Course</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="footer-widget">
                <h5 className="ft-title">Get Contact</h5>
                <ul className="ft-link">
                  <li>
                    <span>Phone:</span> <a href="tel:+4065550120">(406) 555-0120</a>
                  </li>
                  <li>
                    <span>E-mail:</span> <a href="mailto:admin@example.com">admin@example.com</a>
                  </li>
                </ul>

                <form className="newsletter-form mt--20" onSubmit={handleNewsletterSubmit}>
                  <h6 className="w-600">Newsletter</h6>
                  <p className="description">
                    2000+ Our students are subscribe Around the World.
                    <br /> Don't be shy introduce yourself!
                  </p>

                  <div className="form-group right-icon icon-email mb--20">
                    <label htmlFor="email">Enter Your Email Here</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb--0">
                    <button className="rbt-btn rbt-switch-btn btn-gradient radius-round btn-sm" type="submit">
                      <span data-text="Submit Now">Submit Now</span>
                    </button>
                  </div>
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
      <CopyrightArea />
    </footer>
  );
}

