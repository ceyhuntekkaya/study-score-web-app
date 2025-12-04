'use client';

/**
 * Tutor Assignments Page
 */
export default function TutorAssignmentsPage() {
  const assignments = [
    {
      id: 1,
      title: 'React Project Assignment',
      course: 'React Front To Back',
      dueDate: 'March 20, 2025',
      submissions: 25,
      status: 'Active',
    },
  ];

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Assignments</h4>
      </div>

      <div className="row g-5">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="col-lg-12">
            <div className="rbt-card variation-01 rbt-hover">
              <div className="rbt-card-body">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h5 className="rbt-card-title">{assignment.title}</h5>
                    <ul className="rbt-meta">
                      <li><i className="feather-book"></i>{assignment.course}</li>
                      <li><i className="feather-calendar"></i>Due: {assignment.dueDate}</li>
                      <li><i className="feather-users"></i>{assignment.submissions} Submissions</li>
                      <li><i className="feather-check-circle"></i>{assignment.status}</li>
                    </ul>
                  </div>
                  <div className="col-lg-4 text-end">
                    <a className="rbt-btn btn-sm bg-primary-opacity" href="#">
                      View Submissions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

