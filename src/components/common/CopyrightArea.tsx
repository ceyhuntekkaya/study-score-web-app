'use client';

import Link from 'next/link';
import { getCompanyInfo, getCopyrightLinks } from '@/lib/contact';

/**
 * Copyright Area Component
 * Reusable copyright section for all footers
 */
export default function CopyrightArea() {
  const company = getCompanyInfo();
  const copyrightLinks = getCopyrightLinks();

  return (
    <div className="copyright-area copyright-style-1 ptb--20">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
            <p className="rbt-link-hover text-center text-lg-start">
              Copyright © 2026{' '}
              <Link href={company.website || '#'}>{company.name}</Link>. All Rights Reserved
            </p>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
            <ul className="copyright-link rbt-link-hover justify-content-center justify-content-lg-end mt_sm--10 mt_md--10">
              {copyrightLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

