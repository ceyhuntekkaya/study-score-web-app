"use client";

import React, { useState } from "react";

interface Option {
  id: string;
  text: string;
}

const Questions6Section = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const options: Option[] = [
    { id: "A", text: "A big family with many young children" },
    { id: "B", text: "A family without smoker or drinkers" },
    { id: "C", text: "A family without any pets" },
    { id: "D", text: "A family with many animals or pets" },
  ];

  const handleOptionToggle = (optionId: string) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        // Limit to 2 selections as per the instruction "Mark TWO letter"
        if (prev.length < 2) {
          return [...prev, optionId];
        }
        return prev;
      }
    });
  };

  return (
    <div className="bg-white">
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-cyan-500 mb-3">Question 6</h2>

        {/* Instructions */}
        <p className="text-sm text-gray-700 mb-2">
          Mark <span className="text-red-500 font-bold">TWO</span> letter that
          represent the correct answer.
        </p>

        {/* Question Text */}
        <p className="text-sm text-gray-700 mb-4">
          Which kind of family does the girls prefer?
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3.5">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            onClick={() => handleOptionToggle(option.id)}
          >
            {/* Option Letter Circle */}
            <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {option.id}
            </div>

            {/* Checkbox */}
            <div className="relative">
              <div
                className={`w-6 h-6 border-2 border-cyan-400 rounded flex items-center justify-center transition-colors ${
                  selectedAnswers.includes(option.id)
                    ? "bg-cyan-400"
                    : "bg-white"
                }`}
              >
                {selectedAnswers.includes(option.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Option Text */}
            <p className="text-sm text-gray-700 flex-1 select-none">
              {option.text}
            </p>
          </div>
        ))}
      </div>

      {/* Selection Counter */}
      <div className="mt-4 text-xs text-gray-500">
        Selected: {selectedAnswers.length}/2
        {selectedAnswers.length === 2 && (
          <span className="ml-2 text-green-600 font-medium">
            ✓ Two answers selected
          </span>
        )}
        {selectedAnswers.length > 0 && selectedAnswers.length < 2 && (
          <span className="ml-2 text-orange-600 font-medium">
            Select {2 - selectedAnswers.length} more
          </span>
        )}
      </div>
    </div>
  );
};

export default Questions6Section;
