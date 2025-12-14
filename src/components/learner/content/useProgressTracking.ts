import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useUpdateMaterialProgress } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';
import type { CourseLessonPartMaterialDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

interface UseProgressTrackingProps {
  selectedPartId: string | null;
  materials: CourseLessonPartMaterialDetailDTO[];
}

export function useProgressTracking({ selectedPartId, materials }: UseProgressTrackingProps) {
  const updateMaterialProgressMutation = useUpdateMaterialProgress();

  // Refs for tracking
  const videoRefs = useRef<Map<string, HTMLVideoElement | HTMLAudioElement>>(new Map());
  const materialTrackingRefs = useRef<Map<string, {
    watchStartTime: number;
    isPlaying: boolean;
    interval: NodeJS.Timeout | null;
  }>>(new Map());
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  // Store materials in ref to avoid dependency issues
  const materialsRef = useRef(materials);
  useEffect(() => {
    materialsRef.current = materials;
  }, [materials]);

  // Save material progress with completed check
  const saveMaterialProgress = useCallback(async (
    materialId: string,
    currentPosition?: number,
    totalDuration?: number,
    watchDuration?: number,
    isDownloaded?: boolean
  ) => {
    if (!materialId) return;

    // Completed kontrolü - çok önemli!
    const material = materialsRef.current.find(m => m.id === materialId);
    if (material?.userProgress?.completed) {
      console.log('Material already completed, skipping request:', materialId);
      return; // İstek atma!
    }

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
      console.log('Material progress saved:', { materialId, currentPosition, totalDuration, watchDuration, isDownloaded });
    } catch (error) {
      console.error('Error saving material progress:', error);
    }
  }, [updateMaterialProgressMutation]);

  // Video/Audio tracking - use stable material IDs
  const materialIdsKey = useMemo(() => {
    const ids = materials
      .filter(m => (m.mediaType === 'VIDEO' || m.mediaType === 'AUDIO') && m.id)
      .map(m => m.id!)
      .sort();
    return ids.join(',');
  }, [materials.length, materials.map(m => m.id).filter(Boolean).sort().join(',')]);

  // Video/Audio tracking
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

      // Completed kontrolü
      if (material.userProgress?.completed) {
        return; // Bu material için tracking yapma
      }

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
      };

      const handlePause = async () => {
        // Completed kontrolü
        if (material.userProgress?.completed) {
          return;
        }

        tracking.isPlaying = false;
        const pauseTime = Date.now();
        const watchDuration = Math.floor((pauseTime - tracking.watchStartTime) / 1000);
        const currentPosition = Math.floor(element.currentTime) || 0;
        const totalDuration = Math.floor(element.duration) || 0;

        await saveMaterialProgress(material.id!, currentPosition, totalDuration, watchDuration);
      };

      const handleEnded = async () => {
        // Completed kontrolü
        if (material.userProgress?.completed) {
          return;
        }

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
      element.addEventListener('ended', handleEnded);

      // Material progress interval (every 10 seconds) - sadece video/audio için
      const materialInterval = setInterval(async () => {
        // Completed kontrolü
        if (material.userProgress?.completed) {
          clearInterval(materialInterval);
          return;
        }

        if (tracking.isPlaying && !element.paused) {
          const currentPosition = Math.floor(element.currentTime) || 0;
          const totalDuration = Math.floor(element.duration) || 0;
          await saveMaterialProgress(material.id!, currentPosition, totalDuration, 10);
        }
      }, 10000);

      tracking.interval = materialInterval;

      cleanupMap.set(material.id, () => {
        element.removeEventListener('play', handlePlay);
        element.removeEventListener('pause', handlePause);
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
  }, [materialIdsKey, selectedPartId]);

  // IMAGE, TEXT, PDF, DOCUMENT için 10 saniye timer
  // Create stable key from material IDs and completion status
  const timerMaterialsKey = useMemo(() => {
    return materials
      .filter(m => ['IMAGE', 'TEXT', 'PDF', 'DOCUMENT', 'OTHER'].includes(m.mediaType || ''))
      .map(m => `${m.id}-${m.userProgress?.completed ? '1' : '0'}`)
      .sort()
      .join(',');
  }, [materials.map(m => `${m.id}-${m.userProgress?.completed ? '1' : '0'}`).sort().join(',')]);

  useEffect(() => {
    const currentMaterials = materialsRef.current;
    
    // Clear existing timers
    timerRefs.current.forEach((timer) => clearTimeout(timer));
    timerRefs.current.clear();

    currentMaterials.forEach((material) => {
      if (!material.id) return;

      // Sadece IMAGE, TEXT, PDF, DOCUMENT, OTHER için
      const needsTimer = ['IMAGE', 'TEXT', 'PDF', 'DOCUMENT', 'OTHER'].includes(material.mediaType || '');
      if (!needsTimer) return;

      // Completed kontrolü
      if (material.userProgress?.completed) {
        return; // Timer başlatma
      }

      // 10 saniye sonra progress kaydet
      const timer = setTimeout(() => {
        // Tekrar completed kontrolü (timer çalışırken completed olmuş olabilir)
        const currentMaterial = materialsRef.current.find(m => m.id === material.id);
        if (currentMaterial?.userProgress?.completed) {
          return;
        }

        // Tüm tipler için watchDurationSeconds: 10
        saveMaterialProgress(material.id!, undefined, undefined, 10);
      }, 10000);

      timerRefs.current.set(material.id, timer);
    });

    return () => {
      timerRefs.current.forEach((timer) => clearTimeout(timer));
      timerRefs.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerMaterialsKey, selectedPartId]); // Removed saveMaterialProgress to avoid loops

  // Register video/audio element
  const registerVideoElement = useCallback((materialId: string, element: HTMLVideoElement | HTMLAudioElement) => {
    videoRefs.current.set(materialId, element);
  }, []);

  // Handle PDF load (viewer açıldığında timer başlatılır - yukarıdaki useEffect'te)
  const handlePdfLoad = useCallback((materialId: string) => {
    // Timer zaten useEffect'te başlatılıyor, burada sadece log
    console.log('PDF loaded:', materialId);
  }, []);

  // Handle PDF download
  const handlePdfDownload = useCallback(async (materialId: string) => {
    await saveMaterialProgress(materialId, undefined, undefined, undefined, true);
  }, [saveMaterialProgress]);

  // Handle LINK click
  const handleLinkClick = useCallback(async (materialId: string) => {
    await saveMaterialProgress(materialId, undefined, undefined, 0);
  }, [saveMaterialProgress]);

  return {
    registerVideoElement,
    handlePdfLoad,
    handlePdfDownload,
    handleLinkClick,
  };
}
