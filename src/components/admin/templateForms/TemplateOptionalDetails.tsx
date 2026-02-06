"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";

interface TemplateOptionalDetailsProps {
  children: React.ReactNode;
}

export default function TemplateOptionalDetails({ children }: TemplateOptionalDetailsProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt--20">
      <button
        type="button"
        className="btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center gap-1"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <i className={`feather-chevron-${expanded ? "up" : "down"}`}></i>
        {t("admin.exam.showTemplateOptionalDetails") || "Show Template Optional Details"}
      </button>
      {expanded && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}
