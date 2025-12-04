'use client';

import { QuizProvider, useQuiz } from '@/contexts/QuizContext';
import { useTranslation } from '@/i18n';

function QuizContent() {
  const { currentQuiz, quizProgress, setCurrentQuiz, updateProgress } = useQuiz();
  const { t } = useTranslation();

  const handleStartQuiz = () => {
    setCurrentQuiz({
      id: 'quiz-1',
      title: 'Sample Quiz',
      questions: [
        { id: 1, question: 'Question 1?', options: ['A', 'B', 'C', 'D'] },
        { id: 2, question: 'Question 2?', options: ['A', 'B', 'C', 'D'] },
      ],
    });
  };

  return (
    <div>
      <h1>Learner Quiz</h1>
      <p>This is the learner quiz page. Content type: Quiz</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Quiz Progress: {quizProgress}%</h3>
        {currentQuiz ? (
          <div>
            <h4>{currentQuiz.title}</h4>
            <p>Questions: {currentQuiz.questions?.length || 0}</p>
            <button
              onClick={() => updateProgress(Math.min(quizProgress + 10, 100))}
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
            onClick={handleStartQuiz}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Start Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default function LearnerQuizPage() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}

