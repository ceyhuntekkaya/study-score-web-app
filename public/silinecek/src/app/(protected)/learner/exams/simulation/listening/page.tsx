"use client";

import Header from "./components/header";
import Questions1To5Section from "./sections/questions-1-to-5-section";
import Questions6Section from "./sections/questions-6-section";
import Questions7To10Section from "./sections/questions-7-to-10-section";
import Footer from "./components/footer";

export default function ListeningPage() {
  const handleSubmit = () => {
    // Handle test submission
    console.log("Test submitted");
    // You can add navigation or other logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSubmit={handleSubmit} />

      {/* Main Content Area */}
      <div className="p-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-4">
            {/* Part 1 Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Part 1</h1>

            {/* Questions 1-5 Header */}
            <h2 className="text-xl font-semibold text-cyan-500 mb-4">
              Questions 1-5
            </h2>

            {/* Main Content Text */}
            <div className="space-y-3">
              <p className="text-gray-700 text-base leading-relaxed italic">
                The housing officer takes some details from the girl.
              </p>

              <p className="text-gray-700 text-base leading-relaxed italic">
                Complete the following form with{" "}
                <span className="text-red-500 font-bold">
                  NO MORE THAN THREE WORDS AND/OR A NUMBER
                </span>{" "}
                for each answer.
              </p>
            </div>

            <Questions1To5Section />

            {/* Questions 6 Section */}
            <div className="mt-6">
              <Questions6Section />
            </div>

            {/* Questions 7-10 Section */}
            <div className="mt-6">
              <Questions7To10Section />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
