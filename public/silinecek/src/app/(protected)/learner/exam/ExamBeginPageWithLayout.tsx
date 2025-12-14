// ==========================================
// Kullanım örneği: Ana sayfa entegrasyonu
// ==========================================

// pages/exam/[examId]/begin/page.tsx with layout
'use client';

import { useParams } from 'next/navigation';
import {ExamLayout} from "@/app/(protected)/learner/exam/ExamLayout";
import {ExamStartPage} from "@/app/(protected)/learner/exam/componenet/pre-start/ExamStartPage";

export default function ExamBeginPageWithLayout() {
    const params = useParams();
    const examId = params.examId as string;

    return (
        <ExamLayout examId={examId} showProgress={true}>
            <ExamStartPage examId={examId} />
        </ExamLayout>
    );
}

