
type ExamResultsProps = {
    name: string;
};

export const QuestionContent: React.FC<ExamResultsProps> = ({
                                                               name
                                                           }) => {


    return (
        <div className="mb-5">
            {name}
        </div>
    );
};

/*


// components/exam/QuestionContent.tsx
import React from 'react';
import { EMediaType } from '@/types/enumeration';
import { QuestionContentSection } from '@/types/exam/question-content-section';

type QuestionContentProps = {
    contentSections: QuestionContentSection[];
};

export const QuestionContent: React.FC<QuestionContentProps> = ({ contentSections }) => {
    // İçerik bölümlerini sırala
    const sortedSections = [...contentSections].sort((a, b) =>
        (a.orderNumber || 0) - (b.orderNumber || 0)
    );

    const renderContentSection = (section: QuestionContentSection) => {
        switch (section.mediaType) {
            case EMediaType.TEXT:
                return (
                    <div className="prose prose-lg max-w-none"
                         dangerouslySetInnerHTML={{ __html: section.content }} />
                );

            case EMediaType.IMAGE:
                return (
                    <div className="my-4">
                        <img
                            src={section.url+'' || (section.file?.url+'' || '')}
                            alt="Question image"
                            className="max-w-full rounded-lg shadow-sm"
                        />
                    </div>
                );

            case EMediaType.AUDIO:
                return (
                    <div className="my-4">
                        <audio
                            controls
                            className="w-full"
                            src={section.url+'' || (section.file?.url+'' || '')}
                        >
                            Your browser does not support the audio element.
                        </audio>
                        {section.repeatCount && section.repeatCount > 1 && (
                            <div className="text-sm text-gray-600 mt-1">
                                Bu ses {section.repeatCount} kez tekrarlanacaktır.
                            </div>
                        )}
                    </div>
                );

            case EMediaType.VIDEO:
                return (
                    <div className="my-4">
                        <video
                            controls
                            className="w-full rounded-lg shadow-sm"
                            src={section.url+'' || (section.file?.url+'' || '')}
                        >
                            Your browser does not support the video element.
                        </video>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {sortedSections.map((section) => (
                <div key={section.id} className="mb-4">
                    {renderContentSection(section)}
                </div>
            ))}
        </div>
    );
};

 */