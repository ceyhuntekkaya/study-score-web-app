'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * Event Section Component
 * Converted from template
 */
export default function EventSection() {
  const events = [
    {
      id: 1,
      image: '/assets/images/event/grid-type-01.jpg',
      title: 'International Education Fair 2024',
      date: '11 Jan, 2024',
      location: 'IAC Building',
    },
    {
      id: 2,
      image: '/assets/images/event/grid-type-02.jpg',
      title: 'Painting Art Contest 2020',
      location: 'Vancouver',
      time: '8:00 am - 5:00 pm',
    },
    {
      id: 3,
      image: '/assets/images/event/grid-type-03.jpg',
      title: 'Study Score Education Fair 2024',
      location: 'Paris',
      time: '8:00 am - 5:00 pm',
    },
    {
      id: 4,
      image: '/assets/images/event/grid-type-04.jpg',
      title: 'Elegant Light Box Paper Cut Dioramas',
      location: 'IAC Building',
      time: '8:00 am - 5:00 pm',
    },
  ];

  return (
    <div className="rbt-event-area bg-gradient-7 rbt-section-gap rbt-section-box">
      <div className="container">
        <div className="row mb--50">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <h6 className="color-white w-500 mb--15 b2">Motivated to Participate?</h6>
              <h2 className="title color-white w-600">Join Upcoming Events</h2>
            </div>
          </div>
        </div>
        <div className="row g-5">
          {events.map((event) => (
            <div key={event.id} className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="rbt-card card-list-2 event-list-card variation-01 rbt-hover">
                <div className="rbt-card-img">
                  <Link href="/event-details">
                    <Image 
                      src={event.image} 
                      alt={event.title} 
                      width={600} 
                      height={400}
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                </div>
                <div className="rbt-card-body">
                  <ul className="rbt-meta">
                    {event.date && (
                      <li>
                        <i className="feather-calendar"></i>
                        {event.date}
                      </li>
                    )}
                    <li>
                      <i className="feather-map-pin"></i>
                      {event.location}
                    </li>
                    {event.time && (
                      <li>
                        <i className="feather-clock"></i>
                        {event.time}
                      </li>
                    )}
                  </ul>
                  <h4 className="rbt-card-title">
                    <Link href="/event-details">{event.title}</Link>
                  </h4>
                  <div className="read-more-btn">
                    <Link className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round" href="/event-details">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Get Ticket</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

