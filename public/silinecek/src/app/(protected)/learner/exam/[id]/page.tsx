'use client';

import {useParams} from "next/navigation";
import {ExamStartPage} from "@/app/(protected)/learner/exam/componenet/pre-start/ExamStartPage";

export default function ExamApplication() {
    const params = useParams();
    const examId = params.id as string;


    return <>




            <ExamStartPage examId={examId}/>


    </>;
}