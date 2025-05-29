
import React from 'react';
import { ActiveFilters, PriorityLevel } from '../types';

interface FilterControlsProps {
  activeFilters: ActiveFilters;
  onSetFilter: (filterType: keyof ActiveFilters, value: string | undefined) => void;
  projectsInView: string[];
  prioritiesInView: PriorityLevel[];
  isOpen: boolean;
  onToggle: () => void;
  onClearFilters: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  activeFilters,
  onSetFilter,
  projectsInView,
  prioritiesInView,
  isOpen,
  onToggle,
  onClearFilters,
}) => {
  const selectClass = "w-full p-2 text-sm bg-[rgb(var(--input-bg-color))] text-[rgb(var(--text-primary))] border border-[rgb(var(--input-border-color))] rounded-md focus:ring-1 focus:ring-[rgb(var(--accent-color))] focus:border-[rgb(var(--accent-color))] appearance-auto";
  const buttonClass = "px-3 py-1.5 text-xs font-medium rounded-md transition-colors";

  return (
    <div>
      <button
        onClick={onToggle}
        className="p-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent-color))] focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="filter-dropdown"
        title="Open filters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>

      {isOpen && (
        <div 
            id="filter-dropdown" 
            className="absolute right-0 mt-2 w-64 bg-[rgb(var(--card-bg-color))] border border-[rgb(var(--divider-color))] rounded-lg shadow-xl z-20 p-4 space-y-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div>
            <label htmlFor="project-filter" className="block text-xs font-medium text-[rgb(var(--text-secondary))] mb-1">Filter by Project:</label>
            <select
              id="project-filter"
              value={activeFilters.project || ''}
              onChange={(e) => onSetFilter('project', e.target.value || undefined)}
              className={selectClass}
            >
              <option value="">All Projects</option>
              {projectsInView.map(proj => (
                <option key={proj} value={proj}>{proj}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority-filter" className="block text-xs font-medium text-[rgb(var(--text-secondary))] mb-1">Filter by Priority:</label>
            <select
              id="priority-filter"
              value={activeFilters.priority || ''}
              onChange={(e) => onSetFilter('priority', e.target.value || undefined)}
              className={selectClass}
            >
              <option value="">All Priorities</option>
              {Object.values(PriorityLevel).map(level => {
                // Optionally, only show priorities that are actually in prioritiesInView if desired
                // if (prioritiesInView.length > 0 && !prioritiesInView.includes(level) && level !== PriorityLevel.Normal) return null;
                return (
                    <option key={level} value={level}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                    </option>
                );
              })}
            </select>
          </div>
          
          <button
            onClick={onClearFilters}
            className={`${buttonClass} w-full bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80`}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
