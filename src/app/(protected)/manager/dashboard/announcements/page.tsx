'use client';

/**
 * Manager Announcements Page
 */
export default function ManagerAnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: 'Course Update: New Content Added',
      date: 'March 15, 2025',
      content: 'We have added new content to the React course. Please check it out!',
    },
  ];

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Announcements</h4>
      </div>

      <div className="row g-5">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="col-lg-12">
            <div className="rbt-card variation-01 rbt-hover">
              <div className="rbt-card-body">
                <h5 className="rbt-card-title">{announcement.title}</h5>
                <ul className="rbt-meta">
                  <li><i className="feather-calendar"></i>{announcement.date}</li>
                </ul>
                <p className="rbt-card-text">{announcement.content}</p>
                <a className="rbt-btn btn-sm bg-primary-opacity" href="#">
                  Edit Announcement
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

