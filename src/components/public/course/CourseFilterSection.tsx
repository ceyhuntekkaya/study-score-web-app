'use client';

import { useState } from 'react';

interface CourseFilterSectionProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  sortBy: string;
  author: string[];
  offer: string;
  category: string;
  priceRange: { min: number; max: number };
}

/**
 * Course Filter Section Component
 * Converted from template - uses React state instead of jQuery
 */
export default function CourseFilterSection({ onFilterChange }: CourseFilterSectionProps) {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'Default',
    author: [],
    offer: 'Free',
    category: 'Web Design',
    priceRange: { min: 0, max: 1000 },
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const authors = [
    'Janin Afsana',
    'Joe Biden',
    'Fatima Asrafy',
    'Aysha Baby',
    'Mohamad Ali',
    'Jone Li',
    'Alberd Roce',
    'Zeliski Noor',
  ];

  const categories = ['Web Design', 'Graphic', 'App Development', 'Figma Design'];

  return (
    <div className={`default-exp-wrapper ${isExpanded ? 'default-exp-expand' : ''}`}>
      <div className="filter-inner">
        <div className="filter-select-option">
          <div className="filter-select rbt-modern-select">
            <span className="select-label d-block">Short By</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option>Default</option>
              <option>Latest</option>
              <option>Popularity</option>
              <option>Trending</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="filter-select-option">
          <div className="filter-select rbt-modern-select">
            <span className="select-label d-block">Short By Author</span>
            <select
              multiple
              value={filters.author}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                handleFilterChange('author', selected);
              }}
            >
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-select-option">
          <div className="filter-select rbt-modern-select">
            <span className="select-label d-block">Short By Offer</span>
            <select
              value={filters.offer}
              onChange={(e) => handleFilterChange('offer', e.target.value)}
            >
              <option>Free</option>
              <option>Paid</option>
              <option>Premium</option>
            </select>
          </div>
        </div>

        <div className="filter-select-option">
          <div className="filter-select rbt-modern-select">
            <span className="select-label d-block">Short By Category</span>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-select-option">
          <div className="filter-select">
            <span className="select-label d-block">Price Range</span>
            <div className="price_filter s-filter clear">
              <form action="#" method="GET">
                <div className="slider__range--output">
                  <div className="price__output--wrap">
                    <div className="price--output">
                      <span>Price :</span>
                      <input
                        type="text"
                        id="amount"
                        value={`$${filters.priceRange.min} - $${filters.priceRange.max}`}
                        readOnly
                      />
                    </div>
                    <div className="price--filter">
                      <button
                        type="button"
                        className="rbt-btn btn-gradient btn-sm"
                        onClick={() => onFilterChange?.(filters)}
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

