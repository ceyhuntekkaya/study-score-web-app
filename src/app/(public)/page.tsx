import HeroBanner from '@/components/public/hero/HeroBanner';
import AboutSection from '@/components/public/about/AboutSection';
import CategorySection from '@/components/public/category/CategorySection';
import CourseSection from '@/components/public/course/CourseSection';
import EventSection from '@/components/public/event/EventSection';
import TestimonialSection from '@/components/public/testimonial/TestimonialSection';
import BlogSection from '@/components/public/blog/BlogSection';

/**
 * Public Home Page
 * Template content converted to React components
 */
export default function PublicHomePage() {
  return (
    <>
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* About Section */}
      <AboutSection />

      {/* Category Section */}
      <CategorySection />

      {/* Course Section */}
      <CourseSection />

      {/* Event Section */}
      <EventSection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Blog Section */}
      <BlogSection />
    </>
  );
}

