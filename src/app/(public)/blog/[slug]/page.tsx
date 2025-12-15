'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getAllBlogs } from '@/lib/blogs';
import { getSocialLinks } from '@/lib/contact';

/**
 * Blog Details Page
 * Displays detailed information about a specific blog post
 */
export default function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const blog = getBlogBySlug(slug);
  const socialLinks = getSocialLinks();

  if (!blog) {
    notFound();
  }

  const relatedBlogs = getAllBlogs().filter(b => b.id !== blog.id && b.category === blog.category).slice(0, 3);

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
        <div className="breadcrumb-inner breadcrumb-dark">
          <Image
            src="/assets/images/bg/bg-image-10.jpg"
            alt="Education Images"
            width={1920}
            height={400}
            className="w-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="content text-center">
                <ul className="page-list">
                  <li className="rbt-breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <div className="icon-right"><i className="feather-chevron-right"></i></div>
                  </li>
                  <li className="rbt-breadcrumb-item">
                    <a href="/blog">Blog</a>
                  </li>
                  <li>
                    <div className="icon-right"><i className="feather-chevron-right"></i></div>
                  </li>
                  <li className="rbt-breadcrumb-item active">{blog.category}</li>
                </ul>
                <ul className="meta-list justify-content-center mb--10">
                  <li className="list-item">
                    <div className="author-thumbnail">
                      <Image
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                    <div className="author-info">
                      <a href="#"><strong>{blog.author.name}</strong></a> in <a href="#"><strong>{blog.category}</strong></a>
                    </div>
                  </li>
                  <li className="list-item">
                    <i className="feather-clock"></i>
                    <span>{blog.date}</span>
                  </li>
                </ul>
                <h1 className="title">{blog.title}</h1>
                <p>{blog.excerpt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Details Content */}
      <div className="rbt-blog-details-area rbt-section-gapBottom breadcrumb-style-max-width">
        <div className="blog-content-wrapper rbt-article-content-wrapper">
          <div className="content">
            <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
              <figure>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={1200}
                  height={600}
                  style={{ objectFit: 'cover' }}
                />
              <figcaption>AI-driven insights identify your hidden weaknesses and turn them into strengths.</figcaption>

              </figure>
            </div>
            <p>{blog.content}</p>

            <blockquote className="wp-block-quote">
    <p>Every great change starts with a bold decision. Don't just prepare for the future; engineer it with intelligence.</p>
    <cite><a href="#">Study Score AI Manifesto</a></cite>
