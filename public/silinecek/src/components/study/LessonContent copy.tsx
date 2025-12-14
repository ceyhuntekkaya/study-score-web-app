// components/course/LessonContent.tsx
import {useEffect} from "react";
import {MaterialViewer} from "@/components/study/MaterialViewer";
import {CourseDetailDTO} from "@/types/course/course";
import {SelectionState} from "@/types/course/selectionState";


interface LessonContentProps {
    course: CourseDetailDTO;
    selectionState: SelectionState;
}

export function LessonContent({course, selectionState}: LessonContentProps) {
    const {
        selectedLessonId,
        selectedChildLessonId,
        selectedGrandChildLessonId,
        selectedLessonPartId,
        selectedMaterialId,
        setSelectedLessonPartId,
        setSelectedMaterialId
    } = selectionState;

    // Seçili dersi bul
    const findSelectedLesson = () => {
        if (!course) return null;

        const mainLesson = course.lessons?.find(l => l.id === selectedLessonId);
        if (!mainLesson) return null;

        // Alt ders seçilmişse
        if (selectedChildLessonId) {
            const childLesson = mainLesson.childLessons?.find(cl => cl.id === selectedChildLessonId);
            if (!childLesson) return mainLesson;

            // Alt alt ders seçilmişse
            if (selectedGrandChildLessonId) {
                const grandChildLesson = childLesson.childLessons?.find(gcl => gcl.id === selectedGrandChildLessonId);
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
        return parts.find(p => p.id === selectedLessonPartId) || null;
    };

    // Seçili materyali bul
    const getSelectedMaterial = () => {
        const part = getSelectedPart();
        if (!part || !part.materials) return null;
        return part.materials.find(m => m.id === selectedMaterialId) || null;
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
                const part = lesson.lessonParts.find(p => p.id === selectedLessonPartId);
                if (part) {
                    selectedPart = part;
                    break;
                }
            }

            // Alt dersler içinde ara
            for (const childLesson of lesson.childLessons || []) {
                if (childLesson.lessonParts) {
                    const part = childLesson.lessonParts.find(p => p.id === selectedLessonPartId);
                    if (part) {
                        selectedPart = part;
                        break;
                    }
                }

                // Alt dersin alt dersleri içinde ara
                for (const grandChildLesson of childLesson.childLessons || []) {
                    if (grandChildLesson.lessonParts) {
                        const part = grandChildLesson.lessonParts.find(p => p.id === selectedLessonPartId);
                        if (part) {
                            selectedPart = part;
                            break;
                        }
                    }
                }
            }
        }

        // Eğer materyal varsa ilkini seç (sadece henüz materyal seçilmemişse)
        if (selectedPart && selectedPart.materials && selectedPart.materials.length > 0 && !selectedMaterialId) {
            const sortedMaterials = [...selectedPart.materials].sort((a, b) =>
                (a.orderNumber || 0) - (b.orderNumber || 0)
            );
            setSelectedMaterialId(sortedMaterials[0].id);
        } else if (!selectedPart || !selectedPart.materials || selectedPart.materials.length === 0) {
            setSelectedMaterialId(null);
        }
    }, [course, selectedLessonPartId, selectedMaterialId, setSelectedMaterialId]);

    const selectedLesson = findSelectedLesson();
    const lessonParts = getLessonParts();
    const selectedPart = getSelectedPart();
    const selectedMaterial = getSelectedMaterial();

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
                        <h3 className="h5 mb-0">
                            {selectedLesson.name}
                        </h3>
                        <small className="text-muted">{selectedLesson.description}</small>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {/* Ders parçaları sekmeleri */}
                {lessonParts.length > 0 ? (
                    <>
                        <ul className="nav nav-tabs mb-4">
                            {lessonParts.map((part) => (
                                <li key={part.id} className="nav-item">
                                    <button
                                        className={`nav-link ${selectedLessonPartId === part.id ? 'active' : ''}`}
                                        onClick={() => setSelectedLessonPartId(part.id)}
                                    >
                                        {part.orderNumber || ''}. {part.name}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Seçili ders parçasının açıklaması */}
                        {selectedPart && (
                            <div className="mb-4">
                                <h4 className="h5">{selectedPart.name}</h4>
                                {selectedPart.description && (
                                    <p className="text-muted">{selectedPart.description}</p>
                                )}
                            </div>
                        )}

                        {/* Materyal seçimi ve içerik gösterimi */}
                        {selectedPart && selectedPart.materials && selectedPart.materials.length > 0 ? (
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="list-group mb-4">
                                        {selectedPart.materials
                                            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
                                            .map((material) => (
                                                <button
                                                    key={material.id}
                                                    className={`list-group-item list-group-item-action ${selectedMaterialId === material.id ? 'active' : ''}`}
                                                    onClick={() => setSelectedMaterialId(material.id)}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        {material.mediaType === "VIDEO" &&
                                                            <i className="bi bi-play-circle me-2"></i>}
                                                        {material.mediaType === "AUDIO" &&
                                                            <i className="bi bi-music-note-beamed me-2"></i>}
                                                        {material.mediaType === "DOCUMENT" &&
                                                            <i className="bi bi-file-earmark-text me-2"></i>}
                                                        {material.mediaType === "PDF" &&
                                                            <i className="bi bi-file-earmark-pdf me-2"></i>}
                                                        {material.mediaType === "IMAGE" &&
                                                            <i className="bi bi-image me-2"></i>}
                                                        {material.mediaType === "LINK" &&
                                                            <i className="bi bi-link-45deg me-2"></i>}
                                                        {material.mediaType === "TEXT" &&
                                                            <i className="bi bi-file-text me-2"></i>}
                                                        {material.mediaType === "OTHER" &&
                                                            <i className="bi bi-file-earmark me-2"></i>}
                                                        <small>{material.name}</small>
                                                    </div>
                                                    {material.duration && (
                                                        <small className="text-muted d-block mt-1">
                                                            {material.duration} dk
                                                        </small>
                                                    )}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    {selectedMaterial && (
                                        <div>
                                            <h5>{selectedMaterial.name}</h5>
                                            {selectedMaterial.description && (
                                                <p className="text-muted">{selectedMaterial.description}</p>
                                            )}
                                            <MaterialViewer material={selectedMaterial}/>


                                            {
// ceyhun: Eğer seçili ders parçasının materyalleri varsa, onları göster
                                                selectedPart && selectedPart.materials && selectedPart.materials.length > 0 &&
                                                selectedPart.materials
                                                    .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
                                                    .map((material) => (
                                                        <MaterialViewer key={material.id} material={material}/>
                                                    ))

                                            }


                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info">
                                <i className="bi bi-info-circle me-2"></i>
                                No materials have been added for this lesson part yet.
                            </div>
                        )}
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