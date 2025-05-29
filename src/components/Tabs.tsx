

import React from 'react';
import { TabView, ActiveFilters, PriorityLevel } from '../types';
import FilterControls from './FilterControls'; // New import

interface TabsProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  activeTaskCount: number;
  noteCount: number;
  // Filter props
  activeFilters: ActiveFilters;
  onSetFilter: (filterType: keyof ActiveFilters, value: string | undefined) => void;
  projectsInView: string[];
  prioritiesInView: PriorityLevel[];
  isFilterDropdownOpen: boolean;
  onToggleFilterDropdown: () => void;
  onClearFilters: () => void;
  filterDropdownRef: React.RefObject<HTMLDivElement>;
}

const TabButton: React.FC<{
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 sm:flex-none px-3 py-3 text-sm font-medium focus:outline-none transition-all duration-200 ease-in-out relative
      ${isActive 
        ? 'text-[rgb(var(--accent-color))]' 
        : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgba(var(--accent-color),0.05)]'
      }
    `}
    role="tab"
    aria-selected={isActive}
  >
    {label} 
    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200
      ${isActive 
        ? 'bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))]' 
        : 'bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))]'
      }
    `}>{count}</span>
    {isActive && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--accent-color))]"></span>
    )}
  </button>
);

const Tabs: React.FC<TabsProps> = ({ 
  activeTab, 
  onTabChange, 
  activeTaskCount, 
  noteCount,
  activeFilters,
  onSetFilter,
  projectsInView,
  prioritiesInView,
  isFilterDropdownOpen,
  onToggleFilterDropdown,
  onClearFilters,
  filterDropdownRef
}) => {
  return (
    <div className="border-b border-[rgb(var(--divider-color))] flex justify-between items-center bg-[rgb(var(--card-bg-color))] rounded-t-lg" role="tablist">
      <div className="flex">
        <TabButton 
          label="Active Tasks" 
          count={activeTaskCount}
          isActive={activeTab === TabView.ActiveTasks} 
          onClick={() => onTabChange(TabView.ActiveTasks)} 
        />
        <TabButton 
          label="Notes" 
          count={noteCount}
          isActive={activeTab === TabView.Notes} 
          onClick={() => onTabChange(TabView.Notes)} 
        />
      </div>
      <div className="relative pr-2" ref={filterDropdownRef}>
        <FilterControls
            activeFilters={activeFilters}
            onSetFilter={onSetFilter}
            projectsInView={projectsInView}
            prioritiesInView={prioritiesInView}
            isOpen={isFilterDropdownOpen}
            onToggle={onToggleFilterDropdown}
            onClearFilters={onClearFilters}
        />
      </div>
    </div>
  );
};

export default Tabs;