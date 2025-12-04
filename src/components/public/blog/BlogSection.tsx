'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * Blog Section Component
 * Converted from template
 */
export default function BlogSection() {
  const blogs = [
    {
      id: 1,
      image: '/assets/images/blog/university-blog-01.png',
      title: 'Difficult Things About Education.',
      description: 'There are many variations of passages of Ipsum available,',
    },
    {
      id: 2,
      image: '/assets/images/blog/coaching-blog-02.png',
      title: 'Learn How More Money With lms.',
      description: 'There are many variations of passages of Ipsum available,',
    },
    {
      id: 3,
      image: '/assets/images/blog/university-blog-02.png',
      title: 'Understand The Background Of lms.',
      description: 'There are many variations of passages of Ipsum available,',
    },
  ];

  return (
    <div className="rbt-blog-area rbt-sec-cir-shadow-1 rbt-section-gap bg-color-extra2 rbt-section-box">
      <div className="gradient-shape-top version-02"></div>
      <div className="gradient-shape-bottom version-02"></div>
      <div className="container">
        <div className="row mb--60 mb_sm--50 g-5 align-items-end">
          <div className="col-lg-8 col-md-8 col-12">
            <div className="section-title text-start">
              <h6 className="b2 mb--15">
                <span className="theme-gradient">News & Blog</span>
              </h6>
              <h2 className="title w-600">
                Have a Look on <span className="theme-gradient">Our Update</span>
              </h2>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-12">
            <div className="load-more-btn text-start text-md-end">
              <Link className="rbt-btn btn-gradient hover-icon-reverse" href="/blog">
                <span className="icon-reverse-wrapper">
                  <span className="btn-text">View All Posts</span>
                  <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                  <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Card Area */}
        <div className="row g-5">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="rbt-card variation-02 rbt-hover">
                <div className="rbt-card-img">
                  <Link href="/blog-details">
                    <Image 
                      src={blog.image} 
                      alt={blog.title} 
                      width={400} 
                      height={250}
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                </div>
                <div className="rbt-card-body">
                  <h5 className="rbt-card-title">
                    <Link href="/blog-details">{blog.title}</Link>
                  </h5>
                  <p className="rbt-card-text">{blog.description}</p>
                  <div className="rbt-card-bottom">
                    <Link className="transparent-button" href="/blog-details">
                      Read More
                      <i>
                        <svg width="17" height="12" xmlns="http://www.w3.org/2000/svg">
                          <g stroke="#27374D" fill="none" fillRule="evenodd">
                            <path d="M10.614 0l5.629 5.629-5.63 5.629" />
                            <path strokeLinecap="square" d="M.663 5.572h14.594" />
                          </g>
                        </svg>
                      </i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

