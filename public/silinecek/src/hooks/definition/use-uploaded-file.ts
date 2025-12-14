import { useState, useCallback, useEffect } from 'react';
import { UploadedFile, UploadedFileFormData } from '@/types/definition/uploaded-file';
import { uploadedFileService } from '@/services/api/defination/uploaded-file-service';

interface UseUploadedFileReturn {
    uploadedFiles: UploadedFile[];
    selectedUploadedFile: UploadedFile | null;
    loading: boolean;
    error: Error | null;
    fetchUploadedFiles: () => Promise<void>;
    fetchUploadedFileById: (id: string) => Promise<void>;
    createUploadedFile: (file: UploadedFileFormData) => Promise<void>;
    updateUploadedFile: (id: string, file: UploadedFileFormData) => Promise<void>;
    deleteUploadedFile: (id: string) => Promise<void>;
}

export const useUploadedFiles = (): UseUploadedFileReturn => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedUploadedFile, setSelectedUploadedFile] = useState<UploadedFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUploadedFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await uploadedFileService.getAllUploadedFiles();
            setUploadedFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUploadedFileById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await uploadedFileService.getUploadedFileById(id);
            setSelectedUploadedFile(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createUploadedFile = useCallback(async (file: UploadedFileFormData) => {
        try {
            setLoading(true);
            setError(null);
            await uploadedFileService.createUploadedFile(file);
            await fetchUploadedFiles();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchUploadedFiles]);

    const updateUploadedFile = useCallback(async (id: string, file: UploadedFileFormData) => {
        try {
            setLoading(true);
            setError(null);
            await uploadedFileService.updateUploadedFile(id, file);
            await fetchUploadedFiles();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchUploadedFiles]);

    const deleteUploadedFile = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await uploadedFileService.deleteUploadedFileById(id);
            await fetchUploadedFiles();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchUploadedFiles]);

    useEffect(() => {
        fetchUploadedFiles();
    }, [fetchUploadedFiles]);

    return {
        uploadedFiles,
        selectedUploadedFile,
        loading,
        error,
        fetchUploadedFiles,
        fetchUploadedFileById,
        createUploadedFile,
        updateUploadedFile,
        deleteUploadedFile
    };
};