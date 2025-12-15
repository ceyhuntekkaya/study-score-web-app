'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * About Page Content Component
 * Converted from template
 */
export default function AboutPageContent() {
  const features = [
    {
      icon: 'feather-heart',
      iconBg: 'bg-pink-opacity',
      title: '24/7 AI Availability',
      description: 'Your personal tutor never sleeps. Whether you are a night owl or an early bird, get instant feedback and support whenever you are ready to learn.',
    },
    {
      icon: 'feather-book',
      iconBg: 'bg-primary-opacity',
      title: 'Adaptive Learning Path',
      description: 'Stop wasting time on what you already know. Our algorithm analyzes your performance in real-time to build a curriculum that focuses 100% on your weak points.',
    },
    {
      icon: 'feather-monitor',
      iconBg: 'bg-coral-opacity',
      title: "Fine-Tuned Expert Models",
      description: 'Our AI isn\'t generic. It is trained specifically on IELTS, SAT, and TOEFL strategies by top educators to think exactly like a professional examiner.',
    },
  ];

  return (
    <div className="rbt-about-area about-style-1 bg-color-white rbt-section-gapTop">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="thumbnail-wrapper">
              <div className="thumbnail image-1">
                <Image 
                  src="/assets/images/about/about-07.jpg" 
                  alt="Study Score" 
                  width={500} 
                  height={600}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="thumbnail image-2 d-none d-xl-block">
                <Image 
                  src="/assets/images/about/about-09.jpg" 
                  alt="Study Score" 
                  width={300} 
                  height={400}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="thumbnail image-3 d-none d-md-block">
                <Image 
                  src="/assets/images/about/about-08.jpg" 
                  alt="Study Score" 
                  width={250} 
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="inner pl--50 pl_sm--0 pl_md--0">
            <div className="section-title text-start">
    <span className="subtitle bg-coral-opacity">Who We Are</span>
    <h2 className="title">
        Redefining Exam Prep with <br /> Artificial Intelligence
    </h2>
</div>
<p className="description mt--30">
    Study Score AI is not just another online course; it is the world's first "Smart Tutor" dedicated to high-stakes international exams. 
    We believe that every student deserves elite-level coaching, regardless of location or budget. 
    By combining advanced AI with proven pedagogical strategies, we replace static textbooks with a living, breathing curriculum that adapts to you in real-time.
</p>
              {/* Feature List */}
              <div className="rbt-feature-wrapper mt--40">
                {features.map((feature, index) => (
                  <div key={index} className="rbt-feature feature-style-1">
                    <div className={`icon ${feature.iconBg}`}>
                      <i className={feature.icon}></i>
                    </div>
                    <div className="feature-content">
                      <h6 className="feature-title">{feature.title}</h6>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="about-btn mt--40">
                <Link className="rbt-btn btn-gradient hover-icon-reverse" href="/about">
                  <span className="icon-reverse-wrapper">
                    <span className="btn-text">More About Us</span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

