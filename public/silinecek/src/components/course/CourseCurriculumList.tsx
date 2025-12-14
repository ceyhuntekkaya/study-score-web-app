import React, {useEffect} from 'react';
import {BookOpen, DiamondPlus, FileText, GraduationCap, Pencil, Presentation} from 'lucide-react';
import {CourseLessonDTO} from '@/types/course/course-lesson';
import {ELessonLevel} from "@/types/enumeration";
import {useParams} from "next/navigation";
import {useCourses} from "@/hooks/course/use-course";
import {CourseLessonDetailDTO, CourseLessonPartDetailDTO} from "@/types/course/course";

interface CourseCurriculumTabProps {
    onLessonPartClick: (lesson: CourseLessonPartDetailDTO) => void;
    courseLessons: CourseLessonDTO[];
    onLessonAddClick: (lesson: CourseLessonDetailDTO) => void;
    onLessonEditClick: (lesson: CourseLessonDetailDTO) => void;
    onLessonPartEditClick: (materiel: CourseLessonPartDetailDTO) => void;
    onLessonPartAddClick: (materiel: CourseLessonPartDetailDTO) => void;
    updateState: number;
}

// Union type for lesson data
type LessonData = CourseLessonDTO | CourseLessonDetailDTO;

const CourseCurriculumList: React.FC<CourseCurriculumTabProps> = ({
                                                                      courseLessons,
                                                                      onLessonEditClick,
                                                                      onLessonAddClick,
                                                                      onLessonPartClick,
                                                                      onLessonPartEditClick,
                                                                      onLessonPartAddClick,
                                                                      updateState
                                                                  }) => {
    const params = useParams();
    const id = params.id as string;
    const {
        courseDetailDTO,
        fetchCourseDetailById
    } = useCourses();

    useEffect(() => {
        fetchCourseDetailById(id);
    }, [id, fetchCourseDetailById, updateState]);


    // Ders seviyesi için yardımcı fonksiyonlar
    const getLevelBadgeClass = (level: ELessonLevel): string => {
        switch (level) {
            case ELessonLevel.UNIT:
                return 'bg-green-100 text-green-800';
            case ELessonLevel.TOPIC:
                return 'bg-blue-100 text-blue-800';
            case ELessonLevel.LESSON:
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelText = (level: ELessonLevel): string => {
        switch (level) {
            case ELessonLevel.UNIT:
                return 'UNIT';
            case ELessonLevel.TOPIC:
                return 'TOPIC';
            case ELessonLevel.LESSON:
                return 'LESSON';
            default:
                return 'PART';
        }
    };

    const getLevelIcon = (level: ELessonLevel) => {
        switch (level) {
            case ELessonLevel.UNIT:
                return GraduationCap;
            case ELessonLevel.TOPIC:
                return BookOpen;
            case ELessonLevel.LESSON:
                return FileText;
            default:
                return Presentation;
        }
    };


    // Lesson Row Component
    const LessonPartRow: React.FC<{
        lesson: CourseLessonPartDetailDTO;
        index: number;
        level: number;
        parentNumbers?: string;
    }> = ({lesson, index, level, parentNumbers = ''}) => {
        const LevelIcon = Presentation;
        const indentClass = level === 0 ? '' : level === 1 ? 'pl-6' : level === 2 ? 'pl-12' : 'pl-20';
        const bgClass = level === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-50';
        const numberPrefix = parentNumbers ? `${parentNumbers}.${index + 1}` : `${index + 1}`;

        const handleLessonClick = () => {
            onLessonPartClick(lesson);
        };


        const handleLessonPartMaterialAddClick = () => {
            onLessonPartAddClick(lesson);
        };
        const handleLessonPartMaterialEditClick = () => {
            onLessonPartEditClick(lesson);
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
                           PART
                        </span>
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                            <button
                                className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="Derse Git"
                                onClick={handleLessonPartMaterialAddClick}
                            >
                                <DiamondPlus size={16}/>
                            </button>
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

            </>
        );
    };


    const handleLessonAddUnitClick = () => {

        const newUnit: CourseLessonDetailDTO = {
            id: '',
            name: '',
            description: '',
            lessonLevel: ELessonLevel.UNIT,
            childLessons: [],
            lessonParts: [],
            courseId: '',
            orderNumber: 1,
            parentLessonId: '',
        }
        onLessonAddClick(newUnit);
    };

    // Lesson Row Component
    const LessonRow: React.FC<{
        lesson: LessonData;
        index: number;
        level: number;
        parentNumbers?: string;
    }> = ({lesson, index, level, parentNumbers = ''}) => {
        const LevelIcon = getLevelIcon(lesson.lessonLevel);
        const indentClass = level === 0 ? '' : level === 1 ? 'pl-6' : level === 2 ? 'pl-12' : 'pl-20';
        const bgClass = level === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-50';
        const numberPrefix = parentNumbers ? `${parentNumbers}.${index + 1}` : `${index + 1}`;

        // Type guard to check if lesson is CourseLessonDetailDTO
        const isDetailedLesson = (lesson: LessonData): lesson is CourseLessonDetailDTO => {
            return 'lessonParts' in lesson;
        };

        const handleLessonClick = () => {
            if (isDetailedLesson(lesson)) {
                onLessonEditClick(lesson);
            } else {
                // Convert CourseLessonDTO to CourseLessonDetailDTO format for modal
                const detailedLesson: CourseLessonDetailDTO = {
                    ...lesson,
                    lessonParts: [], // Default empty array
                    description: lesson.description || `Bu derste, ${lesson.name.toLowerCase()} konusu kapsamlı bir şekilde ele alınmaktadır.`,
                    childLessons: lesson.childLessons as unknown as CourseLessonDetailDTO[] // Double assertion for type compatibility
                };
                onLessonEditClick(detailedLesson);
            }
        };


        const handleLessonAddClick = () => {
            if (isDetailedLesson(lesson)) {
                onLessonAddClick(lesson);
            } else {
                // Convert CourseLessonDTO to CourseLessonDetailDTO format for modal
                const detailedLesson: CourseLessonDetailDTO = {
                    ...lesson,
                    lessonParts: [], // Default empty array
                    description: lesson.description || `Bu derste, ${lesson.name.toLowerCase()} konusu kapsamlı bir şekilde ele alınmaktadır.`,
                    childLessons: lesson.childLessons as unknown as CourseLessonDetailDTO[] // Double assertion for type compatibility
                };
                onLessonAddClick(detailedLesson);
            }
        };
        const handleLessonEditClick = () => {
            if (isDetailedLesson(lesson)) {
                onLessonEditClick(lesson);
            } else {
                // Convert CourseLessonDTO to CourseLessonDetailDTO format for modal
                const detailedLesson: CourseLessonDetailDTO = {
                    ...lesson,
                    lessonParts: [], // Default empty array
                    description: lesson.description || `Bu derste, ${lesson.name.toLowerCase()} konusu kapsamlı bir şekilde ele alınmaktadır.`,
                    childLessons: lesson.childLessons as unknown as CourseLessonDetailDTO[] // Double assertion for type compatibility
                };
                onLessonEditClick(detailedLesson);
            }
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
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeClass(lesson.lessonLevel)}`}>
                            {getLevelText(lesson.lessonLevel)}
                        </span>
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">

                            {getLevelText(lesson.lessonLevel) !== 'LESSON' &&
                                <button
                                    className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    title="Derse Git"
                                    onClick={handleLessonAddClick}
                                >
                                    <DiamondPlus size={16}/>
                                </button>
                            }

                            <button
                                className="inline-flex items-center p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="Tamamlandı İşaretle"
                                onClick={handleLessonEditClick}
                            >

                                <Pencil size={16}/>
                            </button>
                        </div>
                    </td>
                </tr>

                {/* Render child lessons */}
                {lesson.childLessons && lesson.childLessons.length > 0 && lesson.childLessons.map((childLesson, childIndex) => (
                    <React.Fragment key={`child-${childLesson.id}`}>
                        <LessonRow
                            lesson={childLesson}
                            index={childIndex}
                            level={level + 1}
                            parentNumbers={numberPrefix}

                        />
                    </React.Fragment>
                ))}


                {'lessonParts' in lesson && lesson.lessonParts && lesson.lessonParts.length > 0 && lesson.lessonParts.map((lessonPart, partIndex) => (


                    <React.Fragment key={`child-${lessonPart.id}`}>
                        <LessonPartRow
                            lesson={lessonPart}
                            index={partIndex}
                            level={level + 2}
                            parentNumbers={numberPrefix}
                        />
                    </React.Fragment>
                ))}

                {/* Spacer between main lessons */}
                {level === 0 && index < (courseDetailDTO?.lessons?.length || courseLessons.length) - 1 && (
                    <tr>
                        <td colSpan={5} className="h-2 bg-gray-100"></td>
                    </tr>
                )}
            </>
        );
    };

    return (
        <div className="bg-white">
            <div className=" ">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Curriculum</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ders Adı
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                Seviye
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                <button onClick={handleLessonAddUnitClick}><DiamondPlus size={16}/></button>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {(courseDetailDTO?.lessons || courseLessons).map((lesson, index) => (
                            <LessonRow
                                key={`main-${lesson.id}`}
                                lesson={lesson}
                                index={index}
                                level={0}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Info Alert */}

            </div>
        </div>
    );
};

export default CourseCurriculumList;