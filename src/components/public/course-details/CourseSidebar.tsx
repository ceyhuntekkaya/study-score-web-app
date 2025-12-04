'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CourseSidebarProps {
  currentPrice: string;
  oldPrice?: string;
  discountDays?: number;
  videoPreview?: {
    thumbnail: string;
    videoUrl: string;
  };
  courseFeatures: {
    label: string;
    value: string;
  }[];
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

/**
 * Course Sidebar Component
 * Converted from template
 */
export default function CourseSidebar({
  currentPrice,
  oldPrice,
  discountDays,
  videoPreview,
  courseFeatures,
  onAddToCart,
  onBuyNow,
}: CourseSidebarProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="col-lg-4">
      <div className="course-sidebar sticky-top rbt-shadow-box course-sidebar-top rbt-gradient-border">
        <div className="inner">
          {/* Video Preview */}
          {videoPreview && (
            <a
              className="video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15"
              href={videoPreview.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="video-content">
                <Image
                  className="w-100 rbt-radius"
                  src={videoPreview.thumbnail}
                  alt="Video Images"
                  width={400}
                  height={250}
                  style={{ objectFit: 'cover' }}
                />
                <div className="position-to-top">
                  <span className="rbt-btn rounded-player-2 with-animation">
                    <span className="play-icon"></span>
                  </span>
                </div>
                <span className="play-view-text d-block color-white">
                  <i className="feather-eye"></i> Preview this course
                </span>
              </div>
            </a>
          )}

          <div className="content-item-content">
            <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
              <div className="rbt-price">
                <span className="current-price">{currentPrice}</span>
                {oldPrice && <span className="off-price">{oldPrice}</span>}
              </div>
              {discountDays && (
                <div className="discount-time">
                  <span className="rbt-badge color-danger bg-color-danger-opacity">
                    <i className="feather-clock"></i> {discountDays} days left!
                  </span>
                </div>
              )}
            </div>

            <div className="add-to-card-button mt--15">
              <a
                className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
                }}
              >
                <span className="btn-text">Add to Cart</span>
                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
              </a>
            </div>

            <div className="buy-now-btn mt--15">
              <a
                className="rbt-btn btn-border icon-hover w-100 d-block text-center"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBuyNow?.();
                }}
              >
                <span className="btn-text">Buy Now</span>
                <span className="btn-icon"><i className="feather-arrow-right"></i></span>
              </a>
            </div>

            <span className="subtitle">
              <i className="feather-rotate-ccw"></i> 30-Day Money-Back Guarantee
            </span>

            <div className="rbt-widget-details has-show-more">
              <ul className={`has-show-more-inner-content rbt-course-details-list-wrapper ${showMore ? '' : 'collapsed'}`}>
                {courseFeatures.map((feature, index) => (
                  <li key={index}>
                    <span>{feature.label}</span>
                    <span className="rbt-feature-value rbt-badge-5">{feature.value}</span>
                  </li>
                ))}
              </ul>
              {courseFeatures.length > 5 && (
                <div className="rbt-show-more-btn" onClick={() => setShowMore(!showMore)}>
                  {showMore ? 'Show Less' : 'Show More'}
                </div>
              )}
            </div>

            <div className="social-share-wrapper mt--30 text-center">
              <div className="rbt-post-share d-flex align-items-center justify-content-center">
                <ul className="social-icon social-default transparent-with-border justify-content-center">
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
              </div>
              <hr className="mt--20" />
              <div className="contact-with-us text-center">
                <p>For details about the course</p>
                <p className="rbt-badge-2 mt--10 justify-content-center w-100">
                  <i className="feather-phone mr--5"></i> Call Us:{' '}
                  <a href="tel:+444555666777">
                    <strong>+444 555 666 777</strong>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

