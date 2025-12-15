'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Link from 'next/link';
import Image from 'next/image';
import { useGetAllCourses } from '@/generated/api/course-rest-controller/course-rest-controller';
import type { Course } from '@/generated/api/openAPIDefinition.schemas';

import 'swiper/css';
import 'swiper/css/navigation';

/**
 * Category Section Component
 * Converted from template - uses Swiper (npm package)
 */
export default function CategorySection() {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data: courses, isLoading, error } = useGetAllCourses();
  
  const coursesList: Course[] = courses || [];

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
              {isLoading && (
                <SwiperSlide>
                  <div className="text-center p--40">
                    <p>Loading courses...</p>
                  </div>
                </SwiperSlide>
              )}
              {error ? (
                <SwiperSlide>
                  <div className="text-center p--40">
                    <p className="text-danger">
                      Error loading courses. Please try again later.
                      {error instanceof Error && ` (${error.message})`}
                    </p>
                  </div>
                </SwiperSlide>
              ) : null}
              {!isLoading && !error && coursesList.length > 0 && coursesList.map((course) => (
                <SwiperSlide key={course.id}>
                  <div className="rbt-cat-box rbt-cat-box-1 variation-3 text-center">
                    <div className="inner">
                      <div className="thumbnail">
                        <Link href={`/courses/${course.id}`}>
                          <Image 
                            src={'/assets/'+course.imageUrl || '/assets/images/category/image/default.jpg'} 
                            alt={course.name || 'Course'} 
                            width={300} 
                            height={200}
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="read-more-btn">
                            <span className="rbt-btn btn-sm btn-white radius-round">
                              {course.level || 'N/A'}
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className="content">
                        <h5 className="title">
                          <Link href={`/courses/${course.id}`}>{course.name || 'Untitled Course'}</Link>
                        </h5>
                        <p className="description">{course.description || 'No description available'}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              {!isLoading && !error && coursesList.length === 0 && (
                <SwiperSlide>
                  <div className="text-center p--40">
                    <p>No courses available.</p>
                  </div>
                </SwiperSlide>
              )}
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

