'use client';

interface QuestionAIChatButtonProps {
  questionId: string;
  /** Optional label override */
  label?: string;
}

/**
 * AI Chat butonu – aiReady true olduğunda soru altında gösterilir.
 * Chat komponenti sonra bağlanacak; şimdilik placeholder.
 */
export default function QuestionAIChatButton({
  questionId,
  label = 'AI ile Soru Hakkında Konuş',
}: QuestionAIChatButtonProps) {
  const handleClick = () => {
    // TODO: Chat paneli açılacak / modal vs.
    console.log('AI Chat requested for question:', questionId);
  };

  return (
    <div className="question-ai-chat mt-3">
      <button
        type="button"
        onClick={handleClick}
        className="btn btn-outline-primary btn-sm"
        aria-label={label}
      >
        <i className="feather-message-circle me-2" aria-hidden />
        {label}
      </button>
    </div>
  );
}
