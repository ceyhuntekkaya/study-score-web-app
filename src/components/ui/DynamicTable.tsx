"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n";
import { Column, RecordType } from "@/types/ui/table";
import { Input } from "@/components/ui/Input";

interface TableProps<T> {
  data?: T[] | null;
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchText?: string;
  onFilteredDataChange?: (filteredData: T[]) => void;
  onRowClick?: (row: T) => void;
}

const DynamicTable = <T extends RecordType>({
  data = [],
  columns,
  pageSize = 50,
  searchable = true,
  searchText = "",
  onFilteredDataChange,
  onRowClick,
}: TableProps<T>) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchText);

  // Create a map of record IDs to rendered values to help with search
  const [renderedValuesMap, setRenderedValuesMap] = useState<
    Map<string, string[]>
  >(new Map());

  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const sortedData = useMemo(() => {
    const sortableData = [...safeData];
    if (sortConfig) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [safeData, sortConfig]);

  // Extract all rendered values for each record as strings
  useEffect(() => {
    const newMap = new Map<string, string[]>();

    sortedData.forEach((item) => {
      const recordId = String((item as any).id || Math.random()); // Fallback if no id
      const renderedValues: string[] = [];

      // Add direct values
      Object.entries(item as any).forEach(([, value]) => {
        if (value !== undefined && value !== null) {
          renderedValues.push(String(value).toLowerCase());
        }
      });

      // Add rendered values
      columns.forEach((column) => {
        if (column.render) {
          try {
            const baseValue = (item as any)[column.key];
            const renderedOutput = column.render(baseValue, item);

            // Handle React elements
            if (renderedOutput && typeof renderedOutput === "object") {
              try {
                const isReactElement =
                  renderedOutput.hasOwnProperty("type") &&
                  renderedOutput.hasOwnProperty("props");

                if (isReactElement) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const elementProps = (
                    renderedOutput as { props?: Record<string, any> }
                  ).props;

                  if (elementProps) {
                    if (elementProps.children) {
                      const children = Array.isArray(elementProps.children)
                        ? elementProps.children
                        : [elementProps.children];

                      children.forEach((child) => {
                        if (typeof child === "string") {
                          renderedValues.push(child.toLowerCase().trim());
                        }
                      });
                    }

                    ["title", "alt", "label", "placeholder", "value"].forEach(
                      (prop) => {
                        if (typeof elementProps[prop] === "string") {
                          renderedValues.push(elementProps[prop].toLowerCase());
                        }
                      }
                    );
                  }
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const flattenObject = (
                    obj: Record<string, any>,
                    prefix = ""
                  ): void => {
                    if (prefix === "genixoai") return;
                    Object.entries(obj).forEach(([, value]) => {
                      if (
                        typeof value === "string" ||
                        typeof value === "number" ||
                        typeof value === "boolean"
                      ) {
                        renderedValues.push(String(value).toLowerCase());
                      }
                    });
                  };

                  try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    flattenObject(renderedOutput as Record<string, any>);
                  } catch (err) {
                    console.error(err);
                  }
                }
              } catch (error) {
                console.error(
                  "Error extracting text from React element:",
                  error
                );
              }
            } else if (
              renderedOutput !== undefined &&
              renderedOutput !== null
            ) {
              renderedValues.push(String(renderedOutput).toLowerCase());
            }
          } catch (error) {
            console.error(
              "Error in render function during search data extraction:",
              error
            );
          }
        }
      });

      // Also find nested paths
      const recordStr = JSON.stringify(item);
      const allPaths = recordStr.match(/"([^"]+)":/g) || [];
      allPaths.forEach((path) => {
        const key = path.replace(/^"|":$/g, "");
        try {
          const keyParts = key.split(".");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let currentValue: any = item as any;
          let valid = true;

          for (const part of keyParts) {
            if (
              currentValue &&
              typeof currentValue === "object" &&
              part in currentValue
            ) {
              currentValue = currentValue[part as keyof typeof currentValue];
            } else {
              valid = false;
              break;
            }
          }

          if (valid && currentValue !== undefined && currentValue !== null) {
            renderedValues.push(String(currentValue).toLowerCase());
          }
        } catch (e) {
          // Ignore errors
        }
      });

      newMap.set(recordId, renderedValues);
    });

    setRenderedValuesMap(newMap);
  }, [sortedData, columns]);

  // Enhanced search functionality
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    const searchTermLower = searchTerm.toLowerCase();

    return sortedData.filter((item) => {
      const recordId = String((item as any).id || Math.random());
      const renderedValues = renderedValuesMap.get(recordId) || [];

      // Direct property search first
      for (const key in item as any) {
        const value = (item as any)[key];
        if (
          value !== undefined &&
          String(value).toLowerCase().includes(searchTermLower)
        ) {
          return true;
        }
      }

      // Then check pre-rendered values
      return renderedValues.some((value) => value.includes(searchTermLower));
    });
  }, [sortedData, searchTerm, renderedValuesMap]);

  // Notify parent of filtered data changes
  const onFilteredDataChangeRef = useRef(onFilteredDataChange);
  onFilteredDataChangeRef.current = onFilteredDataChange;

  useEffect(() => {
    if (onFilteredDataChangeRef.current) {
      onFilteredDataChangeRef.current(filteredData);
    }
  }, [searchTerm, filteredData]);

  useEffect(() => {
    if (onFilteredDataChangeRef.current && safeData.length > 0) {
      onFilteredDataChangeRef.current(filteredData);
    }
  }, [safeData.length, filteredData]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: keyof T) => {
    const column = columns.find((col) => col.key === key);
    if (!column?.sortable) return;
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (!safeData.length) {
    return (
      <div className="w-100 text-center py-5">
        {t("common.noData") || "No data available"}
      </div>
    );
  }

  const renderCell = (column: Column<T>, item: T) => {
    if (column.key === "actions" && column.actions) {
      return (
        <div className="d-flex align-items-center gap-3 flex-nowrap">
          {column.actions.map((action, idx) => {
            const isIconOnly = action.iconOnly;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(item);
                }}
                className={
                  isIconOnly
                    ? `p-0 border-0 bg-transparent ${action.className ?? ""}`.trim()
                    : action.className || "rbt-btn btn-sm"
                }
                title={action.title ?? (typeof action.label === "string" ? action.label : "")}
                style={isIconOnly ? { minWidth: 0, lineHeight: 1, cursor: "pointer" } : undefined}
              >
                {action.icon ? (
                  <>
                    <action.icon className="feather me-1" size={16} />
                    {action.label}
                  </>
                ) : (
                  action.label
                )}
              </button>
            );
          })}
        </div>
      );
    }

    const value = (item as any)[column.key];
    return column.render ? column.render(value, item) : String(value ?? "-");
  };

  const showPagination = filteredData.length > pageSize;

  return (
    <div className="w-100">
      {searchable && (
        <div className="ui-table-search">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("common.search") || "Search..."}
            icon="feather-search"
            iconPosition="left"
            style={{ marginTop: 0 }}
          />
        </div>
      )}

      <div className="ui-table-wrapper">
        <table className="ui-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  onClick={() =>
                    column.key !== "actions" &&
                    handleSort(column.key as keyof T)
                  }
                  className={
                    column.sortable && column.key !== "actions"
                      ? "sortable"
                      : ""
                  }
                  style={{
                    backgroundColor: "#f9fafb",
                    color: "#6B7280",
                    fontSize: "16px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{column.header}</span>
                    {column.sortable && column.key !== "actions" && (
                      <span style={{ marginLeft: "0.5rem" }}>
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <i
                              className="feather-arrow-up"
                              style={{ width: "16px", height: "16px" }}
                            ></i>
                          ) : (
                            <i
                              className="feather-arrow-down"
                              style={{ width: "16px", height: "16px" }}
                            ></i>
                          )
                        ) : (
                          <i
                            className="feather-arrow-up-down"
                            style={{
                              width: "16px",
                              height: "16px",
                              opacity: 0.3,
                            }}
                          ></i>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${String(column.key)}-${colIndex}`}
                    style={{
                      color: "#374151",
                      fontSize: "16px",
                      fontWeight: 500,
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      paddingLeft: "24px",
                      paddingRight: "24px",
                    }}
                  >
                    {renderCell(column, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="ui-pagination">
          <div className="ui-pagination-controls">
            <button
              type="button"
              className="ui-pagination-button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <i
                className="feather-chevrons-left"
                style={{ width: "16px", height: "16px" }}
              ></i>
            </button>
            <button
              type="button"
              className="ui-pagination-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i
                className="feather-chevron-left"
                style={{ width: "16px", height: "16px" }}
              ></i>
            </button>
            {(() => {
              const pages: (number | string)[] = [];
              const showEllipsis = totalPages > 7;

              if (!showEllipsis) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                if (currentPage <= 4) {
                  for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                  }
                  pages.push("ellipsis");
                  pages.push(totalPages);
                } else if (currentPage >= totalPages - 3) {
                  pages.push("ellipsis");
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push("ellipsis");
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                  }
                  pages.push("ellipsis");
                  pages.push(totalPages);
                }
              }

              return pages.map((page, idx) => {
                if (page === "ellipsis") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="ui-pagination-button"
                      style={{ cursor: "default" }}
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    type="button"
                    className={`ui-pagination-button ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            <button
              type="button"
              className="ui-pagination-button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <i
                className="feather-chevron-right"
                style={{ width: "16px", height: "16px" }}
              ></i>
            </button>
            <button
              type="button"
              className="ui-pagination-button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <i
                className="feather-chevrons-right"
                style={{ width: "16px", height: "16px" }}
              ></i>
            </button>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {t("common.showing") || "Showing"}{" "}
            {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)}{" "}
            {t("common.of") || "of"} {filteredData.length} entries
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
