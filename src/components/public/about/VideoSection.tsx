'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * Video Section Component
 * Converted from template
 */
export default function VideoSection() {
  return (
    <div className="rbt-video-area rbt-section-gapBottom pt--50 bg-color-white">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="inner pr--50">
              <div className="section-title text-start">
                <span className="subtitle bg-primary-opacity">How We Work</span>
                <h2 className="title">Build your Career And Upgrade Your Life</h2>
                <p className="description mt--30">
                  Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. 
                  Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
                </p>
                <div className="read-more-btn">
                  <Link className="rbt-moderbt-btn" href="/about">
                    <span className="moderbt-btn-text">Learn More About Us</span>
                    <i className="feather-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2">
            <div className="video-popup-wrapper">
              <Image 
                className="w-100 rbt-radius" 
                src="/assets/images/others/video-01.jpg" 
                alt="Video Images" 
                width={600} 
                height={400}
                style={{ objectFit: 'cover' }}
              />
              <a 
                className="popup-video position-to-top" 
                href="https://www.youtube.com/watch?v=nA1Aqp0sPQo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <Image 
                    src="/assets/images/icons/youtube.png" 
                    alt="YouTube" 
                    width={80} 
                    height={80}
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

