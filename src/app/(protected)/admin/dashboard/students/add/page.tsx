'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

export default function AddStudentPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div className="rbt-page-title d-flex justify-content-between align-items-center mb--20">
        <div>
          <h2>Yeni Öğrenci Ekle</h2>
          <Link href="/admin/dashboard/students" className="rbt-btn-link">
            <i className="feather-arrow-left me-1"></i>
            Öğrenciler Listesine Dön
          </Link>
        </div>
      </div>
      <div className="rbt-dashboard-content-wrapper">
        <p>Form içeriği yakında eklenecek...</p>
      </div>
    </>
  );
}
