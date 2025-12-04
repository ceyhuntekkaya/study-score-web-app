'use client';

/**
 * Tutor Quiz Attempts Page (Student Quiz Attempts)
 */
export default function TutorQuizAttemptsPage() {
  const attempts = [
    {
      id: 1,
      studentName: 'John Doe',
      quizName: 'JavaScript Fundamentals Quiz',
      date: 'March 15, 2025',
      score: 85,
      totalQuestions: 20,
    },
  ];

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Quiz Attempts</h4>
      </div>

      <div className="row g-5">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="col-lg-12">
            <div className="rbt-card variation-01 rbt-hover">
              <div className="rbt-card-body">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h5 className="rbt-card-title">{attempt.quizName}</h5>
                    <ul className="rbt-meta">
                      <li><i className="feather-user"></i>{attempt.studentName}</li>
                      <li><i className="feather-calendar"></i>{attempt.date}</li>
                    </ul>
                  </div>
                  <div className="col-lg-4 text-end">
                    <div className="rbt-review">
                      <span className="rbt-title-style-2">
                        Score: {attempt.score}% ({attempt.score}/{attempt.totalQuestions})
                      </span>
                    </div>
                    <a className="rbt-btn btn-sm bg-primary-opacity mt--10" href="#">
                      View Details
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

