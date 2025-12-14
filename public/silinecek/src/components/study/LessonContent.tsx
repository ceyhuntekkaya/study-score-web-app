// components/course/LessonContent.tsx
import { useEffect, useState } from "react";
import { MaterialViewer } from "@/components/study/MaterialViewer";
import { CourseDetailDTO } from "@/types/course/course";
import { SelectionState } from "@/types/course/selectionState";
import { AIChat } from "@/components/study/AIChat";

interface LessonContentProps {
  course: CourseDetailDTO;
  selectionState: SelectionState;
}

export function LessonContent({ course, selectionState }: LessonContentProps) {
  const {
    selectedLessonId,
    selectedChildLessonId,
    selectedGrandChildLessonId,
    selectedLessonPartId,
    selectedMaterialId,
    setSelectedLessonPartId,
    setSelectedMaterialId,
  } = selectionState;

  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (selectedLessonPartId) {
      setShowAIChat(false);
    }
  }, [selectedLessonPartId]);

  const handleSelectedPart = (partId: string) => {
    setShowAIChat(false);
    setSelectedLessonPartId(partId);
  };

  // Seçili dersi bul
  const findSelectedLesson = () => {
    if (!course) return null;

    const mainLesson = course.lessons?.find((l) => l.id === selectedLessonId);
    if (!mainLesson) return null;

    // Alt ders seçilmişse
    if (selectedChildLessonId) {
      const childLesson = mainLesson.childLessons?.find(
        (cl) => cl.id === selectedChildLessonId
      );
      if (!childLesson) return mainLesson;

      console.log("Child lesson found:", childLesson.name);

      // Alt alt ders seçilmişse
      if (selectedGrandChildLessonId) {
        const grandChildLesson = childLesson.childLessons?.find(
          (gcl) => gcl.id === selectedGrandChildLessonId
        );
        return grandChildLesson || childLesson;
      }
      return childLesson;
    }

    return mainLesson;
  };

  // Seçili dersin ders parçalarını bul
  const getLessonParts = () => {
    const selectedLesson = findSelectedLesson();
    return selectedLesson?.lessonParts || [];
  };

  // Seçili ders parçasını bul
  const getSelectedPart = () => {
    const parts = getLessonParts();
    return parts.find((p) => p.id === selectedLessonPartId) || null;
  };

  // Seçilen ders parçasına göre materyal seçimi
  useEffect(() => {
    if (!course || !selectedLessonPartId) return;

    // Seçilen ders parçasını bul
    let selectedPart = null;

    // Ana dersler içinde ara
    for (const lesson of course.lessons || []) {
      // Ana dersin ders parçalarında ara
      if (lesson.lessonParts) {
        const part = lesson.lessonParts.find(
          (p) => p.id === selectedLessonPartId
        );
        if (part) {
          selectedPart = part;
          break;
        }
      }

      // Alt dersler içinde ara
      for (const childLesson of lesson.childLessons || []) {
        if (childLesson.lessonParts) {
          const part = childLesson.lessonParts.find(
            (p) => p.id === selectedLessonPartId
          );
          if (part) {
            selectedPart = part;
            break;
          }
        }

        // Alt dersin alt dersleri içinde ara
        for (const grandChildLesson of childLesson.childLessons || []) {
          if (grandChildLesson.lessonParts) {
            const part = grandChildLesson.lessonParts.find(
              (p) => p.id === selectedLessonPartId
            );
            if (part) {
              selectedPart = part;
              break;
            }
          }
        }
      }
    }

    // Eğer materyal varsa ilkini seç (sadece henüz materyal seçilmemişse)
    if (
      selectedPart &&
      selectedPart.materials &&
      selectedPart.materials.length > 0 &&
      !selectedMaterialId
    ) {
      const sortedMaterials = [...selectedPart.materials].sort(
        (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
      );
      setSelectedMaterialId(sortedMaterials[0].id);
    } else if (
      !selectedPart ||
      !selectedPart.materials ||
      selectedPart.materials.length === 0
    ) {
      setSelectedMaterialId(null);
    }
  }, [course, selectedLessonPartId, selectedMaterialId, setSelectedMaterialId]);

  const selectedLesson = findSelectedLesson();
  const lessonParts = getLessonParts();
  const selectedPart = getSelectedPart();

  if (!selectedLesson) {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-circle me-2"></i>
            Please select a lesson from the left menu.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="h5 mb-0">{selectedLesson.name}</h3>
            <small className="text-muted">{selectedLesson.description}</small>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Ders parçaları sekmeleri */}
        {lessonParts.length > 0 ? (
          <>
            <ul className="nav nav-tabs mb-4 d-flex">
              {lessonParts.map((part) => (
                <li key={part.id} className="nav-item">
                  <button
                    className={`nav-link ${
                      selectedLessonPartId === part.id ? "active" : ""
                    }`}
                    onClick={() => {
                      handleSelectedPart(part.id);
                    }}
                  >
                    {part.orderNumber || ""}. {part.name}
                  </button>
                </li>
              ))}

              <li className="nav-item ms-auto">
                <button
                  className={`static bg-red-600 hover:bg-blue-700 text-white p-3`}
                  onClick={() => {
                    setShowAIChat(true);
                  }}
                >
                  AI CHAT
                </button>
              </li>
            </ul>

            <div className={`${showAIChat ? "block" : "hidden"}`}>
              <AIChat selectionState={selectionState} course={course} />
            </div>
            <div className={`${!showAIChat ? "block" : "hidden"}`}>
              {/* Seçili ders parçasının açıklaması */}
              {selectedPart && selectedPart.name === "--" && (
                <div className="mb-4">
                  <h4 className="h5">{selectedPart.name}</h4>
                  {selectedPart.description && (
                    <p className="text-muted">{selectedPart.description}</p>
                  )}
                </div>
              )}

              {/* Materyal seçimi ve içerik gösterimi */}
              {selectedPart &&
              selectedPart.materials &&
              selectedPart.materials.length > 0 ? (
                <div className="row">
                  <div className="col-md-12">
                    <div>
                      {selectedPart &&
                        selectedPart.materials &&
                        selectedPart.materials.length > 0 &&
                        selectedPart.materials
                          .sort(
                            (a, b) =>
                              (a.orderNumber || 0) - (b.orderNumber || 0)
                          )
                          .map((material) => (
                            <MaterialViewer
                              key={material.id}
                              material={material}
                            />
                          ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No materials have been added for this lesson part yet.
                </div>
              )}
            </div>

            {
              // ceyhun
            }
          </>
        ) : (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            No lesson parts have been added for this lesson yet.
          </div>
        )}
      </div>
    </div>
  );
}
