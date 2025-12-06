'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogs } from '@/lib/blogs';

/**
 * Blog List Page
 * Displays all blog posts
 */
export default function BlogListPage() {
  const blogs = getAllBlogs();
  const featuredBlog = blogs.find(blog => blog.featured);
  const otherBlogs = blogs.filter(blog => !blog.featured);

  return (
    <>
      {/* Breadcrumb Section */}
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
                    <li className="rbt-breadcrumb-item active">All Blog</li>
                  </ul>
                  <div className="title-wrapper">
                    <h1 className="title mb--0">All Blog</h1>
                    <a href="#" className="rbt-badge-2">
                      <div className="image">🎉</div> {blogs.length} Articles
                    </a>
                  </div>
                  <p className="description">Blog that help beginner designers become true unicorns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Area */}
      <div className="rbt-blog-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          {/* Featured Blog and List */}
          <div className="row g-5">
            {/* Featured Blog Card */}
            {featuredBlog && (
              <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="rbt-card variation-02 height-330 rbt-hover">
                  <div className="rbt-card-img">
                    <Link href={`/blog/${featuredBlog.slug}`}>
                      <Image
                        src={featuredBlog.image}
                        alt={featuredBlog.title}
                        width={600}
                        height={400}
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                  </div>
                  <div className="rbt-card-body">
                    <h3 className="rbt-card-title">
                      <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                    </h3>
                    <p className="rbt-card-text">{featuredBlog.excerpt}</p>
                    <div className="rbt-card-bottom">
                      <Link className="transparent-button" href={`/blog/${featuredBlog.slug}`}>
                        Learn More
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
            )}

            {/* Blog List */}
            <div className="col-lg-6 col-md-12 col-sm-12 col-12">
              {otherBlogs.slice(0, 3).map((blog) => (
                <div key={blog.id} className={`rbt-card card-list variation-02 rbt-hover ${blog.id !== otherBlogs[0].id ? 'mt--30' : ''}`}>
                  <div className="rbt-card-img">
                    <Link href={`/blog/${blog.slug}`}>
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={300}
                        height={200}
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                  </div>
                  <div className="rbt-card-body">
                    <h5 className="rbt-card-title">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h5>
                    <div className="rbt-card-bottom">
                      <Link className="transparent-button" href={`/blog/${blog.slug}`}>
                        Read Article
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
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="row g-5 mt--15">
            {otherBlogs.slice(3).map((blog) => (
              <div key={blog.id} className="col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="rbt-card variation-02 rbt-hover">
                  <div className="rbt-card-img">
                    <Link href={`/blog/${blog.slug}`}>
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
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h5>
                    <p className="rbt-card-text">{blog.excerpt}</p>
                    <div className="rbt-card-bottom">
                      <Link className="transparent-button" href={`/blog/${blog.slug}`}>
                        Learn More
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

          {/* Pagination */}
          <div className="row">
            <div className="col-lg-12 mt--60">
              <nav>
                <ul className="rbt-pagination">
                  <li>
                    <a href="#" aria-label="Previous">
                      <i className="feather-chevron-left"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">1</a>
                  </li>
                  <li className="active">
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#" aria-label="Next">
                      <i className="feather-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

