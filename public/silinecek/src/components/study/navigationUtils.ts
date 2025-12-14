// components/course/navigationUtils.ts
import { SelectionState } from "@/types/course/selectionState";
import { CourseDetailDTO } from "@/types/course/course";

export interface NavigationItem {
  type: "lessonPart";
  lessonId: string;
  childLessonId?: string;
  grandChildLessonId?: string;
  lessonPartId: string;
  title: string;
  orderNumber?: number;
  // Hiyerarşi bilgisi için ek alanlar
  lessonTitle: string;
  childLessonTitle?: string;
  grandChildLessonTitle?: string;
}

export function buildNavigationItems(
  courseDetailDTO: CourseDetailDTO
): NavigationItem[] {
  if (!courseDetailDTO || !courseDetailDTO.lessons) return [];

  const items: NavigationItem[] = [];

  // Lessons'ları sırala
  const sortedLessons = [...courseDetailDTO.lessons].sort(
    (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
  );

  sortedLessons.forEach((lesson) => {
    // Ana dersin lesson part'ları (eğer alt ders yoksa)
    if (
      (!lesson.childLessons || lesson.childLessons.length === 0) &&
      lesson.lessonParts &&
      lesson.lessonParts.length > 0
    ) {
      const sortedParts = [...lesson.lessonParts].sort(
        (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
      );

      sortedParts.forEach((part) => {
        items.push({
          type: "lessonPart",
          lessonId: lesson.id,
          lessonPartId: part.id,
          title: part.name,
          orderNumber: part.orderNumber || 0,
          lessonTitle: lesson.name,
        });
      });
    }

    // Alt dersler varsa
    if (lesson.childLessons && lesson.childLessons.length > 0) {
      const sortedChildLessons = [...lesson.childLessons].sort(
        (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
      );

      sortedChildLessons.forEach((childLesson) => {
        // Alt dersin lesson part'ları (eğer alt-alt ders yoksa)
        if (
          (!childLesson.childLessons ||
            childLesson.childLessons.length === 0) &&
          childLesson.lessonParts &&
          childLesson.lessonParts.length > 0
        ) {
          const sortedParts = [...childLesson.lessonParts].sort(
            (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
          );

          sortedParts.forEach((part) => {
            items.push({
              type: "lessonPart",
              lessonId: lesson.id,
              childLessonId: childLesson.id,
              lessonPartId: part.id,
              title: part.name,
              orderNumber: part.orderNumber || 0,
              lessonTitle: lesson.name,
              childLessonTitle: childLesson.name,
            });
          });
        }

        // Alt-alt dersler varsa
        if (childLesson.childLessons && childLesson.childLessons.length > 0) {
          const sortedGrandChildLessons = [...childLesson.childLessons].sort(
            (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
          );

          sortedGrandChildLessons.forEach((grandChildLesson) => {
            // Alt-alt dersin lesson part'ları
            if (
              grandChildLesson.lessonParts &&
              grandChildLesson.lessonParts.length > 0
            ) {
              const sortedParts = [...grandChildLesson.lessonParts].sort(
                (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
              );

              sortedParts.forEach((part) => {
                items.push({
                  type: "lessonPart",
                  lessonId: lesson.id,
                  childLessonId: childLesson.id,
                  grandChildLessonId: grandChildLesson.id,
                  lessonPartId: part.id,
                  title: part.name,
                  orderNumber: part.orderNumber || 0,
                  lessonTitle: lesson.name,
                  childLessonTitle: childLesson.name,
                  grandChildLessonTitle: grandChildLesson.name,
                });
              });
            }
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
  const currentLessonPartId = selectionState.selectedLessonPartId;

  if (!currentLessonPartId) return -1;

  const position = navigationItems.findIndex(
    (item) => item.lessonPartId === currentLessonPartId
  );

  return position;
}

// Bir sonraki lesson part'a git
export function goToNextLessonPart(
  selectionState: SelectionState,
  navigationItems: NavigationItem[]
): boolean {
  const currentPosition = getCurrentPosition(selectionState, navigationItems);

  if (currentPosition === -1 || currentPosition >= navigationItems.length - 1) {
    return false; // Son öğe veya geçersiz pozisyon
  }

  const nextItem = navigationItems[currentPosition + 1];
  navigateToItem(nextItem, selectionState);
  return true;
}

// Bir önceki lesson part'a git
export function goToPreviousLessonPart(
  selectionState: SelectionState,
  navigationItems: NavigationItem[]
): boolean {
  const currentPosition = getCurrentPosition(selectionState, navigationItems);

  if (currentPosition <= 0) {
    return false; // İlk öğe veya geçersiz pozisyon
  }

  const previousItem = navigationItems[currentPosition - 1];
  navigateToItem(previousItem, selectionState);
  return true;
}

// NavigationItem'a göre state'i güncelleyen helper fonksiyon
export function navigateToItem(
  item: NavigationItem,
  selectionState: SelectionState
): void {
  // State güncellemelerini batch olarak yap
  selectionState.setSelectedLessonId(item.lessonId);
  selectionState.setSelectedChildLessonId(item.childLessonId || null);
  selectionState.setSelectedGrandChildLessonId(item.grandChildLessonId || null);
  selectionState.setSelectedLessonPartId(item.lessonPartId);
  selectionState.setSelectedMaterialId(null); // Materyal seçimini sıfırla
}

// İlk lesson part'a git (kursun başına dön)
export function goToFirstLessonPart(
  selectionState: SelectionState,
  navigationItems: NavigationItem[]
): boolean {
  if (navigationItems.length === 0) return false;

  const firstItem = navigationItems[0];
  navigateToItem(firstItem, selectionState);
  return true;
}

// Son lesson part'a git
export function goToLastLessonPart(
  selectionState: SelectionState,
  navigationItems: NavigationItem[]
): boolean {
  if (navigationItems.length === 0) return false;

  const lastItem = navigationItems[navigationItems.length - 1];
  navigateToItem(lastItem, selectionState);
  return true;
}
