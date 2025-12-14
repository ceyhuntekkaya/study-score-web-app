"use client";

import React, { useState } from "react";

const Questions5To8Section: React.FC = () => {
  const [answers, setAnswers] = useState({
    q5: "",
    q6: "",
    q7: "",
    q8: "",
  });

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Questions 5-8 Header */}
      <div className="border-l-4 border-teal-500 pl-4">
        <h3 className="text-lg font-semibold text-teal-600 mb-2">
          Questions 5-8
        </h3>
        <p className="text-gray-700 text-sm">
          Complete the following sentences using{" "}
          <span className="text-red-500 font-bold">
            NO MORE THAN THREE WORDS
          </span>{" "}
          from the text for each gap.
        </p>
      </div>

      {/* Question 5 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">5.</span>
        <span className="text-gray-700 flex-1">
          Safaricom is the{" "}
          <input
            type="text"
            value={answers.q5}
            onChange={(e) => handleAnswerChange("q5", e.target.value)}
            className="border-b-2 border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-teal-500 min-w-[120px]"
            placeholder="Blank 5"
          />{" "}
          mobile phone company in Kenya.
        </span>
      </div>

      {/* Question 6 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">6.</span>
        <span className="text-gray-700 flex-1">
          An M-Pesa account needs to be credited by{" "}
          <input
            type="text"
            value={answers.q6}
            onChange={(e) => handleAnswerChange("q6", e.target.value)}
            className="border-b-2 border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-teal-500 min-w-[120px]"
            placeholder="Blank 6"
          />
        </span>
      </div>

      {/* Question 7 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">7.</span>
        <span className="text-gray-700 flex-1">
          <input
            type="text"
            value={answers.q7}
            onChange={(e) => handleAnswerChange("q7", e.target.value)}
            className="border-b-2 border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-teal-500 min-w-[120px]"
            placeholder="Blank 7"
          />{" "}
          companies are particularly interested in using M-Pesa.
        </span>
      </div>

      {/* Question 8 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-medium min-w-[20px]">8.</span>
        <span className="text-gray-700 flex-1">
          M-Pesa was developed by{" "}
          <input
            type="text"
            value={answers.q8}
            onChange={(e) => handleAnswerChange("q8", e.target.value)}
            className="border-b-2 border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-teal-500 min-w-[120px]"
            placeholder="Blank 8"
          />
        </span>
      </div>
    </div>
  );
};

export default Questions5To8Section;
