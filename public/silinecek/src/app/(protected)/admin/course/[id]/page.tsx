'use client';

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import PageHeader from "@/components/layout/page-header";
import {useCourseLessons} from "@/hooks/course/use-course-lesson";
import CourseCurriculumList from "@/components/course/CourseCurriculumList";
import {CourseLessonDetailDTO, CourseLessonPartDetailDTO} from "@/types/course/course";
import CourseCurriculumLessonPartList from "@/components/course/CourseCurriculumLessonPartList";
import CourseLessonForm from "@/app/(protected)/admin/course/[id]/course-lesson-form";
import CourseLessonPartForm from "@/app/(protected)/admin/course/[id]/course-lesson-part-form";

export default function CustomerDetail() {
    const params = useParams();
    const courseId = params.id as string;


    const [selectedLessonPartId, setSelectedLessonPartId] = useState('');
    const [isNewLesson, setIsNewLesson] = useState(false);
    const [isNewMaterial, setIsNewMaterial] = useState(false);
    const [isListMaterial, setIsListMaterial] = useState(false);
    const [isNewLessonPart, setIsNewLessonPart] = useState(false);
    const [selectedCourseLesson, setSelectedCourseLesson] = useState<CourseLessonDetailDTO | null>(null);
    const [selectedCourseLessonPart, setSelectedCourseLessonPart] = useState<CourseLessonPartDetailDTO | null>(null);

    const [updateState, setUpdateState] = useState(1);

    const {
        courseLessonDTOs,
        fetchCourseLessonsByCourseId
    } = useCourseLessons();


    useEffect(() => {
        if (courseId) {
            fetchCourseLessonsByCourseId(courseId);
        }
    }, [courseId, fetchCourseLessonsByCourseId]);


    const updateAllData = () => {
        fetchCourseLessonsByCourseId(courseId).then(
            () =>
                setUpdateState(prev => prev + 1)
        );
    };



    const handleSelectLessonAdd = (selected: CourseLessonDetailDTO) => {

        setIsNewLesson(true);
        setSelectedCourseLesson(selected);
        setSelectedLessonPartId('')
        setIsListMaterial(false);
        setIsNewLessonPart(false)
        setIsNewMaterial(false)
        setSelectedCourseLessonPart(null);

    };
    const handleSelectLessonEdit = (selected: CourseLessonDetailDTO) => {
        setIsNewLesson(false);
        setSelectedCourseLesson(selected);
        setSelectedLessonPartId('')
        setIsListMaterial(false);
        setIsNewLessonPart(false)
        setIsNewMaterial(false)
        setSelectedCourseLessonPart(null);
    };


    const handleSelectLessonPart = (selected: CourseLessonPartDetailDTO) => {
        setIsNewLesson(false)
        setIsNewMaterial(false)
        setSelectedLessonPartId(selected.id)
        setSelectedCourseLesson(null);
        setIsListMaterial(true);
        setIsNewLessonPart(false)
        setSelectedCourseLessonPart(null);
    };


    const handleSelectLessonPartAdd = (selected: CourseLessonPartDetailDTO) => {
        setIsNewLesson(false)
        setIsNewMaterial(false)
        setSelectedLessonPartId(selected.id)
        setSelectedCourseLesson(null);
        setIsListMaterial(false);
        setSelectedCourseLessonPart(selected);
        setIsNewLessonPart(true)
    };
    const handleSelectLessonPartEdit = (selected: CourseLessonPartDetailDTO) => {
        setIsNewLesson(false)
        setIsNewMaterial(false)
        setSelectedCourseLesson(null);
        setIsListMaterial(false);
        setIsNewLessonPart(false)
        setSelectedLessonPartId(selected.id)
        setSelectedCourseLessonPart(selected);
    };


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="w-full min-h-screen bg-gray-50">
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Sol Bölüm */}
                    <div className="w-full lg:w-1/2 bg-white p-4 pr-2 border-r border-gray-200">
                        <div className="h-full">
                            {
                                courseId &&
                                <CourseCurriculumList
                                    updateState={updateState}
                                    courseLessons={courseLessonDTOs}
                                    onLessonAddClick={handleSelectLessonAdd}
                                    onLessonEditClick={handleSelectLessonEdit}
                                    onLessonPartClick={handleSelectLessonPart}
                                    onLessonPartEditClick={handleSelectLessonPartEdit}
                                    onLessonPartAddClick={handleSelectLessonPartAdd}
                                />
                            }

                        </div>
                    </div>

                    {/* Sağ Bölüm */}
                    <div className="w-full lg:w-1/2 bg-white p-4 pl-2 border-r border-gray-200">
                        <div className="h-full">


                            {
                                courseLessonDTOs && courseId && selectedLessonPartId && !isNewMaterial && isListMaterial &&
                                <CourseCurriculumLessonPartList
                                    updateState={updateState}
                                    courseLessonId={selectedLessonPartId}
                                />
                            }
                            {
                                selectedCourseLesson && !isNewLesson &&
                                <CourseLessonForm selectedCourseLesson={selectedCourseLesson} type={"update"}
                                                  courseId={courseId} updateAllData={updateAllData}/>
                            }

                            {
                                selectedCourseLesson && isNewLesson &&
                                <CourseLessonForm selectedCourseLesson={selectedCourseLesson} type={"create"}
                                                  parentLessonId={selectedCourseLesson.id} courseId={courseId}
                                                  updateAllData={updateAllData}/>
                            }

                            {
                                selectedCourseLessonPart && !isNewLessonPart && selectedCourseLessonPart.courseLessonId &&
                                <CourseLessonPartForm selectedCourseLessonPart={selectedCourseLessonPart}
                                                      type={"update"} courseLessonId={selectedCourseLessonPart.courseLessonId}
                                                      updateAllData={updateAllData}/>
                            }

                            {
                                selectedCourseLessonPart && isNewLessonPart && selectedCourseLessonPart.courseLessonId &&
                                <CourseLessonPartForm selectedCourseLessonPart={selectedCourseLessonPart}
                                                      type={"create"}
                                                      courseLessonId={selectedCourseLessonPart.courseLessonId}
                                                      updateAllData={updateAllData}/>
                            }




                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

