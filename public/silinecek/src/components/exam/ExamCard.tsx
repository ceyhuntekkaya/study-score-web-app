"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Book, Globe, BarChart3, Calendar } from "lucide-react";
import { ECourseCategory, EStatus } from "@/types/enumeration";
import { ExamDto } from "@/types/exam/exam-type";
import "@/style.css";

const getCategoryStyle = (category: ECourseCategory) => {
  switch (category) {
    case ECourseCategory.IELTS:
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        text: "IELTS",
      };
    case ECourseCategory.TOEFL:
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        text: "TOEFL",
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        text: "OTHER",
      };
  }
};

const getLevelStyle = (level: string) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        text: "beginner",
      };
    case "intermediate":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        text: "intermediate",
      };
    case "advanced":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        text: "advanced",
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        text: level || "-",
      };
  }
};

// Durum kontrolü ve gösterimi
const getStatusBadge = (status: EStatus | null) => {
  if (!status) return null;

  const statusConfig: Record<EStatus, { bgColor: string; text: string }> = {
    [EStatus.ACTIVE]: {
      bgColor: "bg-green-500",
      text: "ACTIVE",
    },
    [EStatus.COMPLETED]: {
      bgColor: "bg-yellow-500",
      text: "COMPLETED",
    },
    [EStatus.DELETED]: {
      bgColor: "bg-red-500",
      text: "DELETED",
    },
    [EStatus.PASSIVE]: {
      bgColor: "bg-gray-500",
      text: "PASSIVE",
    },
    [EStatus.WAITING]: {
      bgColor: "bg-gray-500",
      text: "WAITING",
    },
    [EStatus.CONFIRMED]: {
      bgColor: "bg-gray-500",
      text: "CONFIRMED",
    },
    [EStatus.REJECTED]: {
      bgColor: "bg-gray-500",
      text: "REJECTED",
    },
    [EStatus.CANCELLED]: {
      bgColor: "bg-gray-500",
      text: "CANCELLED",
    },
    [EStatus.IN_PROGRESS]: {
      bgColor: "bg-gray-500",
      text: "IN_PROGRESS",
    },
    [EStatus.NOT_STARTED]: {
      bgColor: "bg-gray-500",
      text: "NOT_STARTED",
    },
    [EStatus.PENDING]: {
      bgColor: "bg-gray-500",
      text: "PENDING",
    },
    [EStatus.SUSPENDED]: {
      bgColor: "bg-gray-500",
      text: "SUSPENDED",
    },
    [EStatus.WORKING]: {
      bgColor: "bg-gray-500",
      text: "WORKING",
    },
    [EStatus.NEW]: {
      bgColor: "bg-gray-500",
      text: "NEW",
    },
    [EStatus.FINISHED]: {
      bgColor: "bg-gray-500",
      text: "FINISHED",
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      className={`absolute top-2 left-2 ${config.bgColor} text-white text-xs font-medium px-2 py-1 rounded`}
    >
      {config.text}
    </span>
  );
};

interface ExamCardProps {
  exam: ExamDto;
  onClickExam?: (examId: string) => void;
}

// Sınav Kartı Komponenti
const ExamCard: React.FC<ExamCardProps> = ({ exam, onClickExam }) => {
  const {
    id,
    name,
    category,
    imageUrl,
    description,
    code,
    language,
    level,
    status,
    createdAt,
  } = exam;
  const categoryStyle = getCategoryStyle(category);
  const levelStyle = getLevelStyle(level || "");

  // Açıklama metnini kısaltma
  const shortDescription =
    description && description.length > 100
      ? `${description.substring(0, 100)}...`
      : description;

  // Sınav oluşturulma tarihini formatlama
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Sınav tıklama olayı
  const handleClick = () => {
    if (onClickExam) {
      onClickExam(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col min-h-[574px] w-full transform hover:scale-105">
      <div className="relative">
        {/* Exam Image */}
        <div
          style={{
            height: "200px",
            width: "100%",
            position: "relative",
            overflow: "hidden",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          {imageUrl ? (
            <Image
              src={"/assets/" + imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <div
              style={{
                height: "200px",
                background: "linear-gradient(135deg, #b7113d 0%, #0a2e5e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={48} className="text-white opacity-70" />
            </div>
          )}
        </div>

        {/* Category Badge */}
        <span
          className={`absolute top-3 right-3 ${categoryStyle.bgColor} ${categoryStyle.textColor} text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}
        >
          {categoryStyle.text}
        </span>

        {/* Status Badge */}
        {getStatusBadge(status)}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
          {name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3 leading-relaxed">
          {shortDescription}
        </p>

        <div className="space-y-3 mb-5">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            <Book size={16} className="mr-3 text-red-500" />
            <span className="font-medium">Code:</span>
            <span className="ml-2 font-semibold text-gray-800">{code}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            <Globe size={16} className="mr-3 text-green-500" />
            <span className="font-medium">Language:</span>
            <span className="ml-2 font-semibold text-gray-800">{language}</span>
          </div>

          <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center">
              <BarChart3 size={16} className="mr-3 text-purple-500" />
              <span className="font-medium">Level:</span>
            </div>
            <span
              className={`${levelStyle.bgColor} ${levelStyle.textColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {levelStyle.text}
            </span>
          </div>

          {formattedDate && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Calendar size={16} className="mr-3 text-orange-500" />
              <span className="font-medium">Created:</span>
              <span className="ml-2 text-gray-800">{formattedDate}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={`/learner/exam/${id}`}
            onClick={handleClick}
            className="block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-center font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] shadow-lg hover:shadow-xl"
          >
            Take Exam
          </Link>
        </div>
      </div>
    </div>
  );
};

interface ExamGridProps {
  exams: ExamDto[];
  onClickExam?: (examId: string) => void;
}

const ExamGrid: React.FC<ExamGridProps> = ({ exams, onClickExam }) => {
  return (
    <div className="container mx-auto mt-4 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onClickExam={onClickExam} />
        ))}
      </div>
    </div>
  );
};

export { ExamCard, ExamGrid };
