import api from '../base-api';
import {UploadedFileDto} from "@/types/definition/uploaded-file";
import {EMediaType} from "@/types/enumeration";


class FileService {
    private readonly baseUrl = '/exam/files';

    // File Upload/Download Operations
    async uploadFile(file: File, customPath?: string): Promise<UploadedFileDto> {
        const formData = new FormData();
        formData.append('file', file);
        if (customPath) {
            formData.append('customPath', customPath);
        }

        const response = await api.post<UploadedFileDto>(`${this.baseUrl}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async uploadFileWithMetadata(
        file: File,
        customPath?: string,
        metadata?: Record<string, string>
    ): Promise<UploadedFileDto> {
        const formData = new FormData();
        formData.append('file', file);
        if (customPath) {
            formData.append('customPath', customPath);
        }
        if (metadata) {
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(`metadata[${key}]`, value);
            });
        }

        const response = await api.post<UploadedFileDto>(`${this.baseUrl}/upload-with-metadata`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async downloadFile(fileId: string): Promise<ArrayBuffer> {
        const response = await api.get(`${this.baseUrl}/${fileId}/download`, {
            responseType: 'arraybuffer',
        });
        return response.data;
    }

    async downloadFileByPath(filePath: string): Promise<ArrayBuffer> {
        const response = await api.get(`${this.baseUrl}/download-by-path`, {
            params: { filePath },
            responseType: 'arraybuffer',
        });
        return response.data;
    }

    async downloadFileAsBlob(fileId: string): Promise<Blob> {
        const response = await api.get(`${this.baseUrl}/${fileId}/download-resource`, {
            responseType: 'blob',
        });
        return response.data;
    }

    // File Management Operations
    async getFileById(fileId: string): Promise<UploadedFileDto> {
        const response = await api.get<UploadedFileDto>(`${this.baseUrl}/${fileId}`);
        return response.data;
    }

    async getFileByPath(filePath: string): Promise<UploadedFileDto> {
        const response = await api.get<UploadedFileDto>(`${this.baseUrl}/by-path`, {
            params: { filePath }
        });
        return response.data;
    }

    async getFilesByType(mediaType: EMediaType): Promise<UploadedFileDto[]> {
        const response = await api.get<UploadedFileDto[]>(`${this.baseUrl}/by-type/${mediaType}`);
        return response.data;
    }

    async getFilesByCreator(userId: string): Promise<UploadedFileDto[]> {
        const response = await api.get<UploadedFileDto[]>(`${this.baseUrl}/by-creator/${userId}`);
        return response.data;
    }

    async deleteFile(fileId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${fileId}`);
        return response.data;
    }

    async deleteFileByPath(filePath: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/by-path`, {
            params: { filePath }
        });
        return response.data;
    }

    // File Operations
    async renameFile(fileId: string, newName: string): Promise<UploadedFileDto> {
        const response = await api.put<UploadedFileDto>(`${this.baseUrl}/${fileId}/rename`, null, {
            params: { newName }
        });
        return response.data;
    }

    async moveFile(fileId: string, newPath: string): Promise<UploadedFileDto> {
        const response = await api.put<UploadedFileDto>(`${this.baseUrl}/${fileId}/move`, null, {
            params: { newPath }
        });
        return response.data;
    }

    async copyFile(fileId: string, targetPath: string): Promise<UploadedFileDto> {
        const response = await api.post<UploadedFileDto>(`${this.baseUrl}/${fileId}/copy`, null, {
            params: { targetPath }
        });
        return response.data;
    }

    async fileExists(fileId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${fileId}/exists`);
        return response.data;
    }

    async getFileSize(fileId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${fileId}/size`);
        return response.data;
    }

    // File Validation
    async validateFileType(file: File, allowedTypes: EMediaType[]): Promise<boolean> {
        const formData = new FormData();
        formData.append('file', file);
        allowedTypes.forEach(type => formData.append('allowedTypes', type));

        const response = await api.post<boolean>(`${this.baseUrl}/validate-type`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async validateFileSize(file: File, maxSize: number): Promise<boolean> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('maxSize', maxSize.toString());

        const response = await api.post<boolean>(`${this.baseUrl}/validate-size`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async getFileValidationErrors(file: File): Promise<string[]> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<string[]>(`${this.baseUrl}/validation-errors`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    // File Analytics
    async getRecentFiles(limit: number = 10): Promise<UploadedFileDto[]> {
        const response = await api.get<UploadedFileDto[]>(`${this.baseUrl}/recent`, {
            params: { limit }
        });
        return response.data;
    }

    async getFileTypeStatistics(): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/statistics/type-distribution`);
        return response.data;
    }

    async getTotalStorageUsed(): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/total-storage`);
        return response.data;
    }

    async getLargestFiles(limit: number = 10): Promise<UploadedFileDto[]> {
        const response = await api.get<UploadedFileDto[]>(`${this.baseUrl}/largest`, {
            params: { limit }
        });
        return response.data;
    }

    // Utility Methods for File Handling
    downloadFileAsUrl(fileId: string): string {
        return `${api.defaults.baseURL}${this.baseUrl}/${fileId}/download`;
    }

    async downloadAndSaveFile(fileId: string, filename?: string): Promise<void> {
        try {
            const fileData = await this.downloadFile(fileId);
            const blob = new Blob([fileData]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `file_${fileId}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        }
    }

    async getFileDataUrl(fileId: string): Promise<string> {
        try {
            const fileData = await this.downloadFile(fileId);
            const blob = new Blob([fileData]);
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Failed to get file data URL:', error);
            throw error;
        }
    }

    // File Type Detection Utilities
    getFileExtension(filename: string): string {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    isImageFile(filename: string): boolean {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return imageExtensions.includes(extension);
    }

    isVideoFile(filename: string): boolean {
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return videoExtensions.includes(extension);
    }

    isAudioFile(filename: string): boolean {
        const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return audioExtensions.includes(extension);
    }

    isDocumentFile(filename: string): boolean {
        const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return documentExtensions.includes(extension);
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export const fileService = new FileService();