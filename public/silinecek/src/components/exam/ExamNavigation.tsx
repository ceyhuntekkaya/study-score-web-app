
type ExamResultsProps = {
    name: string;
};

export const ExamNavigation: React.FC<ExamResultsProps> = ({
                                                            name
                                                        }) => {


    return (
        <div className="mb-5">
            {name}
        </div>
    );
};


/*
// components/exam/ExamNavigation.tsx
import React from 'react';
import { useExams } from '@/hooks/exam/use-exam';
import { ExamPart } from '@/types/exam/exam-part';
import { ExamPartQuestion } from '@/types/exam/exam-part-question';

type ExamNavigationProps = {
    examParts: ExamPart[];
    questions: ExamPartQuestion[][];
};

export const ExamNavigation: React.FC<ExamNavigationProps> = ({ examParts, questions }) => {
    const {
        currentPartIndex,
        currentQuestionIndex,
        goToQuestion,
        answers
    } = useExams();

    // Cevabın verilip verilmediğini kontrol et
    const isQuestionAnswered = (partIndex: number, questionIndex: number) => {
        const question = questions[partIndex]?.[questionIndex];
        return question ? answers.some(a => a.questionId === question.id) : false;
    };

    return (
        <div className="bg-white shadow rounded p-3 w-100 mb-4">
            <h3 className="fs-5 fw-semibold mb-3">Soru Navigasyonu</h3>

            <div className="d-flex flex-column gap-3">
                {examParts.map((part, partIndex) => (
                    <div key={part.id} className="border-bottom pb-2" style={{borderBottom: partIndex === examParts.length - 1 ? 'none' : ''}}>
                        <h4 className="fw-medium mb-2">{part.name}</h4>

                        <div className="d-flex flex-wrap gap-2">
                            {questions[partIndex]?.map((question, questionIndex) => (
                                <button
                                    key={question.id}
                                    onClick={() => goToQuestion(partIndex, questionIndex)}
                                    className={`btn d-flex align-items-center justify-content-center p-0
                                ${currentPartIndex === partIndex && currentQuestionIndex === questionIndex
                                        ? 'btn-primary'
                                        : isQuestionAnswered(partIndex, questionIndex)
                                            ? 'btn-outline-success'
                                            : 'btn-light'
                                    }`}
                                    style={{width: "2.5rem", height: "2.5rem", borderRadius: "50%"}}
                                >
                                    {questionIndex + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

 */