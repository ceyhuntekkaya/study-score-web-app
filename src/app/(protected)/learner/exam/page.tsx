'use client';

import { ExamProvider, useExam } from '@/contexts/ExamContext';
import { useTranslation } from '@/i18n';

function ExamContent() {
  const { currentExam, examProgress, setCurrentExam, updateProgress } = useExam();
  const { t } = useTranslation();

  const handleStartExam = () => {
    setCurrentExam({
      id: 'exam-1',
      title: 'Sample Exam',
      questions: [
        { id: 1, question: 'Exam Question 1?', options: ['A', 'B', 'C', 'D'] },
        { id: 2, question: 'Exam Question 2?', options: ['A', 'B', 'C', 'D'] },
      ],
    });
  };

  return (
    <div>
      <h1>Learner Exam</h1>
      <p>This is the learner exam page. Content type: Exam</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Exam Progress: {examProgress}%</h3>
        {currentExam ? (
          <div>
            <h4>{currentExam.title}</h4>
            <p>Questions: {currentExam.questions?.length || 0}</p>
            <button
              onClick={() => updateProgress(Math.min(examProgress + 10, 100))}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Increase Progress
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartExam}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Start Exam
          </button>
        )}
      </div>
    </div>
  );
}

export default function LearnerExamPage() {
  return (
    <ExamProvider>
      <ExamContent />
    </ExamProvider>
  );
}

