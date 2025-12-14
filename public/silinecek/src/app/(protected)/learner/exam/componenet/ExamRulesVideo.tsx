import { useState, useRef, useEffect } from 'react';

interface ExamRulesVideoProps {
    examId: string;
    onComplete: () => void;
    onProgress: (progress: number) => void;
}

export function ExamRulesVideo({ examId, onComplete, onProgress }: ExamRulesVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [watchedPercentage, setWatchedPercentage] = useState(0);

    console.log("Ceyhun ExamRulesVideo component rendered with examId:", examId);

    // Demo video URL - replace with actual video URL
    const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const current = video.currentTime;
            const total = video.duration;

            setCurrentTime(current);
            setProgress((current / total) * 100);

            const watchedPercent = Math.round((current / total) * 100);
            setWatchedPercentage(watchedPercent);
            onProgress(watchedPercent);

            // Consider video completed if watched 95% or more
            if (watchedPercent >= 95 && !isCompleted) {
                setIsCompleted(true);
                onComplete();
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handlePlay = () => {
            setIsPlaying(true);
            if (!hasStarted) {
                setHasStarted(true);
            }
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setIsCompleted(true);
            onComplete();
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
        };
    }, [onComplete, onProgress]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const seekTime = (parseFloat(e.target.value) / 100) * duration;
        video.currentTime = seekTime;
    };

    const handleSpeedChange = (speed: number) => {
        const video = videoRef.current;
        if (!video) return;

        setPlaybackSpeed(speed);
        video.playbackRate = speed;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = parseFloat(e.target.value) / 100;
        setVolume(newVolume);
        video.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            const restoreVolume = volume === 0 ? 0.5 : volume;
            video.volume = restoreVolume;
            setVolume(restoreVolume);
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getRequiredWatchTime = () => {
        return Math.ceil(duration * 0.95);
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
            {/* Video Player */}
            <div className="relative">
                <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    src={videoUrl}
                    preload="metadata"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Tarayıcınız video oynatmayı desteklemiyor.
                </video>

                {/* Video Overlay */}
                {!hasStarted && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <button
                            onClick={togglePlay}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Progress Indicator */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    {watchedPercentage}% izlendi
                </div>

                {/* Completion Badge */}
                {isCompleted && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Tamamlandı
                    </div>
                )}
            </div>

            {/* Video Controls */}
            <div className="bg-gray-800 text-white p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progress}%, #4B5563 ${progress}%, #4B5563 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="hover:text-blue-400 transition-colors"
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* Volume Control */}
                        <div className="flex items-center space-x-2">
                            <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                                {isMuted || volume === 0 ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.842 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.842l3.541-3.824a1 1 0 011.617.824zM18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1.414 0L7.172 7.414a1 1 0 101.414 1.414L10 7.414l1.414 1.414a1 1 0 001.414-1.414L11.414 6z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.842 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.842l3.541-3.824a1 1 0 011.617.824zM12.025 7.05a.75.75 0 011.06.02 3.5 3.5 0 010 4.86.75.75 0 11-1.08-1.04 2 2 0 000-2.84.75.75 0 01.02-1.06zm2.78-2.78a.75.75 0 011.06.02 7 7 0 010 9.78.75.75 0 11-1.08-1.04 5.5 5.5 0 000-7.7.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={isMuted ? 0 : Math.round(volume * 100)}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Playback Speed */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Hız:</span>
                            <select
                                value={playbackSpeed}
                                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border-none outline-none"
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={0.75}>0.75x</option>
                                <option value={1}>1x</option>
                                <option value={1.25}>1.25x</option>
                                <option value={1.5}>1.5x</option>
                                <option value={2}>2x</option>
                            </select>
                        </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
                    </div>
                </div>
            </div>

            {/* Video Information */}
            <div className="bg-white border-t p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Sınav Kuralları ve Yönergeleri
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Bu video sınavla ilgili önemli kuralları ve prosedürleri açıklamaktadır.
                            Lütfen videoyu baştan sona dikkatle izleyin.
                        </p>

                        {/* Video Topics */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>• Kimlik doğrulama prosedürü</div>
                            <div>• Sınav sırasında yapılabilecekler</div>
                            <div>• Teknik sorun durumları</div>
                            <div>• Yasak davranışlar</div>
                            <div>• Güvenlik önlemleri</div>
                            <div>• Sonuç değerlendirme süreci</div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                            İzleme İlerlemesi
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            {watchedPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                            Min. %95 gerekli
                        </div>
                    </div>
                </div>

                {/* Progress Requirements */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            {watchedPercentage >= 95 ? (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className={watchedPercentage >= 95 ? 'text-green-700' : 'text-gray-600'}>
                {watchedPercentage >= 95 ? 'Video başarıyla tamamlandı' : 'Videoyu %95 oranında izlemelisiniz'}
              </span>
                        </div>

                        <div className="text-gray-500">
                            Kalan süre: {formatTime(Math.max(0, getRequiredWatchTime() - currentTime))}
                        </div>
                    </div>
                </div>

                {/* Completion Status */}
                {isCompleted && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-green-800 font-medium">
                Harika! Video kurallarını başarıyla tamamladınız. Artık yazılı kurallara geçebilirsiniz.
              </span>
                        </div>
                    </div>
                )}

                {/* Warning for incomplete viewing */}
                {hasStarted && !isCompleted && watchedPercentage < 95 && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-yellow-800">
                Lütfen videoyu {95 - watchedPercentage}% daha izleyin.
                Video atlama veya hızlı sarma işlemleri tamamlanma oranını etkilemez.
              </span>
                        </div>
                    </div>
                )}

                {/* Video Features */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                        <div>• Video kalitesi otomatik olarak internet hızınıza göre ayarlanır</div>
                        <div>• Videoyu duraklatabilir ve kaldığınız yerden devam edebilirsiniz</div>
                        <div>• Oynatma hızını değiştirebilirsiniz (0.5x - 2x)</div>
                        <div>• Ses seviyesini ayarlayabilir veya sessize alabilirsiniz</div>
                        <div>• Video indirme ve ekran görüntüsü alma işlemleri devre dışıdır</div>
                    </div>
                </div>
            </div>
        </div>
    );
}