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
    title="Achieve Your Dream Score with Your Personal AI Coach." 
    subtitle="The Future of Exam Prep"
    variant="about"
    bgImage="/assets/images/bg/bg-image-11.jpg"
    showButton={true}
    buttonText="Start Your Journey"
    buttonLink="/contact"
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

