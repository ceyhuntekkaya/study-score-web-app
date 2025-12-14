'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { EQuestionTemplateType } from '@/types/exam/exam-type';
import {AnswerInputProps} from "@/types/exam/exam-taking.types";

export function AnswerInput({
                                questionId,
                                questionType,
                                templateData,
                                currentAnswer,
                                onChange,
                                readonly = false,
                                timeLimit
                            }: AnswerInputProps) {
    const [localAnswer, setLocalAnswer] = useState(currentAnswer || '');
    const [wordCount, setWordCount] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced onChange
    const debouncedOnChange = useCallback((value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            onChange(value);
        }, 300);
    }, [onChange]);

    useEffect(() => {
        setLocalAnswer(currentAnswer || '');
    }, [currentAnswer]);

    const handleAnswerChange = useCallback((value: string) => {
        if (readonly) return;
        setLocalAnswer(value);
        debouncedOnChange(value);
    }, [readonly, debouncedOnChange]);

    // Word count calculator
    useEffect(() => {
        const words = localAnswer.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    }, [localAnswer]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const renderMultipleChoice = () => {
        const options = templateData.options as string[] || [];
        const selectedOption = localAnswer ? parseInt(localAnswer) : -1;

        return (
            <div className="space-y-3">
                {options.map((option, index) => (
                    <label
                        key={index}
                        className={`
              flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedOption === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
              ${readonly ? 'cursor-not-allowed opacity-60' : ''}
            `}
                    >
                        <input
                            type="radio"
                            name={`question-${questionId}`}
                            value={index}
                            checked={selectedOption === index}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            disabled={readonly}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                            <div className={`font-medium ${selectedOption === index ? 'text-blue-900' : 'text-gray-900'}`}>
                                {String.fromCharCode(65 + index)}. {option}
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        );
    };

    const renderTrueFalse = () => {
        const selectedAnswer = localAnswer;

        return (
            <div className="space-y-3">
                <label
                    className={`
            flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
            ${selectedAnswer === 'true'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
            ${readonly ? 'cursor-not-allowed opacity-60' : ''}
          `}
                >
                    <input
                        type="radio"
                        name={`question-${questionId}`}
                        value="true"
                        checked={selectedAnswer === 'true'}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        disabled={readonly}
                        className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-lg font-medium ${selectedAnswer === 'true' ? 'text-green-900' : 'text-gray-900'}`}>
              DOĞRU
            </span>
                    </div>
                </label>

                <label
                    className={`
            flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
            ${selectedAnswer === 'false'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
            ${readonly ? 'cursor-not-allowed opacity-60' : ''}
          `}
                >
                    <input
                        type="radio"
                        name={`question-${questionId}`}
                        value="false"
                        checked={selectedAnswer === 'false'}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        disabled={readonly}
                        className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-lg font-medium ${selectedAnswer === 'false' ? 'text-red-900' : 'text-gray-900'}`}>
              YANLIŞ
            </span>
                    </div>
                </label>
            </div>
        );
    };

    const renderFillInTheBlanks = () => {
        const textWithBlanks = templateData.textWithBlanks as string || '';
        const blanks = (textWithBlanks.match(/_+/g) || []).length;
        const answers = localAnswer.split('|');

        const renderTextWithInputs = () => {
            let blankIndex = 0;
            return textWithBlanks.split(/(_+)/).map((part, index) => {
                if (part.match(/^_+$/)) {
                    const currentBlankIndex = blankIndex++;
                    return (
                        <input
                            key={index}
                            type="text"
                            value={answers[currentBlankIndex] || ''}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[currentBlankIndex] = e.target.value;
                                handleAnswerChange(newAnswers.join('|'));
                            }}
                            disabled={readonly}
                            className="inline-block mx-1 px-2 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none focus:border-blue-700 text-center min-w-[80px]"
                            placeholder={`Boşluk ${currentBlankIndex + 1}`}
                        />
                    );
                }
                return <span key={index}>{part}</span>;
            });
        };

        return (
            <div className="space-y-4">
                <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg border">
                    {renderTextWithInputs()}
                </div>

                <div className="text-sm text-gray-600">
                    {blanks} boşluk doldurulacak
                </div>
            </div>
        );
    };

    const renderShortAnswer = () => {
        const maxCharacters = templateData.maxCharacters as number || 500;
        const minCharacters = templateData.minCharacters as number || 10;

        return (
            <div className="space-y-3">
        <textarea
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={readonly}
            maxLength={maxCharacters}
            placeholder="Cevabınızı buraya yazın..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />

                <div className="flex justify-between text-sm">
                    <div className={`${localAnswer.length < minCharacters ? 'text-red-600' : 'text-green-600'}`}>
                        Minimum {minCharacters} karakter
                    </div>
                    <div className={`${localAnswer.length > maxCharacters * 0.9 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {localAnswer.length}/{maxCharacters} karakter
                    </div>
                </div>
            </div>
        );
    };

    const renderEssay = () => {
        const maxWords = templateData.maxWords as number || 500;
        const minWords = templateData.minWords as number || 50;

        return (
            <div className="space-y-3">
        <textarea
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={readonly}
            placeholder="Kompozisyonunuzu buraya yazın..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
        />

                <div className="flex justify-between items-center text-sm">
                    <div className={`${wordCount < minWords ? 'text-red-600' : 'text-green-600'}`}>
                        Minimum {minWords} kelime
                    </div>
                    <div className="flex space-x-4">
                        <div className={`${wordCount > maxWords * 0.9 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {wordCount}/{maxWords} kelime
                        </div>
                        <div className="text-gray-500">
                            {localAnswer.length} karakter
                        </div>
                    </div>
                </div>

                {/* Writing tools */}
                <div className="flex space-x-2 text-xs text-gray-500">
                    <button
                        onClick={() => handleAnswerChange(localAnswer + '\n\n')}
                        disabled={readonly}
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                        Paragraf Ekle
                    </button>
                    <div className="border-l pl-2">
                        Yazı tipi: Times New Roman, 12pt
                    </div>
                </div>
            </div>
        );
    };

    const renderMultipleResponse = () => {
        const options = templateData.options as string[] || [];
        const selectedOptions = localAnswer ? localAnswer.split(',').map(s => parseInt(s)) : [];
        const minSelections = templateData.minSelections as number || 1;
        const maxSelections = templateData.maxSelections as number || options.length;

        const handleOptionChange = (optionIndex: number, isChecked: boolean) => {
            let newSelectedOptions = [...selectedOptions];

            if (isChecked) {
                if (!newSelectedOptions.includes(optionIndex) && newSelectedOptions.length < maxSelections) {
                    newSelectedOptions.push(optionIndex);
                }
            } else {
                newSelectedOptions = newSelectedOptions.filter(idx => idx !== optionIndex);
            }

            handleAnswerChange(newSelectedOptions.join(','));
        };

        return (
            <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                    {minSelections === maxSelections
                        ? `Tam ${minSelections} seçenek işaretleyin`
                        : `${minSelections}-${maxSelections} arasında seçenek işaretleyin`
                    }
                </div>

                {options.map((option, index) => {
                    const isSelected = selectedOptions.includes(index);
                    const canSelect = selectedOptions.length < maxSelections || isSelected;

                    return (
                        <label
                            key={index}
                            className={`
                flex items-start space-x-3 p-3 rounded-lg border-2 transition-all duration-200
                ${isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : canSelect
                                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                            }
                ${readonly ? 'cursor-not-allowed opacity-60' : ''}
              `}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleOptionChange(index, e.target.checked)}
                                disabled={readonly || (!canSelect && !isSelected)}
                                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {String.fromCharCode(65 + index)}. {option}
                                </div>
                            </div>
                        </label>
                    );
                })}

                <div className="text-sm text-gray-600">
                    {selectedOptions.length}/{maxSelections} seçenek işaretlendi
                </div>
            </div>
        );
    };

    const renderMatching = () => {
        const leftItems = templateData.leftItems as string[] || [];
        const rightItems = templateData.rightItems as string[] || [];
        const matches = localAnswer ? JSON.parse(localAnswer) : {};

        const handleMatchChange = (leftIndex: number, rightIndex: number) => {
            const newMatches = { ...matches };

            // Remove existing match for this left item
            delete newMatches[leftIndex];

            // Add new match if rightIndex is valid
            if (rightIndex >= 0) {
                newMatches[leftIndex] = rightIndex;
            }

            handleAnswerChange(JSON.stringify(newMatches));
        };

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                    Sol sütundaki öğeleri sağ sütundaki uygun öğelerle eşleştirin
                </div>

                <div className="space-y-3">
                    {leftItems.map((leftItem, leftIndex) => (
                        <div key={leftIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 font-medium">
                                {leftIndex + 1}. {leftItem}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500">→</span>
                                <select
                                    value={matches[leftIndex] ?? -1}
                                    onChange={(e) => handleMatchChange(leftIndex, parseInt(e.target.value))}
                                    disabled={readonly}
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={-1}>Seçiniz...</option>
                                    {rightItems.map((rightItem, rightIndex) => (
                                        <option key={rightIndex} value={rightIndex}>
                                            {String.fromCharCode(65 + rightIndex)}. {rightItem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-sm text-gray-600">
                    {Object.keys(matches).length}/{leftItems.length} eşleştirme yapıldı
                </div>
            </div>
        );
    };

    const renderOrdering = () => {
        const items = templateData.items as string[] || [];
        const orderedItems = localAnswer ? JSON.parse(localAnswer) : items;

        const moveItem = (fromIndex: number, toIndex: number) => {
            if (readonly) return;
            const newItems = [...orderedItems];
            const [movedItem] = newItems.splice(fromIndex, 1);
            newItems.splice(toIndex, 0, movedItem);
            handleAnswerChange(JSON.stringify(newItems));
        };

        return (
            <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                    Öğeleri doğru sıraya göre düzenleyin (sürükle-bırak veya butonları kullanın)
                </div>

                {orderedItems.map((item: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex flex-col space-y-1">
                            <button
                                onClick={() => moveItem(index, Math.max(0, index - 1))}
                                disabled={readonly || index === 0}
                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                onClick={() => moveItem(index, Math.min(orderedItems.length - 1, index + 1))}
                                disabled={readonly || index === orderedItems.length - 1}
                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold">
                                {index + 1}
                            </div>
                            <div className="font-medium">{item}</div>
                        </div>

                        <div className="text-gray-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderUnsupported = () => (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Desteklenmeyen Soru Tipi
            </h3>
            <p className="text-yellow-700">
                Bu soru tipi ({questionType}) henüz desteklenmiyor.
            </p>
        </div>
    );

    // Render appropriate input based on question type
    const renderInput = () => {
        switch (questionType) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return renderMultipleChoice();
            case EQuestionTemplateType.TRUE_FALSE:
                return renderTrueFalse();
            case EQuestionTemplateType.FILL_IN_THE_BLANKS:
                return renderFillInTheBlanks();
            case EQuestionTemplateType.SHORT_ANSWER:
                return renderShortAnswer();
            case EQuestionTemplateType.ESSAY:
                return renderEssay();
            case EQuestionTemplateType.MULTIPLE_RESPONSE:
                return renderMultipleResponse();
            case EQuestionTemplateType.MATCHING:
                return renderMatching();
            case EQuestionTemplateType.ORDERING:
                return renderOrdering();
            default:
                return renderUnsupported();
        }
    };

    return (
        <div className="space-y-4">
            {renderInput()}

            {/* Time limit indicator */}
            {timeLimit && timeLimit > 0 && (
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Bu soru için {Math.floor(timeLimit / 60)} dakika süre var</span>
                </div>
            )}
        </div>
    );
}