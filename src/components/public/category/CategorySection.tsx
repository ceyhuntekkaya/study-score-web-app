'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Link from 'next/link';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';

/**
 * Category Section Component
 * Converted from template - uses Swiper (npm package)
 */
export default function CategorySection() {
  const swiperRef = useRef<SwiperType | null>(null);

  const categories = [
    {
      id: 1,
      image: '/assets/images/category/image/web-design.jpg',
      title: 'Web Design',
      description: 'Web App Application',
      courseCount: '20 Courses',
    },
    {
      id: 2,
      image: '/assets/images/category/image/graphic-design.jpg',
      title: 'Graphic Design',
      description: 'Design is Art',
      courseCount: '15 Courses',
    },
    {
      id: 3,
      image: '/assets/images/category/image/personal-development.jpg',
      title: 'Personal Development',
      description: 'Web App Application',
      courseCount: '9 Courses',
    },
    {
      id: 4,
      image: '/assets/images/category/image/software.jpg',
      title: 'IT and Software',
      description: 'Web App Application',
      courseCount: '15 Courses',
    },
  ];

  return (
    <div className="rbt-categories-area rbt-section-gap">
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-lg-8 col-md-7 col-12">
              <div className="section-title">
                <h2 className="title">
                  Best Platform To{' '}
                  <span>
                    <Image 
                      src="/assets/images/shape/o-icon-2.png" 
                      alt="Cap Icon" 
                      width={40} 
                      height={40}
                    />
                  </span>{' '}
                  Learn Everything
                </h2>
              </div>
            </div>
          </div>
          <div className="category-activation-four swiper pt--50">
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView="auto"
              navigation={{
                prevEl: '.rbt-arrow-left',
                nextEl: '.rbt-arrow-right',
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 4,
                },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <div className="rbt-cat-box rbt-cat-box-1 variation-3 text-center">
                    <div className="inner">
                      <div className="thumbnail">
                        <Link href="/courses">
                          <Image 
                            src={category.image} 
                            alt={category.title} 
                            width={300} 
                            height={200}
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="read-more-btn">
                            <span className="rbt-btn btn-sm btn-white radius-round">
                              {category.courseCount}
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className="content">
                        <h5 className="title">
                          <Link href="/courses">{category.title}</Link>
                        </h5>
                        <p className="description">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Navigation */}
          <div className="d-flex justify-content-center gap-3 rbt-arrow-between mt--30 rbt-categories-pagination-four">
            <div 
              className="rbt-swiper-arrow style_2 rbt-arrow-left" 
              tabIndex={0} 
              role="button"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <div className="custom-overfolow">
                <i className="rbt-icon feather-arrow-left"></i>
                <i className="rbt-icon-top feather-arrow-left"></i>
              </div>
            </div>

            <div 
              className="rbt-swiper-arrow style_2 rbt-arrow-right" 
              tabIndex={0} 
              role="button"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <div className="custom-overfolow">
                <i className="rbt-icon feather-arrow-right"></i>
                <i className="rbt-icon-top feather-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

