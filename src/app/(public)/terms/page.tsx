import Image from 'next/image';

/**
 * Terms of Service Page
 * Terms and conditions for Study Score App
 */
export default function TermsOfServicePage() {
  return (
    <>
      <div className="rbt-overlay-page-wrapper">
        {/* Breadcrumb Section */}
        <div className="breadcrumb-image-container breadcrumb-style-max-width">
          <div className="breadcrumb-image-wrapper">
            <div className="breadcrumb-dark">
              <Image
                src="/assets/images/bg/bg-image-10.jpg"
                alt="Education Images"
                width={1920}
                height={600}
                className="w-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="breadcrumb-content-top text-center">
            <h1 className="title">Terms of Service</h1>
            <p className="mb--20">Study Score App Terms and Conditions.</p>
            <ul className="page-list">
              <li className="rbt-breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li>
                <div className="icon-right"><i className="feather-chevron-right"></i></div>
              </li>
              <li className="rbt-breadcrumb-item active">Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Terms of Service Content */}
        <div className="rbt-putchase-guide-area breadcrumb-style-max-width rbt-section-gapBottom">
        <div className="rbt-article-content-wrapper">
          <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
            <Image
              className="w-100"
              src="/assets/images/blog/blog-card-01.jpg"
              alt="Blog Images"
              width={1200}
              height={600}
            />
          </div>
          <div className="content">
            <h4>Welcome to Study Score App Terms of Service</h4>
            <p>
              These Terms of Service ("Terms") govern your access to and use of Study Score App ("we", "our", or "us") online learning platform and services (the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
            </p>

            <h4>1. Acceptance of Terms</h4>
            <ol>
              <li>By creating an account, enrolling in courses, or using any of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</li>
              <li>You must be at least 18 years old (or the age of majority in your jurisdiction) to use our Services. If you are under 18, you may only use our Services with the consent and supervision of a parent or guardian.</li>
              <li>We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on this page. Your continued use of our Services after such changes constitutes acceptance of the new Terms.</li>
            </ol>

            <h4>2. Account Registration and Security</h4>
            <ol>
              <li>To access certain features of our Services, you must create an account. You agree to provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
              <li>You must immediately notify us of any unauthorized use of your account or any other breach of security.</li>
              <li>We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.</li>
            </ol>

            <h4>3. Course Enrollment and Access</h4>
            <ol>
              <li>When you enroll in a course, you gain access to the course materials for the duration specified in the course description or for as long as the course remains available on our platform.</li>
              <li>Course access is personal to you and may not be shared, transferred, or sold to others.</li>
              <li>We reserve the right to modify, update, or remove course content at any time. We will make reasonable efforts to notify enrolled students of significant changes.</li>
              <li>Some courses may have prerequisites or require specific qualifications. It is your responsibility to ensure you meet these requirements before enrolling.</li>
            </ol>

            <h4>4. Payment and Refunds</h4>
            <ol>
              <li>Course fees are clearly displayed before enrollment. All prices are in the currency specified and are subject to applicable taxes.</li>
              <li>Payment must be made through our authorized payment processors. We accept major credit cards, debit cards, and other payment methods as indicated.</li>
              <li>We offer a 30-day money-back guarantee for all paid courses. To request a refund, contact our customer support within 30 days of enrollment.</li>
              <li>Refunds will be processed to the original payment method within 5-10 business days.</li>
              <li>We reserve the right to refuse refunds for accounts that have violated our Terms or engaged in fraudulent activity.</li>
            </ol>

            <h4>5. Intellectual Property Rights</h4>
            <ol>
              <li>All course content, including videos, text, images, quizzes, and materials, is protected by copyright and other intellectual property laws.</li>
              <li>You are granted a limited, non-exclusive, non-transferable license to access and use course materials for your personal, non-commercial educational purposes only.</li>
              <li>You may not:
                <ul>
                  <li>Copy, reproduce, distribute, or share course materials with others</li>
                  <li>Record, download, or capture course videos or content</li>
                  <li>Use course materials for commercial purposes or create derivative works</li>
                  <li>Remove copyright notices or other proprietary markings</li>
                </ul>
              </li>
              <li>Violation of these intellectual property rights may result in immediate account termination and legal action.</li>
            </ol>

            <h4>6. User Conduct and Prohibited Activities</h4>
            <ol>
              <li>You agree to use our Services only for lawful purposes and in accordance with these Terms.</li>
              <li>You are prohibited from:
                <ul>
                  <li>Posting or transmitting any content that is illegal, harmful, threatening, abusive, or discriminatory</li>
                  <li>Impersonating others or providing false information</li>
                  <li>Interfering with or disrupting the Services or servers</li>
                  <li>Attempting to gain unauthorized access to any part of our platform</li>
                  <li>Using automated systems (bots, scrapers) to access our Services</li>
                  <li>Sharing your account credentials or allowing others to use your account</li>
                </ul>
              </li>
              <li>We reserve the right to remove any content that violates these Terms and to suspend or terminate accounts of users who engage in prohibited activities.</li>
            </ol>

            <h4>7. Certificates and Credentials</h4>
            <ol>
              <li>Upon successful completion of a course (as determined by course requirements), you may receive a digital certificate.</li>
              <li>Certificates are issued at our discretion and may be revoked if we determine that course requirements were not met or if you violated our Terms.</li>
              <li>Certificates are for personal use only and do not constitute professional accreditation unless explicitly stated.</li>
            </ol>

            <h4>8. Disclaimers and Limitations of Liability</h4>
            <ol>
              <li>Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied.</li>
              <li>We do not guarantee that our Services will be uninterrupted, error-free, or completely secure.</li>
              <li>We are not responsible for the accuracy, completeness, or usefulness of any course content provided by instructors.</li>
              <li>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our Services.</li>
            </ol>

            <h4>9. Termination</h4>
            <ol>
              <li>You may terminate your account at any time by contacting our customer support or using account deletion features.</li>
              <li>We may terminate or suspend your account immediately, without prior notice, if you violate these Terms.</li>
              <li>Upon termination, your right to access and use our Services will cease immediately.</li>
              <li>Provisions that by their nature should survive termination (including payment obligations, intellectual property rights, and disclaimers) will remain in effect.</li>
            </ol>

            <h4>10. Governing Law and Dispute Resolution</h4>
            <ol>
              <li>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</li>
              <li>Any disputes arising from these Terms or your use of our Services shall be resolved through binding arbitration in accordance with [Arbitration Rules], except where prohibited by law.</li>
            </ol>

            <h4>11. Contact Information</h4>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@studyscoreapp.com
              <br />
              Address: [Your Company Address]
            </p>

            <p className="mt--30">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

