"use client";

import React, { useState } from "react";

interface Question {
  label: string;
  value: string;
  isInput: boolean;
  inputId?: number;
  placeholder?: string;
  type?: "text" | "number" | "select";
  options?: string[];
}

const Questions1To5Section = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      label: "First name",
      value: "",
      isInput: true,
      inputId: 1,
      placeholder: "Enter your first name",
      type: "text",
    },
    {
      label: "Family name",
      value: "Yuichini",
      isInput: false,
    },
    {
      label: "Gender",
      value: "Female",
      isInput: false,
    },
    {
      label: "Age",
      value: "28",
      isInput: false,
    },
    {
      label: "Passport number",
      value: "",
      isInput: true,
      inputId: 2,
      placeholder: "Enter your passport number",
      type: "text",
    },
    {
      label: "Nationality",
      value: "Japanese",
      isInput: false,
    },
    {
      label: "Course enrolled",
      value: "",
      isInput: true,
      inputId: 3,
      placeholder: "Enter course name",
      type: "text",
    },
    {
      label: "Length of the course",
      value: "",
      isInput: true,
      inputId: 4,
      placeholder: "Enter course duration",
      type: "text",
    },
    {
      label: "Homestay time",
      value: "",
      isInput: true,
      inputId: 5,
      placeholder: "Enter homestay duration",
      type: "text",
    },
  ]);

  const handleInputChange = (inputId: number, newValue: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.inputId === inputId
          ? { ...question, value: newValue }
          : question
      )
    );
  };

  const renderInput = (question: Question) => {
    const baseClasses =
      "w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm";

    if (question.type === "select" && question.options) {
      return (
        <select
          value={question.value}
          onChange={(e) => handleInputChange(question.inputId!, e.target.value)}
          className={baseClasses}
        >
          <option value="">Select...</option>
          {question.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={question.type || "text"}
        value={question.value}
        onChange={(e) => handleInputChange(question.inputId!, e.target.value)}
        placeholder={question.placeholder}
        className={baseClasses}
      />
    );
  };

  return (
    <div className="bg-white">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          PERSONAL DETAILS FOR HOMESTAY APPLİCATİON
        </h2>
      </div>

      <div className="overflow-hidden border border-gray-300 rounded-2xl">
        <table className="w-full">
          <tbody>
            {questions.map((question, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-3.5 py-2 text-xs font-medium text-gray-700 w-1/2 border-r border-gray-200">
                  {question.label}
                </td>
                <td className="px-3.5 py-2 w-1/2">
                  <div className="flex items-center gap-3">
                    {question.isInput ? (
                      <>
                        <div className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {question.inputId}
                        </div>
                        <div className="flex-1">{renderInput(question)}</div>
                      </>
                    ) : (
                      <span className="text-xs text-gray-800">
                        {question.value}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Questions1To5Section;
