'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * About Page Testimonial Section Component
 * Converted from template - horizontal scroll testimonials
 */
export default function AboutTestimonialSection() {
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
      text: 'Study Score education, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      rating: 5,
    },
    {
      id: 3,
      image: '/assets/images/testimonial/client-03.png',
      name: 'Valerie J. Creasman',
      position: 'Executive Designer',
      company: '@ Google',
      text: 'Our educational, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      rating: 5,
    },
    {
      id: 4,
      image: '/assets/images/testimonial/client-04.png',
      name: 'Hannah R. Sutton',
      position: 'Executive Chairman',
      company: '@ Facebook',
      text: 'People says about, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      rating: 5,
    },
    {
      id: 5,
      image: '/assets/images/testimonial/client-05.png',
      name: 'Pearl B. Hill',
      position: 'Chairman SR',
      company: '@ Facebook',
      text: 'Like this Study Score, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <a key={i} href="#">
        <i className="fa fa-star"></i>
      </a>
    ));
  };

  return (
    <div className="rbt-testimonial-area bg-color-white pb--80 overflow-hidden">
      <div className="container-fluid">
        <div className="row g-5 align-items-center">
          <div className="col-xl-3">
            <div className="section-title pl--100 pl_sm--30">
              <span className="subtitle bg-pink-opacity">Learners Feedback</span>
              <h2 className="title">What Our Learners Say</h2>
              <p className="description mt--20">
                Learning communicate to global world and build a bright future with our Study Score.
              </p>
              <div className="veiw-more-btn mt--20">
                <Link className="rbt-btn btn-gradient rbt-marquee-btn marquee-text-y" href="/contact">
                  <span data-text="Contact Us">Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-9">
            <div className="overflow-hidden">
              <div className="scroll-animation-wrapper pt--50 pb--30">
                <div className="scroll-animation scroll-right-left">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="single-column-20">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

