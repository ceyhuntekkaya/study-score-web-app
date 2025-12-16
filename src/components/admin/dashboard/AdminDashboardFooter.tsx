'use client';

import Link from 'next/link';
import Image from 'next/image';
import CopyrightArea from '@/components/common/CopyrightArea';

/**
 * Admin Dashboard Footer Component
 * Based on manager footer template
 */
export default function AdminDashboardFooter() {
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
