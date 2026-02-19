'use client';

export interface QuestionBodyProps {
  /** Soru metni – her soruda mutlaka görünür (gövde). API'den gelmezse fallback gösterilir. */
  questionText: string;
  /** Opsiyonel alt açıklama / prompt (Essay, Audio, Video, Image vb. şablonlarda kullanılır) */
  prompt?: string | null;
}

const FALLBACK_TEXT = 'Soru metni';

/**
 * Soru gövdesi – tüm soru şablonlarında üstte görünen başlık + opsiyonel prompt.
 * Her template bu bileşeni kullanarak soru metnini tutarlı gösterir.
 * questionText boşsa (API'den gelmemişse) fallback metin gösterilir.
 */


export default function QuestionBody({ questionText, prompt }: QuestionBodyProps) {
  const displayHtml = (questionText ?? '').trim() || FALLBACK_TEXT;
  return (
    <div className="question-text mb--30" data-question-body>
      <div
        className="rbt-title-style-2 mb--20"
        style={{ fontSize: '18px', fontWeight: '400', color: '#111', textTransform: 'none' }}
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />
      {prompt && (
        <div
          style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}
          dangerouslySetInnerHTML={{ __html: prompt }}
        />
      )}
    </div>
  );
}
