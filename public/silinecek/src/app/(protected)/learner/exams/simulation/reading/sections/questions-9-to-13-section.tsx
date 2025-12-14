"use client";

import React, { useState } from "react";

const Questions9To13Section: React.FC = () => {
  const [answers, setAnswers] = useState({
    q9: "",
    q10: "",
    q11: "",
    q12: "",
    q13: "",
  });

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Questions 9-13 Header */}
      <div className="border-l-4 border-teal-500 pl-4">
        <h3 className="text-lg font-semibold text-teal-600 mb-2">
          Questions 9-13
        </h3>
        <p className="text-gray-700 text-sm">
          Choose the correct letter, A, B, C or D for each question.
        </p>
      </div>

      {/* Question 9 */}
      <div className="space-y-3">
        <div className="flex items-start space-x-4">
          <span className="text-gray-800 font-medium min-w-[20px]">9.</span>
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              What is the main purpose of M-Pesa according to the passage?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q9"
                  value="A"
                  checked={answers.q9 === "A"}
                  onChange={(e) => handleAnswerChange("q9", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">A. To provide banking services to rural areas</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q9"
                  value="B"
                  checked={answers.q9 === "B"}
                  onChange={(e) => handleAnswerChange("q9", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">B. To transfer money between mobile phone users</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q9"
                  value="C"
                  checked={answers.q9 === "C"}
                  onChange={(e) => handleAnswerChange("q9", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">C. To compete with traditional banks</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q9"
                  value="D"
                  checked={answers.q9 === "D"}
                  onChange={(e) => handleAnswerChange("q9", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">D. To provide internet services</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Question 10 */}
      <div className="space-y-3">
        <div className="flex items-start space-x-4">
          <span className="text-gray-800 font-medium min-w-[20px]">10.</span>
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              How much money can customers keep in their M-Pesa virtual account?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q10"
                  value="A"
                  checked={answers.q10 === "A"}
                  onChange={(e) => handleAnswerChange("q10", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">A. Up to 50,000 shillings</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q10"
                  value="B"
                  checked={answers.q10 === "B"}
                  onChange={(e) => handleAnswerChange("q10", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">B. Up to 100,000 shillings</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q10"
                  value="C"
                  checked={answers.q10 === "C"}
                  onChange={(e) => handleAnswerChange("q10", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">C. Unlimited amount</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q10"
                  value="D"
                  checked={answers.q10 === "D"}
                  onChange={(e) => handleAnswerChange("q10", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">D. Up to 25,000 shillings</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Question 11 */}
      <div className="space-y-3">
        <div className="flex items-start space-x-4">
          <span className="text-gray-800 font-medium min-w-[20px]">11.</span>
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              What percentage of Kenyans are excluded from the formal financial sector?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q11"
                  value="A"
                  checked={answers.q11 === "A"}
                  onChange={(e) => handleAnswerChange("q11", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">A. More than 60%</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q11"
                  value="B"
                  checked={answers.q11 === "B"}
                  onChange={(e) => handleAnswerChange("q11", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">B. More than 80%</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q11"
                  value="C"
                  checked={answers.q11 === "C"}
                  onChange={(e) => handleAnswerChange("q11", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">C. More than 70%</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q11"
                  value="D"
                  checked={answers.q11 === "D"}
                  onChange={(e) => handleAnswerChange("q11", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">D. More than 90%</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Question 12 */}
      <div className="space-y-3">
        <div className="flex items-start space-x-4">
          <span className="text-gray-800 font-medium min-w-[20px]">12.</span>
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              Who developed the M-Pesa service?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q12"
                  value="A"
                  checked={answers.q12 === "A"}
                  onChange={(e) => handleAnswerChange("q12", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">A. Safaricom</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q12"
                  value="B"
                  checked={answers.q12 === "B"}
                  onChange={(e) => handleAnswerChange("q12", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">B. Vodafone</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q12"
                  value="C"
                  checked={answers.q12 === "C"}
                  onChange={(e) => handleAnswerChange("q12", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">C. Kenyan government</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q12"
                  value="D"
                  checked={answers.q12 === "D"}
                  onChange={(e) => handleAnswerChange("q12", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">D. Local banks</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Question 13 */}
      <div className="space-y-3">
        <div className="flex items-start space-x-4">
          <span className="text-gray-800 font-medium min-w-[20px]">13.</span>
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              What is the main advantage of M-Pesa for urban Kenyans?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q13"
                  value="A"
                  checked={answers.q13 === "A"}
                  onChange={(e) => handleAnswerChange("q13", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">A. Lower transaction fees</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q13"
                  value="B"
                  checked={answers.q13 === "B"}
                  onChange={(e) => handleAnswerChange("q13", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">B. Supporting relatives in rural areas</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q13"
                  value="C"
                  checked={answers.q13 === "C"}
                  onChange={(e) => handleAnswerChange("q13", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">C. Access to international transfers</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="q13"
                  value="D"
                  checked={answers.q13 === "D"}
                  onChange={(e) => handleAnswerChange("q13", e.target.value)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700">D. Better interest rates</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions9To13Section;
