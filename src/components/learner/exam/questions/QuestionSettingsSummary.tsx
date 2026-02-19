'use client';

import type { ReactNode } from 'react';

interface QuestionSettingsSummaryProps {
  children: ReactNode;
}

/**
 * Önizleme modunda soru ayarlarının kısa özetini göstermek için.
 * Uygulama modunda bu bileşen kullanılmamalı (öğrenciye ayar özeti gösterilmez).
 */
export default function QuestionSettingsSummary({ children }: QuestionSettingsSummaryProps) {
  return (
    <div
      className="question-settings-summary mt-3 p-3 rounded small text-muted"
      style={{
        backgroundColor: 'var(--rbt-bg-light, #f8f9fa)',
        border: '1px solid var(--rbt-border, #e9ecef)',
      }}
    >
      <strong className="text-body">Ayarlar özeti:</strong>
      <div className="mt-1">{children}</div>
    </div>
  );
}
