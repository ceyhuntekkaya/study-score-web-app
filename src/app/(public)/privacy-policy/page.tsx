import Image from 'next/image';

/**
 * Privacy Policy Page
 * Privacy policy content for Study Score App
 */
export default function PrivacyPolicyPage() {
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
            <h1 className="title">Privacy Policy</h1>
            <p className="mb--20">Study Score App Privacy Policy Here.</p>
            <ul className="page-list">
              <li className="rbt-breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li>
                <div className="icon-right"><i className="feather-chevron-right"></i></div>
              </li>
              <li className="rbt-breadcrumb-item active">Privacy Policy</li>
            </ul>
          </div>
        </div>

        {/* Privacy Policy Content */}
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
            <h4>Welcome to Study Score App Privacy Policy</h4>
            <ol>
              <li>
                This Privacy Policy describes how Study Score App ("we", "our", or "us") collects, uses, and shares your personal information when you use our online learning platform and services (the "Services"). By using our Services, you agree to the collection and use of information in accordance with this policy.
              </li>
              <li>
                We are committed to protecting your privacy and ensuring the security of your personal information. This policy explains what information we collect, how we use it, and your rights regarding your personal data.
              </li>
              <li>
                If you do not agree with our policies and practices, please do not use our Services. Your continued use of our Services after we make changes to this Privacy Policy means you accept those changes, so please check this policy periodically for updates.
              </li>
            </ol>

            <h4>The type of personal information we collect</h4>
            <ol>
              <li>
                We collect certain personal information about visitors and users of our Services. This includes:
                <ul>
                  <li>Account information: name, email address, phone number, and password</li>
                  <li>Profile information: profile picture, bio, educational background, and preferences</li>
                  <li>Payment information: billing address, payment method details (processed securely through third-party payment processors)</li>
                  <li>Course data: enrollment information, progress, quiz results, and certificates</li>
                  <li>Usage data: how you interact with our platform, courses accessed, time spent, and device information</li>
                </ul>
              </li>
              <li>
                We may also collect information automatically when you use our Services, including IP address, browser type, operating system, referring URLs, and other technical information.
              </li>
            </ol>

            <h4>How we collect personal information</h4>
            <ol>
              <li>
                We collect information directly from you when you:
                <ul>
                  <li>Create an account or update your profile</li>
                  <li>Enroll in courses or make purchases</li>
                  <li>Complete forms, surveys, or participate in discussions</li>
                  <li>Contact our customer support team</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                </ul>
              </li>
              <li>
                We collect information automatically through:
                <ul>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Server logs and analytics tools</li>
                  <li>Device information and usage patterns</li>
                </ul>
              </li>
              <li>
                We may receive information from third parties, such as:
                <ul>
                  <li>Payment processors when you make a purchase</li>
                  <li>Social media platforms if you connect your account</li>
                  <li>Analytics and marketing service providers</li>
                </ul>
              </li>
            </ol>

            <h4>How we use your personal information</h4>
            <ol>
              <li>To provide and maintain our Services, including course delivery and progress tracking</li>
              <li>To process payments and manage your account</li>
              <li>To communicate with you about your account, courses, and important updates</li>
              <li>To improve our Services and develop new features</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To detect and prevent fraud, abuse, and security issues</li>
              <li>To comply with legal obligations and enforce our terms of service</li>
            </ol>

            <h4>How we share your personal information</h4>
            <ol>
              <li>We do not sell your personal information to third parties.</li>
              <li>We may share your information with:
                <ul>
                  <li>Service providers who help us operate our platform (hosting, payment processing, analytics)</li>
                  <li>Instructors and course creators (limited to course-related information)</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                  <li>Business partners in case of a merger, acquisition, or sale of assets</li>
                </ul>
              </li>
            </ol>

            <h4>Your rights and choices</h4>
            <ol>
              <li>You have the right to access, update, or delete your personal information</li>
              <li>You can opt-out of marketing communications at any time</li>
              <li>You can manage cookie preferences through your browser settings</li>
              <li>You can request a copy of your data or request data deletion</li>
              <li>If you have concerns about how we handle your data, please contact us</li>
            </ol>

            <h4>Data security</h4>
            <ol>
              <li>We implement appropriate technical and organizational measures to protect your personal information</li>
              <li>We use encryption, secure servers, and regular security audits</li>
              <li>However, no method of transmission over the internet is 100% secure</li>
            </ol>

            <h4>Changes to this Privacy Policy</h4>
            <ol>
              <li>We may update this Privacy Policy from time to time</li>
              <li>We will notify you of any material changes by posting the new policy on this page</li>
              <li>The "Last Updated" date at the top of this policy indicates when it was last revised</li>
            </ol>

            <h4>Contact us</h4>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@studyscoreapp.com
              <br />
              Address: [Your Company Address]
            </p>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

