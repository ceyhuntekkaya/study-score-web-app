"use client";
import FaqAccordion from '@/components/public/faq/FaqAccordion';
import Image from 'next/image';
import { useState, FormEvent } from 'react';

/**
 * FAQ Contact Form Component
 * Simple contact form for FAQ page
 */
function FaqContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <form id="contact-form" className="max-width-auto" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          name="name"
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
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <label>Phone</label>
        <span className="focus-border"></span>
      </div>
      <div className="form-group">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <label>Message</label>
        <span className="focus-border"></span>
      </div>
      <div className="form-submit-group">
        <button
          type="submit"
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
  );
}

/**
 * FAQ Page
 * Frequently Asked Questions with accordion sections
 */
export default function FaqPage() {
  const purchasesRefundsFaqs = [
    {
      id: 'purchase-1',
      question: 'What is Study Score App? How does it work?',
      answer: 'Study Score App is an online learning platform that allows students to access courses, track their progress, and improve their academic performance. You can enroll in courses, complete lessons, take quizzes, and earn certificates upon completion.',
    },
    {
      id: 'purchase-2',
      question: 'How can I get customer support?',
      answer: 'You can reach our customer support team by sending an email to our support address, using the contact form on our website, or by calling our support hotline during business hours. We typically respond within 24 hours.',
    },
    {
      id: 'purchase-3',
      question: 'Can I get updates regularly and for how long do I get updates?',
      answer: 'Yes, we regularly update our platform with new features, course content, and improvements. As a registered user, you will receive updates for as long as you maintain an active account. We also send email notifications about important updates and new course releases.',
    },
    {
      id: 'purchase-4',
      question: 'What is the refund policy?',
      answer: 'We offer a 30-day money-back guarantee for all paid courses. If you are not satisfied with your purchase, you can request a full refund within 30 days of enrollment. Please contact our support team to initiate a refund request.',
    },
  ];

  const makingCoursesFaqs = [
    {
      id: 'course-1',
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, simply browse our course catalog, select the course you are interested in, and click the "Enroll Now" button. For paid courses, you will be redirected to the payment page. Once payment is confirmed, you will have immediate access to the course content.',
    },
    {
      id: 'course-2',
      question: 'Can I access courses on mobile devices?',
      answer: 'Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can access your courses, watch videos, complete assignments, and take quizzes from any device with an internet connection.',
    },
    {
      id: 'course-3',
      question: 'How long do I have access to a course?',
      answer: 'Once you enroll in a course, you have lifetime access to the course materials. You can learn at your own pace and revisit the content as many times as you need. This includes all video lessons, downloadable resources, and course updates.',
    },
    {
      id: 'course-4',
      question: 'Do I receive a certificate upon completion?',
      answer: 'Yes, upon successful completion of a course (including all lessons, quizzes, and assignments), you will receive a digital certificate that you can download and share on your professional profiles like LinkedIn.',
    },
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h2 className="title">FAQs</h2>
                <ul className="page-list">
                  <li className="rbt-breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <div className="icon-right"><i className="feather-chevron-right"></i></div>
                  </li>
                  <li className="rbt-breadcrumb-item active">FAQs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Area */}
      <div className="rbt-accordion-area accordion-style-1 bg-color-white rbt-section-gap">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <FaqAccordion
                title="Purchases & Refunds"
                items={purchasesRefundsFaqs}
                accordionId="accordionPurchases"
              />
            </div>

            <div className="col-lg-6">
              <FaqAccordion
                title="Making Courses"
                items={makingCoursesFaqs}
                accordionId="accordionCourses"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>

      {/* Contact Section */}
      <div className="rbt-contact-address rbt-section-gap">
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
                <FaqContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

