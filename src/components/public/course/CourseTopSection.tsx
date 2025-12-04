'use client';

import { useState, FormEvent } from 'react';

interface CourseTopSectionProps {
  totalResults?: number;
  showingFrom?: number;
  showingTo?: number;
  onSearch?: (query: string) => void;
  onFilterToggle?: () => void;
  onViewChange?: (view: 'grid' | 'list') => void;
}

/**
 * Course Top Section Component
 * Converted from template - includes grid/list view, search, filter button
 */
export default function CourseTopSection({
  totalResults = 19,
  showingFrom = 1,
  showingTo = 9,
  onSearch,
  onFilterToggle,
  onViewChange,
}: CourseTopSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewChange?.(mode);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="rbt-course-top-wrapper mt--40 mt_sm--20">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5 col-md-12">
            <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
              <div className="rbt-short-item switch-layout-container">
                <ul className="course-switch-layout">
                  <li className="course-switch-item">
                    <button
                      className={`rbt-grid-view ${viewMode === 'grid' ? 'active' : ''}`}
                      title="Grid Layout"
                      onClick={() => handleViewChange('grid')}
                    >
                      <i className="feather-grid"></i> <span className="text">Grid</span>
                    </button>
                  </li>
                  <li className="course-switch-item">
                    <button
                      className={`rbt-list-view ${viewMode === 'list' ? 'active' : ''}`}
                      title="List Layout"
                      onClick={() => handleViewChange('list')}
                    >
                      <i className="feather-list"></i> <span className="text">List</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="rbt-short-item">
                <span className="course-index">
                  Showing {showingFrom}-{showingTo} of {totalResults} results
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-7 col-md-12">
            <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
              <div className="rbt-short-item">
                <form action="#" className="rbt-search-style me-0" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search Your Course.."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="rbt-search-btn rbt-round-btn">
                    <i className="feather-search"></i>
                  </button>
                </form>
              </div>

              <div className="rbt-short-item">
                <div className="view-more-btn text-start text-sm-end">
                  <button
                    className="discover-filter-button discover-filter-activation rbt-btn btn-white btn-md radius-round"
                    onClick={onFilterToggle}
                  >
                    Filter<i className="feather-filter"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

