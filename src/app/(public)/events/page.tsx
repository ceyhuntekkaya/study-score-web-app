'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getAllEvents } from '@/lib/events';

/**
 * Events List Page
 * Displays all available events
 */
export default function EventsListPage() {
  const events = getAllEvents();

  return (
    <>
      {/* Banner Section */}
      <div className="rbt-page-banner-wrapper">
        {/* Start Banner BG Image */}
        <div className="rbt-banner-image"></div>
        {/* End Banner BG Image */}
        <div className="rbt-banner-content">
          {/* Start Banner Content Top */}
          <div className="rbt-banner-content-top">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  {/* Start Breadcrumb Area */}
                  <ul className="page-list">
                    <li className="rbt-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <div className="icon-right"><i className="feather-chevron-right"></i></div>
                    </li>
                    <li className="rbt-breadcrumb-item active">All Event</li>
                  </ul>
                  {/* End Breadcrumb Area */}

                  <div className="title-wrapper">
                    <h1 className="title mb--0">All Event</h1>
                    <a href="#" className="rbt-badge-2">
                      <div className="image">🎉</div> {events.length} Events
                    </a>
                  </div>
                  <p className="description">Event that help beginner designers become true unicorns.</p>
                </div>
              </div>
            </div>
          </div>
          {/* End Banner Content Top */}
        </div>
      </div>

      {/* Events List Section */}
      <div className="rbt-counterup-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row g-5">
            {events.map((event) => (
              <div key={event.id} className="col-lg-6 col-md-6 col-12">
                <div className="rbt-card card-list-2 event-list-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <Link href={`/events/${event.slug}`}>
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
                      <Link href={`/events/${event.slug}`}>{event.title}</Link>
                    </h4>
                    <div className="read-more-btn">
                      <Link
                        className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                        href={`/events/${event.slug}`}
                      >
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

          {/* Pagination */}
          <div className="row">
            <div className="col-lg-12 mt--60">
              <nav>
                <ul className="rbt-pagination">
                  <li>
                    <a href="#" aria-label="Previous">
                      <i className="feather-chevron-left"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">1</a>
                  </li>
                  <li className="active">
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#" aria-label="Next">
                      <i className="feather-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

