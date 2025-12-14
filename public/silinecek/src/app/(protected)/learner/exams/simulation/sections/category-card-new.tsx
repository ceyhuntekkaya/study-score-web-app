"use client";

import React, { useState, useRef } from "react";
import Card from "../../components/ui/card";

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  isActive: boolean;
  videoUrl?: string;
  description: string;
}

interface CategoryCardProps {
  items: CategoryItem[];
  onItemSelect?: (item: CategoryItem) => void;
}

const CategoryCard = ({ items, onItemSelect }: CategoryCardProps) => {
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoDuration, setVideoDuration] = useState(124);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setVideoWatched(true);
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      const newVolume = volume > 0 ? 0 : 1;
      setVolume(newVolume);
      videoRef.current.volume = newVolume;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * videoDuration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleConfirm = () => {
    if (videoWatched && onItemSelect) {
      const activeItem = items.find((item) => item.isActive);
      if (activeItem) {
        onItemSelect(activeItem);
      }
    }
  };

  const handleItemClick = (item: CategoryItem) => {
    if (item.isActive) {
      alert("IELTS Listening Test başlatılıyor...");
    } else {
      alert(`${item.title} will be available soon!`);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <div
            className={`text-center p-6 transition-all duration-300 ${
              item.isActive
                ? "cursor-pointer hover:bg-gray-50"
                : "cursor-not-allowed"
            }`}
            onClick={() => handleItemClick(item)}
          >
            {/* Header with Icon and Title */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#4ECDC4] rounded-full p-3 mr-3">
                <div className="w-6 h-6 text-white">{item.icon}</div>
              </div>
              <div className="text-left">
                <h2 className="text-xl font-medium text-[#4ECDC4]">
                  {item.title}
                </h2>
                <h3 className="text-lg text-[#4ECDC4]">{item.subtitle}</h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed max-w-xl mx-auto mb-6 text-[#8A8A8A]">
              {item.description}
            </p>

            {/* Video Container */}
            <div className="rounded-lg p-8 mb-8">
              <div
                className="relative bg-[#E8E8E8] rounded-lg overflow-hidden mb-4"
                style={{ aspectRatio: "16/9" }}
              >
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center relative">
                    {/* Loading indicator for active items */}
                    {item.isActive && isLoading && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F0F0] via-[#E0E0E0] to-[#D5D5D5] flex items-center justify-center z-20">
                        <div className="bg-[#4ECDC4] bg-opacity-20 rounded-full p-8">
                          <svg
                            className="w-16 h-16 text-[#4ECDC4] animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Disabled overlay for inactive items */}
                    {!item.isActive && (
                      <div className="absolute inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-20">
                        <div className="text-center">
                          <div className="bg-gray-400 rounded-full p-6 mb-4 mx-auto w-fit">
                            <svg
                              className="w-12 h-12 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                          </div>
                          <p className="text-gray-600 font-medium">
                            Coming Soon
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Play button overlay - only for active items */}
                    {item.isActive && !isPlaying && !isLoading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause();
                        }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
                      >
                        <div className="bg-white bg-opacity-90 rounded-full p-6 hover:bg-opacity-100 transition-all duration-300">
                          <svg
                            className="w-12 h-12 text-[#4ECDC4]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    )}

                    {/* Video Player - only for active items */}
                    {item.isActive && item.videoUrl && (
                      <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        onEnded={handleVideoEnded}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onLoadStart={() => setIsLoading(true)}
                        onCanPlay={() => setIsLoading(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        controls={false}
                        preload="metadata"
                        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzRFQ0RDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPklFTFRTIFR1dG9yaWFsPC90ZXh0Pgo8L3N2Zz4="
                      >
                        <source src={item.videoUrl} type="video/mp4" />
                        <source
                          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                          type="video/mp4"
                        />
                        Video tarayıcınız tarafından desteklenmiyor.
                      </video>
                    )}

                    {/* Static poster for disabled items */}
                    {!item.isActive && (
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzRFQ0RDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPklFTFRTIFR1dG9yaWFsPC90ZXh0Pgo8L3N2Zz4=")`,
                        }}
                      />
                    )}
                  </div>

                  {/* Custom Controls - only for active items */}
                  {item.isActive && (
                    <div className="bg-[#2A2A2A] h-12 flex items-center px-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause();
                        }}
                        className="text-white hover:text-gray-300 mr-4"
                      >
                        {isPlaying ? (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>

                      <span className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(videoDuration)}
                      </span>

                      <div
                        className="flex-1 mx-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProgressClick(e);
                        }}
                      >
                        <div className="bg-gray-600 h-1 rounded-full overflow-hidden hover:h-2 transition-all duration-200">
                          <div
                            className="bg-white h-full transition-all duration-300"
                            style={{
                              width: `${(currentTime / videoDuration) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVolumeChange();
                          }}
                          className="text-white hover:text-gray-300"
                        >
                          {volume > 0 ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Static controls bar for disabled items */}
                  {!item.isActive && (
                    <div className="bg-gray-400 h-12 flex items-center px-4 relative opacity-50">
                      <button className="text-white mr-4" disabled>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <span className="text-white text-sm font-mono">
                        0:00 / 2:04
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-600 h-1 rounded-full overflow-hidden">
                          <div className="bg-white h-full w-0"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="text-white" disabled>
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-medium text-[#4ECDC4] mb-1">
                  IELTS Tutorial 2
                </h3>
                <h4 className="text-lg text-[#4ECDC4]">{item.subtitle}</h4>
              </div>
            </div>

            {/* Confirm Button - only for active items */}
            {item.isActive && (
              <div className="text-center mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirm();
                  }}
                  disabled={!videoWatched}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                    videoWatched
                      ? "bg-[#4ECDC4] text-white hover:bg-[#3DBDB6] shadow-md"
                      : "bg-[#CCCCCC] text-[#888888] cursor-not-allowed"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Confirm
                  </span>
                </button>
              </div>
            )}

            {/* Status Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  item.isActive
                    ? "bg-[#4ECDC4] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {item.isActive ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Available
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Coming Soon
                  </>
                )}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CategoryCard;
