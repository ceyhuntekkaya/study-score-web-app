'use client';

import Image from 'next/image';

/**
 * Testimonial Section Component
 * Converted from template
 */
export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      image: '/assets/images/testimonial/client-01.png',
      name: 'Martha Maldonado',
      position: 'Executive Chairman',
      company: '@ Google',
      text: 'After the launch, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      rating: 5,
    },
    {
      id: 2,
      image: '/assets/images/testimonial/client-02.png',
      name: 'Michael D. Lovelady',
      position: 'CEO',
      company: '@ Google',
      text: 'Study Score education, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget.',
      rating: 5,
    },
    {
      id: 3,
      image: '/assets/images/testimonial/client-03.png',
      name: 'Valerie J. Creasman',
      position: 'Executive Designer',
      company: '@ Google',
      text: 'Our educational, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget.',
      rating: 5,
    },
  ];

  const brands = [
    '/assets/images/brand/partner-5.webp',
    '/assets/images/brand/partner-1.webp',
    '/assets/images/brand/partner-6.webp',
    '/assets/images/brand/partner-3.webp',
    '/assets/images/brand/partner-1.webp',
    '/assets/images/brand/partner-6.webp',
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <a key={i} href="#">
        <i className="fa fa-star"></i>
      </a>
    ));
  };

  return (
    <div className="rbt-testimonial-area bg-color-white rbt-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mb--60 mb_sm--50">
            <div className="section-title text-center">
              <h6 className="b2 mb--15">
                <span className="theme-gradient">Testimonials</span>
              </h6>
              <h2 className="title w-600">
                Student's <span className="theme-gradient">Feedback</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="row g-5">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="col-lg-4 col-md-6 col-12">
              <div className="rbt-testimonial-box">
                <div className="inner">
                  <div className="clint-info-wrapper">
                    <div className="thumb">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        width={80} 
                        height={80}
                      />
                    </div>
                    <div className="client-info">
                      <h5 className="title">{testimonial.name}</h5>
                      <span>
                        {testimonial.position} <i>{testimonial.company}</i>
                      </span>
                    </div>
                  </div>
                  <div className="description">
                    <p className="subtitle-3">{testimonial.text}</p>
                    <div className="rating mt--20">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Brand Section */}
        <div className="mt--80">
          <div className="rbt-brand-title-wrap">
            <h5 className="rbt-brand-title w-600 text-center mb-0">
              Making <span className="theme-gradient">sensitive clients</span> more valuable for{' '}
              <span className="theme-gradient">companies</span> like
            </h5>
          </div>
          <ul className="brand-list brand-style-3 justify-content-start justify-content-lg-between mt--30">
            {brands.map((brand, index) => (
              <li key={index}>
                <a href="#">
                  <Image src={brand} alt="Brand" width={120} height={60} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

