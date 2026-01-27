'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from './Button';

interface SimpleHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SimpleHtmlEditor({
  value,
  onChange,
  placeholder = 'İçerik girin...',
  className = '',
}: SimpleHtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);

  useEffect(() => {
    if (!showCodeView && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, showCodeView]);

  useEffect(() => {
    if (showCodeView && textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value || '';
    }
  }, [value, showCodeView]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const toggleView = () => {
    if (showCodeView) {
      // Switching from code view to WYSIWYG
      if (textareaRef.current && editorRef.current) {
        editorRef.current.innerHTML = textareaRef.current.value || '';
      }
    } else {
      // Switching from WYSIWYG to code view
      if (editorRef.current && textareaRef.current) {
        textareaRef.current.value = editorRef.current.innerHTML || '';
      }
    }
    setShowCodeView(!showCodeView);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  const ToolbarButton = ({
    command,
    icon,
    title,
    value,
  }: {
    command: string;
    icon: string;
    title: string;
    value?: string;
  }) => (
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={() => execCommand(command, value)}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      <i className={icon}></i>
    </button>
  );

  return (
    <div className={`simple-html-editor ${className}`}>
      <div className="editor-toolbar border rounded-top p-2 bg-light d-flex gap-1 flex-wrap justify-content-between align-items-center">
        <div className="d-flex gap-1 flex-wrap">
          {!showCodeView && (
            <>
              <ToolbarButton command="bold" icon="feather-bold" title="Kalın" />
              <ToolbarButton command="italic" icon="feather-italic" title="İtalik" />
              <ToolbarButton command="underline" icon="feather-underline" title="Altı Çizili" />
              <div className="vr"></div>
              <ToolbarButton command="justifyLeft" icon="feather-align-left" title="Sola Hizala" />
              <ToolbarButton command="justifyCenter" icon="feather-align-center" title="Ortala" />
              <ToolbarButton command="justifyRight" icon="feather-align-right" title="Sağa Hizala" />
              <div className="vr"></div>
              <ToolbarButton command="insertUnorderedList" icon="feather-list" title="Madde İşareti" />
              <ToolbarButton command="insertOrderedList" icon="feather-list" title="Numaralı Liste" />
              <div className="vr"></div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  const url = prompt('Link URL girin:');
                  if (url) {
                    execCommand('createLink', url);
                  }
                }}
                title="Link Ekle"
                onMouseDown={(e) => e.preventDefault()}
              >
                <i className="feather-link"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => execCommand('removeFormat')}
                title="Formatı Temizle"
                onMouseDown={(e) => e.preventDefault()}
              >
                <i className="feather-x"></i>
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={toggleView}
          title={showCodeView ? 'WYSIWYG Görünümü' : 'HTML Kodu'}
        >
          <i className={`feather-${showCodeView ? 'eye' : 'code'} me-1`}></i>
          {showCodeView ? 'WYSIWYG' : 'HTML'}
        </button>
      </div>
      {showCodeView ? (
        <textarea
          ref={textareaRef}
          className="border border-top-0 rounded-bottom p-3"
          style={{
            minHeight: '200px',
            maxHeight: '400px',
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'vertical',
            outline: 'none',
          }}
          value={value || ''}
          onChange={handleCodeChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className={`editor-content border border-top-0 rounded-bottom p-3 ${
            isFocused ? 'editor-content-focus' : ''
          }`}
          style={{
            minHeight: '200px',
            maxHeight: '400px',
            overflowY: 'auto',
            outline: 'none',
          }}
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      )}
      <style>{`
        .simple-html-editor .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
        }
        .simple-html-editor .editor-content-focus {
          border-color: #80bdff !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        .simple-html-editor textarea:focus {
          border-color: #80bdff !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      `}</style>
    </div>
  );
}