</blockquote>

            <div className="wp-block-gallery columns-3 is-cropped">
              <ul className="blocks-gallery-grid">
                <li className="blocks-gallery-item">
                  <figure>
                    <Image
                      className="radius-4"
                      src="/assets/images/blog/blog-gallery-01.jpg"
                      alt="Blog Images"
                      width={400}
                      height={300}
                      style={{ objectFit: 'cover' }}
                    />
                  </figure>
                </li>
                <li className="blocks-gallery-item">
                  <figure>
                    <Image
                      className="radius-4"
                      src="/assets/images/blog/blog-gallery-02.jpg"
                      alt="Blog Images"
                      width={400}
                      height={300}
                      style={{ objectFit: 'cover' }}
                    />
                  </figure>
                </li>
                <li className="blocks-gallery-item">
                  <figure>
                    <Image
                      className="radius-4"
                      src="/assets/images/blog/blog-gallery-03.jpg"
                      alt="Blog Images"
                      width={400}
                      height={300}
                      style={{ objectFit: 'cover' }}
                    />
                  </figure>
                </li>
              </ul>
            </div>

            <h4>The Problem with "One-Size-Fits-All" Education</h4>
            <p>
              <a href="#">Traditional classrooms</a> face a fundamental problem: in a room of 30 students, 
              the teacher must teach to the "average." If you learn faster, you get bored. If you need more time, 
              you get left behind. This standard approach ignores your unique learning style.
            </p>
            <p>
              Study Score AI completely changes this dynamic. Instead of forcing you to follow a rigid syllabus, 
              our AI technology builds a dynamic curriculum around you. It identifies exactly what you already know 
              and skips it, focusing 100% of your energy on your weak points. This is the difference between 
              [cite_start]studying hard and studying smart[cite: 200, 214].
            </p>

            <h4>Your Personal AI Tutor: Available 24/7</h4>
            <p>
              <a href="#">Imagine a private tutor</a> who never gets tired, never judges your mistakes, and is available 
              at 3 AM. [cite_start]Our "Smart Tutor" analyzes your performance with microscopic precision[cite: 184, 207]. 
              It doesn't just say "your writing is weak"; it tells you specifically that you struggle with 
              "coherence in paragraph transitions" and gives you exercises to fix just that.
            </p>

            <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
              <figure>
                <Image
                  src="/assets/images/blog/blog-bl-02.jpg"
                  alt="AI Learning Analysis"
                  width={1200}
                  height={600}
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>AI analyzes your learning patterns in real-time to optimize your score.</figcaption>
              </figure>
            </div>

            <p>
              "The secret to high scores isn't just solving thousands of questions; it's solving the *right* questions," 
              says the development team behind Study Score AI. By using advanced algorithms similar to those used by 
              tech giants, we bring elite-level exam coaching to everyone. Whether you are preparing for IELTS, 
              [cite_start]TOEFL, or SAT, the system adapts to your stress levels and performance instantly[cite: 312, 336].
            </p>

            <h4>A New Standard for Academic Success</h4>
            <p>For more success stories and strategies, visit our <a href="#">Success Stories</a> page.</p>
            <p>
              <a href="#">The future of education</a> is personalized, data-driven, and accessible. 
              With Study Score AI, you aren't just memorizing answers; you are mastering the logic of the exam. 
              It's time to stop guessing and start improving with a system that knows your potential better than you do.
            </p>

            {/* Blog Tags */}
            <div className="tagcloud">
              {blog.tags.map((tag, index) => (
                <a key={index} href="#">{tag}</a>
              ))}
            </div>

            {/* Social Share */}
            <div className="social-share-block">
              <div className="post-like">
                <a href="#"><i className="feather feather-thumbs-up"></i><span>2.2k Like</span></a>
              </div>
              <ul className="social-icon social-default transparent-with-border">
                <li>
                  <a href={socialLinks.facebook.url}>
                    <i className="feather-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href={socialLinks.twitter.url}>
                    <i className="feather-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href={socialLinks.instagram.url}>
                    <i className="feather-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href={socialLinks.linkedin.url}>
                    <i className="feather-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>

            {/* Blog Author */}
            <div className="about-author">
              <div className="media">
                <div className="thumbnail">
                  <a href="#">
                    <Image
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </a>
                </div>
                <div className="media-body">
                  <div className="author-info">
                    <h5 className="title">
                      <a className="hover-flip-item-wrapper" href="#">
                        {blog.author.name}
                      </a>
                    </h5>
                    <span className="b3 subtitle">{blog.author.role}</span>
                  </div>
                  <div className="content">
                    <p className="description">
                      At 29 years old, my favorite compliment is being told that I look like my mom. Seeing myself in her image, like this daughter up top.
                    </p>
                    <ul className="social-icon social-default icon-naked justify-content-start">
                      <li>
                        <a href={socialLinks.facebook.url}>
                          <i className="feather-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href={socialLinks.twitter.url}>
                          <i className="feather-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href={socialLinks.instagram.url}>
                          <i className="feather-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href={socialLinks.linkedin.url}>
                          <i className="feather-linkedin"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="related-course mt--60">
                <div className="row">
                  <div className="col-lg-12 mb--40">
                    <div className="section-title text-start">
                      <span className="subtitle bg-secondary-opacity">Related Blog</span>
                      <h2 className="title">Related Blog</h2>
                    </div>
                  </div>
                </div>
                <div className="row g-5">
                  {relatedBlogs.map((relatedBlog) => (
                    <div key={relatedBlog.id} className="col-lg-4 col-md-6 col-sm-6 col-12 mt--30">
                      <div className="rbt-card variation-02 rbt-hover">
                        <div className="rbt-card-img">
                          <Link href={`/blog/${relatedBlog.slug}`}>
                            <Image
                              src={relatedBlog.image}
                              alt={relatedBlog.title}
                              width={400}
                              height={250}
                              style={{ objectFit: 'cover' }}
                            />
                          </Link>
                        </div>
                        <div className="rbt-card-body">
                          <h5 className="rbt-card-title">
                            <Link href={`/blog/${relatedBlog.slug}`}>{relatedBlog.title}</Link>
                          </h5>
                          <p className="rbt-card-text">{relatedBlog.excerpt}</p>
                          <div className="rbt-card-bottom">
                            <Link className="transparent-button" href={`/blog/${relatedBlog.slug}`}>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

