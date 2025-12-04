'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CourseFormData } from './types';

interface CertificateTemplateSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: CourseFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Certificate Template Section Component
 * Fifth accordion section for certificate template selection
 */
export default function CertificateTemplateSection({
  isOpen,
  onToggle,
  formData,
  onInputChange,
}: CertificateTemplateSectionProps) {
  const [certificateTab, setCertificateTab] = useState<'landscape' | 'portrait'>('landscape');

  return (
    <div className="accordion-item card">
      <h2 className="accordion-header card-header" id="accSeven">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="accCollapseEight"
        >
          Certificate Template
        </button>
      </h2>
      <div
        id="accCollapseEight"
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        aria-labelledby="accSeven"
        data-bs-parent="#tutionaccordionExamplea1"
      >
        <div className="accordion-body card-body">
          <div className="advance-tab-button advance-tab-button-1">
            <ul className="rbt-default-tab-button nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className={certificateTab === 'landscape' ? 'active' : ''}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCertificateTab('landscape');
                  }}
                >
                  <span>Landscape</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={certificateTab === 'portrait' ? 'active' : ''}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCertificateTab('portrait');
                  }}
                >
                  <span>Portrait</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="tab-content">
                {certificateTab === 'landscape' && (
                  <div className="tab-pane fade advance-tab-content-1 active show" id="landscape" role="tabpanel">
                    <div className="row g-5 mt--10">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className="col-lg-4">
                          <div className="certificate-inner rbt-image-checkbox">
                            <input
                              type="radio"
                              id={`option${num}`}
                              name="certificateTemplate"
                              value={`landscape-${num}`}
                              checked={formData.certificateTemplate === `landscape-${num}`}
                              onChange={onInputChange}
                            />
                            <label htmlFor={`option${num}`}>
                              <Image
                                src={`/assets/images/${num === 1 ? 'icons/certificate-none.svg' : `others/preview-0${num - 1}.png`}`}
                                alt="Certificate Image"
                                width={200}
                                height={150}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {certificateTab === 'portrait' && (
                  <div className="tab-pane fade advance-tab-content-1 active show" id="portrait" role="tabpanel">
                    <div className="row g-5 mt--10">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className="col-lg-4">
                          <div className="certificate-inner rbt-image-checkbox">
                            <input
                              type="radio"
                              id={`optionport${num}`}
                              name="certificateTemplate"
                              value={`portrait-${num}`}
                              checked={formData.certificateTemplate === `portrait-${num}`}
                              onChange={onInputChange}
                            />
                            <label htmlFor={`optionport${num}`}>
                              <Image
                                src={`/assets/images/${num === 1 ? 'icons/certificate-none-portrait.svg' : `others/preview-port-0${num === 6 ? num : num - 1}.png`}`}
                                alt="Certificate Image"
                                width={200}
                                height={150}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

