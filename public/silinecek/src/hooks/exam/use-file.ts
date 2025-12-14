import { useState, useCallback } from 'react';
import { UploadedFileDto } from '@/types/definition/uploaded-file';
import { EMediaType } from '@/types/enumeration';
import { fileService } from '@/services/api/exam/file-service';

interface FileUploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

interface UseFileReturn {
    files: UploadedFileDto[];
    selectedFile: UploadedFileDto | null;
    filesByType: UploadedFileDto[];
    filesByCreator: UploadedFileDto[];
    recentFiles: UploadedFileDto[];
    largestFiles: UploadedFileDto[];
    fileTypeStatistics: Record<string, number> | null;
    totalStorageUsed: number;
    validationErrors: string[];
    uploadProgress: FileUploadProgress | null;
    downloadProgress: FileUploadProgress | null;
    loading: boolean;
    uploading: boolean;
    downloading: boolean;
    error: Error | null;

    // File Upload/Download Operations
    uploadFile: (file: File, customPath?: string) => Promise<UploadedFileDto | null>;
    uploadFileWithMetadata: (file: File, customPath?: string, metadata?: Record<string, string>) => Promise<UploadedFileDto | null>;
    downloadFile: (fileId: string) => Promise<ArrayBuffer | null>;
    downloadFileByPath: (filePath: string) => Promise<ArrayBuffer | null>;
    downloadFileAsBlob: (fileId: string) => Promise<Blob | null>;
    downloadAndSaveFile: (fileId: string, filename?: string) => Promise<void>;

    // File Management Operations
    getFileById: (fileId: string) => Promise<void>;
    getFileByPath: (filePath: string) => Promise<void>;
    getFilesByType: (mediaType: EMediaType) => Promise<void>;
    getFilesByCreator: (userId: string) => Promise<void>;
    deleteFile: (fileId: string) => Promise<void>;
    deleteFileByPath: (filePath: string) => Promise<void>;

    // File Operations
    renameFile: (fileId: string, newName: string) => Promise<void>;
    moveFile: (fileId: string, newPath: string) => Promise<void>;
    copyFile: (fileId: string, targetPath: string) => Promise<void>;
    fileExists: (fileId: string) => Promise<boolean>;
    getFileSize: (fileId: string) => Promise<number>;

    // File Validation
    validateFileType: (file: File, allowedTypes: EMediaType[]) => Promise<boolean>;
    validateFileSize: (file: File, maxSize: number) => Promise<boolean>;
    getFileValidationErrors: (file: File) => Promise<void>;

    // File Analytics
    getRecentFiles: (limit?: number) => Promise<void>;
    getFileTypeStatistics: () => Promise<void>;
    getTotalStorageUsed: () => Promise<void>;
    getLargestFiles: (limit?: number) => Promise<void>;

    // Utility Methods
    downloadFileAsUrl: (fileId: string) => string;
    getFileDataUrl: (fileId: string) => Promise<string | null>;

    // File Type Detection Utilities
    getFileExtension: (filename: string) => string;
    isImageFile: (filename: string) => boolean;
    isVideoFile: (filename: string) => boolean;
    isAudioFile: (filename: string) => boolean;
    isDocumentFile: (filename: string) => boolean;
    formatFileSize: (bytes: number) => string;

    // Reset Functions
    resetSelectedFile: () => void;
    resetFilesByType: () => void;
    resetFilesByCreator: () => void;
    resetValidationErrors: () => void;
    resetProgress: () => void;
    resetError: () => void;
    resetAll: () => void;

    // Utility Functions
    getFileByIdFromCache: (id: string) => UploadedFileDto | undefined;
    getFilesByTypeFromCache: (mediaType: EMediaType) => UploadedFileDto[];
    getTotalFilesCount: () => number;
    getTotalFilesSize: () => number;
    getFilesByExtension: (extension: string) => UploadedFileDto[];
    getImageFiles: () => UploadedFileDto[];
    getVideoFiles: () => UploadedFileDto[];
    getAudioFiles: () => UploadedFileDto[];
    getDocumentFiles: () => UploadedFileDto[];
    getFilesCreatedInRange: (startDate: Date, endDate: Date) => UploadedFileDto[];
    canDeleteFile: (fileId: string) => boolean;
    getFilePreviewUrl: (fileId: string) => string;
}

