'use client';

import AudioPlayer from '@/components/ui/AudioPlayer';

interface Header {
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'PDF' | 'TEXT' | 'LINK' | 'OTHER';
  content?: string;
}

interface HeaderRendererProps {
  header: Header;
}

/**
 * HeaderRenderer Component
 * Renders question group headers based on their media type
 */
export default function HeaderRenderer({ header }: HeaderRendererProps) {
  const { mediaType, content } = header;

  // IMAGE
  if (mediaType === 'IMAGE') {
    const imageSrc = content?.startsWith('http') || content?.startsWith('//') 
      ? content 
      : content 
        ? `/assets/${content}` 
        : '';
    
    
    if (!content) {
      return (
        <div className="header-item header-image mb--20">
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            No image content provided
          </div>
        </div>
      );
    }
    
    return (
      <div className="header-item header-image mb--20">
        <div className="image-wrapper" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <img
            src={imageSrc}
            alt="Header Image"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'block',
              margin: '0 auto',
            }}
            onError={(e) => {
              console.error('Image load error:', { content, imageSrc });
              const imgElement = e.target as HTMLImageElement;
              imgElement.style.display = 'none';
              // Show error message
              const wrapper = imgElement.parentElement;
              if (wrapper) {
                wrapper.innerHTML = `
                  <div style="padding: 20px; color: #856404;">
                    <i class="feather-alert-circle"></i> Image could not be loaded: ${content}
                  </div>
                `;
              }
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageSrc);
            }}
          />
        </div>
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
      <div className="header-item header-video mb--20">
        {content && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {isYouTube ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <iframe
                  src={getYouTubeEmbedUrl(content)}
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title="Header Video"
                />
              </div>
            ) : (
              <video
                controls
                style={{
                  width: '100%',
                  maxHeight: '450px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'block',
                }}
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
      <div className="header-item header-audio mb--20">
        {content && (
          <div className="audio-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <AudioPlayer src={content} minHeight={72} />
          </div>
        )}
      </div>
    );
  }

  // DOCUMENT
  if (mediaType === 'DOCUMENT') {
    return (
      <div className="header-item header-document mb--20">
        {content && (
          <div
            className="document-content"
            style={{
              padding: '20px',
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }

  // PDF – sadece indirme butonu, gösterim yok
  if (mediaType === 'PDF') {
    return (
      <div className="header-item header-pdf mb--20">
        {content && (
          <div className="pdf-wrapper">
            <a
              href={content}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rbt-btn btn-md bg-primary"
            >
              <span className="btn-text">Download PDF</span>
              <span className="btn-icon"><i className="feather-download"></i></span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // LINK
  if (mediaType === 'LINK') {
    return (
      <div className="header-item header-link mb--20">
        {content && (
          <div className="link-wrapper">
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="rbt-btn btn-md bg-primary"
            >
              <span className="btn-text">Open Link</span>
              <span className="btn-icon"><i className="feather-external-link"></i></span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // TEXT or OTHER – soru gövdesi gibi; siyah, kalın değil
  if (mediaType === 'TEXT' || mediaType === 'OTHER' || !mediaType) {
    return (
      <div className="header-item header-text mb--20">
        {content && (
          <div
            className="text-content"
            style={{
              padding: '0 20px',
              margin: '0px',
              lineHeight: 1.5,
              color: '#111',
              fontWeight: 400,
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="header-item header-unknown mb--20">
      {content && (
        <div
          className="unknown-content"
          style={{
            padding: '20px',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
