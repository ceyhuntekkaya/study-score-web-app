import { NavigationItem } from "./navigationUtils";
import { SelectionState } from "@/types/course/selectionState";
import { LessonContent } from "./LessonContent";
import { CourseNotes } from "./CourseNotes";
import { CourseDetailDTO } from "@/types/course/course";

interface CourseContentProps {
  course: CourseDetailDTO;
  selectionState: SelectionState;
  navigationItems: NavigationItem[];
}

export function CourseContent({ course, selectionState }: CourseContentProps) {
  return (
    <>
      <LessonContent course={course} selectionState={selectionState} />

      <hr />

      {
        //  <AIChat selectionState={selectionState} course={course}/>
      }

      <CourseNotes
        courseId={course.id}
        lessonId={selectionState.selectedLessonId}
        lessonPartId={selectionState.selectedLessonPartId}
        materialId={selectionState.selectedMaterialId}
      />

      {
        //  <CourseDescription course={course}/>
      }
    </>
  );
}
