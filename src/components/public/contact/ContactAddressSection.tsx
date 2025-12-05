'use client';

/**
 * Contact Address Section Component
 * Converted from template
 */
export default function ContactAddressSection() {
  const addresses = [
    {
      icon: 'feather-headphones',
      title: 'Contact Phone Number',
      content: [
        <a key="phone1" href="tel:+444555666777">+444 555 666 777</a>,
        <a key="phone2" href="tel:+222222222333">+222 222 222 333</a>,
      ],
    },
    {
      icon: 'feather-mail',
      title: 'Our Email Address',
      content: [
        <a key="email1" href="mailto:admin@gmail.com">admin@gmail.com</a>,
        <a key="email2" href="mailto:example@gmail.com">example@gmail.com</a>,
      ],
    },
    {
      icon: 'feather-map-pin',
      title: 'Our Location',
      content: [
        <p key="location">
          5678 Bangla Main Road, cities 580 <br /> GBnagla, example 54786
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

