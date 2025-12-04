'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

/**
 * Contact Form Section Component
 * Converted from template - uses React state instead of jQuery form handling
 */
export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Replace with actual API call
    console.log('Form submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="rbt-contact-address">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6">
            <div className="thumbnail">
              <Image 
                className="w-100 radius-6" 
                src="/assets/images/about/contact.jpg" 
                alt="Contact Images" 
                width={600} 
                height={600}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="rbt-contact-form contact-form-style-1 max-width-auto">
              <div className="section-title text-start">
                <span className="subtitle bg-primary-opacity">EDUCATION FOR EVERYONE</span>
              </div>
              <h3 className="title">Get a Free Course You Can Contact With Me</h3>
              <form 
                id="contact-form" 
                method="POST" 
                className="rainbow-dynamic-form max-width-auto"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <input
                    name="name"
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label>Name</label>
                  <span className="focus-border"></span>
                </div>
                <div className="form-group">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label>Email</label>
                  <span className="focus-border"></span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <label>Your Subject</label>
                  <span className="focus-border"></span>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="contact-message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label>Message</label>
                  <span className="focus-border"></span>
                </div>
                <div className="form-submit-group">
                  <button
                    name="submit"
                    type="submit"
                    id="submit"
                    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                    disabled={isSubmitting}
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">{isSubmitting ? 'Sending...' : 'GET IT NOW'}</span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

