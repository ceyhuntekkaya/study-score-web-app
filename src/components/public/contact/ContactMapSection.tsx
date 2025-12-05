'use client';

import { getMapEmbedUrl, getContactData } from '@/lib/contact';

/**
 * Contact Map Section Component
 * Converted from template
 */
export default function ContactMapSection() {
  const mapUrl = getMapEmbedUrl();
  const { map } = getContactData();

  return (
    <div className="rbt-google-map bg-color-white rbt-section-gapTop">
      <iframe
        className="w-100"
        src={mapUrl}
        height={map.height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

