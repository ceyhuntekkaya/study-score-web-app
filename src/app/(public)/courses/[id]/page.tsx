'use client';

import { use } from 'react';
import Image from 'next/image';
import CourseDetailsBanner from '@/components/public/course-details/CourseDetailsBanner';
import CourseDetailsNavigation from '@/components/public/course-details/CourseDetailsNavigation';
import CourseOverviewSection from '@/components/public/course-details/CourseOverviewSection';
import CourseContentSection from '@/components/public/course-details/CourseContentSection';
import CourseDetailsInfoSection from '@/components/public/course-details/CourseDetailsInfoSection';
import CourseInstructorSection from '@/components/public/course-details/CourseInstructorSection';
import CourseReviewSection from '@/components/public/course-details/CourseReviewSection';
import CourseSidebar from '@/components/public/course-details/CourseSidebar';
import CourseCard from '@/components/public/course/CourseCard';

/**
 * Course Details Page
 * Template content converted to React components
 */
export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Dummy course data - will be replaced with API call
  const course = {
    id,
    title: 'The Complete Histudy 2024: From Zero to Expert!',
    description: 'Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!',
    rating: 4.8,
    totalRatings: 215475,
    totalStudents: 616029,
    author: {
      name: 'Angela',
      avatar: '/assets/images/client/avatar-02.png',
      profileLink: '/profile',
    },
    category: 'Web Development',
    lastUpdated: '12/2024',
    language: 'English',
    isCertified: true,
    isBestseller: true,
    thumbnail: '/assets/images/course/course-01.jpg',
    currentPrice: '$60.99',
    oldPrice: '$84.99',
    discountDays: 3,
    videoPreview: {
      thumbnail: '/assets/images/others/video-01.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=nA1Aqp0sPQo',
    },
    learningPoints: [
      'Become an advanced, confident, and modern JavaScript developer from scratch.',
      'Have an intermediate skill level of Python programming.',
      'Have a portfolio of various data analysis projects.',
      'Use the numpy library to create and manipulate arrays.',
      'Use the Jupyter Notebook Environment. JavaScript developer from scratch.',
      'Use the pandas module with Python to create and structure data.',
      'Have a portfolio of various data analysis projects.',
      'Create data visualizations using matplotlib and the seaborn.',
    ],
    extendedDescription: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis, aliquam voluptas laudantium incidunt architecto nam excepturi provident rem laborum repellendus placeat neque aut doloremque ut ullam, veritatis nesciunt iusto officia alias, non est vitae.',
    sections: [
      {
        id: 'intro',
        title: 'Intro to Course and Histudy',
        duration: '1hr 30min',
        lessons: [
          {
            id: '1',
            title: 'Course Intro',
            duration: '30 min',
            type: 'video' as const,
            isPreview: true,
          },
          {
            id: '2',
            title: 'Watch Before Start',
            duration: '0.5 min',
            type: 'video' as const,
            isPreview: true,
          },
          {
            id: '3',
            title: 'Read Before You Start',
            type: 'text' as const,
            isLocked: true,
          },
        ],
      },
      {
        id: 'fundamentals',
        title: 'Course Fundamentals',
        duration: '2hr 30min',
        lessons: [
          {
            id: '4',
            title: 'Course Intro',
            type: 'video' as const,
            isLocked: true,
          },
          {
            id: '5',
            title: 'Read Before You Start',
            type: 'text' as const,
            isLocked: true,
          },
        ],
      },
    ],
    requirements: [
      'Become an advanced, confident, and modern JavaScript developer from scratch.',
      'Have an intermediate skill level of Python programming.',
      'Have a portfolio of various data analysis projects.',
      'Use the numpy library to create and manipulate arrays.',
    ],
    detailsDescription: [
      'Use the Jupyter Notebook Environment. JavaScript developer from scratch.',
      'Use the pandas module with Python to create and structure data.',
      'Have a portfolio of various data analysis projects.',
      'Create data visualizations using matplotlib and the seaborn.',
    ],
    instructor: {
      name: 'B.M. Rafekul Islam',
      avatar: '/assets/images/testimonial/testimonial-7.jpg',
      profileLink: '/author',
      title: 'Advanced Educator',
      rating: 4.4,
      totalReviews: 75237,
      totalStudents: 912970,
      totalCourses: 16,
      bio: 'John is a brilliant educator, whose life was spent for computer science and love of nature.',
      socialLinks: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/',
        linkedin: 'https://www.linkdin.com/',
      },
    },
    ratingBreakdown: [
      { stars: 5, percentage: 63 },
      { stars: 4, percentage: 29 },
      { stars: 3, percentage: 6 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 1 },
    ],
    featuredReviews: [
      {
        id: '1',
        author: {
          name: 'Farjana Bawnia',
          avatar: '/assets/images/testimonial/testimonial-3.jpg',
          profileLink: '/profile',
        },
        rating: 5,
        comment: 'At 29 years old, my favorite compliment is being told that I look like my mom. Seeing myself in her image, like this daughter up top.',
      },
      {
        id: '2',
        author: {
          name: 'Sakib Al Hasan',
          avatar: '/assets/images/testimonial/testimonial-8.jpg',
          profileLink: '/profile',
        },
        rating: 5,
        comment: 'My favorite compliment is being told that I look like my mom. Seeing myself in her image, like this daughter up top.',
      },
    ],
    courseFeatures: [
      { label: 'Start Date', value: '5 Hrs 20 Min' },
      { label: 'Enrolled', value: '100' },
      { label: 'Lectures', value: '50' },
      { label: 'Skill Level', value: 'Basic' },
      { label: 'Language', value: 'English' },
      { label: 'Quizzes', value: '10' },
      { label: 'Certificate', value: 'Yes' },
      { label: 'Pass Percentage', value: '95%' },
    ],
    relatedCourses: [
      {
        id: '1',
        image: '/assets/images/course/course-online-01.jpg',
        title: 'React Front To Back',
        description: 'It is a long established fact that a reader will be distracted.',
        lessons: 12,
        students: 50,
        rating: 5,
        reviews: 15,
        author: {
          name: 'Angela',
          avatar: '/assets/images/client/avatar-02.png',
          profileLink: '/profile',
        },
        category: 'Development',
        currentPrice: '$60',
        oldPrice: '$120',
        discount: '-40%',
      },
      {
        id: '2',
        image: '/assets/images/course/course-online-02.jpg',
        title: 'PHP Beginner Advanced',
        description: 'It is a long established fact that a reader will be distracted.',
        lessons: 12,
        students: 50,
        rating: 5,
        reviews: 15,
        author: {
          name: 'Angela',
          avatar: '/assets/images/client/avatar-02.png',
          profileLink: '/profile',
        },
        category: 'Development',
        currentPrice: '$60',
        oldPrice: '$120',
        showAddToCart: true,
      },
    ],
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', course.id);
    // TODO: Implement add to cart
  };

  const handleBuyNow = () => {
    console.log('Buy now:', course.id);
    // TODO: Implement buy now
  };

  return (
    <>
      {/* Course Details Banner */}
      <CourseDetailsBanner
        title={course.title}
        description={course.description}
        rating={course.rating}
        totalRatings={course.totalRatings}
        totalStudents={course.totalStudents}
        author={course.author}
        category={course.category}
        lastUpdated={course.lastUpdated}
        language={course.language}
        isCertified={course.isCertified}
        isBestseller={course.isBestseller}
      />

      <div className="rbt-course-details-area ptb--60">
        <div className="container">
          <div className="row g-5">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="course-details-content">
                {/* Course Thumbnail */}
                <div className="rbt-course-feature-box rbt-shadow-box thuumbnail">
                  <Image
                    className="w-100"
                    src={course.thumbnail}
                    alt={course.title}
                    width={800}
                    height={450}
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Sticky Navigation */}
                <CourseDetailsNavigation />

                {/* Overview Section */}
                <CourseOverviewSection
                  description={course.description}
                  learningPoints={course.learningPoints}
                  extendedDescription={course.extendedDescription}
                />

                {/* Course Content Section */}
                <CourseContentSection sections={course.sections} />

                {/* Details Section */}
                <CourseDetailsInfoSection
                  requirements={course.requirements}
                  description={course.detailsDescription}
                />

                {/* Instructor Section */}
                <CourseInstructorSection instructor={course.instructor} />

                {/* Review Section */}
                <CourseReviewSection
                  averageRating={course.rating}
                  totalRatings={course.totalRatings}
                  ratingBreakdown={course.ratingBreakdown}
                  featuredReviews={course.featuredReviews}
                />

                {/* Related Courses */}
                <div className="related-course mt--60">
                  <div className="row g-5 align-items-end mb--40">
                    <div className="col-lg-8 col-md-8 col-12">
                      <div className="section-title">
                        <span className="subtitle bg-pink-opacity">Top Course</span>
                        <h4 className="title">
                          More Course By <strong className="color-primary">{course.author.name}</strong>
                        </h4>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="read-more-btn text-start text-md-end">
                        <a className="rbt-btn rbt-switch-btn btn-border btn-sm" href="/courses">
                          <span data-text="View All Course">View All Course</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="row g-5">
                    {course.relatedCourses.map((relatedCourse) => (
                      <div key={relatedCourse.id} className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <CourseCard {...relatedCourse} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <CourseSidebar
              currentPrice={course.currentPrice}
              oldPrice={course.oldPrice}
              discountDays={course.discountDays}
              videoPreview={course.videoPreview}
              courseFeatures={course.courseFeatures}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>
    </>
  );
}

