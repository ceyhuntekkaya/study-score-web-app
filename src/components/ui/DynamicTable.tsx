'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n';
import { Column, RecordType } from '@/types/ui/table';

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
    searchText = '',
    onFilteredDataChange,
    onRowClick,
}: TableProps<T>) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState(searchText);

    // Create a map of record IDs to rendered values to help with search
    const [renderedValuesMap, setRenderedValuesMap] = useState<Map<string, string[]>>(new Map());

    const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);

    const sortedData = useMemo(() => {
        const sortableData = [...safeData];
        if (sortConfig) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [safeData, sortConfig]);

    // Extract all rendered values for each record as strings
    useEffect(() => {
        const newMap = new Map<string, string[]>();

        sortedData.forEach((item) => {
            const recordId = String(item.id || Math.random()); // Fallback if no id
            const renderedValues: string[] = [];

            // Add direct values
            Object.entries(item).forEach(([, value]) => {
                if (value !== undefined && value !== null) {
                    renderedValues.push(String(value).toLowerCase());
                }
            });

            // Add rendered values
            columns.forEach((column) => {
                if (column.render) {
                    try {
                        const baseValue = item[column.key as keyof typeof item];
                        const renderedOutput = column.render(baseValue, item);

                        // Handle React elements
                        if (renderedOutput && typeof renderedOutput === 'object') {
                            try {
                                const isReactElement =
                                    renderedOutput.hasOwnProperty('type') &&
                                    renderedOutput.hasOwnProperty('props');

                                if (isReactElement) {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const elementProps = (renderedOutput as { props?: Record<string, any> }).props;

                                    if (elementProps) {
                                        if (elementProps.children) {
                                            const children = Array.isArray(elementProps.children)
                                                ? elementProps.children
                                                : [elementProps.children];

                                            children.forEach(child => {
                                                if (typeof child === 'string') {
                                                    renderedValues.push(child.toLowerCase().trim());
                                                }
                                            });
                                        }

                                        ['title', 'alt', 'label', 'placeholder', 'value'].forEach(prop => {
                                            if (typeof elementProps[prop] === 'string') {
                                                renderedValues.push(elementProps[prop].toLowerCase());
                                            }
                                        });
                                    }
                                } else {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const flattenObject = (obj: Record<string, any>, prefix = ''): void => {
                                        if(prefix === 'genixoai') return;
                                        Object.entries(obj).forEach(([, value]) => {
                                            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
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
                                console.error("Error extracting text from React element:", error);
                            }
                        } else if (renderedOutput !== undefined && renderedOutput !== null) {
                            renderedValues.push(String(renderedOutput).toLowerCase());
                        }
                    } catch (error) {
                        console.error("Error in render function during search data extraction:", error);
                    }
                }
            });

            // Also find nested paths
            const recordStr = JSON.stringify(item);
            const allPaths = recordStr.match(/"([^"]+)":/g) || [];
            allPaths.forEach(path => {
                const key = path.replace(/^"|":$/g, '');
                try {
                    const keyParts = key.split('.');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let currentValue: any = item;
                    let valid = true;

                    for (const part of keyParts) {
                        if (currentValue && typeof currentValue === 'object' && part in currentValue) {
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

        return sortedData.filter(item => {
            const recordId = String(item.id || Math.random());
            const renderedValues = renderedValuesMap.get(recordId) || [];

            // Direct property search first
            for (const key in item) {
                const value = item[key];
                if (value !== undefined &&
                    String(value).toLowerCase().includes(searchTermLower)) {
                    return true;
                }
            }

            // Then check pre-rendered values
            return renderedValues.some(value => value.includes(searchTermLower));
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
        const column = columns.find(col => col.key === key);
        if (!column?.sortable) return;
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    if (!safeData.length) {
        return (
            <div className="w-100 text-center py-5">
                {t('common.noData') || 'No data available'}
            </div>
        );
    }

    const renderCell = (column: Column<T>, item: T) => {
        if (column.key === 'actions' && column.actions) {
            return (
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {column.actions.map((action, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(item);
                            }}
                            className={action.className || 'rbt-btn btn-sm btn-border-gradient'}
                            title={typeof action.label === 'string' ? action.label : ''}
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
                    ))}
                </div>
            );
        }

        const value = item[column.key as keyof T];
        return column.render ? column.render(value, item) : String(value ?? '-');
    };

    const showPagination = filteredData.length > pageSize;

    return (
        <div className="w-100">
            {searchable && (
                <div className="rbt-search-box mb--20">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('common.search') || 'Search...'}
                        />
                        <span className="input-group-text">
                            <i className="feather-search"></i>
                        </span>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={`${String(column.key)}-${index}`}
                                    onClick={() => column.key !== 'actions' && handleSort(column.key as keyof T)}
                                    style={{
                                        cursor: column.sortable && column.key !== 'actions' ? 'pointer' : 'default',
                                        userSelect: 'none',
                                    }}
                                    className={column.sortable && column.key !== 'actions' ? '' : ''}
                                >
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>{column.header}</span>
                                        {column.sortable && column.key !== 'actions' && (
                                            <span className="ms-2">
                                                {sortConfig?.key === column.key ? (
                                                    sortConfig.direction === 'asc' ? (
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
                        {paginatedData.map((item, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick?.(item)}
                                style={{
                                    cursor: onRowClick ? 'pointer' : 'default',
                                }}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={`${String(column.key)}-${colIndex}`}
                                        className="align-middle"
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
                <div className="rbt-pagination-wrapper mt--20">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="feather-chevrons-left"></i>
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <i className="feather-chevron-left"></i>
                                </button>
                            </li>
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
                                        pages.push('ellipsis');
                                        pages.push(totalPages);
                                    } else if (currentPage >= totalPages - 3) {
                                        pages.push('ellipsis');
                                        for (let i = totalPages - 4; i <= totalPages; i++) {
                                            pages.push(i);
                                        }
                                    } else {
                                        pages.push('ellipsis');
                                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                            pages.push(i);
                                        }
                                        pages.push('ellipsis');
                                        pages.push(totalPages);
                                    }
                                }

                                return pages.map((page, idx) => {
                                    if (page === 'ellipsis') {
                                        return (
                                            <li key={`ellipsis-${idx}`} className="page-item disabled">
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
                            <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <i className="feather-chevron-right"></i>
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <i className="feather-chevrons-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div className="pagination-info mt-2">
                        <span>
                            {t('common.showing') || 'Showing'} {((currentPage - 1) * pageSize) + 1} -{' '}
                            {Math.min(currentPage * pageSize, filteredData.length)} {t('common.of') || 'of'}{' '}
                            {filteredData.length}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicTable;
