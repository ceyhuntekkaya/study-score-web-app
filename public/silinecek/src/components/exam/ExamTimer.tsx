// components/exam/ExamTimer.tsx
import React from 'react';
import {useExamTimer} from "@/hooks/exam/use-exam-timer";

export const ExamTimer: React.FC = () => {
    const { getRemainingTimeFormatted, totalDuration } = useExamTimer();

    return (
        <div className="fixed top-4 right-4 bg-white shadow-md rounded-lg px-4 py-2 text-xl font-bold">
            <div className={`${totalDuration < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                {getRemainingTimeFormatted()}
            </div>
        </div>
    );
};