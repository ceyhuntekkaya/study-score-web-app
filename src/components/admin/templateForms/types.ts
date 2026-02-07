export interface TemplateFormProps {
  templateData: any;
  onChange: (templateData: any) => void;
}

/** Ordering template: item shape sent to/saved by API (no id). */
export interface OrderingItemTemplate {
  text: string;
  correctPosition: number;
}

/** Ordering template data – single source of truth for form and question. */
export interface OrderingTemplateData {
  options: {
    items: OrderingItemTemplate[];
  };
  orderingType?: "SEQUENTIAL" | "RANKING";
  shuffleItems?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

/** Drag-and-drop item (id + text) inside a zone. */
export interface DragAndDropItemTemplate {
  id: string;
  text: string;
}

/** Drag-and-drop template: only dropZones; each zone has items (correct answers). */
export interface DragAndDropTemplateData {
  options: {
    dropZones: Array<{
      id: string;
      label: string;
      items: DragAndDropItemTemplate[];
    }>;
  };
  layout?: "VERTICAL" | "HORIZONTAL" | "GRID" | "CUSTOM";
  shuffleItems?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}
