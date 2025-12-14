'use client';


import {QuestionNavigationInfo} from "@/types/exam/exam-taking.types";

interface QuestionNavigationProps {
    navigationInfo: QuestionNavigationInfo;
    onPrevious: () => void;
    onNext: () => void;
    onGoToQuestion?: (questionNumber: number) => void;
    showQuestionJumper?: boolean;
    showProgress?: boolean;
    allowBackNavigation?: boolean;
    allowSkipping?: boolean;
    size?: 'small' | 'medium' | 'large';
    position?: 'top' | 'bottom' | 'inline';
    className?: string;
}

export function QuestionNavigation({
                                       navigationInfo,
                                       onPrevious,
                                       onNext,
                                       onGoToQuestion,
                                       showQuestionJumper = true,
                                       showProgress = true,
                                       allowBackNavigation = true,
                                       allowSkipping = true,
                                       size = 'medium',
                                       position = 'bottom',
                                       className = ''
                                   }: QuestionNavigationProps) {
    const { current, total, hasNext, hasPrevious } = navigationInfo;

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'p-2',
                    button: 'px-3 py-1 text-sm',
                    text: 'text-sm',
                    input: 'w-16 px-2 py-1 text-sm'
                };
            case 'large':
                return {
                    container: 'p-4',
                    button: 'px-6 py-3 text-lg',
                    text: 'text-lg',
                    input: 'w-20 px-3 py-2 text-lg'
                };
            default: // medium
                return {
                    container: 'p-3',
                    button: 'px-4 py-2 text-base',
                    text: 'text-base',
                    input: 'w-18 px-3 py-2 text-base'
                };
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'border-b bg-white sticky top-0 z-30';
            case 'bottom':
                return 'border-t bg-white sticky bottom-0 z-30';
            default: // inline
                return 'border bg-gray-50 rounded-lg';
        }
    };

    const sizeClasses = getSizeClasses();
    const positionClasses = getPositionClasses();

    const handleQuestionJump = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const questionNumber = parseInt(formData.get('questionNumber') as string);

        if (questionNumber >= 1 && questionNumber <= total && onGoToQuestion) {
            onGoToQuestion(questionNumber);
        }
    };

    const getProgressPercentage = () => {
        return (current / total) * 100;
    };

    return (
        <div className={`${positionClasses} ${className}`}>
            <div className={`${sizeClasses.container} flex items-center justify-between`}>
                {/* Left: Previous Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={onPrevious}
                        disabled={!hasPrevious || !allowBackNavigation}
                        className={`
              ${sizeClasses.button}
              ${(!hasPrevious || !allowBackNavigation)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-gray-300 hover:border-blue-300'
                        }
              border rounded-lg font-medium transition-all duration-200
              flex items-center space-x-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            `}
                        title={!allowBackNavigation ? 'Geri gitmek izin verilmiyor' : 'Önceki soru'}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Önceki</span>
                    </button>
                </div>

                {/* Center: Question Info and Progress */}
                <div className="flex-1 flex flex-col items-center space-y-2">
                    {/* Question Counter */}
                    <div className="flex items-center space-x-4">
            <span className={`${sizeClasses.text} font-semibold text-gray-800`}>
              Soru {current} / {total}
            </span>

                        {/* Question Jumper */}
                        {showQuestionJumper && onGoToQuestion && (
                            <form onSubmit={handleQuestionJump} className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Git:</span>
                                <input
                                    type="number"
                                    name="questionNumber"
                                    min="1"
                                    max={total}
                                    defaultValue={current}
                                    className={`
                    ${sizeClasses.input}
                    border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-center
                  `}
                                    title="Soru numarası girin"
                                />
                                <button
                                    type="submit"
                                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                                    title="Belirtilen soruya git"
                                >
                                    Git
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {showProgress && (
                        <div className="w-full max-w-md">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>Başlangıç</span>
                                <span>{Math.round(getProgressPercentage())}% tamamlandı</span>
                                <span>Son</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Next Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={onNext}
                        disabled={!hasNext && !allowSkipping}
                        className={`
              ${sizeClasses.button}
              ${(!hasNext && !allowSkipping)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : hasNext
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }
              border rounded-lg font-medium transition-all duration-200
              flex items-center space-x-2
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${hasNext ? 'focus:ring-blue-500' : 'focus:ring-green-500'}
            `}
                        title={
                            !hasNext && !allowSkipping
                                ? 'Son soru'
                                : hasNext
                                    ? 'Sonraki soru'
                                    : 'Sınavı tamamla'
                        }
                    >
                        <span>{hasNext ? 'Sonraki' : 'Tamamla'}</span>
                        {hasNext ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Additional Navigation Info */}
            <div className="px-3 py-2 bg-gray-50 border-t text-center">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    {!allowBackNavigation && (
                        <div className="flex items-center space-x-1 text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Geri dönüş izin verilmiyor</span>
                        </div>
                    )}

                    {!allowSkipping && (
                        <div className="flex items-center space-x-1 text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Soru atlama izin verilmiyor</span>
                        </div>
                    )}

                    <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Klavye: ←/→ ok tuşları ile gezinebilirsiniz</span>
                    </div>
                </div>
            </div>
        </div>
    );
}