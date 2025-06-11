
import React from 'react';
import { Entry } from '../types';
import EntryItem from './EntryItem';

interface ArchivedNoteListProps {
  notes: Entry[];
  onOpenDetailModal: (entry: Entry) => void;
  existingProjects: string[]; // Added for consistency
}

const ArchivedNoteList: React.FC<ArchivedNoteListProps> = ({ notes, onOpenDetailModal, existingProjects }) => {
  if (notes.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No archived notes.</p>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <EntryItem
          key={note.id}
          entry={note}
          allowActions={false} 
          onOpenDetailModal={onOpenDetailModal}
          onOpenQuickSnoozeMenu={(_entry, _event) => {}} // Added no-op function
          draggedItemId={null}
          onDragStartHandler={() => {}}
          onDropHandler={() => {}}
          onDragEndHandler={() => {}}
          existingProjects={existingProjects} // Pass prop
        />
      ))}
    </div>
  );
};

export default ArchivedNoteList;
