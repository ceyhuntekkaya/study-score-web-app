import React, { useState, useEffect } from 'react';
import {useExamAnswer} from "@/hooks/exam/use-exam-answer";
import {EQuestionTemplateType} from "@/types/exam/exam-type";

type AnswerInputProps = {
    questionId: string;
    questionType: EQuestionTemplateType;
    sessionId: string;
};

export const AnswerInput: React.FC<AnswerInputProps> = ({ questionId, questionType, sessionId }) => {
    const { sessionAnswers, saveAnswer } = useExamAnswer();
    const [inputValue, setInputValue] = useState('');

    // Mevcut cevabı yükle
    useEffect(() => {
        const existingAnswer = sessionAnswers.find(a =>
            a.questionId === questionId
        );

        if (existingAnswer) {
            setInputValue(existingAnswer.answerData);
        } else {
            setInputValue('');
        }
    }, [questionId, sessionAnswers]);

    // Cevabı kaydet
    const handleSaveAnswer = (value: string) => {

        /*
        const answerData = {
            sessionId,
            questionId,
            answer: value,
        };
         if (questionPart) {
            answerData.questionPartId = questionPart.id;
        }
         */



        saveAnswer(sessionId,sessionId,value);
    };

    // Yazma alanı için
    if (questionType === EQuestionTemplateType.ESSAY) {
        return (
            <div className="mt-3">
                <label className="form-label fw-medium small mb-2">
                    Your Answer:
                </label>
                <textarea
                    className="form-control"
                    style={{ minHeight: "200px" }}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        handleSaveAnswer(e.target.value);
                    }}
                    placeholder="Cevabınızı buraya yazın..."
                />
            </div>
        );
    }

    // Kısa cevap alanı için
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer:
            </label>
            <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    handleSaveAnswer(e.target.value);
                }}
                placeholder="Cevabınızı buraya yazın..."
            />
        </div>
    );
};