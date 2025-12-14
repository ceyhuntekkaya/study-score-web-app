"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/ui/button";
import Modal from "./components/ui/modal";

export default function ExamsPage() {
  const [testModalOpen, setTestModalOpen] = useState(false);
  const router = useRouter();

  const handleConfirmTest = () => {
    // Simulation sayfasına yönlendir
    router.push("/exams/simulation");
    setTestModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <h1 className="text-2xl font-bold text-[#1A2E45]">
            Welcome to IELTS Practice
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-4 max-w-2xl mx-auto">
          <div className="flex justify-center mb-1">
            {/* Computer Icon */}
            <svg width="32" height="32" fill="#1A2E45" viewBox="0 0 24 24">
              <path
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                stroke="#1A2E45"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-[#1A2E45] text-center mb-1">
            IELTS Mock Test 2025 January
          </h2>

          <h3 className="text-base font-semibold text-[#1A2E45] text-center mb-2.5">
            Practice test 1
          </h3>

          <div className="flex justify-center items-center mb-2.5">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4].map((star) => (
                <svg
                  key={star}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <svg
                className="w-4 h-4 text-gray-300 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </div>
            <span className="text-xs text-[#6B7A90] ml-1">(2,265 votes)</span>
          </div>

          <div className="flex justify-center items-center mb-4">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-[#1A2E45] mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072 0M5.636 5.636a9 9 0 000 12.728M12 9v6m0 0l-3-3m3 3l3-3"
                />
              </svg>
              <span className="text-sm text-[#6B7A90] font-medium">
                Listening
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setTestModalOpen(true)}
              className="w-44 py-1 bg-[#1A2E45] text-white rounded-full font-semibold text-base hover:bg-[#16325c] transition"
            >
              Take Test
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        showCloseButton={true}
        size="md"
      >
        <div className="flex flex-col items-center bg-white rounded-lg max-w-2xl mx-auto p-2.5">
          <div className="flex justify-center mb-1">
            {/* Computer Icon */}
            <svg width="32" height="32" fill="#1A2E45" viewBox="0 0 24 24">
              <path
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                stroke="#1A2E45"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1A2E45] text-center mb-1">
            IELTS Full Test
          </h2>
          <p className="text-sm text-[#6B7A90] text-center mb-2.5">
            Simulation test mode is the best option to experience the real IELTS
            on computer.
          </p>
          <div className="w-full mb-2.5">
            <h3 className="text-sm font-bold text-[#1A2E45] mb-1">
              Test information
            </h3>
            <ul className="list-disc pl-5 text-sm text-[#6B7A90]">
              <li>
                This test includes the Listening, Reading and Writing sections.{" "}
                <span className="italic">
                  (Speaking simulation will be available soon).
                </span>
              </li>
              <li>
                It takes about 2 hours and 45 minutes to complete (same as the
                real IELTS test).
              </li>
            </ul>
          </div>
          <p className="text-sm text-[#6B7A90] text-center mb-3">
            Please confirm if you would like to continue.
          </p>
          <Button
            onClick={handleConfirmTest}
            className="w-44 py-1 bg-[#1A2E45] text-white rounded-full font-semibold text-base hover:bg-[#16325c] transition"
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
