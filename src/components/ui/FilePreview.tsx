'use client';

import * as React from 'react';
import { detectFileType } from '@/utils/detectFileType';
import { getApiInvokeUrl } from '@/config';
import Image from 'next/image';

type PreviewSize = 'small' | 'medium' | 'large' | 'full';

interface FilePreviewProps {
    fileUrl: string;
    alt?: string;
    size?: PreviewSize;
}

const FilePreview: React.FC<FilePreviewProps> = ({
    fileUrl,
    alt = 'file',
    size = 'small'
}) => {
    const sizeClasses = {
        small: { width: 128, height: 128 },
        medium: { width: 256, height: 256 },
        large: { width: 384, height: 384 },
        full: { width: '100%', height: 'auto' }
    };

    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${getApiInvokeUrl()}/upload/serve/${fileUrl}`;
    const fileType = detectFileType(fullUrl).type;

    const containerStyle: React.CSSProperties = {
        ...(size === 'full' 
            ? { width: '100%', height: 'auto' }
            : { width: sizeClasses[size].width, height: sizeClasses[size].height }
        ),
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        overflow: 'hidden'
    };

    return (
        <div style={containerStyle}>
            {fileType === "image" ? (
                <Image
                    src={fullUrl}
                    alt={alt}
                    width={typeof sizeClasses[size].width === 'number' ? sizeClasses[size].width : 400}
                    height={typeof sizeClasses[size].height === 'number' ? sizeClasses[size].height : 300}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : fileType === "video" ? (
                <video
                    src={fullUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    controls
                />
            ) : fileType === "audio" ? (
                <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <i className="feather-music" style={{ fontSize: '48px', color: '#0d6efd', marginBottom: '8px' }}></i>
                    <audio controls src={fullUrl} style={{ width: '100%' }} preload="metadata">
                        Tarayıcınız audio elementini desteklemiyor.
                    </audio>
                </div>
            ) : (
                <div className="text-center p-2">
                    <i className="feather-file" style={{ fontSize: '32px', color: '#6c757d' }}></i>
                    <p className="text-muted small mt-2">
                        {fileType === "pdf" ? 'PDF' : 'Dosya'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FilePreview;
