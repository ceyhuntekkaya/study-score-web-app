'use client';

import '../../styles/report.css';

/**
 * Lesson Sidebar Component
 * Converted from template - course content sidebar
 * Uses pathname to parse route params (layout can't use useParams)
 */
export default function CourseReportDemo() {
  

  return (
    <div>
      



    <div className="demo-ielts-dashboard">
        <div className="demo-container">
            <div className="demo-header">
                <h1>🎯 IELTS Progress Dashboard</h1>
                <div className="demo-student-info">Week 6 of 12 • Target Band: 7.0</div>
            </div>

            <div className="demo-dashboard">
                <div className="demo-card">
                    <div className="demo-card-title">
                        <div className="demo-icon">📊</div>
                        Overall Progress
                    </div>
                    <div className="demo-progress-circle">
                        <svg width="180" height="180">
                            <defs>
                                <linearGradient id="demo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                                </linearGradient>
                            </defs>
                            <circle className="demo-progress-circle-bg" cx="90" cy="90" r="75"></circle>
                            <circle className="demo-progress-circle-fill" cx="90" cy="90" r="75" 
                                    strokeDasharray="471" strokeDashoffset="179"></circle>
                        </svg>
                        <div className="demo-progress-text">
                            <div className="demo-percentage">62%</div>
                            <div className="demo-label">Complete</div>
                        </div>
                    </div>
                    <div className="demo-band-display">
                        <div className="demo-band-item">
                            <div className="demo-band-value demo-start">5.5</div>
                            <div className="demo-band-label">Start</div>
                        </div>
                        <div className="demo-band-item">
                            <div className="demo-band-value demo-current">6.3</div>
                            <div className="demo-band-label">Current</div>
                        </div>
                        <div className="demo-band-item">
                            <div className="demo-band-value demo-target">7.0</div>
                            <div className="demo-band-label">Target</div>
                        </div>
                    </div>
                </div>

                <div className="demo-card">
                    <div className="demo-card-title">
                        <div className="demo-icon">🎧</div>
                        Listening
                    </div>
                    <div className="demo-skill-bar-container">
                        <div className="demo-skill-header">
                            <span className="demo-skill-name">Current Performance</span>
                            <span className="demo-skill-band">6.8 / 7.0</span>
                        </div>
                        <div className="demo-progress-bar-bg">
                            <div className="demo-progress-bar-fill" style={{width: '97%'}}></div>
                        </div>
                        <span className="demo-status-badge demo-status-on-track">On Track 🎯</span>
                    </div>
                    <div className="demo-score-trend">
                        <div className="demo-score-bar" style={{height: '70%'}} data-score="28"></div>
                        <div className="demo-score-bar" style={{height: '85%'}} data-score="30"></div>
                        <div className="demo-score-bar" style={{height: '92%'}} data-score="31"></div>
                    </div>
                    <div className="demo-tag-list">
                        <div className="demo-tag demo-strength">Main idea questions</div>
                        <div className="demo-tag demo-strength">Multiple choice</div>
                        <div className="demo-tag demo-weakness">Section 4 distractors</div>
                    </div>
                </div>

                {/* Reading Skill Card */}
                <div className="demo-card">
                    <div className="demo-card-title">
                        <div className="demo-icon">📖</div>
                        Reading
                    </div>
                    <div className="demo-skill-bar-container">
                        <div className="demo-skill-header">
                            <span className="demo-skill-name">Current Performance</span>
                            <span className="demo-skill-band">6.2 / 7.0</span>
                        </div>
                        <div className="demo-progress-bar-bg">
                            <div className="demo-progress-bar-fill" style={{width: '89%'}}></div>
                        </div>
                        <span className="demo-status-badge demo-status-behind">Slightly Behind ⚠️</span>
                    </div>
                    <div className="demo-score-trend">
                        <div className="demo-score-bar" style={{height: '60%'}} data-score="24"></div>
                        <div className="demo-score-bar" style={{height: '75%'}} data-score="26"></div>
                        <div className="demo-score-bar" style={{height: '84%'}} data-score="27"></div>
                    </div>
                    <div className="demo-tag-list">
                        <div className="demo-tag demo-strength">True/False/Not Given</div>
                        <div className="demo-tag demo-weakness">Matching headings</div>
                        <div className="demo-tag demo-weakness">Time management</div>
                    </div>
                </div>

                {/* Writing Skill Card */}
                <div className="demo-card">
                    <div className="demo-card-title">
                        <div className="demo-icon">✍️</div>
                        Writing
                    </div>
                    <div className="demo-skill-bar-container">
                        <div className="demo-skill-header">
                            <span className="demo-skill-name">Current Performance</span>
                            <span className="demo-skill-band">6.0 / 7.0</span>
                        </div>
                        <div className="demo-progress-bar-bg">
                            <div className="demo-progress-bar-fill" style={{width: '86%'}}></div>
                        </div>
                        <span className="demo-status-badge demo-status-attention">Needs Attention 🔔</span>
                    </div>
                    <div className="demo-task-scores">
                        <div className="demo-task-score-item">
                            <span className="demo-task-label">Task 1</span>
                            <span className="demo-task-value">6.0</span>
                        </div>
                        <div className="demo-task-score-item">
                            <span className="demo-task-label">Task 2</span>
                            <span className="demo-task-value">5.8</span>
                        </div>
                    </div>
                    <div className="demo-tag-list">
                        <div className="demo-tag demo-weakness">Data comparison</div>
                        <div className="demo-tag demo-weakness">Idea development</div>
                        <div className="demo-tag demo-strength">Clear opinion</div>
                    </div>
                </div>

                <div className="demo-card">
                    <div className="demo-card-title">
                        <div className="demo-icon">🗣️</div>
                        Speaking
                    </div>
                    <div className="demo-skill-bar-container">
                        <div className="demo-skill-header">
                            <span className="demo-skill-name">Current Performance</span>
                            <span className="demo-skill-band">6.1 / 7.0</span>
                        </div>
                        <div className="demo-progress-bar-bg">
                            <div className="demo-progress-bar-fill" style={{width: '87%'}}></div>
                        </div>
                        <span className="demo-status-badge demo-status-attention">Needs Attention 🔔</span>
                    </div>
                    <div className="demo-task-scores">
                        <div className="demo-task-score-item">
                            <span className="demo-task-label">Fluency</span>
                            <span className="demo-task-value">Moderate</span>
                        </div>
                        <div className="demo-task-score-item">
                            <span className="demo-task-label">Pronunciation</span>
                            <span className="demo-task-value">Clear</span>
                        </div>
                    </div>
                    <div className="demo-tag-list">
                        <div className="demo-tag demo-weakness">Limited lexical range</div>
                        <div className="demo-tag demo-weakness">Hesitation in Part 3</div>
                    </div>
                </div>

                <div className="demo-card demo-card-full">
                    <div className="demo-card-title">
                        <div className="demo-icon">🤖</div>
                        AI Insights & Recommendations
                    </div>
                    <div className="demo-ai-feedback">
                        <p><strong>General Assessment:</strong> The student shows steady progress towards Band 7.0. Listening skills are approaching the target level, while Writing and Speaking require more structured practice and feedback.</p>
                        <p><strong>Estimated Time to Target:</strong> <span className="demo-time-estimate">6 weeks</span></p>
                        
                        <div className="demo-risk-list">
                            <div className="demo-risk-item">⚠️ Writing coherence under exam pressure</div>
                            <div className="demo-risk-item">⚠️ Speaking lexical variety</div>
                        </div>
                    </div>
                </div>

                <div className="demo-card demo-card-full">
                    <div className="demo-card-title">
                        <div className="demo-icon">📅</div>
                        Upcoming Focus Areas
                    </div>
                    <div className="demo-week-plan">
                        <div className="demo-week-section">
                            <div className="demo-week-title">Week 7 Focus</div>
                            <ul className="demo-week-items">
                                <li>Writing Task 2 opinion essays</li>
                                <li>Speaking Part 3 discussion practice</li>
                                <li>Reading matching headings drills</li>
                            </ul>
                        </div>
                        <div className="demo-week-section">
                            <div className="demo-week-title">Week 8 Focus</div>
                            <ul className="demo-week-items">
                                <li>Writing Task 1 comparison language</li>
                                <li>Listening Section 4 note completion</li>
                                <li>Speaking vocabulary expansion</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    </div>
  );
}

