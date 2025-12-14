"use client";

import React, { useState, useRef } from "react";
import Card from "../../components/ui/card";

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  isActive: boolean;
  videoUrl: string;
  description: string;
  route: string;
}

interface CategoryCardProps {
  items: CategoryItem[];
  onItemSelect?: (item: CategoryItem) => void;
}

interface VideoState {
  videoWatched: boolean;
  videoDuration: number;
  currentTime: number;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
}

const CategoryCard = ({ items, onItemSelect }: CategoryCardProps) => {
  // Separate state for each video
  const [videoStates, setVideoStates] = useState<Record<string, VideoState>>(
    () => {
      const initialStates: Record<string, VideoState> = {};
      items.forEach((item) => {
        initialStates[item.id] = {
          videoWatched: false,
          videoDuration: 0,
          currentTime: 0,
          isPlaying: false,
          isLoading: true,
          volume: 1,
        };
      });
      return initialStates;
    }
  );

  // Separate video refs for each video
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Color schemes for different categories
  const getCategoryColors = (id: string, isActive: boolean) => {
    const colorSchemes = {
      listening: {
        primary: isActive ? "#4ECDC4" : "#B0D4D1",
        secondary: isActive ? "#3DBDB6" : "#9FCAC7",
        text: isActive ? "#4ECDC4" : "#B0D4D1",
      },
      reading: {
        primary: isActive ? "#7CB342" : "#B8D4A3",
        secondary: isActive ? "#689F38" : "#A8C792",
        text: isActive ? "#7CB342" : "#B8D4A3",
      },
      writing: {
        primary: isActive ? "#FF9800" : "#FFD4A3",
        secondary: isActive ? "#F57C00" : "#FFCA92",
        text: isActive ? "#FF9800" : "#FFD4A3",
      },
      speaking: {
        primary: isActive ? "#E91E63" : "#F8A5C2",
        secondary: isActive ? "#C2185B" : "#F592B8",
        text: isActive ? "#E91E63" : "#F8A5C2",
      },
    };
    return (
      colorSchemes[id as keyof typeof colorSchemes] || colorSchemes.listening
    );
  };

  const getTutorialNumber = (id: string) => {
    const numbers = {
      listening: "2",
      reading: "3",
      writing: "3",
      speaking: "4",
    };
    return numbers[id as keyof typeof numbers] || "2";
  };

  // Update video state for specific category
  const updateVideoState = (
    categoryId: string,
    updates: Partial<VideoState>
  ) => {
    setVideoStates((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], ...updates },
    }));
  };

  // Video event handlers for each category
  const handleVideoEnded = (categoryId: string) => {
    updateVideoState(categoryId, { videoWatched: true, isPlaying: false });
  };

  const handleTimeUpdate = (categoryId: string) => {
    const videoElement = videoRefs.current[categoryId];
    if (videoElement) {
      const current = videoElement.currentTime;
      const duration = videoElement.duration;

      // Update current time always
      updateVideoState(categoryId, { currentTime: current });

      // If duration wasn't set before, try to set it now
      const currentState = videoStates[categoryId];
      if (
        (!currentState.videoDuration || currentState.videoDuration === 0) &&
        duration &&
        !isNaN(duration) &&
        isFinite(duration)
      ) {
        updateVideoState(categoryId, {
          videoDuration: duration,
          currentTime: current,
        });
      }

      // Video tam %100 bittiğinde watched olarak işaretle
      if (duration > 0 && current >= duration - 0.1) {
        updateVideoState(categoryId, { videoWatched: true });
      }
    }
  };

  const handleLoadedMetadata = (categoryId: string) => {
    const videoElement = videoRefs.current[categoryId];
    if (videoElement) {
      // Ensure video is ready and visible
      videoElement.style.visibility = "visible";

      // Force duration update
      const duration = videoElement.duration;
      console.log(`Video ${categoryId} duration:`, duration);

      if (duration && !isNaN(duration) && isFinite(duration)) {
        updateVideoState(categoryId, {
          videoDuration: duration,
          isLoading: false,
        });
      } else {
        // If duration is not available, try to get it later
        setTimeout(() => {
          const newDuration = videoElement.duration;
          if (newDuration && !isNaN(newDuration) && isFinite(newDuration)) {
            updateVideoState(categoryId, {
              videoDuration: newDuration,
              isLoading: false,
            });
          }
        }, 500);
      }
    }
  };

  const handlePlayPause = async (categoryId: string) => {
    const videoElement = videoRefs.current[categoryId];
    const currentState = videoStates[categoryId];

    if (videoElement) {
      try {
        if (currentState.isPlaying) {
          videoElement.pause();
          updateVideoState(categoryId, { isPlaying: false });
        } else {
          // Force all visibility styles before playing
          videoElement.style.display = "block";
          videoElement.style.visibility = "visible";
          videoElement.style.opacity = "1";
          videoElement.style.position = "absolute";
          videoElement.style.top = "0";
          videoElement.style.left = "0";
          videoElement.style.width = "100%";
          videoElement.style.height = "100%";
          videoElement.style.objectFit = "cover";
          videoElement.style.zIndex = "1";
          videoElement.style.backgroundColor = "#000";

          // Force a layout recalculation
          void videoElement.offsetHeight;

          // Ensure video is loaded
          if (videoElement.readyState < 3) {
            videoElement.load();
          }

          await videoElement.play();
          updateVideoState(categoryId, { isPlaying: true });
        }
      } catch (error) {
        console.error("Video play failed:", error);
        // Try to reload and play again
        try {
          videoElement.load();
          setTimeout(async () => {
            try {
              await videoElement.play();
              updateVideoState(categoryId, { isPlaying: true });
            } catch (retryError) {
              console.error("Retry failed:", retryError);
            }
          }, 100);
        } catch (loadError) {
          console.error("Video load failed:", loadError);
        }
      }
    }
  };

  const handleVolumeChange = (categoryId: string) => {
    const videoElement = videoRefs.current[categoryId];
    const currentState = videoStates[categoryId];

    if (videoElement) {
      const newVolume = currentState.volume > 0 ? 0 : 1;
      updateVideoState(categoryId, { volume: newVolume });
      videoElement.volume = newVolume;
    }
  };

  const handleProgressClick = (
    categoryId: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const videoElement = videoRefs.current[categoryId];
    const currentState = videoStates[categoryId];

    if (videoElement && currentState.videoDuration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * currentState.videoDuration;

      // Ensure time is within bounds
      const clampedTime = Math.max(
        0,
        Math.min(newTime, currentState.videoDuration)
      );

      console.log(`Seeking to: ${clampedTime} / ${currentState.videoDuration}`);

      // Force all visibility styles
      videoElement.style.display = "block";
      videoElement.style.visibility = "visible";
      videoElement.style.opacity = "1";
      videoElement.style.position = "absolute";
      videoElement.style.top = "0";
      videoElement.style.left = "0";
      videoElement.style.width = "100%";
      videoElement.style.height = "100%";
      videoElement.style.objectFit = "cover";
      videoElement.style.zIndex = "1";

      try {
        videoElement.currentTime = clampedTime;
        updateVideoState(categoryId, { currentTime: clampedTime });
      } catch (error) {
        console.error("Error setting currentTime:", error);
      }

      // Progress bar ile video sonuna gidilirse watched olarak işaretle
      if (
        currentState.videoDuration > 0 &&
        clampedTime >= currentState.videoDuration - 0.1
      ) {
        updateVideoState(categoryId, { videoWatched: true });
      }

      // Force multiple repaints
      void videoElement.offsetHeight; // Trigger reflow
      requestAnimationFrame(() => {
        videoElement.style.transform = "translateZ(0)"; // Force GPU acceleration
        requestAnimationFrame(() => {
          videoElement.style.transform = "";
        });
      });
    } else {
      console.warn(`Cannot seek - duration: ${currentState.videoDuration}`);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) {
      return "0:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isVideoCompleted = (categoryId: string) => {
    const videoElement = videoRefs.current[categoryId];
    const currentState = videoStates[categoryId];

    return (
      currentState.videoWatched ||
      (videoElement &&
        videoElement.duration > 0 &&
        videoElement.currentTime >= videoElement.duration - 0.1)
    );
  };

  const handleConfirm = (item: CategoryItem) => {
    if (!isVideoCompleted(item.id)) {
      alert("Lütfen videoyu tamamen izledikten sonra devam edin.");
      return;
    }

    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const colors = getCategoryColors(item.id, item.isActive);
        const tutorialNumber = getTutorialNumber(item.id);
        const currentState = videoStates[item.id];

        return (
          <Card key={item.id}>
            <div
              className={`text-center p-5 transition-all duration-300 bg-white ${
                item.isActive ? "shadow-md" : "cursor-not-allowed opacity-75"
              }`}
            >
              {/* Header with Icon and Title */}
              <div className="flex items-center justify-center mb-5">
                <div
                  className="rounded-full p-4 mr-4"
                  style={{ backgroundColor: colors.primary }}
                >
                  <div className="w-8 h-8 text-white">{item.icon}</div>
                </div>
                <div className="text-left">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: colors.text }}
                  >
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-sm leading-relaxed max-w-3xl mx-auto mb-5 ${
                  item.isActive ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {item.description}
              </p>

              {/* Video Container */}
              <div className="rounded-xl p-3.5 mb-5 bg-gray-50">
                <div
                  className="relative bg-white rounded-xl overflow-hidden shadow-sm mb-5"
                  style={{
                    aspectRatio: "16/9",
                    position: "relative",
                    zIndex: 0,
                  }}
                >
                  <div
                    className="absolute inset-0 flex flex-col"
                    style={{ zIndex: 0 }}
                  >
                    <div
                      className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                      style={{ position: "relative", zIndex: 0 }}
                      onClick={(e) => {
                        if (item.isActive && !currentState.isLoading) {
                          e.stopPropagation();
                          handlePlayPause(item.id);
                        }
                      }}
                    >
                      {/* Video Content or Placeholder - only show tutorial info for disabled items */}
                      {!item.isActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div
                              className="rounded-full p-6 mb-4 mx-auto w-fit shadow-lg"
                              style={{ backgroundColor: colors.primary }}
                            >
                              <div className="w-12 h-12 text-white">
                                {item.icon}
                              </div>
                            </div>
                            <h3
                              className="text-xl font-medium mb-2"
                              style={{ color: colors.text }}
                            >
                              IELTS Tutorial {tutorialNumber}
                            </h3>
                            <h4
                              className="text-lg"
                              style={{ color: colors.text }}
                            >
                              {item.subtitle}
                            </h4>
                          </div>
                        </div>
                      )}

                      {/* Disabled overlay for inactive items */}
                      {!item.isActive && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                          <div className="text-center">
                            <div
                              className="rounded-full p-4 mb-3 mx-auto w-fit opacity-60"
                              style={{ backgroundColor: colors.primary }}
                            >
                              <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loading indicator for active items */}
                      {item.isActive && currentState.isLoading && (
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-[20]"
                          style={{ zIndex: 20 }}
                        >
                          <div
                            className="bg-opacity-20 rounded-full p-8"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <svg
                              className="w-16 h-16 animate-pulse"
                              style={{ color: colors.primary }}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Play button overlay - only for active items */}
                      {item.isActive &&
                        !currentState.isPlaying &&
                        !currentState.isLoading && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPause(item.id);
                            }}
                            className="absolute inset-0 z-[10] flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
                            style={{ zIndex: 10 }}
                          >
                            <div className="bg-white bg-opacity-95 rounded-full p-6 hover:bg-opacity-100 transition-all duration-300 shadow-lg">
                              <svg
                                className="w-12 h-12"
                                style={{ color: colors.primary }}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </button>
                        )}

                      {/* Video Player - only for active items */}
                      {item.isActive && (
                        <video
                          ref={(el) => {
                            if (el) {
                              videoRefs.current[item.id] = el;
                              // Force immediate visibility setup
                              el.style.position = "absolute";
                              el.style.top = "0";
                              el.style.left = "0";
                              el.style.width = "100%";
                              el.style.height = "100%";
                              el.style.objectFit = "cover";
                              el.style.zIndex = "1";
                              el.style.backgroundColor = "#000";
                            }
                          }}
                          className="absolute inset-0 w-full h-full object-cover z-[1]"
                          onEnded={() => handleVideoEnded(item.id)}
                          onTimeUpdate={() => handleTimeUpdate(item.id)}
                          onLoadedMetadata={() => handleLoadedMetadata(item.id)}
                          onDurationChange={(e) => {
                            // Duration changed event
                            const videoElement = e.target as HTMLVideoElement;
                            const duration = videoElement.duration;
                            if (
                              duration &&
                              !isNaN(duration) &&
                              isFinite(duration)
                            ) {
                              updateVideoState(item.id, {
                                videoDuration: duration,
                              });
                              console.log(
                                `Duration changed for ${item.id}:`,
                                duration
                              );
                            }
                          }}
                          onLoadStart={() =>
                            updateVideoState(item.id, { isLoading: true })
                          }
                          onCanPlay={() => {
                            updateVideoState(item.id, { isLoading: false });
                            // Force visibility when ready to play
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              videoElement.style.display = "block";
                              videoElement.style.visibility = "visible";
                              videoElement.style.opacity = "1";

                              // Check duration again
                              const duration = videoElement.duration;
                              if (
                                duration &&
                                !isNaN(duration) &&
                                isFinite(duration)
                              ) {
                                updateVideoState(item.id, {
                                  videoDuration: duration,
                                });
                              }
                            }
                          }}
                          onCanPlayThrough={() => {
                            // Video can play through without stopping
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              const duration = videoElement.duration;
                              if (
                                duration &&
                                !isNaN(duration) &&
                                isFinite(duration)
                              ) {
                                updateVideoState(item.id, {
                                  videoDuration: duration,
                                  isLoading: false,
                                });
                              }
                            }
                          }}
                          onPlay={() => {
                            updateVideoState(item.id, { isPlaying: true });
                            // Ensure video is visible when playing
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              videoElement.style.display = "block";
                              videoElement.style.visibility = "visible";
                              videoElement.style.opacity = "1";
                              videoElement.style.zIndex = "1";
                            }
                          }}
                          onPause={() =>
                            updateVideoState(item.id, { isPlaying: false })
                          }
                          onLoadedData={() => {
                            // Video loaded and ready to play
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              videoElement.style.display = "block";
                              videoElement.style.visibility = "visible";
                              videoElement.style.opacity = "1";

                              // Force duration check
                              const duration = videoElement.duration;
                              if (
                                duration &&
                                !isNaN(duration) &&
                                isFinite(duration)
                              ) {
                                updateVideoState(item.id, {
                                  videoDuration: duration,
                                });
                              }
                            }
                          }}
                          onWaiting={() => {
                            // Video is buffering
                            updateVideoState(item.id, { isLoading: true });
                          }}
                          onPlaying={() => {
                            // Video started playing
                            updateVideoState(item.id, {
                              isLoading: false,
                              isPlaying: true,
                            });
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              videoElement.style.display = "block";
                              videoElement.style.visibility = "visible";
                              videoElement.style.opacity = "1";
                            }
                          }}
                          onSeeking={() => {
                            // User is seeking
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              updateVideoState(item.id, {
                                currentTime: videoElement.currentTime,
                              });
                            }
                          }}
                          onSeeked={() => {
                            // Seeking completed
                            const videoElement = videoRefs.current[item.id];
                            if (videoElement) {
                              updateVideoState(item.id, {
                                currentTime: videoElement.currentTime,
                              });
                            }
                          }}
                          controls={false}
                          preload="auto"
                          playsInline
                          webkit-playsinline="true"
                          muted={currentState.volume === 0}
                          style={{
                            display: "block",
                            visibility: "visible",
                            opacity: 1,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            zIndex: 1,
                            backgroundColor: "#000",
                          }}
                        >
                          <source src={item.videoUrl} type="video/mp4" />
                          Video tarayıcınız tarafından desteklenmiyor.
                        </video>
                      )}
                    </div>

                    {/* Custom Controls - only for active items */}
                    {item.isActive && (
                      <div
                        className="h-12 flex items-center px-4 relative"
                        style={{ backgroundColor: "#2A2A2A" }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(item.id);
                          }}
                          className="text-white hover:text-gray-300 mr-4 cursor-pointer"
                        >
                          {currentState.isPlaying ? (
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
                          {formatTime(currentState.currentTime)} /{" "}
                          {formatTime(currentState.videoDuration)}
                        </span>

                        <div
                          className={`flex-1 mx-4 ${
                            currentState.videoDuration > 0
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentState.videoDuration > 0) {
                              handleProgressClick(item.id, e);
                            }
                          }}
                        >
                          <div className="bg-gray-600 h-1 rounded-full overflow-hidden hover:h-2 transition-all duration-200">
                            <div
                              className="bg-white h-full transition-all duration-300"
                              style={{
                                width: `${
                                  currentState.videoDuration > 0
                                    ? Math.min(
                                        100,
                                        Math.max(
                                          0,
                                          (currentState.currentTime /
                                            currentState.videoDuration) *
                                            100
                                        )
                                      )
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVolumeChange(item.id);
                            }}
                            className="text-white hover:text-gray-300 cursor-pointer"
                          >
                            {currentState.volume > 0 ? (
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
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-white hover:text-gray-300 cursor-pointer"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-white hover:text-gray-300 cursor-pointer"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Static controls bar for disabled items */}
                    {!item.isActive && (
                      <div className="bg-gray-300 h-12 flex items-center px-4 relative opacity-60">
                        <button
                          className="text-gray-600 mr-4 cursor-pointer"
                          disabled
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                        <span className="text-gray-600 text-sm font-mono">
                          0:00 / 2:04
                        </span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-500 h-1 rounded-full overflow-hidden">
                            <div className="bg-gray-400 h-full w-0"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            className="text-gray-600 cursor-pointer"
                            disabled
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          </button>
                          <button
                            className="text-gray-600 cursor-pointer"
                            disabled
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                          </button>
                          <button
                            className="text-gray-600 cursor-pointer"
                            disabled
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Button - only for active items */}
              {item.isActive && (
                <div className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm(item);
                    }}
                    className={`px-8 py-3 rounded-full font-medium text-white transition-all duration-300 shadow-lg ${
                      isVideoCompleted(item.id)
                        ? "hover:shadow-xl transform hover:scale-105"
                        : "hover:shadow-md"
                    }`}
                    style={{
                      backgroundColor: isVideoCompleted(item.id)
                        ? colors.primary
                        : "#CCCCCC",
                    }}
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
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CategoryCard;
