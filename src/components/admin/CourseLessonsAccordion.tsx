'use client';

import React, { useState, useMemo, useEffect } from 'react';
import feather from 'feather-icons';
import { CourseLessonDetailDTO, CourseLessonPartDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

interface CourseLessonsAccordionProps {
  lessons?: CourseLessonDetailDTO[];
}

interface CourseLessonDetailDTOWithChildren extends CourseLessonDetailDTO {
  childLessons?: CourseLessonDetailDTOWithChildren[];
}

type LessonLevel = 'UNIT' | 'TOPIC' | 'LESSON';

export default function CourseLessonsAccordion({ lessons = [] }: CourseLessonsAccordionProps) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    
    // Transform lessons to hierarchical structure
    const hierarchicalLessons = useMemo(() => {
        if (!lessons || lessons.length === 0) return [];

        const allLessons = lessons
            .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
            .map((lesson) => lesson as CourseLessonDetailDTOWithChildren)
            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

        // Get UNIT level lessons (top level, no parent)
        const units = allLessons.filter(
            (lesson) => lesson.lessonLevel === 'UNIT' && !lesson.parentLessonId
        );

        return units;
    }, [lessons]);

    // Toggle accordion item
    const toggleItem = (itemId: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    // Helper function to get child lessons
    const getChildLessons = (parent: CourseLessonDetailDTOWithChildren): CourseLessonDetailDTOWithChildren[] => {
        if (parent.childLessons && parent.childLessons.length > 0) {
            return parent.childLessons;
        }
        if (!lessons) return [];
        return lessons.filter(
            (lesson) => lesson.parentLessonId === parent.id
        ) as CourseLessonDetailDTOWithChildren[];
    };

    // Feather icons replacement after render
    useEffect(() => {
        feather.replace();
    }, [lessons]);

    // Helper functions for level styling
    const getLevelBadgeClass = (level: LessonLevel | string): string => {
        switch (level) {
            case 'UNIT':
                return 'badge bg-success bg-opacity-25 text-success';
            case 'TOPIC':
                return 'badge bg-primary bg-opacity-25 text-primary';
            case 'LESSON':
                return 'badge bg-warning bg-opacity-25 text-warning';
            default:
                return 'badge bg-secondary bg-opacity-25 text-secondary';
        }
    };

    const getLevelText = (level: LessonLevel | string): string => {
        switch (level) {
            case 'UNIT':
                return 'UNIT';
            case 'TOPIC':
                return 'TOPIC';
            case 'LESSON':
                return 'LESSON';
            default:
                return 'PART';
        }
    };

    const getLevelIcon = (level: LessonLevel | string): string => {
        switch (level) {
            case 'UNIT':
                return 'feather-award';
            case 'TOPIC':
                return 'feather-book-open';
            case 'LESSON':
                return 'feather-file-text';
            default:
                return 'feather-monitor';
        }
    };

    const getLevelIconColor = (level: LessonLevel | string, depth: number): string => {
        if (depth === 0) return 'text-primary';
        if (depth === 1) return 'text-secondary';
        if (depth === 2) return 'text-warning';
        return 'text-danger';
    };

    // Lesson Part Row Component
    const LessonPartRow: React.FC<{
        lesson: CourseLessonPartDetailDTO;
        index: number;
        level: number;
        parentNumbers?: string;
    }> = ({lesson, index, level, parentNumbers = ''}) => {
        // Part seviyesi için de aynı girinti mantığı
        const getIndentClass = (lvl: number): string => {
            if (lvl === 0) return '';
            if (lvl === 1) return 'ps-4';  // 1.5rem
            if (lvl === 2) return 'ps-7';  // 3rem
            if (lvl === 3) return 'ps-10'; // 4.5rem
            return 'ps-13'; // 6rem
        };
        const indentClass = getIndentClass(level);
        const bgClass = level === 0 ? 'table-light' : '';
        const numberPrefix = parentNumbers ? `${parentNumbers}.${index + 1}` : `${index + 1}`;
        const iconColorClass = getLevelIconColor('PART', level);

        return (
            <>
                <tr className={bgClass}>
                    <td className="px-3 py-2 fw-medium text-dark" style={{fontSize: '0.875rem'}}>
                        {level === 0 ? index + 1 : ''}
                    </td>
                    <td className="px-3 py-2">
                        <div
                            className={`d-flex align-items-center cursor-pointer ${indentClass}`}
                            style={{transition: 'color 0.15s'}}
                            onMouseOver={(e) => {
                                const span = e.currentTarget.querySelector('span');
                                if (span) span.classList.add('text-primary');
                            }}
                            onMouseOut={(e) => {
                                const span = e.currentTarget.querySelector('span');
                                if (span) span.classList.remove('text-primary');
                            }}
                        >
                            <i 
                                className={`feather-monitor ${iconColorClass} me-3`} 
                                style={{fontSize: '18px'}}
                            />
                            <span className={`${level === 0 ? 'fw-semibold text-dark' : 'text-secondary'}`}>
                                {level > 0 && `${numberPrefix} `}{lesson.name || 'İsimsiz Part'}
                            </span>
                        </div>
                    </td>
                    <td className="px-3 py-2">
                        <span className="badge bg-secondary bg-opacity-25 text-secondary">
                            PART
                        </span>
                    </td>
                    <td className="px-3 py-2">
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="btn btn-sm btn-light border-0 p-1 text-primary"
                                title="Material Ekle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Handle material add
                                }}
                                style={{transition: 'all 0.15s'}}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
                                    e.currentTarget.style.color = '#0a58ca';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = '';
                                }}
                            >
                                <i className="feather-plus-circle" style={{fontSize: '16px'}} />
                            </button>
                            <button
                                className="btn btn-sm btn-light border-0 p-1 text-success"
                                title="Düzenle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Handle part edit
                                }}
                                style={{transition: 'all 0.15s'}}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
                                    e.currentTarget.style.color = '#157347';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = '';
                                }}
                            >
                                <i className="feather-edit" style={{fontSize: '16px'}} />
                            </button>
                        </div>
                    </td>
                </tr>

                {/* Material Rows */}
                {lesson.materials && lesson.materials.length > 0 && lesson.materials.map((material, materialIndex) => {
                    // Material, part'ın bir alt seviyesi olduğu için +1 seviye daha girintili
                    const getMaterialIndentClass = (lvl: number): string => {
                        if (lvl === 0) return 'ps-7';   // 3rem
                        if (lvl === 1) return 'ps-10';  // 4.5rem
                        if (lvl === 2) return 'ps-13';  // 6rem
                        if (lvl === 3) return 'ps-16';  // 7.5rem
                        return 'ps-19'; // 9rem
                    };
                    const materialIndentClass = getMaterialIndentClass(level);
                    const materialNumber = `${numberPrefix}.${materialIndex + 1}`;
                    
                    return (
                        <tr key={material.id} className="bg-white">
                            <td className="px-3 py-2 fw-medium text-dark" style={{fontSize: '0.875rem'}}></td>
                            <td className="px-3 py-2">
                                <div className={`d-flex align-items-center ${materialIndentClass}`}>
                                    <i className="feather-file text-secondary me-3" style={{fontSize: '16px'}}></i>
                                    <span className="text-secondary" style={{fontSize: '0.875rem'}}>
                                        {materialNumber} {material.name || 'İsimsiz Material'}
                                    </span>
                                    {material.mediaType && (
                                        <span className="badge bg-secondary ms-2" style={{fontSize: '0.75rem'}}>{material.mediaType}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                <span className="badge bg-secondary bg-opacity-25 text-secondary" style={{fontSize: '0.75rem'}}>
                                    MATERIAL
                                </span>
                            </td>
                            <td className="px-3 py-2">
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-sm btn-light border-0 p-1 text-success"
                                        title="Düzenle"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Handle material edit
                                        }}
                                        style={{transition: 'all 0.15s'}}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
                                            e.currentTarget.style.color = '#157347';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.color = '';
                                        }}
                                    >
                                        <i className="feather-edit" style={{fontSize: '16px'}} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </>
        );
    };

    // Lesson Row Component (Recursive)
    const LessonRow: React.FC<{
        lesson: CourseLessonDetailDTOWithChildren;
        index: number;
        level: number;
        parentNumbers?: string;
    }> = ({lesson, index, level, parentNumbers = ''}) => {
        const LevelIcon = getLevelIcon(lesson.lessonLevel || '');
        // Daha belirgin girinti hiyerarşisi: her seviye 3rem artış
        const getIndentClass = (lvl: number): string => {
            if (lvl === 0) return '';
            if (lvl === 1) return 'ps-4';  // 1.5rem
            if (lvl === 2) return 'ps-7';  // 3rem
            if (lvl === 3) return 'ps-10'; // 4.5rem
            return 'ps-13'; // 6rem
        };
        const indentClass = getIndentClass(level);
        const bgClass = level === 0 ? 'table-light' : '';
        const numberPrefix = parentNumbers ? `${parentNumbers}.${index + 1}` : `${index + 1}`;
        const iconColorClass = getLevelIconColor(lesson.lessonLevel || '', level);

        const children = getChildLessons(lesson);
        const hasChildren = (children && children.length > 0) || 
                           (lesson.lessonParts && lesson.lessonParts.length > 0);
        
        const isExpanded = expandedItems.has(lesson.id || '');

        return (
            <>
                <tr className={bgClass}>
                    <td className="px-3 py-2 fw-medium text-dark" style={{fontSize: '0.875rem'}}>
                        {level === 0 ? index + 1 : ''}
                    </td>
                    <td className="px-3 py-2">
                        <div
                            className={`d-flex align-items-center cursor-pointer ${indentClass}`}
                            style={{transition: 'color 0.15s'}}
                            onMouseOver={(e) => {
                                const span = e.currentTarget.querySelector('span.lesson-name');
                                if (span) span.classList.add('text-primary');
                            }}
                            onMouseOut={(e) => {
                                const span = e.currentTarget.querySelector('span.lesson-name');
                                if (span) span.classList.remove('text-primary');
                            }}
                        >
                            {hasChildren && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (lesson.id) toggleItem(lesson.id);
                                    }}
                                    className="btn btn-sm btn-link p-0 me-2 text-secondary border-0"
                                    style={{
                                        fontSize: '16px',
                                        lineHeight: 1,
                                        textDecoration: 'none',
                                        transition: 'color 0.15s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.classList.replace('text-secondary', 'text-dark')}
                                    onMouseOut={(e) => e.currentTarget.classList.replace('text-dark', 'text-secondary')}
                                >
                                    <i className={`feather-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                                </button>
                            )}
                            {!hasChildren && (
                                <span className="me-2" style={{width: '16px', display: 'inline-block'}}></span>
                            )}
                            <i 
                                className={`${LevelIcon} ${iconColorClass} me-3`} 
                                style={{fontSize: '18px'}}
                            />
                            <span className={`lesson-name ${level === 0 ? 'fw-semibold text-dark' : 'text-secondary'}`}>
                                {level > 0 && `${numberPrefix} `}{lesson.name || 'İsimsiz'}
                            </span>
                        </div>
                    </td>
                    <td className="px-3 py-2">
                        <span className={getLevelBadgeClass(lesson.lessonLevel || '')}>
                            {getLevelText(lesson.lessonLevel || '')}
                        </span>
                    </td>
                    <td className="px-3 py-2">
                        <div className="d-flex align-items-center gap-2">
                            {getLevelText(lesson.lessonLevel || '') !== 'LESSON' &&
                                <button
                                    className="btn btn-sm btn-light border-0 p-1 text-primary"
                                    title="Alt Seviye Ekle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Handle add child
                                    }}
                                    style={{transition: 'all 0.15s'}}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
                                        e.currentTarget.style.color = '#0a58ca';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '';
                                        e.currentTarget.style.color = '';
                                    }}
                                >
                                    <i className="feather-plus-circle" style={{fontSize: '16px'}} />
                                </button>
                            }
                            <button
                                className="btn btn-sm btn-light border-0 p-1 text-success"
                                title="Düzenle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Handle edit
                                }}
                                style={{transition: 'all 0.15s'}}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
                                    e.currentTarget.style.color = '#157347';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = '';
                                }}
                            >
                                <i className="feather-edit" style={{fontSize: '16px'}} />
                            </button>
                        </div>
                    </td>
                </tr>

                {/* Render child lessons - ONLY IF EXPANDED */}
                {isExpanded && children && children.length > 0 && children.map((childLesson, childIndex) => (
                    <React.Fragment key={`child-${childLesson.id}`}>
                        <LessonRow
                            lesson={childLesson}
                            index={childIndex}
                            level={level + 1}
                            parentNumbers={numberPrefix}
                        />
                    </React.Fragment>
                ))}

                {/* Render lesson parts - ONLY IF EXPANDED */}
                {isExpanded && lesson.lessonParts && lesson.lessonParts.length > 0 && 
                    lesson.lessonParts
                        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
                        .map((lessonPart, partIndex) => (
                            <React.Fragment key={`part-${lessonPart.id}`}>
                                <LessonPartRow
                                    lesson={lessonPart}
                                    index={partIndex}
                                    level={level + 2}
                                    parentNumbers={numberPrefix}
                                />
                            </React.Fragment>
                        ))
                }

                {/* Spacer between main lessons */}
                {level === 0 && index < hierarchicalLessons.length - 1 && (
                    <tr>
                        <td colSpan={4} className="p-0" style={{height: '8px', backgroundColor: '#f8f9fa'}}></td>
                    </tr>
                )}
            </>
        );
    };

    // Empty state
    if (hierarchicalLessons.length === 0) {
        return (
            <div className="bg-white">
                <div className="mb-4">
                    <h2 className="fs-3 fw-bold text-dark mb-2">Course Curriculum</h2>
                </div>
                <div className="text-center py-5">
                    <p className="text-secondary">Henüz ders içeriği eklenmemiş.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="mb-4">
                <h2 className="fs-3 fw-bold text-dark mb-2">Course Curriculum</h2>
            </div>

            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="px-3 py-2 text-start text-uppercase text-secondary fw-medium" 
                                style={{fontSize: '0.75rem', letterSpacing: '0.05em', width: '60px'}}>
                                #
                            </th>
                            <th className="px-3 py-2 text-start text-uppercase text-secondary fw-medium" 
                                style={{fontSize: '0.75rem', letterSpacing: '0.05em'}}>
                                Ders Adı
                            </th>
                            <th className="px-3 py-2 text-start text-uppercase text-secondary fw-medium" 
                                style={{fontSize: '0.75rem', letterSpacing: '0.05em', width: '120px'}}>
                                Seviye
                            </th>
                            <th className="px-3 py-2 text-start text-uppercase text-secondary fw-medium" 
                                style={{fontSize: '0.75rem', letterSpacing: '0.05em', width: '120px'}}>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Handle add unit
                                    }}
                                    className="btn btn-sm btn-light border-0 p-1 text-primary"
                                    title="Yeni Unit Ekle"
                                    style={{transition: 'all 0.15s'}}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
                                        e.currentTarget.style.color = '#0a58ca';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '';
                                        e.currentTarget.style.color = '';
                                    }}
                                >
                                    <i className="feather-plus-circle" style={{fontSize: '16px'}} />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="border-top">
                        {hierarchicalLessons.map((lesson, index) => (
                            <LessonRow
                                key={`main-${lesson.id}`}
                                lesson={lesson}
                                index={index}
                                level={0}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}