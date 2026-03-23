"use client";

import type { CourseLessonPartMaterialDetailDTO } from "@/generated/api/openAPIDefinition.schemas";
import { getMediaServeUrl } from "@/lib/fileUtils";
import AudioPlayer from "@/components/ui/AudioPlayer";
import QuizItemsRenderer from "./QuizItemsRenderer";

interface MaterialRendererProps {
  material: CourseLessonPartMaterialDetailDTO;
  onVideoRef?: (
    materialId: string,
    element: HTMLVideoElement | HTMLAudioElement,
  ) => void;
  onPdfLoad?: (materialId: string) => void;
  onPdfDownload?: (materialId: string) => void;
  onLinkClick?: (materialId: string) => void;
  /** true ise quiz sorularının altında AIChat gösterilir (öğrenme amaçlı). Varsayılan: false. */
  showAIChat?: boolean;
}

export default function MaterialRenderer({
  material,
  onVideoRef,
  onPdfLoad,
  onPdfDownload,
  onLinkClick,
  showAIChat = false,
}: MaterialRendererProps) {
  const mediaType = material.mediaType;
  const content = material.content || "";

  // QUIZ: If material has quizItems, show only quiz items (ignore other media types)
  if (material.quizItems && material.quizItems.length > 0) {
    return (
      <QuizItemsRenderer
        quizItems={material.quizItems}
        courseLessonPartMaterialId={material.id}
        showAIChat={showAIChat}
      />
    );
  }

  // IMAGE
  if (mediaType === "IMAGE") {
    return (
      <div className="material-item material-image">
        {content && (
          <div className="image-wrapper">
            <img
              src={getMediaServeUrl(content)}
              alt={material.name || "Image"}
              style={{ maxWidth: "100%", height: "auto" }}
              onError={(e) => {
                console.error("Image load error:", content);
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
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
      <div className="material-item material-video">
        {content && (
          <div className="rbt-video-player">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(content)}
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={material.name || "Video"}
              />
            ) : (
              <video
                ref={(el) => {
                  if (el && material.id && onVideoRef) {
                    onVideoRef(material.id, el);
                  }
                }}
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
      <div className="material-item material-audio">
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
      <div className="material-item material-document">
        {content && (
          <div
            className="document-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }

  // PDF – sadece indirme butonu (ön izleme yok; bazı tarayıcılar iframe ile PDF desteklemiyor)
  if (mediaType === "PDF") {
    return (
      <div className="material-item material-pdf">
        {content && (
          <div className="pdf-wrapper">
            <a
              href={getMediaServeUrl(content)}
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
      <div className="material-item material-link">
        {content && (
          <div className="link-wrapper">
            <a
              href={getMediaServeUrl(content)}
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
              <span className="btn-icon">
                <i className="feather-external-link"></i>
              </span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // TEXT - Must be checked before OTHER to ensure proper rendering
  if (mediaType === "TEXT") {
    return (
      <div className="material-item material-text">
        {content ? (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-muted">No content</div>
        )}
      </div>
    );
  }

  // OTHER
  if (mediaType === "OTHER" || !mediaType) {
    return (
      <div className="material-item material-text">
        {content ? (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-muted">No content</div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="material-item material-unknown">
      {content && (
        <div
          className="unknown-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
