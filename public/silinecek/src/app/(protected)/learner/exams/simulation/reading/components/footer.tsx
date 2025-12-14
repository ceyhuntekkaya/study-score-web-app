"use client";

import React from "react";

const Footer: React.FC = () => {
  const part1Questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const part2TotalQuestions = 13;
  const part2AnsweredQuestions = 0;
  const part3TotalQuestions = 14;
  const part3AnsweredQuestions = 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 shadow-sm">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 border border-[#14b8a6] rounded-md p-1">
          <span className="font-semibold text-gray-800 text-xs">Part 1</span>
          <div className="flex space-x-1">
            {part1Questions.map((questionNum) => (
              <button
                key={questionNum}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-[#14b8a6] text-white text-[10px] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-opacity-50"
                onClick={() => console.log(`Question ${questionNum} clicked`)}
              >
                {questionNum}
              </button>
            ))}
          </div>
        </div>

        <div className="text-gray-800 font-semibold text-xs">
          Part 2: {part2AnsweredQuestions} of {part2TotalQuestions} questions
        </div>

        <div className="text-gray-800 font-semibold text-xs">
          Part 3: {part3AnsweredQuestions} of {part3TotalQuestions} questions
        </div>
      </div>
    </div>
  );
};

export default Footer;
