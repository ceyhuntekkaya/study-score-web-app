'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/i18n';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  onClick?: (row: T, event: React.MouseEvent) => void;
  clickable?: boolean; // If true, this column is clickable and will prevent row click
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 20,
  searchable = true,
  onRowClick,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle column sort
  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column || !column.sortable) return;

    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="rbt-dashboard-content-wrapper">
      {/* Search Input */}
      {searchable && (
        <div className="rbt-search-box mb--20">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t('common.search') || 'Search...'}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <span className="input-group-text">
              <i className="feather-search"></i>
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  style={{
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ms-2">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <i className="feather-arrow-up"></i>
                          ) : (
                            <i className="feather-arrow-down"></i>
                          )
                        ) : (
                          <i className="feather-arrow-up-down" style={{ opacity: 0.3 }}></i>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  {t('common.noData') || 'No data available'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const hasClickableColumn = columns.some(col => col.onClick || col.clickable);
                const rowClickable = onRowClick && !hasClickableColumn;
                
                return (
                  <tr
                    key={index}
                    onClick={() => {
                      if (rowClickable) {
                        onRowClick(row);
                      }
                    }}
                    style={{
                      cursor: rowClickable ? 'pointer' : 'default',
                    }}
                  >
                    {columns.map((column) => {
                      const isColumnClickable = column.onClick || column.clickable;
                      const hasButtonInRender = column.render && column.clickable;
                      
                      return (
                        <td
                          key={column.key}
                          onClick={(e) => {
                            // If column has onClick handler, call it
                            if (isColumnClickable && column.onClick) {
                              e.stopPropagation();
                              column.onClick(row, e);
                            }
                            // If column has clickable flag but no onClick, still stop propagation
                            // (the button inside render will handle the click)
                            else if (hasButtonInRender) {
                              e.stopPropagation();
                            }
                          }}
                          style={{
                            cursor: isColumnClickable ? 'pointer' : 'inherit',
                          }}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key] ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rbt-pagination-wrapper mt--20">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="feather-chevron-left"></i>
                </button>
              </li>

              {(() => {
                const pages: (number | string)[] = [];
                const showEllipsis = totalPages > 7;

                if (!showEllipsis) {
                  // Show all pages if total pages <= 7
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);

                  if (currentPage <= 4) {
                    // Show first 5 pages
                    for (let i = 2; i <= 5; i++) {
                      pages.push(i);
                    }
                    pages.push('ellipsis');
                    pages.push(totalPages);
                  } else if (currentPage >= totalPages - 3) {
                    // Show last 5 pages
                    pages.push('ellipsis');
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Show pages around current
                    pages.push('ellipsis');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                      pages.push(i);
                    }
                    pages.push('ellipsis');
                    pages.push(totalPages);
                  }
                }

                return pages.map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <li key={`ellipsis-${index}`} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                });
              })()}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <i className="feather-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
          <div className="pagination-info mt-2">
            <span>
              {t('common.showing') || 'Showing'} {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} {t('common.of') || 'of'}{' '}
              {sortedData.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
