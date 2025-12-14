import { ExamDto, ExamReadyDto } from '@/types/exam/exam-type';
import { ECourseCategory } from '@/types/enumeration';

interface ExamInfoCardProps {
    exam: ExamDto;
    examReady: ExamReadyDto;
}

export function ExamInfoCard({ exam, examReady }: ExamInfoCardProps) {
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} saat ${mins} dakika`;
        }
        return `${mins} dakika`;
    };

    const getCategoryName = (category: ECourseCategory) => {
        const categoryNames = {
            [ECourseCategory.IELTS]: 'IELTS',
            [ECourseCategory.TOEFL]: 'TOEFL',

        };
        return categoryNames[category] || category;
    };

    const getQuestionTypeDistribution = () => {
        const distribution: { [key: string]: number } = {};

        examReady.questions.forEach(question => {
            const type = question.questionType;
            distribution[type] = (distribution[type] || 0) + 1;
        });

        return distribution;
    };

    const questionTypes = getQuestionTypeDistribution();

    const getQuestionTypeName = (type: string) => {
        const typeNames: { [key: string]: string } = {
            'MULTIPLE_CHOICE': 'Çoktan Seçmeli',
            'TRUE_FALSE': 'Doğru/Yanlış',
            'FILL_IN_THE_BLANKS': 'Boşluk Doldurma',
            'SHORT_ANSWER': 'Kısa Cevap',
            'MATCHING': 'Eşleştirme',
            'ESSAY': 'Kompozisyon',
            'ORDERING': 'Sıralama',
            'MULTIPLE_RESPONSE': 'Çoklu Seçim',
            'HOT_SPOT': 'Nokta Belirleme',
            'DRAG_AND_DROP': 'Sürükle Bırak',
            'AUDIO_RESPONSE': 'Ses Kaydı',
            'VIDEO_RESPONSE': 'Video Kaydı',
            'IMAGE_RESPONSE': 'Resim Yükleme'
        };
        return typeNames[type] || type;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Sınav Detayları
                </h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column - Basic Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Kategori</div>
                                <div className="font-medium text-gray-900">
                                    {getCategoryName(exam.category)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Süre</div>
                                <div className="font-medium text-gray-900">
                                    {formatDuration(Math.floor(examReady.estimatedDuration / 60))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Toplam Soru</div>
                                <div className="font-medium text-gray-900">
                                    {examReady.totalQuestions} soru
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Toplam Puan</div>
                                <div className="font-medium text-gray-900">
                                    {examReady.totalPoints} puan
                                </div>
                            </div>
                        </div>

                        {exam.level && (
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Seviye</div>
                                    <div className="font-medium text-gray-900">
                                        {exam.level}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Question Types */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Soru Türleri</h4>
                        <div className="space-y-3">
                            {Object.entries(questionTypes).map(([type, count]) => (
                                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {getQuestionTypeName(type)}
                  </span>
                                    <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(count / examReady.totalQuestions) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Parts Information */}
                {examReady.examParts && examReady.examParts.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Sınav Bölümleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {examReady.examParts.map((part, index) => (
                                <div key={part.id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-gray-900">
                                            {part.orderNumber || index + 1}. {part.name}
                                        </h5>
                                        {part.skill && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {part.skill === 'READING' ? 'Okuma' : 'Yazma'}
                      </span>
                                        )}
                                    </div>
                                    {part.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                            {part.description}
                                        </p>
                                    )}
                                    <div className="text-xs text-gray-500">
                                        {examReady.questions.filter(q => q.examPart.id === part.id).length} soru
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Success Criteria */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">
                            Başarı Kriterleri
                        </h4>
                        <p className="text-sm text-blue-800">
                            Sınavı başarıyla tamamlamak için minimum gereksinimleri yerine getirmelisiniz.
                            Detaylı bilgi için sınav kurallarını inceleyin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}