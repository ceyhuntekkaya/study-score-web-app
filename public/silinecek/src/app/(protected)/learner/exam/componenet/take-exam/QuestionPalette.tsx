'use client';

import { useState, useMemo } from 'react';
import {QuestionPaletteItem, QuestionStatusColors} from "@/types/exam/exam-taking.types";

interface QuestionPaletteProps {
    questions: QuestionPaletteItem[];
    currentQuestionId: string;
    onQuestionSelect: (questionId: string) => void;
    showLegend?: boolean;
    showPartHeaders?: boolean;
    showSearch?: boolean;
    showFilters?: boolean;
    groupByPart?: boolean;
    size?: 'small' | 'medium' | 'large';
    columns?: number;
    isCollapsible?: boolean;
    className?: string;
}

const statusColors: QuestionStatusColors = {
    'not-visited': 'bg-gray-200 text-gray-700 border-gray-300',
    'visited': 'bg-blue-100 text-blue-700 border-blue-300',
    'answered': 'bg-green-100 text-green-700 border-green-400',
    'marked': 'bg-yellow-100 text-yellow-700 border-yellow-400',
    'skipped': 'bg-orange-100 text-orange-700 border-orange-400',
    'current': 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300'
};

export function QuestionPalette({
                                    questions,
                                    currentQuestionId,
                                    onQuestionSelect,
                                    showLegend = true,
                                    showPartHeaders = true,
                                    showSearch = false,
                                    showFilters = false,
                                    groupByPart = true,
                                    size = 'medium',
                                    columns = 10,
                                    isCollapsible = true,
                                    className = ''
                                }: QuestionPaletteProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'text-xs',
                    question: 'w-6 h-6 text-xs',
                    legend: 'text-xs',
                    header: 'text-sm'
                };
            case 'large':
                return {
                    container: 'text-base',
                    question: 'w-10 h-10 text-sm',
                    legend: 'text-sm',
                    header: 'text-lg'
                };
            default: // medium
                return {
                    container: 'text-sm',
                    question: 'w-8 h-8 text-xs',
                    legend: 'text-sm',
                    header: 'text-base'
                };
        }
    };

    const sizeClasses = getSizeClasses();

    const filteredQuestions = useMemo(() => {
        let filtered = questions;

        if (searchQuery) {
            filtered = filtered.filter(q =>
                q.number.toString().includes(searchQuery) ||
                q.partName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(q => q.status === statusFilter);
        }

        return filtered;
    }, [questions, searchQuery, statusFilter]);

    const groupedQuestions = useMemo(() => {
        if (!groupByPart) {
            return [{ partName: 'Tüm Sorular', questions: filteredQuestions }];
        }

        const groups = filteredQuestions.reduce((acc, question) => {
            const partName = question.partName || 'Genel';
            if (!acc[partName]) {
                acc[partName] = [];
            }
            acc[partName].push(question);
            return acc;
        }, {} as Record<string, QuestionPaletteItem[]>);

        return Object.entries(groups).map(([partName, questions]) => ({
            partName,
            questions: questions.sort((a, b) => a.number - b.number)
        }));
    }, [filteredQuestions, groupByPart]);

    const getQuestionStatus = (question: QuestionPaletteItem) => {
        if (question.id === currentQuestionId) return 'current';
        return question.status;
    };

    const getStatusCount = (status: string) => {
        return questions.filter(q => q.status === status).length;
    };

    const legendItems = [
        { status: 'answered', label: 'Cevaplanmış', count: getStatusCount('answered') },
        { status: 'marked', label: 'İşaretlenmiş', count: getStatusCount('marked') },
        { status: 'visited', label: 'Görüntülenmiş', count: getStatusCount('visited') },
        { status: 'skipped', label: 'Atlanmış', count: getStatusCount('skipped') },
        { status: 'not-visited', label: 'Görüntülenmemiş', count: getStatusCount('not-visited') }
    ];

    const getGridCols = () => {
        switch (columns) {
            case 5: return 'grid-cols-5';
            case 8: return 'grid-cols-8';
            case 12: return 'grid-cols-12';
            case 15: return 'grid-cols-15';
            default: return 'grid-cols-10';
        }
    };

    if (isCollapsed && isCollapsible) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="flex items-center justify-between w-full text-left"
                >
          <span className={`font-semibold text-gray-800 ${sizeClasses.header}`}>
            Soru Paleti ({questions.length})
          </span>
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Mini progress bar */}
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${(getStatusCount('answered') / questions.length) * 100}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-gray-800 ${sizeClasses.header}`}>
                        Soru Paleti ({filteredQuestions.length}/{questions.length})
                    </h3>
                    {isCollapsible && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Search and Filters */}
                {(showSearch || showFilters) && (
                    <div className="mt-3 flex space-x-3">
                        {showSearch && (
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Soru numarası ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        {showFilters && (
                            <div className="flex-shrink-0">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tümü</option>
                                    <option value="answered">Cevaplanmış</option>
                                    <option value="marked">İşaretlenmiş</option>
                                    <option value="visited">Görüntülenmiş</option>
                                    <option value="skipped">Atlanmış</option>
                                    <option value="not-visited">Görüntülenmemiş</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Question Grid */}
            <div className="p-4 max-h-96 overflow-y-auto">
                {groupedQuestions.map((group, groupIndex) => (
                    <div key={group.partName} className={groupIndex > 0 ? 'mt-6' : ''}>
                        {/* Part Header */}
                        {showPartHeaders && groupByPart && (
                            <div className="mb-3">
                                <h4 className={`font-medium text-gray-700 ${sizeClasses.header}`}>
                                    {group.partName} ({group.questions.length} soru)
                                </h4>
                                <div className="h-px bg-gray-200 mt-1"></div>
                            </div>
                        )}

                        {/* Questions Grid */}
                        <div className={`grid ${getGridCols()} gap-2`}>
                            {group.questions.map((question) => {
                                const status = getQuestionStatus(question);
                                const isCurrentQuestion = question.id === currentQuestionId;

                                return (
                                    <button
                                        key={question.id}
                                        onClick={() => onQuestionSelect(question.id)}
                                        className={`
                      ${sizeClasses.question}
                      ${statusColors[status]}
                      ${isCurrentQuestion ? 'scale-110 z-10' : 'hover:scale-105'}
                      rounded-lg border-2 font-semibold transition-all duration-200
                      flex items-center justify-center
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                    `}
                                        title={`Soru ${question.number} - ${status === 'current' ? 'Mevcut soru' : question.status}`}
                                    >
                                        {question.number}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {filteredQuestions.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <p>Filtrelere uygun soru bulunamadı</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <h4 className={`font-medium text-gray-700 mb-3 ${sizeClasses.legend}`}>Durum Açıklaması</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {legendItems.map((item) => (
                            <div key={item.status} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded border-2 ${statusColors[item.status as 'not-visited' | 'visited' | 'answered' | 'marked' | 'skipped' | 'current']}`} />
                                <span className={`${sizeClasses.legend} text-gray-700`}>
                  {item.label} ({item.count})
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}