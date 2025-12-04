'use client';

import { ContentProvider, useContent } from '@/contexts/ContentContext';
import { useTranslation } from '@/i18n';

function ContentPageContent() {
  const { currentContent, contentProgress, setCurrentContent, updateProgress } = useContent();
  const { t } = useTranslation();

  const handleLoadContent = () => {
    setCurrentContent({
      id: 'content-1',
      title: 'Sample Content',
      sections: [
        { id: 1, title: 'Section 1', content: 'Content for section 1' },
        { id: 2, title: 'Section 2', content: 'Content for section 2' },
      ],
    });
  };

  return (
    <div>
      <h1>Learner Content</h1>
      <p>This is the learner content page. Content type: Content</p>
      <p>F5 yapıldığında bu sayfadan devam edeceksiniz.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Content Progress: {contentProgress}%</h3>
        {currentContent ? (
          <div>
            <h4>{currentContent.title}</h4>
            <p>Sections: {currentContent.sections?.length || 0}</p>
            <button
              onClick={() => updateProgress(Math.min(contentProgress + 10, 100))}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Increase Progress
            </button>
          </div>
        ) : (
          <button
            onClick={handleLoadContent}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Content
          </button>
        )}
      </div>
    </div>
  );
}

export default function LearnerContentPage() {
  return (
    <ContentProvider>
      <ContentPageContent />
    </ContentProvider>
  );
}

