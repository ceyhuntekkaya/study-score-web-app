'use client';

import * as React from "react";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";
import { getApiInvokeUrl } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';

type FileType = 'image' | 'video' | 'audio' | 'pdf' | 'file';

export interface UploadedFileDto {
    id?: string;
    path?: string;
    fileName?: string;
    fileOriginalName?: string;
    fileSize?: number;
    [key: string]: any;
}

export interface FileUploadProps {
    acceptedFileTypes?: FileType[];
    maxFileSize?: number; // MB cinsinden
    maxFiles?: number;
    multiple?: boolean;
    onUploadComplete?: (files: UploadedFileDto[]) => void;
    labelText?: string;
    error?: boolean;
    errorText?: string;
    className?: string;
    id?: string;
    entityId: string;
    uploadType: string;
}

interface FileWithPreview {
    file: File;
    preview: string;
    id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    acceptedFileTypes = ['image', 'video', 'audio', 'pdf'],
    maxFileSize = 10,
    maxFiles = 10,
    multiple = true,
    onUploadComplete,
    labelText = "Dosya Yükle",
    error = false,
    errorText,
    className = "",
    id = "file-upload",
    entityId,
    uploadType
}) => {
    const { accessToken } = useAuth();
    const [selectedFiles, setSelectedFiles] = React.useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [localError, setLocalError] = React.useState<string>("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const getAcceptString = () => {
        const acceptMap: Record<FileType, string> = {
            image: 'image/*',
            video: 'video/*',
            audio: 'audio/*',
            pdf: 'application/pdf',
            file: '*/*'
        };
        return acceptedFileTypes.map(type => acceptMap[type]).join(',');
    };

    const validateFileSize = (file: File): boolean => {
        const maxSizeInBytes = maxFileSize * 1024 * 1024;
        return file.size <= maxSizeInBytes;
    };

    const validateFileType = (file: File): boolean => {
        if (acceptedFileTypes.includes('file')) return true;
        const fileType = file.type;
        for (const type of acceptedFileTypes) {
            if (type === 'image' && fileType.startsWith('image/')) return true;
            if (type === 'video' && fileType.startsWith('video/')) return true;
            if (type === 'audio' && fileType.startsWith('audio/')) return true;
            if (type === 'pdf' && fileType === 'application/pdf') return true;
        }
        return false;
    };

    const createPreview = (file: File): string => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
            return URL.createObjectURL(file);
        } else if (file.type === 'application/pdf') {
            return '/assets/images/icons/pdf-icon.svg';
        }
        return '/assets/images/icons/file-icon.svg';
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        setLocalError("");
        const fileArray = Array.from(files);

        if (!multiple && fileArray.length > 1) {
            setLocalError("Sadece bir dosya seçebilirsiniz.");
            return;
        }

        if (selectedFiles.length + fileArray.length > maxFiles) {
            setLocalError(`En fazla ${maxFiles} dosya yükleyebilirsiniz.`);
            return;
        }

        const validFiles: FileWithPreview[] = [];
        const errors: string[] = [];

        for (const file of fileArray) {
            if (!validateFileSize(file)) {
                errors.push(`${file.name} dosyası çok büyük (max ${maxFileSize}MB)`);
                continue;
            }
            if (!validateFileType(file)) {
                errors.push(`${file.name} desteklenmeyen dosya tipi`);
                continue;
            }
            validFiles.push({
                file,
                preview: createPreview(file),
                id: Math.random().toString(36).substr(2, 9)
            });
        }

        if (errors.length > 0) {
            setLocalError(errors.join(', '));
        }

        if (validFiles.length > 0) {
            setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (fileId: string) => {
        setSelectedFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);
            const fileToRemove = prev.find(f => f.id === fileId);
            if (fileToRemove && (fileToRemove.file.type.startsWith('image/') ||
                fileToRemove.file.type.startsWith('video/') ||
                fileToRemove.file.type.startsWith('audio/'))) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return updated;
        });
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            setLocalError("Lütfen en az bir dosya seçin.");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setLocalError("");

        try {
            const formData = new FormData();
            selectedFiles.forEach(({file}) => {
                formData.append('files', file);
            });

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (onUploadComplete) {
                            onUploadComplete(response);
                        }
                        setSelectedFiles([]);
                        setUploadProgress(100);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    } catch (e) {
                        setLocalError("Sunucu yanıtı işlenirken hata oluştu.");
                    }
                } else {
                    setLocalError(`Yükleme hatası: ${xhr.status}`);
                }
                setIsUploading(false);
            });

            xhr.addEventListener('error', () => {
                setLocalError("Yükleme sırasında bir hata oluştu.");
                setIsUploading(false);
            });

            const apiUrl = getApiInvokeUrl();
            xhr.open('POST', `${apiUrl}/upload/${entityId}/${uploadType}`);

            if (accessToken) {
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            }

            xhr.send(formData);

        } catch (err) {
            console.error(err);
            setLocalError("Yükleme sırasında bir hata oluştu.");
            setIsUploading(false);
        }
    };

    React.useEffect(() => {
        return () => {
            selectedFiles.forEach(({preview, file}) => {
                if (file.type.startsWith('image/') ||
                    file.type.startsWith('video/') ||
                    file.type.startsWith('audio/')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [selectedFiles]);

    return (
        <div className={`w-100 ${className}`}>
            <Label htmlFor={id}>{labelText}</Label>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
                    border border-dashed rounded p-4 text-center cursor-pointer
                    ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${error ? 'border-danger' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    id={id}
                    className="d-none"
                    accept={getAcceptString()}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />

                <i className="feather-upload" style={{ fontSize: '48px', color: '#6c757d', marginBottom: '8px' }}></i>
                <p className="mt-2">
                    <span className="text-primary fw-semibold">Dosya seçin</span> veya sürükleyip bırakın
                </p>
                <p className="text-muted small mt-1">
                    {acceptedFileTypes.map(type => type.toUpperCase()).join(', ')} • Maks {maxFileSize}MB
                    {multiple && ` • En fazla ${maxFiles} dosya`}
                </p>
            </div>

            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="small fw-semibold">
                            Seçili Dosyalar ({selectedFiles.length})
                        </p>
                        {!isUploading && (
                            <Button
                                size="sm"
                                onClick={uploadFiles}
                            >
                                <i className="feather-upload me-1"></i>
                                Yükle
                            </Button>
                        )}
                    </div>

                    <div className="row g-3">
                        {selectedFiles.map(({file, preview, id: fileId}) => (
                            <div key={fileId} className="col-md-3 col-sm-4 col-6">
                                <div className="card position-relative">
                                    <div className="card-img-top" style={{ aspectRatio: '1', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={preview}
                                                alt={file.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : file.type.startsWith('video/') ? (
                                            <video
                                                src={preview}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                controls
                                            />
                                        ) : file.type.startsWith('audio/') ? (
                                            <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                                                <i className="feather-music" style={{ fontSize: '48px', color: '#0d6efd' }}></i>
                                            </div>
                                        ) : (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                                <i className="feather-file" style={{ fontSize: '48px', color: '#6c757d' }}></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body p-2">
                                        <p className="card-text small text-truncate mb-1" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="card-text small text-muted">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    {!isUploading && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(fileId);
                                            }}
                                        >
                                            <i className="feather-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isUploading && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="small fw-semibold">Yükleniyor...</p>
                        <p className="small text-muted">{uploadProgress}%</p>
                    </div>
                    <Progress value={uploadProgress}/>
                </div>
            )}

            {(localError || errorText) && (
                <div className="mt-3">
                    <Alert variant="destructive">
                        <AlertDescription>{localError || errorText}</AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
};

FileUpload.displayName = "FileUpload";

export { FileUpload };
