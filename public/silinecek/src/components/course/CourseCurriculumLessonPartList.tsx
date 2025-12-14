import React, {useEffect, useState} from 'react';
import {FileText, DiamondPlus, Pencil} from 'lucide-react';
import {useCourseLessonPartMaterials} from "@/hooks/course/use-course-lesson-part-material";
import {MaterialViewer} from "@/components/study/MaterialViewer";
import {CourseLessonPartMaterialToDto} from "@/types/course/course-lesson-part-material";
import {CourseLessonPartMaterialDetailDTO} from '@/types/course/course';
import CourseLessonPartMaterialForm from "@/app/(protected)/admin/course/[id]/course-lesson-part-material-form";
import {EMediaType} from "@/types/enumeration";

interface CourseCurriculumTabProps {
    courseLessonId: string;
    updateState: number;
}

type LessonData = CourseLessonPartMaterialDetailDTO;

const CourseCurriculumLessonPartList: React.FC<CourseCurriculumTabProps> = ({
                                                                                courseLessonId,
                                                                            }) => {


    const [isNewMaterial, setIsNewMaterial] = useState(false);
    const [isEditMaterial, setIsEditMaterial] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<CourseLessonPartMaterialDetailDTO | null>(null);
    const [updateState, setUpdateState] = useState(1);

    const updateAllData = () => {
        console.log('update all data');
        fetchCourseLessonPartMaterialByCourseLessonId(courseLessonId).then(
            () =>
                setUpdateState(prev => prev + 1)
        );
    };



    const {
        fetchCourseLessonPartMaterialByCourseLessonId,
        courseLessonPartMaterials
    } = useCourseLessonPartMaterials();


    useEffect(() => {
        fetchCourseLessonPartMaterialByCourseLessonId(courseLessonId);
        setSelectedMaterial(null)
    }, [courseLessonId, fetchCourseLessonPartMaterialByCourseLessonId, updateState]);


    const handleLessonPartMaterialAddClickEvent = () => {
        const newMaterial: CourseLessonPartMaterialDetailDTO = {
            id: '',
            name: '',
            description: '',
            content: '',
            mediaType: EMediaType.TEXT,
            orderNumber: 1,
            duration: 1,
            uploadedFileId: '',
            uploadedFileName: '',
            courseLessonPartId: courseLessonId,
            userProgress: null
        }

        setSelectedMaterial(newMaterial);
        setIsNewMaterial(true);
        setIsEditMaterial(false);
    };

    // Lesson Row Component
    const LessonRow: React.FC<{
        lesson: LessonData;
        index: number;
        level: number;
        parentNumbers?: string;
    }> = ({lesson, index, level, parentNumbers = ''}) => {
        const LevelIcon = FileText;
        const indentClass = level === 0 ? '' : level === 1 ? 'pl-6' : level === 2 ? 'pl-12' : 'pl-20';
        const bgClass = level === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-50';
        const numberPrefix = parentNumbers ? `${parentNumbers}.${index + 1}` : `${index + 1}`;


        const handleLessonClick = () => {
            setSelectedMaterial(lesson);
            setIsNewMaterial(false);
            setIsEditMaterial(false);
        };


        const handleLessonPartMaterialEditClick = () => {
            setSelectedMaterial(lesson);
            setIsNewMaterial(false);
            setIsEditMaterial(true);
        };

        return (
            <>
                <tr className={`${bgClass} transition-colors duration-150`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {level === 0 ? index + 1 : ''}
                    </td>
                    <td className="px-4 py-3">
                        <div
                            className={`flex items-center cursor-pointer group ${indentClass}`}
                            onClick={handleLessonClick}
                        >
                            <LevelIcon
                                size={18}
                                className={`mr-3 ${level === 0 ? 'text-blue-600' : level === 1 ? 'text-gray-500' : level === 2 ? 'text-yellow-500' : 'text-red-400'}`}
                            />
                            <span
                                className={`${level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'} group-hover:text-blue-600 transition-colors`}>
                                {level > 0 && `${numberPrefix} `}{lesson.name}
                            </span>
                        </div>
                    </td>
                    <td className="px-4 py-3">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                          {lesson.mediaType}
                        </span>
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">

                            <button
                                className="inline-flex items-center p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="Tamamlandı İşaretle"
                                onClick={handleLessonPartMaterialEditClick}
                            >
                                <Pencil size={16}/>
                            </button>
                        </div>
                    </td>
                </tr>


                <tr>
                    <td colSpan={5} className="h-2 bg-gray-100"></td>
                </tr>
            </>
        );
    };

    return (
        <div className="bg-white">
            <div className="pt-0">
                <h2 className="text-2xl font-bold text-gray-900">Lesson Part Materials </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Material
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                Type
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">


                                <button
                                    className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    title="Derse Git"
                                    onClick={handleLessonPartMaterialAddClickEvent}
                                >
                                    <DiamondPlus size={24}/>
                                </button>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {courseLessonPartMaterials && courseLessonPartMaterials.map((material, index) => (
                            <LessonRow
                                key={`main-${material.id}`}
                                lesson={CourseLessonPartMaterialToDto(material)}
                                index={index}
                                level={0}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Info Alert */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">

                        <div className="w-100">
                            {selectedMaterial && !isNewMaterial && !isEditMaterial && (
                                <div>
                                    <h5>{selectedMaterial.name}</h5>
                                    {selectedMaterial.description && (
                                        <p className="text-muted">{selectedMaterial.description}</p>
                                    )}
                                    <MaterialViewer material={selectedMaterial}/>
                                </div>
                            )}


                            {
                                selectedMaterial && isNewMaterial && !isEditMaterial &&
                                <CourseLessonPartMaterialForm selectedMaterial={selectedMaterial} type={"create"}
                                                              courseLessonPartId={courseLessonId}
                                                              updateAllData={updateAllData}/>
                            }

                            {
                                selectedMaterial && !isNewMaterial && isEditMaterial &&
                                <CourseLessonPartMaterialForm selectedMaterial={selectedMaterial} type={"update"}
                                                              courseLessonPartId={courseLessonId}
                                                              updateAllData={updateAllData}/>
                            }
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCurriculumLessonPartList;