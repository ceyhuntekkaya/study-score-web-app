type FileType = 'image' | 'video' | 'pdf' | 'audio' | 'document' | 'archive' | 'unknown';

interface FileTypeResult {
    type: FileType;
    extension: string | null;
    mimeType: string | null;
}

/**
 * Verilen URL'den dosya tipini tespit eder
 */
export function detectFileType(url: string): FileTypeResult {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname.toLowerCase();
        const extension = pathname.split('.').pop() || null;

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif', 'heic', 'heif'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpg', 'mpeg', '3gp'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'opus'];
        const documentExtensions = ['doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];
        const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];

        if (extension) {
            if (extension === 'pdf') {
                return {
                    type: 'pdf',
                    extension: 'pdf',
                    mimeType: 'application/pdf'
                };
            }

            if (imageExtensions.includes(extension)) {
                return {
                    type: 'image',
                    extension,
                    mimeType: `image/${extension === 'jpg' ? 'jpeg' : extension}`
                };
            }

            if (videoExtensions.includes(extension)) {
                return {
                    type: 'video',
                    extension,
                    mimeType: `video/${extension}`
                };
            }

            if (audioExtensions.includes(extension)) {
                return {
                    type: 'audio',
                    extension,
                    mimeType: `audio/${extension}`
                };
            }

            if (documentExtensions.includes(extension)) {
                return {
                    type: 'document',
                    extension,
                    mimeType: 'application/octet-stream'
                };
            }

            if (archiveExtensions.includes(extension)) {
                return {
                    type: 'archive',
                    extension,
                    mimeType: 'application/octet-stream'
                };
            }
        }

        return {
            type: 'unknown',
            extension,
            mimeType: null
        };

    } catch (error) {
        return {
            type: 'unknown',
            extension: null,
            mimeType: null
        };
    }
}
