'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import CourseForm from "@/components/form/course-form";
import {useCourses} from "@/hooks/course/use-course";

export default function CourseAdd() {


    const {
        createCourse
    } = useCourses();



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <CourseForm onSubmit={createCourse}/>

            </div>
        </div>
    )
}