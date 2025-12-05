'use client';

import { getAllPhones, getAllEmails, getPrimaryAddress } from '@/lib/contact';

/**
 * Contact Address Section Component
 * Converted from template
 */
export default function ContactAddressSection() {
  const phones = getAllPhones();
  const emails = getAllEmails();
  const address = getPrimaryAddress();

  const addresses = [
    {
      icon: 'feather-headphones',
      title: 'Contact Phone Number',
      content: phones.map((phone, index) => (
        <a key={`phone${index}`} href={phone.href}>
          {phone.display}
        </a>
      )),
    },
    {
      icon: 'feather-mail',
      title: 'Our Email Address',
      content: emails.map((email, index) => (
        <a key={`email${index}`} href={email.href}>
          {email.display}
        </a>
      )),
    },
    {
      icon: 'feather-map-pin',
      title: 'Our Location',
      content: [
        <p key="location">
          {address.line1}
          {address.line2 && (
            <>
              <br /> {address.line2}
            </>
          )}
        </p>,
      ],
    },
  ];

  return (
    <div className="rbt-conatct-area bg-gradient-11 rbt-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title text-center mb--60">
              <span className="subtitle bg-secondary-opacity">Contact Us</span>
              <h2 className="title">
              Study Score Course Contact <br /> can join with us.
              </h2>
            </div>
          </div>
        </div>
        <div className="row g-5">
          {addresses.map((address, index) => (
            <div 
              key={index} 
              className="col-lg-4 col-md-6 col-sm-6 col-12"
            >
              <div className="rbt-address">
                <div className="icon">
                  <i className={address.icon}></i>
                </div>
                <div className="inner">
                  <h4 className="title">{address.title}</h4>
                  {address.content.map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

