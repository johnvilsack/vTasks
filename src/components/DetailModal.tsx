


import React from 'react';
import { Entry, EntryType, PriorityLevel } from '../types'; // Added PriorityLevel
import { formatDate, formatDueDate, formatArchivedAtDate } from '../utils/dateUtils';

interface DetailModalProps {
  entry: Entry | null;
  onClose: () => void;
  onToggleComplete?: (id: string) => void; 
  onDeleteRequest?: (entry: Entry) => void; 
  onArchiveRequest?: (entry: Entry) => void;
  onStartEdit?: (id: string, type: EntryType) => void; 
  onOpenCompletionNotesModal?: (task: Entry) => void; 
  onOpenSnoozeModal?: (entry: Entry) => void;
  onUnsnoozeItem?: (itemId: string) => void; // Added
}

const ActionIconButton: React.FC<{ onClick: (e: React.MouseEvent) => void; ariaLabel: string; title: string; children: React.ReactNode; className?: string }> = 
  ({ onClick, ariaLabel, title, children, className }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-full transition-colors duration-150 ${className}`}
    aria-label={ariaLabel}
    title={title}
  >
    {children}
  </button>
);

const DetailModal: React.FC<DetailModalProps> = ({ entry, onClose, onToggleComplete, onDeleteRequest, onArchiveRequest, onStartEdit, onOpenCompletionNotesModal, onOpenSnoozeModal, onUnsnoozeItem }) => {
  if (!entry) return null;

  const DetailItem: React.FC<{ label: string; value?: string | PriorityLevel | null, isLink?: boolean, inputType?: 'date' }> = ({ label, value, isLink, inputType }) => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) return null;
    
    let displayValue = value;
    if (label === "Priority" && typeof value === 'string' && Object.values(PriorityLevel).includes(value as PriorityLevel)) {
        displayValue = value.charAt(0) + value.slice(1).toLowerCase();
    }

    return (
      <div className="mb-3">
        <p className="text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">{label}</p>
        {isLink && typeof displayValue === 'string' ? (
          <a 
            href={displayValue.startsWith('http') ? displayValue : `https://${displayValue}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-[rgb(var(--accent-color))] hover:underline break-words"
            onClick={(e) => e.stopPropagation()}
          >
            {displayValue}
          </a>
        ) : inputType === 'date' && typeof displayValue === 'string' ? (
            // This is just for display, not an actual input. For actual input, use InputForm logic.
            <p className="text-sm text-[rgb(var(--text-primary))] break-words whitespace-pre-wrap dark-input-icons">{String(displayValue)}</p>
        ) : (
          <p className="text-sm text-[rgb(var(--text-primary))] break-words whitespace-pre-wrap">{String(displayValue)}</p>
        )}
      </div>
    );
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartEdit) {
      onStartEdit(entry.id, entry.type);
      onClose(); 
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteRequest) {
      onDeleteRequest(entry);
    }
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onArchiveRequest) {
      onArchiveRequest(entry); 
    }
  }

  const handleSnooze = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenSnoozeModal) {
        onOpenSnoozeModal(entry);
    }
  };

  const handleUnsnooze = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnsnoozeItem) {
      onUnsnoozeItem(entry.id);
      // Optionally close modal or update view, App.tsx handles state update
      onClose(); 
    }
  };
  
  const handleToggleComplete = () => {
    if (entry.type === EntryType.Task) {
        if (!entry.isCompleted && onOpenCompletionNotesModal) {
            onOpenCompletionNotesModal(entry);
        } else if (entry.isCompleted && onToggleComplete) { 
            onToggleComplete(entry.id);
        }
    }
  };

  const actionButtonBaseClass = "px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] flex items-center justify-center space-x-1.5";
  const primaryActionClass = `bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  
  const actionIconColor = "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent-color))]";
  const deleteIconColor = "text-[rgb(var(--destructive-color))] hover:text-[rgb(var(--destructive-color-hover))]";
  const isCurrentlySnoozed = entry.snoozedUntil && new Date(entry.snoozedUntil) > new Date();

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 relative pb-3 border-b border-[rgb(var(--divider-color))]">
            <h2 id="detail-modal-title" className="text-lg font-semibold text-[rgb(var(--text-primary))] break-words mr-32">
                {entry.title}
            </h2>
            <div className="absolute top-0 right-0 flex items-center space-x-0.5 pt-0 pr-0">
                 {onStartEdit && !entry.isCompleted && !entry.isArchived && ( 
                    <ActionIconButton onClick={handleEdit} ariaLabel={`Edit ${entry.type.toLowerCase()} ${entry.title}`} title="Edit" className={actionIconColor}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </ActionIconButton>
                )}
                {isCurrentlySnoozed && onUnsnoozeItem && !entry.isCompleted && !entry.isArchived &&(
                     <ActionIconButton onClick={handleUnsnooze} ariaLabel={`Unsnooze ${entry.type.toLowerCase()} ${entry.title}`} title="Unsnooze" className={`${actionIconColor} hover:text-green-400`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-2.474mem0 0l.475-2.076m4.125 0l.387 1.688m-1.542-1.688L12 10.5m0 0l-1.132-4.938L9 7.5m0 0l3 3m0 0l3-3m-3 3v4.5m0 0H9m3 0h3m-3 0a9 9 0 11-18 0 9 9 0 0118 0zM4 12.077A8.906 8.906 0 002.026 15C3.21 16.89 5.846 18 9 18s5.79-1.11 7.974-3A8.906 8.906 0 0020 12.077" />
                           <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
                        </svg>
                    </ActionIconButton>
                )}
                {!isCurrentlySnoozed && onOpenSnoozeModal && !entry.isCompleted && !entry.isArchived && ( 
                    <ActionIconButton onClick={handleSnooze} ariaLabel={`Snooze ${entry.type.toLowerCase()} ${entry.title}`} title="Snooze" className={actionIconColor}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </ActionIconButton>
                )}
                {entry.type === EntryType.Note && onArchiveRequest && ( 
                     <ActionIconButton onClick={handleArchive} ariaLabel={entry.isArchived ? `Unarchive note ${entry.title}` : `Archive note ${entry.title}`} title={entry.isArchived ? "Unarchive note" : "Archive note"} className={actionIconColor}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            {entry.isArchived ? 
                                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7H5V5zm5 8a1 1 0 100-2H8a1 1 0 100 2h2z" clipRule="evenodd" /> 
                                : 
                                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            }
                        </svg>
                    </ActionIconButton>
                )}
                {onDeleteRequest && ( 
                    <ActionIconButton onClick={handleDelete} ariaLabel={`Delete ${entry.type.toLowerCase()} ${entry.title}`} title="Delete" className={deleteIconColor}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </ActionIconButton>
                )}
                 <button 
                    onClick={onClose} 
                    className="p-1.5 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] rounded-full hover:bg-[rgb(var(--button-secondary-bg-color))]"
                    aria-label="Close detail view"
                    title="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-1 -mr-1 mb-4 mt-3"> 
            <DetailItem label="Type" value={entry.type === EntryType.Task ? 'Task' : 'Note'} />
            {entry.project && <DetailItem label="Project" value={entry.project} />}
            {entry.priority && entry.priority !== PriorityLevel.Normal && <DetailItem label="Priority" value={entry.priority} />}
            {entry.details && <DetailItem label="Details" value={entry.details} />}
            {entry.isCompleted && entry.completionNotes && <DetailItem label="Completion Notes" value={entry.completionNotes} />}
            {entry.dueDate && !entry.isCompleted && <DetailItem label="Due Date" value={formatDueDate(entry.dueDate)} inputType="date" />}
            {entry.contact && <DetailItem label="Contact" value={entry.contact} />}
            {entry.url && <DetailItem label="URL" value={entry.url} isLink={true} />}
            <DetailItem label="Created At" value={formatDate(entry.createdAt)} />
            {entry.isCompleted && entry.completedAt && (
            <DetailItem label="Completed At" value={formatDate(entry.completedAt)} />
            )}
            {entry.isArchived && entry.archivedAt && (
            <DetailItem label="Archived At" value={formatArchivedAtDate(entry.archivedAt)} />
            )}
            {isCurrentlySnoozed && entry.snoozedUntil && (
                <DetailItem label="Snoozed Until" value={`${formatDate(entry.snoozedUntil)}`} />
            )}
        </div>
        
        {entry.type === EntryType.Task && (onToggleComplete || onOpenCompletionNotesModal) && !isCurrentlySnoozed && !entry.isArchived && (
            <div className="flex-shrink-0 pt-3 border-t border-[rgb(var(--divider-color))]">
                <div className="flex justify-end">
                    <button onClick={handleToggleComplete} className={`${actionButtonBaseClass} ${primaryActionClass} w-full sm:w-auto`}
                     disabled={entry.isCompleted && !onToggleComplete} 
                    >
                    {entry.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DetailModal;