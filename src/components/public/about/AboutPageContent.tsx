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
      title: 'Flexible Classes',
      description: 'It is a long established fact that a reader will be distracted by this on readable content of when looking at its layout.',
    },
    {
      icon: 'feather-book',
      iconBg: 'bg-primary-opacity',
      title: 'Learn From Anywhere',
      description: 'Sed distinctio repudiandae eos recusandae laborum eaque non eius iure suscipit laborum eaque non eius iure suscipit.',
    },
    {
      icon: 'feather-monitor',
      iconBg: 'bg-coral-opacity',
      title: "Experienced Teacher's service.",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, aliquid mollitia Officia, aliquid mollitia.',
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
                  alt="Education Images" 
                  width={500} 
                  height={600}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="thumbnail image-2 d-none d-xl-block">
                <Image 
                  src="/assets/images/about/about-09.jpg" 
                  alt="Education Images" 
                  width={300} 
                  height={400}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="thumbnail image-3 d-none d-md-block">
                <Image 
                  src="/assets/images/about/about-08.jpg" 
                  alt="Education Images" 
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
                <span className="subtitle bg-coral-opacity">Know About Us</span>
                <h2 className="title">
                  Know About Histudy <br /> Learning Platform
                </h2>
              </div>
              <p className="description mt--30">
                Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. 
                Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
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

