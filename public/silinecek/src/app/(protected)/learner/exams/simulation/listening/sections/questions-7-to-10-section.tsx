"use client";

import React, { useState } from "react";

interface Question {
  id: number;
  beforeInput: string;
  afterInput?: string;
  answer: string;
  placeholder?: string;
}

const Questions7To10Section = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({
    7: "",
    8: "",
    9: "",
    10: "",
  });

  const questions: Question[] = [
    {
      id: 7,
      beforeInput:
        "Although the girl is not a vegetarian, she doesn't eat a lot of meat. Her favourite food is",
      afterInput: ".",
      answer: "",
      placeholder: "Enter answer (max 3 words)",
    },
    {
      id: 8,
      beforeInput:
        "The girls has given up playing handball. Now, she just play",
      afterInput: "with her friends at weekends.",
      answer: "",
      placeholder: "Enter answer (max 3 words)",
    },
    {
      id: 9,
      beforeInput:
        "The girl does not like the bus because they are always late. She would rather",
      afterInput: ".",
      answer: "",
      placeholder: "Enter answer (max 3 words)",
    },
    {
      id: 10,
      beforeInput:
        "The girl can get the information about the homestay family that she wants",
      afterInput: ".",
      answer: "",
      placeholder: "Enter answer (max 3 words)",
    },
  ];

  const handleAnswerChange = (questionId: number, value: string) => {
    // Limit to 3 words max
    const words = value.trim().split(/\s+/);
    if (words.length > 3 && value.trim() !== "") {
      return; // Don't update if more than 3 words
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const getAnswerWithBlank = (question: Question) => {
    return (
      <div className="text-sm text-gray-700 leading-relaxed">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex-shrink-0">{question.beforeInput}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {question.id}
            </div>
            <input
              type="text"
              value={answers[question.id]}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="min-w-[220px] max-w-[360px] px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm"
              maxLength={50}
            />
          </div>
          {question.afterInput && (
            <span className="flex-shrink-0">{question.afterInput}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-cyan-500 mb-3">Question 7-10</h2>

        {/* Instructions */}
        <div className="bg-gray-50 p-3.5 rounded-lg mb-3.5">
          <p className="text-sm text-gray-700 mb-1">
            Fill in the blanks with{" "}
            <span className="text-red-500 font-bold">
              NO MORE THAN THREE WORDS
            </span>{" "}
            for each answer.
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((question) => (
          <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
            {/* Question Content */}
            <div className="mb-3">{getAnswerWithBlank(question)}</div>

            {/* Word count warning */}
            {getWordCount(answers[question.id]) > 3 && (
              <div className="mt-2 text-red-500 text-xs font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Answer exceeds 3 words limit
              </div>
            )}

            {/* Answer validation */}
            {answers[question.id] &&
              getWordCount(answers[question.id]) <= 3 && (
                <div className="mt-2 text-green-600 text-xs font-medium flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Answer is valid ({getWordCount(answers[question.id])} word
                  {getWordCount(answers[question.id]) !== 1 ? "s" : ""})
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
        <h3 className="text-sm font-semibold text-cyan-700 mb-2">
          Progress Summary
        </h3>
        <div className="flex gap-4 flex-wrap">
          {questions.map((question) => (
            <div key={question.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Q{question.id}:</span>
              <div
                className={`w-4 h-4 rounded-full ${
                  answers[question.id] &&
                  getWordCount(answers[question.id]) <= 3
                    ? "bg-green-500"
                    : answers[question.id]
                    ? "bg-red-500"
                    : "bg-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Completed:{" "}
          {
            Object.values(answers).filter(
              (answer) => answer && getWordCount(answer) <= 3
            ).length
          }
          /4
        </p>
      </div>
    </div>
  );
};

export default Questions7To10Section;
