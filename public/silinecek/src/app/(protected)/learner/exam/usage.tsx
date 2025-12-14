// pages/exam/[examId]/begin/page.tsx
'use client';

import { useParams } from 'next/navigation';
import {ExamStartPage} from "@/app/(protected)/learner/exam/componenet/pre-start/ExamStartPage";

export default function ExamBeginPage() {
    const params = useParams();
    const examId = params.examId as string;

    return <ExamStartPage examId={examId} />;
}

