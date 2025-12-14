// types/course/selectionState.ts
export interface SelectionState {
    selectedLessonId: string | null;
    selectedChildLessonId: string | null;
    selectedGrandChildLessonId: string | null;
    selectedLessonPartId: string | null;
    selectedMaterialId: string | null;
    setSelectedLessonId: (id: string | null) => void;
    setSelectedChildLessonId: (id: string | null) => void;
    setSelectedGrandChildLessonId: (id: string | null) => void;
    setSelectedLessonPartId: (id: string | null) => void;
    setSelectedMaterialId: (id: string | null) => void;
}