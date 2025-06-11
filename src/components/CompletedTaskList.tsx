

import React, { useState } from 'react';
import { Entry } from '../types';
import { getWeekOfYear, formatWeekDateRange } from '../utils/dateUtils';
import EntryItem from './EntryItem';

interface CompletedTaskListProps {
  tasks: Entry[];
  onOpenDetailModal: (entry: Entry) => void;
  existingProjects: string[]; 
}

const CompletedTaskList: React.FC<CompletedTaskListProps> = ({ tasks, onOpenDetailModal, existingProjects }) => {
  const [copiedWeekKey, setCopiedWeekKey] = useState<string | null>(null);

  if (tasks.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No completed tasks yet.</p>;
  }

  const groupedTasks: Record<string, Entry[]> = tasks.reduce((acc, task) => {
    if (task.completedAt) {
      const { week, year } = getWeekOfYear(task.completedAt);
      const weekRange = formatWeekDateRange(task.completedAt);
      const key = `Week ${week} ${weekRange}, ${year}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(task);
    }
    return acc;
  }, {} as Record<string, Entry[]>);
  
  const sortedGroupKeys = Object.keys(groupedTasks).sort((a, b) => {
    const matchA = a.match(/Week (\d+) .*?, (\d+)/);
    const matchB = b.match(/Week (\d+) .*?, (\d+)/);
    
    if (!matchA || !matchB) return 0;

    const yearA = parseInt(matchA[2]);
    const yearB = parseInt(matchB[2]);
    if (yearA !== yearB) return yearB - yearA; 

    const weekA = parseInt(matchA[1]);
    const weekB = parseInt(matchB[1]);
    return weekB - weekA; 
  });

  const handleCopyTitles = async (tasksInGroup: Entry[], groupKey: string) => {
    const titles = tasksInGroup.map(task => task.title).join('\n');
    try {
      await navigator.clipboard.writeText(titles);
      setCopiedWeekKey(groupKey);
      setTimeout(() => setCopiedWeekKey(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy titles: ', err);
      alert('Failed to copy titles. See console for details.');
    }
  };


  return (
    <div className="space-y-5">
      {sortedGroupKeys.map(groupKey => (
        <div key={groupKey}>
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-[rgb(var(--divider-color))]">
            <h3 className="text-md font-semibold text-[rgb(var(--text-secondary))]">{groupKey}</h3>
            <button
              onClick={() => handleCopyTitles(groupedTasks[groupKey], groupKey)}
              className="p-1.5 rounded-full text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent-color))] hover:bg-[rgba(var(--accent-color),0.1)] transition-colors duration-150"
              title="Copy titles for this week"
              aria-label="Copy titles for this week"
            >
              {copiedWeekKey === groupKey ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[rgb(var(--completed-accent-color))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <div className="space-y-3">
            {groupedTasks[groupKey]
              .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()) 
              .map(task => (
                <EntryItem 
                  key={task.id} 
                  entry={task} 
                  allowActions={false} 
                  onOpenDetailModal={onOpenDetailModal}
                  onOpenQuickSnoozeMenu={(_entry, _event) => {}} // Added no-op function
                  draggedItemId={null} 
                  onDragStartHandler={() => {}}
                  onDropHandler={() => {}}
                  onDragEndHandler={() => {}}
                  existingProjects={existingProjects} 
                />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedTaskList;
