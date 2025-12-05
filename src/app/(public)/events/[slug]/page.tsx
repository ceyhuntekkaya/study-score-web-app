'use client';

'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getEventBySlug, getAllEvents } from '@/lib/events';

/**
 * Event Details Page
 * Displays detailed information about a specific event
 */
export default function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = getEventBySlug(slug);
  const allEvents = getAllEvents();
  const similarEvents = allEvents.filter(e => e.id !== event?.id).slice(0, 2);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));

  const toggleFaq = (index: number) => {
    const newOpen = new Set(openFaqs);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenFaqs(newOpen);
  };

  if (!event) {
    return (
      <div className="container ptb--100">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>Event Not Found</h2>
            <p>The event you're looking for doesn't exist.</p>
            <Link href="/events" className="rbt-btn btn-gradient">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
        <div className="breadcrumb-inner breadcrumb-dark">
          <Image
            src="/assets/images/bg/bg-image-10.jpg"
            alt="Education Images"
            width={1920}
            height={400}
            className="w-100"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="content">
                <div className="content text-start">
                  <ul className="page-list">
                    <li className="rbt-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <div className="icon-right"><i className="feather-chevron-right"></i></div>
                    </li>
                    <li className="rbt-breadcrumb-item">
                      <a href="/events">Events</a>
                    </li>
                    <li>
                      <div className="icon-right"><i className="feather-chevron-right"></i></div>
                    </li>
                    <li className="rbt-breadcrumb-item active">{event.category}</li>
                  </ul>
                  <h2 className="title mb--0">{event.title}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Content */}
      <div className="rbt-course-details-area rbt-section-gap">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="course-details-content">
                {/* Event Image */}
                <div className="rbt-feature-box rbt-shadow-box thuumbnail">
                  <Image
                    className="w-100"
                    src={event.image}
                    alt={event.title}
                    width={1200}
                    height={600}
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Event Content */}
                <div className="rbt-feature-box rbt-shadow-box mt--60">
                  <div className="row g-5">
                    <div className="col-lg-12">
                      <div className="section-title">
                        <h4 className="title mb--0">Event Content</h4>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <ul className="rbt-list-style-1">
                        {event.content.slice(0, Math.ceil(event.content.length / 2)).map((item, index) => (
                          <li key={index}>
                            <i className="feather-check"></i>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <ul className="rbt-list-style-1">
                        {event.content.slice(Math.ceil(event.content.length / 2)).map((item, index) => (
                          <li key={index}>
                            <i className="feather-check"></i>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="rbt-feature-box rbt-shadow-box mt--60">
                  <div className="row g-5">
                    <div className="col-lg-12">
                      <div className="section-title">
                        <h4 className="title mb--20">Event Description</h4>
                      </div>
                      <p>{event.fullDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Event FAQ */}
                {event.faqs.length > 0 && (
                  <div className="course-content rbt-shadow-box mt--60">
                    <div className="section-title">
                      <h4 className="title mb--0">Event FAQ</h4>
                    </div>
                    <div className="rbt-accordion-style rbt-accordion-02 accordion mt--45">
                      <div className="accordion" id="eventFaqAccordion">
                        {event.faqs.map((faq, index) => (
                          <div key={index} className="accordion-item card">
                            <h2 className="accordion-header card-header" id={`heading-${index}`}>
                              <button
                                className={`accordion-button ${openFaqs.has(index) ? '' : 'collapsed'}`}
                                type="button"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={openFaqs.has(index)}
                                aria-controls={`collapse-${index}`}
                              >
                                {faq.question}
                              </button>
                            </h2>
                            <div
                              id={`collapse-${index}`}
                              className={`accordion-collapse collapse ${openFaqs.has(index) ? 'show' : ''}`}
                              aria-labelledby={`heading-${index}`}
                              data-bs-parent="#eventFaqAccordion"
                            >
                              <div className="accordion-body card-body">
                                <p>{faq.answer}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Participants */}
                {event.participants.length > 0 && (
                  <div className="rbt-participants-area mt--60">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="section-title text-start mb--20">
                          <span className="subtitle bg-secondary-opacity">Event Participants</span>
                          <h2 className="title">Event Participants</h2>
                        </div>
                      </div>
                    </div>
                    <div className="row g-5">
                      {event.participants.map((participant, index) => (
                        <div key={index} className="col-lg-6 col-md-6 col-12">
                          <div className="rbt-team team-style-default style-two rbt-hover">
                            <div className="inner">
                              <div className="thumbnail">
                                <Image
                                  src={participant.image}
                                  alt={participant.name}
                                  width={200}
                                  height={200}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="content">
                                <h2 className="title">{participant.name}</h2>
                                <h6 className="subtitle theme-gradient">{participant.role}</h6>
                                <span className="team-form">
                                  <i className="feather-map-pin"></i>
                                  <span className="location">{participant.location}</span>
                                </span>
                                <p className="description">{participant.bio}</p>
                                <ul className="social-icon social-default icon-naked mt--20">
                                  <li>
                                    <a href="https://www.facebook.com/">
                                      <i className="feather-facebook"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="https://www.twitter.com">
                                      <i className="feather-twitter"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="https://www.instagram.com/">
                                      <i className="feather-instagram"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Events */}
                {similarEvents.length > 0 && (
                  <div className="related-course mt--60">
                    <div className="row">
                      <div className="col-lg-12 mb--40">
                        <div className="section-title text-start">
                          <span className="subtitle bg-secondary-opacity">Similar Event</span>
                          <h2 className="title">Similar Event</h2>
                        </div>
                      </div>
                    </div>
                    <div className="row g-5">
                      {similarEvents.map((similarEvent) => (
                        <div key={similarEvent.id} className="col-lg-6 col-md-6 col-sm-6 col-12 mt--30">
                          <div className="rbt-card event-grid-card variation-01 rbt-hover">
                            <div className="rbt-card-img">
                              <Link href={`/events/${similarEvent.slug}`}>
                                <Image
                                  src={similarEvent.image}
                                  alt={similarEvent.title}
                                  width={600}
                                  height={400}
                                  style={{ objectFit: 'cover' }}
                                />
                              </Link>
                            </div>
                            <div className="rbt-card-body">
                              <ul className="rbt-meta">
                                <li>
                                  <i className="feather-calendar"></i>
                                  {similarEvent.date}
                                </li>
                                <li>
                                  <i className="feather-map-pin"></i>
                                  {similarEvent.location}
                                </li>
                              </ul>
                              <h4 className="rbt-card-title">
                                <Link href={`/events/${similarEvent.slug}`}>{similarEvent.title}</Link>
                              </h4>
                              <div className="read-more-btn">
                                <Link
                                  className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                                  href={`/events/${similarEvent.slug}`}
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
                  </div>
                )}
              </div>
            </div>

            {/* Event Sidebar */}
            <div className="col-lg-4">
              <div className="rbt-course-sidebar rbt-shadow-box">
                <div className="inner">
                  <div className="content-item-content">
                    <div className="rbt-price-area">
                      <div className="price-inner">
                        {event.isFree ? (
                          <span className="price">Free</span>
                        ) : (
                          <>
                            <span className="price">${event.price}</span>
                            <span className="price-text">Per Ticket</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="rbt-course-feature-box">
                      <ul className="rbt-course-feature-list">
                        <li>
                          <i className="feather-calendar"></i>
                          <span>Date:</span>
                          <strong>{event.date}</strong>
                        </li>
                        <li>
                          <i className="feather-clock"></i>
                          <span>Time:</span>
                          <strong>{event.time}</strong>
                        </li>
                        <li>
                          <i className="feather-map-pin"></i>
                          <span>Location:</span>
                          <strong>{event.location}</strong>
                        </li>
                        <li>
                          <i className="feather-tag"></i>
                          <span>Category:</span>
                          <strong>{event.category}</strong>
                        </li>
                        <li>
                          <i className="feather-users"></i>
                          <span>Available:</span>
                          <strong>{event.availableTickets - event.registeredCount} tickets</strong>
                        </li>
                      </ul>
                    </div>
                    <div className="rbt-course-btn">
                      <Link
                        className="rbt-btn btn-gradient hover-icon-reverse w-100 btn-block"
                        href="#"
                      >
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">{event.isFree ? 'Register Now' : 'Get Ticket'}</span>
                          <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                          <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                        </span>
                      </Link>
                    </div>
                    <div className="rbt-course-info">
                      <p className="rbt-course-text">
                        <i className="feather-info"></i>
                        {event.registeredCount} people have already registered for this event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

