'use client';

import { useState, useEffect } from 'react';

interface CourseDetailsNavigationProps {
  sections?: string[];
}

/**
 * Course Details Navigation Component
 * Converted from template - sticky navigation with scroll spy
 */
export default function CourseDetailsNavigation({
  sections = ['overview', 'coursecontent', 'details', 'intructor', 'review'],
}: CourseDetailsNavigationProps) {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const sectionLabels: Record<string, string> = {
    overview: 'Overview',
    coursecontent: 'Course Content',
    details: 'Details',
    intructor: 'Intructor',
    review: 'Review',
  };

  const handleClick = (section: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(section);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(section);
    }
  };

  return (
    <div className="rbt-inner-onepage-navigation sticky-top mt--30">
      <nav className="mainmenu-nav onepagenav">
        <ul className="mainmenu">
          {sections.map((section) => (
            <li key={section} className={activeSection === section ? 'current' : ''}>
              <a href={`#${section}`} onClick={(e) => handleClick(section, e)}>
                {sectionLabels[section] || section}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

