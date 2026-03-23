"use client";

import AudioPlayer from "@/components/ui/AudioPlayer";
import { getMediaServeUrl } from "@/lib/fileUtils";
import type { QuestionHeaderDetailDTO } from "@/generated/api/openAPIDefinition.schemas";

interface HeaderRendererProps {
  header: QuestionHeaderDetailDTO;
}

/**
 * HeaderRenderer Component
 * Renders question group headers based on their media type
 */
export default function HeaderRenderer({ header }: HeaderRendererProps) {
  const { mediaType, content } = header;

  // IMAGE
  if (mediaType === "IMAGE") {
    const imageSrc = getMediaServeUrl(content ?? "");

    if (!content) {
      return (
        <div className="header-item header-image mb--20">
          <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
            No image content provided
          </div>
        </div>
      );
    }

    return (
      <div className="header-item header-image">
        <div className="image-wrapper">
          <img
            src={imageSrc}
            alt="Header Image"
            onError={(e) => {
              console.error("Image load error:", { content, imageSrc });
              const imgElement = e.target as HTMLImageElement;
              imgElement.style.display = "none";
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", imageSrc);
            }}
          />
        </div>
      </div>
    );
  }

  // VIDEO
  if (mediaType === "VIDEO") {
    const isYouTube =
      content &&
      (content.includes("youtube.com") ||
        content.includes("youtu.be") ||
        content.startsWith("https://www.youtube.com"));

    const getYouTubeEmbedUrl = (url: string): string => {
      if (url.includes("/embed/")) return url;
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1]?.split("&")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      return url;
    };

    return (
      <div className="header-item header-video">
        {content && (
          <div className="rbt-video-player">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(content)}
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="Header Video"
              />
            ) : (
              <video
                controls
                src={getMediaServeUrl(content)}
                onError={(e) => {
                  console.error("Video load error:", content);
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
  if (mediaType === "AUDIO") {
    return (
      <div className="header-item header-audio">
        {content && (
          <div className="audio-wrapper">
            <AudioPlayer src={getMediaServeUrl(content)} minHeight={72} />
          </div>
        )}
      </div>
    );
  }

  // DOCUMENT
  if (mediaType === "DOCUMENT") {
    return (
      <div className="header-item header-document">
        {content && (
          <div
            className="document-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }

  // PDF – sadece indirme butonu, gösterim yok
  if (mediaType === "PDF") {
    return (
      <div className="header-item header-pdf">
        {content && (
          <div className="pdf-wrapper">
            <a
              href={getMediaServeUrl(content)}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rbt-btn btn-md bg-primary"
            >
              <span className="btn-text">Download PDF</span>
              <span className="btn-icon">
                <i className="feather-download"></i>
              </span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // LINK
  if (mediaType === "LINK") {
    return (
      <div className="header-item header-link">
        {content && (
          <div className="link-wrapper">
            <a
              href={getMediaServeUrl(content)}
              target="_blank"
              rel="noopener noreferrer"
              className="rbt-btn btn-md bg-primary"
            >
              <span className="btn-text">Open Link</span>
              <span className="btn-icon">
                <i className="feather-external-link"></i>
              </span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // TEXT or OTHER – soru gövdesi gibi; siyah, kalın değil
  if (mediaType === "TEXT" || mediaType === "OTHER" || !mediaType) {
    return (
      <div className="header-item header-text">
        {content && (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="header-item header-unknown">
      {content && (
        <div
          className="unknown-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
