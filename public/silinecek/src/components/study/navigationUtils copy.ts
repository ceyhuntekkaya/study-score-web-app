// components/course/navigationUtils.ts
import { SelectionState } from "@/types/course/selectionState";
import {CourseDetailDTO} from "@/types/course/course";

export interface NavigationItem {
    type: 'lesson' | 'childLesson' | 'grandChildLesson' | 'lessonPart' | 'material';
    lessonId?: string;
    childLessonId?: string;
    grandChildLessonId?: string;
    lessonPartId?: string;
    materialId?: string;
    title: string;
    orderNumber?: number;
}

export function buildNavigationItems(courseDetailDTO: CourseDetailDTO): NavigationItem[] {
    if (!courseDetailDTO || !courseDetailDTO.lessons) return [];

    const items: NavigationItem[] = [];

    // Lessons'ları sırala
    const sortedLessons = [...courseDetailDTO.lessons].sort((a, b) =>
        (a.orderNumber || 0) - (b.orderNumber || 0)
    );

    sortedLessons.forEach(lesson => {
        // Ana ders
        items.push({
            type: 'lesson',
            lessonId: lesson.id,
            title: lesson.name,
            orderNumber: lesson.orderNumber || 0
        });

        // Alt dersler
        if (lesson.childLessons && lesson.childLessons.length > 0) {
            const sortedChildLessons = [...lesson.childLessons].sort((a, b) =>
                (a.orderNumber || 0) - (b.orderNumber || 0)
            );

            sortedChildLessons.forEach(childLesson => {
                items.push({
                    type: 'childLesson',
                    lessonId: lesson.id,
                    childLessonId: childLesson.id,
                    title: childLesson.name,
                    orderNumber: childLesson.orderNumber || 0
                });

                // Alt alt dersler
                if (childLesson.childLessons && childLesson.childLessons.length > 0) {
                    const sortedGrandChildLessons = [...childLesson.childLessons].sort((a, b) =>
                        (a.orderNumber || 0) - (b.orderNumber || 0)
                    );

                    sortedGrandChildLessons.forEach(grandChildLesson => {
                        items.push({
                            type: 'grandChildLesson',
                            lessonId: lesson.id,
                            childLessonId: childLesson.id,
                            grandChildLessonId: grandChildLesson.id,
                            title: grandChildLesson.name,
                            orderNumber: grandChildLesson.orderNumber || 0
                        });

                        // Alt alt dersin ders parçaları
                        if (grandChildLesson.lessonParts && grandChildLesson.lessonParts.length > 0) {
                            const sortedParts = [...grandChildLesson.lessonParts].sort((a, b) =>
                                (a.orderNumber || 0) - (b.orderNumber || 0)
                            );

                            sortedParts.forEach(part => {
                                items.push({
                                    type: 'lessonPart',
                                    lessonId: lesson.id,
                                    childLessonId: childLesson.id,
                                    grandChildLessonId: grandChildLesson.id,
                                    lessonPartId: part.id,
                                    title: part.name,
                                    orderNumber: part.orderNumber || 0
                                });

                                // Alt alt dersin materyalleri
                                if (part.materials && part.materials.length > 0) {
                                    const sortedMaterials = [...part.materials].sort((a, b) =>
                                        (a.orderNumber || 0) - (b.orderNumber || 0)
                                    );

                                    sortedMaterials.forEach(material => {
                                        items.push({
                                            type: 'material',
                                            lessonId: lesson.id,
                                            childLessonId: childLesson.id,
                                            grandChildLessonId: grandChildLesson.id,
                                            lessonPartId: part.id,
                                            materialId: material.id,
                                            title: material.name,
                                            orderNumber: material.orderNumber || 0
                                        });
                                    });
                                }
                            });
                        }
                    });
                }

                // Alt dersin ders parçaları (eğer alt alt ders yoksa)
                if ((!childLesson.childLessons || childLesson.childLessons.length === 0) &&
                    childLesson.lessonParts && childLesson.lessonParts.length > 0) {
                    const sortedParts = [...childLesson.lessonParts].sort((a, b) =>
                        (a.orderNumber || 0) - (b.orderNumber || 0)
                    );

                    sortedParts.forEach(part => {
                        items.push({
                            type: 'lessonPart',
                            lessonId: lesson.id,
                            childLessonId: childLesson.id,
                            lessonPartId: part.id,
                            title: part.name,
                            orderNumber: part.orderNumber || 0
                        });

                        // Alt dersin materyalleri
                        if (part.materials && part.materials.length > 0) {
                            const sortedMaterials = [...part.materials].sort((a, b) =>
                                (a.orderNumber || 0) - (b.orderNumber || 0)
                            );

                            sortedMaterials.forEach(material => {
                                items.push({
                                    type: 'material',
                                    lessonId: lesson.id,
                                    childLessonId: childLesson.id,
                                    lessonPartId: part.id,
                                    materialId: material.id,
                                    title: material.name,
                                    orderNumber: material.orderNumber || 0
                                });
                            });
                        }
                    });
                }
            });
        }

        // Ana dersin ders parçaları (eğer alt ders yoksa)
        if ((!lesson.childLessons || lesson.childLessons.length === 0) &&
            lesson.lessonParts && lesson.lessonParts.length > 0) {
            const sortedParts = [...lesson.lessonParts].sort((a, b) =>
                (a.orderNumber || 0) - (b.orderNumber || 0)
            );

            sortedParts.forEach(part => {
                items.push({
                    type: 'lessonPart',
                    lessonId: lesson.id,
                    lessonPartId: part.id,
                    title: part.name,
                    orderNumber: part.orderNumber || 0
                });

                // Ana dersin materyalleri
                if (part.materials && part.materials.length > 0) {
                    const sortedMaterials = [...part.materials].sort((a, b) =>
                        (a.orderNumber || 0) - (b.orderNumber || 0)
                    );

                    sortedMaterials.forEach(material => {
                        items.push({
                            type: 'material',
                            lessonId: lesson.id,
                            lessonPartId: part.id,
                            materialId: material.id,
                            title: material.name,
                            orderNumber: material.orderNumber || 0
                        });
                    });
                }
            });
        }
    });

    return items;
}

