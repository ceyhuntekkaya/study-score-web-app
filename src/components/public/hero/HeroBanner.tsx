'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Link from 'next/link';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

/**
 * Hero Banner Component
 * Converted from template - uses Swiper (npm package) instead of jQuery
 */
export default function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);

  const bannerSlides = [
    {
      id: 1,
      bgImage: '/assets/images/bg/bg-image-24.jpg',
      shape: '/assets/images/shape/m-banner-shape-01.png',
      subtitle: 'Excellent 4.9 out of 5',
      title: 'Education Is The Best Key Success In Life',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat.',
      students: '36K+',
      studentsLabel: 'Enrolled Students',
    },
    {
      id: 2,
      bgImage: '/assets/images/bg/bg-image-25.jpg',
      shape: '/assets/images/shape/m-banner-shape-01.png',
      subtitle: 'Excellent 4.9 out of 5',
      title: 'Unlock Your Potential with Quality Education',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat.',
      students: '36K+',
      studentsLabel: 'Enrolled Students',
    },
    {
      id: 3,
      bgImage: '/assets/images/bg/bg-image-26.jpg',
      shape: '/assets/images/shape/m-banner-shape-01.png',
      subtitle: 'Excellent 4.9 out of 5',
      title: 'Online Learning Now In Your Fingertps',
      description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat.',
      students: '36K+',
      studentsLabel: 'Enrolled Students',
    },
  ];

  return (
    <div className="rbt-banner-area rbt-banner-19">
      <div className="wrapper rbt-arrow-between">
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: '.rbt-arrow-left',
            nextEl: '.rbt-arrow-right',
          }}
          loop={true}
          className="rbt-banner-activation-2 rbt-slider-animation"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {bannerSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div 
                className="rbt-banner-item bg_image"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="shape-1">
                  <Image 
                    src={slide.shape} 
                    alt="Shape" 
                    width={200} 
                    height={200}
                  />
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="inner">
                        <h6 className="subtitle">
                          <span>
                            <Image 
                              src="/assets/images/icons/trustpilot-white.png" 
                              alt="trustpilot" 
                              width={100} 
                              height={30}
                            />
                          </span>
                          {slide.subtitle}
                        </h6>
                        <h1 className="title">{slide.title}</h1>
                        <p className="description">{slide.description}</p>
                        <div className="bottom-content d-flex align-items-center gap-5 flex-wrap">
                          <Link className="rbt-btn btn-gradient hover-icon-reverse" href="/register">
                            <span className="icon-reverse-wrapper">
                              <span className="btn-text">Apply Today</span>
                              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                            </span>
                          </Link>
                          <div className="d-flex flex-wrap gap-4 align-items-center">
                            <div className="profile-share">
                              <a href="#" className="avatar" data-tooltip="Mark Jordan" tabIndex={0}>
                                <Image 
                                  src="/assets/images/shape/art-stu-1.png" 
                                  alt="education" 
                                  width={40} 
                                  height={40}
                                />
                              </a>
                              <a href="#" className="avatar" data-tooltip="Jordan" tabIndex={0}>
                                <Image 
                                  src="/assets/images/shape/art-stu-3.png" 
                                  alt="education" 
                                  width={40} 
                                  height={40}
                                />
                              </a>
                              <a href="#" className="avatar" data-tooltip="Ava Miller" tabIndex={0}>
                                <Image 
                                  src="/assets/images/shape/art-stu-2.png" 
                                  alt="education" 
                                  width={40} 
                                  height={40}
                                />
                              </a>
                            </div>
                            <div>
                              <h6 className="number mb-0">{slide.students}</h6>
                              <p className="number-title">{slide.studentsLabel}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Controls */}
        <div className="rbt-slider-control">
          <div className="rbt-swiper-arrow-2 rbt-arrow-left" onClick={() => swiperRef.current?.slidePrev()}>
            <span className="icon">
              <i className="rbt-icon-top feather-arrow-left"></i>
            </span>
            <span className="text">Prev</span>
          </div>

          <div className="rbt-swiper-arrow-2 rbt-arrow-right" onClick={() => swiperRef.current?.slideNext()}>
            <span className="text">Next</span>
            <span className="icon">
              <i className="rbt-icon feather-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

