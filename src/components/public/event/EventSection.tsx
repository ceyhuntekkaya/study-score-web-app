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
      title: 'The Future of Exam Prep: AI Revolution',
      date: '15 Jan, 2026',
      time: '10:00 am - 2:00 pm',
      location: 'ANKÜ Teknokent',
    },
    {
      id: 2,
      image: '/assets/images/event/grid-type-02.jpg',
      title: 'Mastering IELTS with Your Personal AI Tutor',
      date: '22 Jan, 2026',
      time: '1:00 pm - 4:00 pm',
      location: 'ANKÜ Teknokent',
    },
    {
      id: 3,
      image: '/assets/images/event/grid-type-03.jpg',
      title: 'SAT & TOEFL Strategy Summit',
      date: '05 Feb, 2026',
      time: '9:00 am - 5:00 pm',
      location: 'ANKÜ Teknokent',
    },
    {
      id: 4,
      image: '/assets/images/event/grid-type-04.jpg',
      title: 'Next-Gen EdTech: Personalized Learning',
      date: '12 Feb, 2026',
      time: '10:00 am - 3:00 pm',
      location: 'ANKÜ Teknokent',
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
                    <Link className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round" href="/login">
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Join Event</span>
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

