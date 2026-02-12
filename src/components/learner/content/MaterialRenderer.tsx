'use client';

import { useRef } from 'react';
import type { CourseLessonPartMaterialDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

interface MaterialRendererProps {
  material: CourseLessonPartMaterialDetailDTO;
  onVideoRef?: (materialId: string, element: HTMLVideoElement | HTMLAudioElement) => void;
  onPdfLoad?: (materialId: string) => void;
  onPdfDownload?: (materialId: string) => void;
  onLinkClick?: (materialId: string) => void;
}

export default function MaterialRenderer({
  material,
  onVideoRef,
  onPdfLoad,
  onPdfDownload,
  onLinkClick,
}: MaterialRendererProps) {
  const mediaType = material.mediaType;
  const content = material.content || '';

  console.log(material)

  // IMAGE
  if (mediaType === 'IMAGE') {
    return (
      <div className="material-item material-image mb--30">
        {content && (
          <div className="image-wrapper">
            <img
              src={"/assets/" + content}
              alt={material.name || 'Image'}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              onError={(e) => {
                console.error('Image load error:', content);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // VIDEO
  if (mediaType === 'VIDEO') {
    const isYouTube = content && (
      content.includes('youtube.com') ||
      content.includes('youtu.be') ||
      content.startsWith('https://www.youtube.com')
    );

    const getYouTubeEmbedUrl = (url: string): string => {
      if (url.includes('/embed/')) return url;
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      return url;
    };

    return (
      <div className="material-item material-video mb--30">
        {content && (
          <div className="rbt-video-player">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(content)}
                allowFullScreen
                allow="autoplay; encrypted-media"
                style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
                title={material.name || 'Video'}
              />
            ) : (
              <video
                ref={(el) => {
                  if (el && material.id && onVideoRef) {
                    onVideoRef(material.id, el);
                  }
                }}
                controls
                style={{ width: '100%', borderRadius: '8px' }}
                src={content}
                onError={(e) => {
                  console.error('Video load error:', content);
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>
    );
  }

  // AUDIO
  if (mediaType === 'AUDIO') {
    return (
      <div className="material-item material-audio mb--30">
        {content && (
          <div className="audio-wrapper">
            <audio
              ref={(el) => {
                if (el && material.id && onVideoRef) {
                  onVideoRef(material.id, el);
                }
              }}
              controls
              style={{ width: '100%' }}
            >
              <source src={content} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
      </div>
    );
  }

  // DOCUMENT
  if (mediaType === 'DOCUMENT') {
    return (
      <div className="material-item material-document mb--30">
        {content && (
          <div
            className="document-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }

  // PDF
  if (mediaType === 'PDF') {
    return (
      <div className="material-item material-pdf mb--30">
        {content && (
          <div className="pdf-wrapper">
            <iframe
              src={content}
              style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
              title={material.name || 'PDF Document'}
              onError={(e) => {
                console.error('PDF load error:', content);
              }}
              onLoad={() => {
                if (material.id && onPdfLoad) {
                  onPdfLoad(material.id);
                }
              }}
            />
            {material.id && (
              <div className="mt-3">
                <a
                  href={content}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (material.id && onPdfDownload) {
                      onPdfDownload(material.id);
                    }
                  }}
                  className="rbt-btn btn-md bg-primary"
                >
                  <span className="btn-text">Download PDF</span>
                  <span className="btn-icon"><i className="feather-download"></i></span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // LINK
  if (mediaType === 'LINK') {
    return (
      <div className="material-item material-link mb--30">
        {content && (
          <div className="link-wrapper">
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="rbt-btn btn-md bg-primary"
              onClick={async (e) => {
                // Progress kaydet
                if (material.id && onLinkClick) {
                  await onLinkClick(material.id);
                }
                // Link açılacak (default behavior)
              }}
            >
              <span className="btn-text">Open Link</span>
              <span className="btn-icon"><i className="feather-external-link"></i></span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // TEXT - Must be checked before OTHER to ensure proper rendering
  if (mediaType === 'TEXT') {
    return (
      <div className="material-item material-text mb--30">
        {content ? (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              lineHeight: '1.6',
              wordWrap: 'break-word',
            }}
          />
        ) : (
          <div className="text-muted">No content</div>
        )}
      </div>
    );
  }

  // OTHER
  if (mediaType === 'OTHER' || !mediaType) {
    return (
      <div className="material-item material-text mb--30">
        {content ? (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              lineHeight: '1.6',
              wordWrap: 'break-word',
            }}
          />
        ) : (
          <div className="text-muted">No content</div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="material-item material-unknown mb--30">
      {content && (
        <div
          className="unknown-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
