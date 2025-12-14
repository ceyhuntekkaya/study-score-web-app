import React from 'react';
import { useExams } from '@/hooks/exam/use-exam';

type NavigationButtonsProps = {
    onFinish?: () => void;
};

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onFinish }) => {
    const {
        goToNextQuestion,
        goToPreviousQuestion,
        finishExam,
    } = useExams();

    const handleFinish = async () => {
        const confirmed = window.confirm('Sınavı bitirmek istediğinizden emin misiniz?');
        if (confirmed) {
            await finishExam();
            if (onFinish) onFinish();
        }
    };

    return (
        <div className="d-flex justify-content-between mt-4">
            <button
                onClick={goToPreviousQuestion}
                className="btn btn-light shadow-sm"
            >
                Önceki Soru
            </button>

            <div className="d-flex gap-2">
                <button
                    onClick={handleFinish}
                    className="btn btn-danger shadow-sm"
                >
                    Sınavı Bitir
                </button>

                <button
                    onClick={goToNextQuestion}
                    className="btn btn-primary shadow-sm"
                >
                    Sonraki Soru
                </button>
            </div>
        </div>
    )

};