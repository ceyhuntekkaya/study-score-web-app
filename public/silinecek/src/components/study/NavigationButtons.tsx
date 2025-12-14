// Updated NavigationButtons.tsx
// components/course/NavigationButtons.tsx
import {
  NavigationItem,
  getCurrentPosition,
  navigateToItem,
} from "./navigationUtils";
import { SelectionState } from "@/types/course/selectionState";

interface NavigationButtonsProps {
  selectionState: SelectionState;
  navigationItems: NavigationItem[];
}

export function NavigationButtons({
  selectionState,
  navigationItems,
}: NavigationButtonsProps) {
  const currentPos = getCurrentPosition(selectionState, navigationItems);

  const canGoPrevious = currentPos > 0;
  const canGoNext = currentPos >= 0 && currentPos < navigationItems.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      const previousItem = navigationItems[currentPos - 1];
      navigateToItem(previousItem, selectionState);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      const nextItem = navigationItems[currentPos + 1];
      navigateToItem(nextItem, selectionState);
    }
  };

  return (
    <div className="navigation-buttons-container">
      <button
        className={`navigation-btn navigation-btn-prev ${
          canGoPrevious ? "active" : "disabled"
        }`}
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        title="Önceki ders"
      >
        <span className="nav-icon">‹</span>
      </button>

      <div className="navigation-counter">
        <span className="counter-text">
          {currentPos >= 0 ? `${currentPos + 1}/${navigationItems.length}` : ""}
        </span>
      </div>

      <button
        className={`navigation-btn navigation-btn-next ${
          canGoNext ? "active" : "disabled"
        }`}
        onClick={handleNext}
        disabled={!canGoNext}
        title="Sonraki ders"
      >
        <span className="nav-icon">›</span>
      </button>
    </div>
  );
}
