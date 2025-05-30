
import React from 'react';
import { Entry } from '../types';
import EntryItem from './EntryItem';

interface ActiveTaskListProps {
  tasks: Entry[];
  onToggleComplete: (id: string) => void; 
  onDeleteRequest: (entry: Entry) => void;
  editingTaskId: string | null;
  onStartEditTask: (id: string) => void;
  onSaveTaskEdit: (id: string, title: string, details: string, dueDate?: string, contact?: string, url?: string, project?: string, priority?: any, snoozedUntil?: string) => void;
  onCancelEditTask: (id: string) => void;
  onOpenDetailModal: (entry: Entry) => void;
  onOpenCompletionNotesModal: (task: Entry) => void;
  onOpenSnoozeModal: (entry: Entry) => void; 
  onUnsnoozeItem: (itemId: string) => void;
  draggedItemId: string | null;
  onDragStartHandler: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (targetId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  existingProjects: string[];
  animateWakeUpForIds: Set<string>; 
}

const ActiveTaskList: React.FC<ActiveTaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDeleteRequest,
  editingTaskId,
  onStartEditTask,
  onSaveTaskEdit,
  onCancelEditTask,
  onOpenDetailModal,
  onOpenCompletionNotesModal,
  onOpenSnoozeModal,
  onUnsnoozeItem,
  draggedItemId,
  onDragStartHandler,
  onDropHandler,
  onDragEndHandler,
  existingProjects,
  animateWakeUpForIds,
}) => {
  if (tasks.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No active tasks!</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <EntryItem
          key={task.id}
          entry={task}
          onToggleComplete={onToggleComplete}
          onDeleteRequest={onDeleteRequest}
          editingTaskId={editingTaskId} 
          onStartEdit={onStartEditTask} 
          onSaveEdit={onSaveTaskEdit}   
          onCancelEdit={onCancelEditTask} 
          allowActions={true}
          onOpenDetailModal={onOpenDetailModal}
          onOpenCompletionNotesModal={onOpenCompletionNotesModal}
          onOpenSnoozeModal={onOpenSnoozeModal}
          onUnsnoozeItem={onUnsnoozeItem}
          draggedItemId={draggedItemId}
          onDragStartHandler={onDragStartHandler}
          onDropHandler={onDropHandler}
          onDragEndHandler={onDragEndHandler}
          existingProjects={existingProjects}
          animateNow={animateWakeUpForIds.has(task.id)}
        />
      ))}
    </div>
  );
};

export default ActiveTaskList;