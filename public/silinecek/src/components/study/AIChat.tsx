// components/course/AIChat.tsx
import AIChatComponent from "@/components/ai-chat";
import { CourseDetailDTO } from "@/types/course/course";
import { SelectionState } from "@/types/course/selectionState";

interface AIChatProps {
  course: CourseDetailDTO;
  selectionState: SelectionState;
}

export function AIChat({ course, selectionState }: AIChatProps) {
  const { selectedLessonPartId, selectedMaterialId } = selectionState;

  const getSelectedLessonPart = () => {
    if (!course || !selectedLessonPartId || !selectedMaterialId) return null;

    // Ana dersler içinde ara
    for (const lesson of course.lessons || []) {
      // Ana dersin ders parçalarında ara
      if (lesson.lessonParts) {
        const part = lesson.lessonParts.find(
          (p) => p.id === selectedLessonPartId
        );
        if (part && part.materials) {
          return part;
        }
      }

      // Alt dersler içinde ara
      for (const childLesson of lesson.childLessons || []) {
        if (childLesson.lessonParts) {
          const part = childLesson.lessonParts.find(
            (p) => p.id === selectedLessonPartId
          );
          if (part && part.materials) {
            return part;
          }
        }

        // Alt dersin alt dersleri içinde ara
        for (const grandChildLesson of childLesson.childLessons || []) {
          if (grandChildLesson.lessonParts) {
            const part = grandChildLesson.lessonParts.find(
              (p) => p.id === selectedLessonPartId
            );
            if (part && part.materials) {
              return part;
            }
          }
        }
      }
    }

    return null;
  };

  const selectedPart = getSelectedLessonPart();

  if (!selectedPart) {
    return (
      <div className="card mb-4">
        <div className="card-header bg-light">
          <i className="bi bi-robot me-2"></i>
          AI Assistant
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Select a material to start chatting with AI assistant about the
            content.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <i className="bi bi-robot me-2"></i>
        AI Assistant - {selectedPart.name}
      </div>
      <div className="card-body p-0" style={{ height: "50vh" }}>
        <AIChatComponent activeText={selectedPart.description || ""} />
      </div>
    </div>
  );
}
