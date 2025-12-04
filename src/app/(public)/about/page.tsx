import BreadcrumbSection from '@/components/public/breadcrumb/BreadcrumbSection';
import AboutPageContent from '@/components/public/about/AboutPageContent';
import VideoSection from '@/components/public/about/VideoSection';
import AboutTestimonialSection from '@/components/public/about/AboutTestimonialSection';

/**
 * About Page
 * Template content converted to React components
 */
export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <BreadcrumbSection 
        title="Take Challenge for Build Your Life. The World Most Lessons for Back to Your Life." 
        subtitle="How We Work"
        variant="about"
        bgImage="/assets/images/bg/bg-image-11.jpg"
        showButton={true}
        buttonText="More About Us"
        buttonLink="/about"
      />

      {/* About Content Section */}
      <AboutPageContent />

      {/* Video Section */}
      <VideoSection />

      {/* Testimonial Section */}
      <AboutTestimonialSection />
    </>
  );
}

