import ContactAddressSection from '@/components/public/contact/ContactAddressSection';
import ContactFormSection from '@/components/public/contact/ContactFormSection';
import ContactMapSection from '@/components/public/contact/ContactMapSection';

/**
 * Contact Page
 * Template content converted to React components
 * Note: Contact page doesn't have a banner, it starts directly with contact section
 */
export default function ContactPage() {
  return (
    <>
      {/* Contact Address Section (includes title/subtitle) */}
      <ContactAddressSection />

      {/* Contact Form Section */}
      <ContactFormSection />

      {/* Google Map Section */}
      <ContactMapSection />
    </>
  );
}

