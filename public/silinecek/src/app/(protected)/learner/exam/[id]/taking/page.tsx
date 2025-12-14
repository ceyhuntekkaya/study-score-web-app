'use client';

import {useParams} from "next/navigation";
import {ExamTakingPage} from "@/app/(protected)/learner/exam/componenet/take-exam/ExamTakingPage";

export default function ExamApplication() {
    const params = useParams();
    const examId = params.id as string;


    return <>




        <ExamTakingPage examId={examId}/>


    </>;
}