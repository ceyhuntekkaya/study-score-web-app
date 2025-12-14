import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useUpdatePartProgress, useUpdateMaterialProgress } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';
import type { CourseLessonPartMaterialDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

interface UseProgressTrackingProps {
  selectedPartId: string | null;
  materials: CourseLessonPartMaterialDetailDTO[];
}

export function useProgressTracking({ selectedPartId, materials }: UseProgressTrackingProps) {
  const updatePartProgressMutation = useUpdatePartProgress();
  const updateMaterialProgressMutation = useUpdateMaterialProgress();

  // Refs for tracking
  const currentMaterialIdRef = useRef<string | null>(null);
  const currentMaterialPositionRef = useRef<number>(0);
  const partTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement | HTMLAudioElement>>(new Map());
  const partStartTimeRef = useRef<number>(Date.now());
  const previousPartIdRef = useRef<string | null>(null);
  const calculatePartProgressRef = useRef<number>(0);
  const materialTrackingRefs = useRef<Map<string, {
    watchStartTime: number;
    isPlaying: boolean;
    interval: NodeJS.Timeout | null;
  }>>(new Map());
  
  // Store materials in ref to avoid dependency issues
  const materialsRef = useRef(materials);
  useEffect(() => {
    materialsRef.current = materials;
  }, [materials]);

  // Calculate progress percentage
  const calculatePartProgress = useCallback(() => {
    const currentMaterials = materialsRef.current;
    if (!currentMaterials.length) {
      calculatePartProgressRef.current = 0;
      return 0;
    }
    const currentMaterialIndex = currentMaterials.findIndex(m => m.id === currentMaterialIdRef.current);
    if (currentMaterialIndex === -1) {
      calculatePartProgressRef.current = 0;
      return 0;
    }
    const progress = Math.min(100, Math.round(((currentMaterialIndex + 1) / currentMaterials.length) * 100));
    calculatePartProgressRef.current = progress;
    return progress;
  }, []);

  // Save part progress
  const savePartProgress = useCallback(async (
    partId: string,
    progressPercentage: number,
    timeSpent: number,
    materialId?: string | null,
    materialPosition?: number
  ) => {
    if (!partId) return;
    try {
      await updatePartProgressMutation.mutateAsync({
        data: {
          partId,
          progressPercentage,
          timeSpentSeconds: timeSpent,
          currentMaterialId: materialId || undefined,
          currentMaterialPositionSeconds: materialPosition || undefined,
        },
      });
      console.log('Part progress saved:', { partId, progressPercentage, timeSpent });
    } catch (error) {
      console.error('Error saving part progress:', error);
    }
  }, [updatePartProgressMutation]);

  // Save material progress
  const saveMaterialProgress = useCallback(async (
    materialId: string,
    currentPosition?: number,
    totalDuration?: number,
    watchDuration?: number,
    isDownloaded?: boolean
  ) => {
    if (!materialId) return;
    try {
      await updateMaterialProgressMutation.mutateAsync({
        data: {
          materialId,
          currentPositionSeconds: currentPosition,
          totalDurationSeconds: totalDuration,
          watchDurationSeconds: watchDuration,
          isDownloaded,
        },
      });
      console.log('Material progress saved:', { materialId, currentPosition, totalDuration, watchDuration });
    } catch (error) {
      console.error('Error saving material progress:', error);
    }
  }, [updateMaterialProgressMutation]);

  // Cleanup function
  const cleanupPartProgress = useCallback(() => {
    if (partTimeIntervalRef.current) {
      clearInterval(partTimeIntervalRef.current);
      partTimeIntervalRef.current = null;
    }
    materialTrackingRefs.current.forEach((tracking) => {
      if (tracking.interval) {
        clearInterval(tracking.interval);
        tracking.interval = null;
      }
    });
  }, []);

  // Part progress tracking
  useEffect(() => {
    // Cleanup previous part
    if (previousPartIdRef.current && previousPartIdRef.current !== selectedPartId) {
      const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
      savePartProgress(
        previousPartIdRef.current,
        calculatePartProgressRef.current,
        timeSpent,
        currentMaterialIdRef.current,
        currentMaterialPositionRef.current
      );
    }

    // Reset for new part
    if (selectedPartId) {
      currentMaterialIdRef.current = null;
      currentMaterialPositionRef.current = 0;
      partStartTimeRef.current = Date.now();
      previousPartIdRef.current = selectedPartId;

      // Initial progress save
      savePartProgress(selectedPartId, 0, 0);

      // Interval for part progress (every 30 seconds)
      partTimeIntervalRef.current = setInterval(() => {
        const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
        savePartProgress(
          selectedPartId,
          calculatePartProgressRef.current,
          timeSpent,
          currentMaterialIdRef.current,
          currentMaterialPositionRef.current
        );
      }, 30000);
    }

    return () => {
      cleanupPartProgress();
      if (selectedPartId) {
        const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
        savePartProgress(
          selectedPartId,
          calculatePartProgressRef.current,
          timeSpent,
          currentMaterialIdRef.current,
          currentMaterialPositionRef.current
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPartId]); // Only depend on selectedPartId to avoid infinite loops

  // Video/Audio tracking - use stable material IDs
  // Create stable key from material IDs
  const materialIdsKey = useMemo(() => {
    const ids = materials
      .filter(m => (m.mediaType === 'VIDEO' || m.mediaType === 'AUDIO') && m.id)
      .map(m => m.id!)
      .sort();
    return ids.join(',');
  }, [materials.length, materials.map(m => m.id).filter(Boolean).sort().join(',')]);

  useEffect(() => {
    if (!materialIdsKey || !selectedPartId) {
      return;
    }

    const cleanupMap = new Map<string, () => void>();
    const currentMaterials = materialsRef.current;
    
    // Early return if no video/audio materials
    if (!currentMaterials.some(m => (m.mediaType === 'VIDEO' || m.mediaType === 'AUDIO') && m.id)) {
      return;
    }

    currentMaterials.forEach((material) => {
      if (material.mediaType !== 'VIDEO' && material.mediaType !== 'AUDIO') return;
      if (!material.id) return;

      const element = videoRefs.current.get(material.id);
      if (!element) return;

      // Initialize tracking
      if (!materialTrackingRefs.current.has(material.id)) {
        materialTrackingRefs.current.set(material.id, {
          watchStartTime: Date.now(),
          isPlaying: false,
          interval: null,
        });
      }

      const tracking = materialTrackingRefs.current.get(material.id)!;

      // Event handlers
      const handlePlay = () => {
        tracking.isPlaying = true;
        tracking.watchStartTime = Date.now();
        currentMaterialIdRef.current = material.id!;
      };

      const handlePause = async () => {
        tracking.isPlaying = false;
        const pauseTime = Date.now();
        const watchDuration = Math.floor((pauseTime - tracking.watchStartTime) / 1000);
        const currentPosition = Math.floor(element.currentTime);
        const totalDuration = Math.floor(element.duration) || 0;

        await saveMaterialProgress(material.id!, currentPosition, totalDuration, watchDuration);
        
        if (selectedPartId) {
          const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
          await savePartProgress(
            selectedPartId,
            calculatePartProgressRef.current,
            timeSpent,
            material.id!,
            currentPosition
          );
        }
      };

      let lastUpdateTime = 0;
      const handleTimeUpdate = () => {
        const now = Date.now();
        if (now - lastUpdateTime > 1000) {
          currentMaterialPositionRef.current = Math.floor(element.currentTime);
          lastUpdateTime = now;
        }
      };

      const handleEnded = async () => {
        tracking.isPlaying = false;
        const endTime = Date.now();
        const watchDuration = Math.floor((endTime - tracking.watchStartTime) / 1000);
        const currentPosition = Math.floor(element.duration) || 0;
        const totalDuration = Math.floor(element.duration) || 0;
        await saveMaterialProgress(material.id!, currentPosition, totalDuration, watchDuration);
      };

      // Add listeners
      element.addEventListener('play', handlePlay);
      element.addEventListener('pause', handlePause);
      element.addEventListener('timeupdate', handleTimeUpdate);
      element.addEventListener('ended', handleEnded);

      // Material progress interval (every 10 seconds)
      const materialInterval = setInterval(async () => {
        if (tracking.isPlaying && !element.paused) {
          const currentPosition = Math.floor(element.currentTime);
          const totalDuration = Math.floor(element.duration) || 0;
          await saveMaterialProgress(material.id!, currentPosition, totalDuration, 10);
          
          if (selectedPartId) {
            const timeSpent = Math.floor((Date.now() - partStartTimeRef.current) / 1000);
            await savePartProgress(
              selectedPartId,
              calculatePartProgressRef.current,
              timeSpent,
              material.id!,
              currentPosition
            );
          }
        }
      }, 10000);

      tracking.interval = materialInterval;

      cleanupMap.set(material.id, () => {
        element.removeEventListener('play', handlePlay);
        element.removeEventListener('pause', handlePause);
        element.removeEventListener('timeupdate', handleTimeUpdate);
        element.removeEventListener('ended', handleEnded);
        if (materialInterval) {
          clearInterval(materialInterval);
        }
      });
    });

    return () => {
      cleanupMap.forEach((cleanup) => cleanup());
      materialTrackingRefs.current.forEach((tracking) => {
        if (tracking.interval) {
          clearInterval(tracking.interval);
          tracking.interval = null;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialIdsKey, selectedPartId]); // Removed savePartProgress and saveMaterialProgress to avoid loops

  // Register video/audio element
  const registerVideoElement = useCallback((materialId: string, element: HTMLVideoElement | HTMLAudioElement) => {
    videoRefs.current.set(materialId, element);
  }, []);

  // Handle PDF load
  const handlePdfLoad = useCallback((materialId: string) => {
    currentMaterialIdRef.current = materialId;
  }, []);

  // Handle PDF download
  const handlePdfDownload = useCallback(async (materialId: string) => {
    await saveMaterialProgress(materialId, undefined, undefined, undefined, true);
  }, [saveMaterialProgress]);

  return {
    registerVideoElement,
    handlePdfLoad,
    handlePdfDownload,
  };
}
