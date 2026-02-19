/**
 * Question response media (audio/video) upload for AUDIO_RESPONSE and VIDEO_RESPONSE.
 * Flow: upload blob via POST /files/upload → use returned path to build serve URL → send that URL in answerData (POST /api/question-responses).
 */
import { customInstance } from '@/lib/api-client';
import { getFilePreviewUrl } from '@/lib/fileUtils';

const OBJECT_TYPE = 'QUESTION_RESPONSE';

/**
 * Upload one or more blobs to POST /files/upload. Returns serve URLs (not raw paths).
 * Backend accepts WebM for both audio and video (browser MediaRecorder default).
 */
export async function uploadQuestionResponseMedia(
  blobs: Blob[],
  fileProp: 'audio' | 'video',
  fileNames?: string[]
): Promise<string[]> {
  if (blobs.length === 0) return [];
  const formData = new FormData();
  blobs.forEach((blob, i) => {
    const name = fileNames?.[i] ?? (fileProp === 'audio' ? 'recording.webm' : i === 0 ? 'recording.webm' : `thumbnail-${i}.jpg`);
    formData.append('files', blob, name);
  });
  formData.append('objectType', OBJECT_TYPE);
  formData.append('fileProp', fileProp);

  const paths = await customInstance<string[]>({
    url: '/files/upload',
    method: 'POST',
    data: formData,
  });

  return (Array.isArray(paths) ? paths : [paths]).map((p) => getFilePreviewUrl(String(p)));
}

/** Upload a single audio blob; returns the serve URL for the recording. */
export async function uploadQuestionResponseAudio(blob: Blob): Promise<string> {
  const urls = await uploadQuestionResponseMedia([blob], 'audio');
  if (urls.length === 0) throw new Error('Upload returned no path');
  return urls[0];
}

/** Upload video blob and optional thumbnail blob; returns { videoUrl, thumbnailUrl? }. */
export async function uploadQuestionResponseVideo(
  videoBlob: Blob,
  thumbnailBlob?: Blob
): Promise<{ videoUrl: string; thumbnailUrl?: string }> {
  const blobs = thumbnailBlob ? [videoBlob, thumbnailBlob] : [videoBlob];
  const names = thumbnailBlob ? ['recording.webm', 'thumbnail.jpg'] : undefined;
  const urls = await uploadQuestionResponseMedia(blobs, 'video', names);
  return {
    videoUrl: urls[0] ?? '',
    thumbnailUrl: urls[1],
  };
}