export const useFile = (): UseFileReturn => {
    // State management
    const [files, setFiles] = useState<UploadedFileDto[]>([]);
    const [selectedFile, setSelectedFile] = useState<UploadedFileDto | null>(null);
    const [filesByType, setFilesByType] = useState<UploadedFileDto[]>([]);
    const [filesByCreator, setFilesByCreator] = useState<UploadedFileDto[]>([]);
    const [recentFiles, setRecentFiles] = useState<UploadedFileDto[]>([]);
    const [largestFiles, setLargestFiles] = useState<UploadedFileDto[]>([]);
    const [fileTypeStatistics, setFileTypeStatistics] = useState<Record<string, number> | null>(null);
    const [totalStorageUsed, setTotalStorageUsed] = useState<number>(0);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<FileUploadProgress | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<FileUploadProgress | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Helper function to update file in all relevant states
    const updateFileInStates = useCallback((updatedFile: UploadedFileDto) => {
        const updateInArray = (arr: UploadedFileDto[]) =>
            arr.map(file => file.id === updatedFile.id ? updatedFile : file);

        setFiles(prev => updateInArray(prev));
        setFilesByType(prev => updateInArray(prev));
        setFilesByCreator(prev => updateInArray(prev));
        setRecentFiles(prev => updateInArray(prev));
        setLargestFiles(prev => updateInArray(prev));

        if (selectedFile?.id === updatedFile.id) {
            setSelectedFile(updatedFile);
        }
    }, [selectedFile]);

    // Helper function to remove file from all relevant states
    const removeFileFromStates = useCallback((fileId: string) => {
        const removeFromArray = (arr: UploadedFileDto[]) => arr.filter(file => file.id !== fileId);

        setFiles(prev => removeFromArray(prev));
        setFilesByType(prev => removeFromArray(prev));
        setFilesByCreator(prev => removeFromArray(prev));
        setRecentFiles(prev => removeFromArray(prev));
        setLargestFiles(prev => removeFromArray(prev));

        if (selectedFile?.id === fileId) {
            setSelectedFile(null);
        }
    }, [selectedFile]);

    // File Upload/Download Operations
    const uploadFile = useCallback(async (file: File, customPath?: string): Promise<UploadedFileDto | null> => {
        try {
            setUploading(true);
            setError(null);
            setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

            const uploadedFile = await fileService.uploadFile(file, customPath);
            setFiles(prev => [uploadedFile, ...prev]);

            setUploadProgress({ loaded: file.size, total: file.size, percentage: 100 });
            return uploadedFile;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(null), 2000); // Clear progress after 2 seconds
        }
    }, []);

    const uploadFileWithMetadata = useCallback(async (
        file: File,
        customPath?: string,
        metadata?: Record<string, string>
    ): Promise<UploadedFileDto | null> => {
        try {
            setUploading(true);
            setError(null);
            setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

            const uploadedFile = await fileService.uploadFileWithMetadata(file, customPath, metadata);
            setFiles(prev => [uploadedFile, ...prev]);

            setUploadProgress({ loaded: file.size, total: file.size, percentage: 100 });
            return uploadedFile;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(null), 2000);
        }
    }, []);

    const downloadFile = useCallback(async (fileId: string): Promise<ArrayBuffer | null> => {
        try {
            setDownloading(true);
            setError(null);
            const fileData = await fileService.downloadFile(fileId);
            return fileData;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setDownloading(false);
        }
    }, []);

    const downloadFileByPath = useCallback(async (filePath: string): Promise<ArrayBuffer | null> => {
        try {
            setDownloading(true);
            setError(null);
            const fileData = await fileService.downloadFileByPath(filePath);
            return fileData;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setDownloading(false);
        }
    }, []);

    const downloadFileAsBlob = useCallback(async (fileId: string): Promise<Blob | null> => {
        try {
            setDownloading(true);
            setError(null);
            const blob = await fileService.downloadFileAsBlob(fileId);
            return blob;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setDownloading(false);
        }
    }, []);

    const downloadAndSaveFile = useCallback(async (fileId: string, filename?: string) => {
        try {
            setDownloading(true);
            setError(null);
            await fileService.downloadAndSaveFile(fileId, filename);
        } catch (err) {
            handleError(err);
        } finally {
            setDownloading(false);
        }
    }, []);

    // File Management Operations
    const getFileById = useCallback(async (fileId: string) => {
        try {
            setLoading(true);
            setError(null);
            const file = await fileService.getFileById(fileId);
            setSelectedFile(file);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileByPath = useCallback(async (filePath: string) => {
        try {
            setLoading(true);
            setError(null);
            const file = await fileService.getFileByPath(filePath);
            setSelectedFile(file);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getFilesByType = useCallback(async (mediaType: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const fileList = await fileService.getFilesByType(mediaType);
            setFilesByType(fileList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getFilesByCreator = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const fileList = await fileService.getFilesByCreator(userId);
            setFilesByCreator(fileList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteFile = useCallback(async (fileId: string) => {
        try {
            setLoading(true);
            setError(null);
            await fileService.deleteFile(fileId);
            removeFileFromStates(fileId);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removeFileFromStates]);

    const deleteFileByPath = useCallback(async (filePath: string) => {
        try {
            setLoading(true);
            setError(null);
            await fileService.deleteFileByPath(filePath);
            // Note: We don't have the fileId here, so we can't remove from states
            // The user should refresh the file list after this operation
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // File Operations
    const renameFile = useCallback(async (fileId: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedFile = await fileService.renameFile(fileId, newName);
            updateFileInStates(updatedFile);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateFileInStates]);

    const moveFile = useCallback(async (fileId: string, newPath: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedFile = await fileService.moveFile(fileId, newPath);
            updateFileInStates(updatedFile);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateFileInStates]);

    const copyFile = useCallback(async (fileId: string, targetPath: string) => {
        try {
            setLoading(true);
            setError(null);
            const copiedFile = await fileService.copyFile(fileId, targetPath);
            setFiles(prev => [copiedFile, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fileExists = useCallback(async (fileId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await fileService.fileExists(fileId);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileSize = useCallback(async (fileId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await fileService.getFileSize(fileId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    // File Validation
    const validateFileType = useCallback(async (file: File, allowedTypes: EMediaType[]): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await fileService.validateFileType(file, allowedTypes);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const validateFileSize = useCallback(async (file: File, maxSize: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await fileService.validateFileSize(file, maxSize);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileValidationErrors = useCallback(async (file: File) => {
        try {
            setLoading(true);
            setError(null);
            const errors = await fileService.getFileValidationErrors(file);
            setValidationErrors(errors);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // File Analytics
    const getRecentFiles = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const fileList = await fileService.getRecentFiles(limit);
            setRecentFiles(fileList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileTypeStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await fileService.getFileTypeStatistics();
            setFileTypeStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTotalStorageUsed = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const storage = await fileService.getTotalStorageUsed();
            setTotalStorageUsed(storage);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getLargestFiles = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const fileList = await fileService.getLargestFiles(limit);
            setLargestFiles(fileList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Utility Methods
    const downloadFileAsUrl = useCallback((fileId: string): string => {
        return fileService.downloadFileAsUrl(fileId);
    }, []);

    const getFileDataUrl = useCallback(async (fileId: string): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            return await fileService.getFileDataUrl(fileId);
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // File Type Detection Utilities
    const getFileExtension = useCallback((filename: string): string => {
        return fileService.getFileExtension(filename);
    }, []);

    const isImageFile = useCallback((filename: string): boolean => {
        return fileService.isImageFile(filename);
    }, []);

    const isVideoFile = useCallback((filename: string): boolean => {
        return fileService.isVideoFile(filename);
    }, []);

    const isAudioFile = useCallback((filename: string): boolean => {
        return fileService.isAudioFile(filename);
    }, []);

    const isDocumentFile = useCallback((filename: string): boolean => {
        return fileService.isDocumentFile(filename);
    }, []);

    const formatFileSize = useCallback((bytes: number): string => {
        return fileService.formatFileSize(bytes);
    }, []);

    // Reset Functions
    const resetSelectedFile = useCallback(() => {
        setSelectedFile(null);
    }, []);

    const resetFilesByType = useCallback(() => {
        setFilesByType([]);
    }, []);

    const resetFilesByCreator = useCallback(() => {
        setFilesByCreator([]);
    }, []);

    const resetValidationErrors = useCallback(() => {
        setValidationErrors([]);
    }, []);

    const resetProgress = useCallback(() => {
        setUploadProgress(null);
        setDownloadProgress(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetAll = useCallback(() => {
        setFiles([]);
        setSelectedFile(null);
        setFilesByType([]);
        setFilesByCreator([]);
        setRecentFiles([]);
        setLargestFiles([]);
        setFileTypeStatistics(null);
        setTotalStorageUsed(0);
        setValidationErrors([]);
        setUploadProgress(null);
        setDownloadProgress(null);
        setError(null);
    }, []);

    // Utility Functions
    const getFileByIdFromCache = useCallback((id: string): UploadedFileDto | undefined => {
        return files.find(file => file.id === id);
    }, [files]);

    const getFilesByTypeFromCache = useCallback((mediaType: EMediaType): UploadedFileDto[] => {
        return files.filter(file => file.documentType === mediaType);
    }, [files]);

    const getTotalFilesCount = useCallback((): number => {
        return files.length;
    }, [files]);

    const getTotalFilesSize = useCallback((): number => {
        return files.reduce((total, file) => total + (file.fileSize || 0), 0);
    }, [files]);

    const getFilesByExtension = useCallback((extension: string): UploadedFileDto[] => {
        return files.filter(file => {
            const fileExtension = getFileExtension(file.fileOriginalName || '');
            return fileExtension.toLowerCase() === extension.toLowerCase();
        });
    }, [files, getFileExtension]);

    const getImageFiles = useCallback((): UploadedFileDto[] => {
        return files.filter(file => isImageFile(file.fileOriginalName || ''));
    }, [files, isImageFile]);

    const getVideoFiles = useCallback((): UploadedFileDto[] => {
        return files.filter(file => isVideoFile(file.fileOriginalName || ''));
    }, [files, isVideoFile]);

    const getAudioFiles = useCallback((): UploadedFileDto[] => {
        return files.filter(file => isAudioFile(file.fileOriginalName || ''));
    }, [files, isAudioFile]);

    const getDocumentFiles = useCallback((): UploadedFileDto[] => {
        return files.filter(file => isDocumentFile(file.fileOriginalName || ''));
    }, [files, isDocumentFile]);

    const getFilesCreatedInRange = useCallback((startDate: Date, endDate: Date): UploadedFileDto[] => {
        return files.filter(file => {
            if (!file.createdAt) return false;
            const fileDate = new Date(file.createdAt);
            return fileDate >= startDate && fileDate <= endDate;
        });
    }, [files]);

    const canDeleteFile = useCallback((fileId: string): boolean => {
        const file = getFileByIdFromCache(fileId);
        // Add your business logic here for determining if a file can be deleted
        return file !== undefined;
    }, [getFileByIdFromCache]);

    const getFilePreviewUrl = useCallback((fileId: string): string => {
        return downloadFileAsUrl(fileId);
    }, [downloadFileAsUrl]);

    return {
        // State
        files,
        selectedFile,
        filesByType,
        filesByCreator,
        recentFiles,
        largestFiles,
        fileTypeStatistics,
        totalStorageUsed,
        validationErrors,
        uploadProgress,
        downloadProgress,
        loading,
        uploading,
        downloading,
        error,

        // File Upload/Download Operations
        uploadFile,
        uploadFileWithMetadata,
        downloadFile,
        downloadFileByPath,
        downloadFileAsBlob,
        downloadAndSaveFile,

        // File Management Operations
        getFileById,
        getFileByPath,
        getFilesByType,
        getFilesByCreator,
        deleteFile,
        deleteFileByPath,

        // File Operations
        renameFile,
        moveFile,
        copyFile,
        fileExists,
        getFileSize,

        // File Validation
        validateFileType,
        validateFileSize,
        getFileValidationErrors,

        // File Analytics
        getRecentFiles,
        getFileTypeStatistics,
        getTotalStorageUsed,
        getLargestFiles,

        // Utility Methods
        downloadFileAsUrl,
        getFileDataUrl,

        // File Type Detection Utilities
        getFileExtension,
        isImageFile,
        isVideoFile,
        isAudioFile,
        isDocumentFile,
        formatFileSize,

        // Reset Functions
        resetSelectedFile,
        resetFilesByType,
        resetFilesByCreator,
        resetValidationErrors,
        resetProgress,
        resetError,
        resetAll,

        // Utility Functions
        getFileByIdFromCache,
        getFilesByTypeFromCache,
        getTotalFilesCount,
        getTotalFilesSize,
        getFilesByExtension,
        getImageFiles,
        getVideoFiles,
        getAudioFiles,
        getDocumentFiles,
        getFilesCreatedInRange,
        canDeleteFile,
        getFilePreviewUrl
    };
};