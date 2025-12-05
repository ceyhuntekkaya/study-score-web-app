'use client';

import { useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  title: string;
  items: FaqItem[];
  accordionId: string;
}

/**
 * FAQ Accordion Component
 * Reusable accordion for FAQ sections
 */
export default function FaqAccordion({ title, items, accordionId }: FaqAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set([items[0]?.id]));

  const toggleItem = (itemId: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(itemId)) {
      newOpen.delete(itemId);
    } else {
      newOpen.add(itemId);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="rbt-accordion-style accordion">
      <div className="section-title text-start mb--60">
        <h4 className="title">{title}</h4>
      </div>
      <div className="rbt-accordion-style rbt-accordion-04 accordion">
        <div className="accordion" id={accordionId}>
          {items.map((item) => (
            <div key={item.id} className="accordion-item card">
              <h2 className="accordion-header card-header" id={`heading-${item.id}`}>
                <button
                  className={`accordion-button ${openItems.has(item.id) ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={openItems.has(item.id)}
                  aria-controls={`collapse-${item.id}`}
                >
                  {item.question}
                </button>
              </h2>
              <div
                id={`collapse-${item.id}`}
                className={`accordion-collapse collapse ${openItems.has(item.id) ? 'show' : ''}`}
                aria-labelledby={`heading-${item.id}`}
                data-bs-parent={`#${accordionId}`}
              >
                <div className="accordion-body card-body">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

