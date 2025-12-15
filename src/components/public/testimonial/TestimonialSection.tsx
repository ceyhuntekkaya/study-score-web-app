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
      name: 'Zeynep Yılmaz',
      position: '12th Grade Student',
      company: '@ Robert College',
      text: 'I was stuck at band 6.5 in IELTS. The AI tutor analyzed my essays and told me exactly where I lost points. It felt like having a private teacher 24/7. I finally reached 8.0!',
      rating: 5,
    },
    {
      id: 2,
      image: '/assets/images/testimonial/client-02.png',
      name: 'Caner Demir',
      position: '11th Grade Student',
      company: '@ Galatasaray High School',
      text: 'I didn’t have time for long courses. Study Score AI created a custom plan for my SAT prep. It skipped what I already knew and focused only on my weak spots. Pure efficiency.',
      rating: 5,
    },
    {
      id: 3,
      image: '/assets/images/testimonial/client-03.png',
      name: 'Elif Kaya',
      position: '12th Grade Student',
      company: '@ TED Ankara College',
      text: 'The instant feedback on my speaking tasks was a game changer. I used to be nervous, but the realistic simulations made me feel fully ready for the real exam environment.',
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
              <span className="theme-gradient">schools</span> like
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

