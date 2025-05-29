


import React from 'react';
import { Entry, EntryType } from '../types'; 
import EntryItem from './EntryItem';

interface SnoozedListProps {
  entries: Entry[];
  onOpenDetailModal: (entry: Entry) => void;
  existingProjects: string[];
  onOpenSnoozeModal: (entry: Entry) => void;
  onUnsnoozeItem: (itemId: string) => void; 
  onDeleteRequest: (entry: Entry) => void;
  onArchiveRequest: (entry: Entry) => void;
  onToggleComplete: (id: string) => void;
  onOpenCompletionNotesModal: (task: Entry) => void;
  // Handlers for inline editing
  onStartEdit: (id: string, type: EntryType) => void;
  onSaveEdit: (
    id: string, 
    title: string, 
    details: string, 
    dueDate?: string, 
    contact?: string, 
    url?: string, 
    project?: string, 
    priority?: any,
    snoozedUntil?: string
  ) => void;
  onCancelEdit: (id: string) => void;
  editingNoteId: string | null;
  editingTaskId: string | null;
  // Drag and drop (likely unused here, but part of EntryItem's props)
  draggedItemId: string | null;
  onDragStartHandler: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (targetId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
}

const SnoozedList: React.FC<SnoozedListProps> = ({ 
    entries, 
    onOpenDetailModal, 
    existingProjects,
    onOpenSnoozeModal,
    onUnsnoozeItem,
    onDeleteRequest,
    onArchiveRequest,
    onToggleComplete,
    onOpenCompletionNotesModal,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    editingNoteId,
    editingTaskId,
    draggedItemId, 
    onDragStartHandler,
    onDropHandler,
    onDragEndHandler
}) => {
  if (entries.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No snoozed items.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <EntryItem
          key={entry.id}
          entry={entry}
          allowActions={true} 
          onOpenDetailModal={onOpenDetailModal}
          onOpenSnoozeModal={onOpenSnoozeModal}
          onUnsnoozeItem={onUnsnoozeItem}
          onDeleteRequest={onDeleteRequest}
          onArchiveRequest={onArchiveRequest}
          onToggleComplete={onToggleComplete}
          onOpenCompletionNotesModal={onOpenCompletionNotesModal}
          
          onStartEdit={() => onStartEdit(entry.id, entry.type)}
          onSaveEdit={onSaveEdit}
          onCancelEdit={() => onCancelEdit(entry.id)}
          isEditing={entry.type === EntryType.Note ? editingNoteId === entry.id : undefined} 
          editingTaskId={editingTaskId} 
          
          draggedItemId={draggedItemId}
          onDragStartHandler={onDragStartHandler}
          onDropHandler={onDropHandler}
          onDragEndHandler={onDragEndHandler}
          existingProjects={existingProjects}
        />
      ))}
    </div>
  );
};

export default SnoozedList;