export function getCurrentPosition(
    selectionState: SelectionState,
    navigationItems: NavigationItem[]
): number {
    const currentItem = {
        lessonId: selectionState.selectedLessonId,
        childLessonId: selectionState.selectedChildLessonId,
        grandChildLessonId: selectionState.selectedGrandChildLessonId,
        lessonPartId: selectionState.selectedLessonPartId,
        materialId: selectionState.selectedMaterialId
    };

    return navigationItems.findIndex(item => {
        // Material seçilmişse, material'ı karşılaştır
        if (currentItem.materialId && item.materialId) {
            return item.materialId === currentItem.materialId;
        }

        // Lesson part seçilmişse ve material seçilmemişse, lesson part'ı karşılaştır
        if (currentItem.lessonPartId && item.lessonPartId && !currentItem.materialId) {
            return item.lessonPartId === currentItem.lessonPartId &&
                item.lessonId === currentItem.lessonId &&
                item.childLessonId === currentItem.childLessonId &&
                item.grandChildLessonId === currentItem.grandChildLessonId;
        }

        // Grand child lesson seçilmişse ve lesson part seçilmemişse
        if (currentItem.grandChildLessonId && item.grandChildLessonId && !currentItem.lessonPartId) {
            return item.grandChildLessonId === currentItem.grandChildLessonId;
        }

        // Child lesson seçilmişse ve grand child lesson seçilmemişse
        if (currentItem.childLessonId && item.childLessonId && !currentItem.grandChildLessonId && !currentItem.lessonPartId) {
            return item.childLessonId === currentItem.childLessonId;
        }

        // Sadece lesson seçilmişse
        if (currentItem.lessonId && item.lessonId && !currentItem.childLessonId && !currentItem.lessonPartId) {
            return item.lessonId === currentItem.lessonId;
        }

        return false;
    });
}

// NavigationItem'a göre state'i güncelleyen helper fonksiyon
export function navigateToItem(item: NavigationItem, selectionState: SelectionState): void {
    selectionState.setSelectedLessonId(item.lessonId || null);
    selectionState.setSelectedChildLessonId(item.childLessonId || null);
    selectionState.setSelectedGrandChildLessonId(item.grandChildLessonId || null);
    selectionState.setSelectedLessonPartId(item.lessonPartId || null);
    selectionState.setSelectedMaterialId(item.materialId || null);
}
