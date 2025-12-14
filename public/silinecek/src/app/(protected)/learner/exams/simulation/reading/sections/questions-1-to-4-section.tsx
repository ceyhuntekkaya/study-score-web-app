"use client";

import React, { useState } from "react";

const Questions1To4Section: React.FC = () => {
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Questions 1-4 Header */}
      <div className="border-l-4 border-teal-500 pl-4">
        <h3 className="text-lg font-semibold text-teal-600 mb-2">
          Questions 1-4
        </h3>
        <p className="text-gray-700 text-sm">
          The text has 5 paragraphs (A - E). Which paragraph contains each of the following pieces of information?
        </p>
      </div>

      {/* Question 1 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">1.</span>
        <span className="text-gray-700 flex-1">
          A possible security problem
        </span>
        <select
          value={answers.q1}
          onChange={(e) => handleAnswerChange("q1", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
      </div>

      {/* Question 2 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">2.</span>
        <span className="text-gray-700 flex-1">
          The cost of M-Pesa
        </span>
        <select
          value={answers.q2}
          onChange={(e) => handleAnswerChange("q2", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
      </div>

      {/* Question 3 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">3.</span>
        <span className="text-gray-700 flex-1">
          An international service similar to M-Pesa
        </span>
        <select
          value={answers.q3}
          onChange={(e) => handleAnswerChange("q3", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
      </div>

      {/* Question 4 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">4.</span>
        <span className="text-gray-700 flex-1">
          The fact that most Kenyans do not have a bank account
        </span>
        <select
          value={answers.q4}
          onChange={(e) => handleAnswerChange("q4", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
      </div>
    </div>
  );
};

export default Questions1To4Section;
