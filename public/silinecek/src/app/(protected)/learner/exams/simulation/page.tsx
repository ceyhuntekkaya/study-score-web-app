"use client";

import { useRouter } from "next/navigation";
import CategoryCard from "./sections/category-card";

const categories = [
  {
    id: "listening",
    title: "IELTS Listening Test",
    subtitle: "Listening Skills Assessment",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
    ),
    isActive: true,
    description:
      "Please watch the video guidance below and confirm you completely understand before taking the Listening test.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    route: "/exams/simulation/listening",
  },
  {
    id: "reading",
    title: "IELTS Reading Test",
    subtitle: "Reading Comprehension",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
    isActive: true,
    description:
      "Test your reading comprehension skills with academic and general training passages.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    route: "/exams/simulation/reading",
  },
  {
    id: "writing",
    title: "IELTS Writing Test",
    subtitle: "Writing Skills Assessment",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
    ),
    isActive: false,
    description:
      "Practice your writing skills with task 1 and task 2 exercises.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    route: "/exams/simulation/writing",
  },
  {
    id: "speaking",
    title: "IELTS Speaking Test",
    subtitle: "Speaking Skills Assessment",
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
      </svg>
    ),
    isActive: false,
    description:
      "Improve your speaking skills through interactive conversation practice.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    route: "/exams/simulation/speaking",
  },
];

export default function SimulationPage() {
  const router = useRouter();

  const handleCategorySelect = (item: {
    id: string;
    title: string;
    subtitle: string;
    icon: React.JSX.Element;
    isActive: boolean;
    description: string;
    videoUrl: string;
    route: string;
  }) => {
    // Navigate to the specified route
    router.push(item.route);
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the test?")) {
      router.push("/exams");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Left Icon */}
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            {/* Right Exit Button */}
            <button
              className="flex items-center space-x-2 px-2.5 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleExit}
            >
              <span className="text-xs font-medium">Exit</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-3 pt-8">
        <div className="max-w-4xl w-full">
          {/* Test Selection Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              IELTS ACADEMIC TEST
            </h1>
            <p className="text-xs text-gray-600">
              Choose the module you want to practice
            </p>
          </div>

          {/* Category Cards */}
          <CategoryCard
            items={categories}
            onItemSelect={handleCategorySelect}
          />
        </div>
      </div>
    </div>
  );
}
