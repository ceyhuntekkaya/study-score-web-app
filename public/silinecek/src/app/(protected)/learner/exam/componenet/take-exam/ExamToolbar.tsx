'use client';

import { useState } from 'react';
import {ExamToolbarAction} from "@/types/exam/exam-taking.types";

interface ExamToolbarProps {
    actions: ExamToolbarAction[];
    position?: 'top' | 'bottom' | 'left' | 'right' | 'floating';
    size?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
    showShortcuts?: boolean;
    isCollapsible?: boolean;
    className?: string;
}

export function ExamToolbar({
                                actions,
                                position = 'bottom',
                                size = 'medium',
                                showLabels = true,
                                showShortcuts = false,
                                isCollapsible = false,
                                className = ''
                            }: ExamToolbarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'p-2',
                    button: 'w-8 h-8 text-xs',
                    icon: 'w-4 h-4',
                    text: 'text-xs',
                    gap: 'gap-1'
                };
            case 'large':
                return {
                    container: 'p-4',
                    button: 'w-12 h-12 text-base',
                    icon: 'w-6 h-6',
                    text: 'text-base',
                    gap: 'gap-4'
                };
            default: // medium
                return {
                    container: 'p-3',
                    button: 'w-10 h-10 text-sm',
                    icon: 'w-5 h-5',
                    text: 'text-sm',
                    gap: 'gap-2'
                };
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm';
            case 'bottom':
                return 'fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg';
            case 'left':
                return 'fixed left-0 top-0 bottom-0 z-40 bg-white border-r shadow-sm flex-col';
            case 'right':
                return 'fixed right-0 top-0 bottom-0 z-40 bg-white border-l shadow-sm flex-col';
            case 'floating':
                return 'fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-lg border';
            default:
                return 'bg-white border-t shadow-sm';
        }
    };

    const sizeClasses = getSizeClasses();
    const positionClasses = getPositionClasses();
    const visibleActions = actions.filter(action => action.visible !== false);

    const getActionIcon = (iconName: string) => {
        switch (iconName) {
            case 'previous':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'next':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'mark':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                );
            case 'clear':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                );
            case 'save':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                    </svg>
                );
            case 'submit':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'pause':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'review':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'calculator':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 112 0v3a1 1 0 11-2 0v-3zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                    </svg>
                );
            case 'help':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                );
            case 'fullscreen':
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const renderAction = (action: ExamToolbarAction) => {
        const buttonClass = `
      ${sizeClasses.button}
      ${action.disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 cursor-pointer'
        }
      border border-gray-300 rounded-lg transition-all duration-200
      flex items-center justify-center
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      ${!action.disabled ? 'hover:scale-105 hover:shadow-md' : ''}
    `;

        return (
            <div key={action.id} className="relative group">
                <button
                    onClick={action.action}
                    disabled={action.disabled}
                    className={buttonClass}
                    title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                >
                    {getActionIcon(action.icon)}
                </button>

                {/* Label (if enabled) */}
                {showLabels && (
                    <div className={`${sizeClasses.text} text-center mt-1 text-gray-600 truncate`}>
                        {action.label}
                    </div>
                )}

                {/* Shortcut (if enabled) */}
                {showShortcuts && action.shortcut && (
                    <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {action.shortcut}
                    </div>
                )}
            </div>
        );
    };

    if (isCollapsible && isCollapsed) {
        return (
            <div className={`${positionClasses} ${className}`}>
                <div className={sizeClasses.container}>
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className={`${sizeClasses.button} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200`}
                        title="Araç çubuğunu göster"
                    >
                        <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${positionClasses} ${className}`}>
            <div className={`${sizeClasses.container} flex items-center justify-center`}>
                {/* Collapse button (if collapsible) */}
                {isCollapsible && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className={`${sizeClasses.button} bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 mr-4`}
                        title="Araç çubuğunu gizle"
                    >
                        <svg className={sizeClasses.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}

                {/* Action buttons */}
                <div className={`flex items-center ${sizeClasses.gap} ${position === 'left' || position === 'right' ? 'flex-col' : ''}`}>
                    {visibleActions.map(renderAction)}
                </div>
            </div>

            {/* Keyboard shortcuts info (for floating toolbar) */}
            {position === 'floating' && showShortcuts && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg border-t">
                    <div className="text-xs text-gray-600 font-medium mb-1">Klavye Kısayolları:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                        {visibleActions
                            .filter(action => action.shortcut)
                            .slice(0, 6) // Show max 6 shortcuts
                            .map(action => (
                                <div key={action.id} className="flex justify-between">
                                    <span>{action.label}:</span>
                                    <span className="font-mono font-semibold">{action.shortcut}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
}