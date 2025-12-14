// components/course/MaterialViewer.tsx
import Link from "next/link";
import {CourseLessonPartMaterialDetailDTO} from "@/types/course/course";
import React from "react";


interface MaterialViewerProps {
    material: CourseLessonPartMaterialDetailDTO;
}

export function MaterialViewer({ material }: MaterialViewerProps) {

    if (!material) return null;




/*
    const renderMathContent = (text: string) => {
        // Inline math: $...$
        // Block math: $$...$$
        const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2);
                return <BlockMath key={index} math={math} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                const math = part.slice(1, -1);
                return <InlineMath key={index} math={math} />;
            }
            return <span key={index}>{part}</span>;
        });
    };

 */

    const getYouTubeVideoId = (url:string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

// YouTube URL'si olup olmadığını kontrol eden fonksiyon
    const isYouTubeUrl = (url:string) => {
        return url.includes('youtube.com') || url.includes('youtu.be');
    };

    const renderContent = () => {

        switch (material.mediaType) {
            case "VIDEO":
                const isYouTube = isYouTubeUrl(material.content || "");

                if (isYouTube) {
                    const videoId = getYouTubeVideoId(material.content || '');

                    if (videoId) {
                        return (
                            <div className="ratio ratio-16x9 mb-4">
                                <iframe
                                    className="w-100"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        );
                    }
                }

                // Normal video dosyaları için mevcut kod
                return (
                    <div className="ratio ratio-16x9 mb-4">
                        <video
                            className="w-100"
                            controls
                            src={material.content || ""}
                        >
                            Your browser does not support the video file.
                        </video>
                    </div>
                );

            case "AUDIO":
                return (
                    <div className="mb-4">
                        <audio
                            className="w-100"
                            controls
                            src={material.content || ""}
                        >
                            Your browser does not support the audio file.
                        </audio>
                    </div>
                );

            case "PDF":
                return (
                    <div className="mb-4 border border-4">
                        <iframe
                            src={material.content || ""}
                            className="w-100"
                            style={{ height: "600px" }}
                            title={material.name}
                        ></iframe>
                    </div>
                );

            case "DOCUMENT":
                return (
                    <div className="mb-4">
                        <a
                            href={material.content || ""}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                            download={material.uploadedFileName || undefined}
                        >
                            <i className="bi bi-file-earmark-text me-2"></i>
                            Download Document
                        </a>
                    </div>
                );

            case "IMAGE":
                return (
                    <div className="mb-4 text-center">
                        <img
                            src={`/assets/${material.content}`}
                            alt={material.name}
                            className="img-fluid"
                            style={{ maxHeight: "500px" }}
                        />
                    </div>
                );

            case "LINK":
                return (
                    <div className="mb-4">
                        {material.content ? (
                            <Link
                                href={material.content}
                                className="btn btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-link-45deg me-2"></i>
                                Open Link
                            </Link>
                        ) : (
                            <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                No valid link found.
                            </div>
                        )}
                    </div>
                );

            case "TEXT":
            default:
                return (
                    <div className="mb-4 card">
                        <div className="card-body">
                            {material.content ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: material.content
                                            .replace(/\n/g, '<br/>')
                                            .replace(/\\n/g, '<br/>'),
                                    }}
                                />
                            ) : (
                                <div className="alert alert-warning">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    No content found.
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return <div className="material-viewer">{renderContent()}</div>;
}