'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * About Section Component
 * Converted from template
 */
export default function AboutSection() {
  return (
    <div className="rbt-about-area rbt-section-gapTop overflow-hidden">
      <div className="about-style-4">
        <div className="container">
          <div className="row row--40 mt_dec--40">
            <div className="col-xl-6 col-12 mt--40">
              <div className="content">
                <div className="section-title">
                  <h6 className="b2 mb--15">
                    <span className="theme-gradient">Welcome To Histudy</span>
                  </h6>
                  <h2 className="title w-600">
                    Your Goals Are Within <br />
                    <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M2 16.8032C7.91578 16.9588 13.8152 14.5642 17.3757 9.31372C18.7544 7.28056 19.2564 4.87202 19.6736 2.5C20.006 12.1364 30.1484 15.4819 38 16.8227C30.9581 16.3571 23.3519 20.0182 22.65 27.5C18.2438 20.052 10.1583 17.4958 2 16.8032Z" 
                        fill="white" 
                        stroke="url(#paint0_linear_100_66)" 
                        strokeWidth="4" 
                        strokeMiterlimit="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      <defs>
                        <linearGradient id="paint0_linear_100_66" x1="18.2" y1="2.5" x2="18.2" y2="27.5" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#2F57EF" />
                          <stop offset="1" stopColor="#C586EE" />
                        </linearGradient>
                      </defs>
                    </svg> Reach.
                  </h2>
                  <p className="mt--20">
                    At Histudy University, we are moving boldly - and concertedly - to expand tomorrow's frontiers. 
                    We believe that we have the power to shape the future, for the better
                  </p>
                  <ul className="mt--30 mb--25">
                    <li>
                      <span className="icon bg-primary-opacity">
                        <i className="feather-heart"></i>
                      </span>
                      <span className="text">Flexible Classes</span>
                    </li>
                    <li>
                      <span className="icon bg-secondary-opacity">
                        <i className="feather-book"></i>
                      </span>
                      <span className="text">Learn From Anywhere</span>
                    </li>
                  </ul>
                  <div className="d-flex align-items-center gap-5 flex-wrap">
                    <Link className="rbt-btn btn-gradient hover-icon-reverse" href="/about">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Explore More</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </span>
                    </Link>
                    <div>
                      <Image 
                        src="/assets/images/others/signature-01.png" 
                        alt="Signature" 
                        width={150} 
                        height={60}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-12 mt--40">
              <div className="about-thumb">
                <div className="shape-1">
                  <Image 
                    src="/assets/images/shape/mf-shape-01.png" 
                    alt="Shape" 
                    width={200} 
                    height={200}
                  />
                </div>
                <div className="shape-2">
                  <Image 
                    src="/assets/images/shape/v-union.png" 
                    alt="Shape" 
                    width={150} 
                    height={150}
                  />
                </div>
                <div className="since">
                  <span>
                    <Image 
                      src="/assets/images/icons/award-01.png" 
                      alt="Award Icon" 
                      width={50} 
                      height={50}
                    />
                  </span>
                  <div className="title-wrap">
                    <h4 className="number">
                      <span className="odometer rbt-font-primary" data-count="1890">1890</span>
                    </h4>
                    <h6 className="subtitle">Since</h6>
                  </div>
                </div>
                <div className="thumb-1">
                  <Image 
                    src="/assets/images/others/m-banner-men.png" 
                    alt="Thumb" 
                    width={500} 
                    height={600}
                  />
                </div>
                <h6 className="title">President of University</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

