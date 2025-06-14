
import React, { useState, useEffect, useRef } from 'react';
import { Entry, EntryType, PriorityLevel } from '../types';
import { formatDueDate, formatDateShort, formatArchivedAtDate, formatDate } from '../utils/dateUtils';

interface EntryItemProps {
  entry: Entry;
  onToggleComplete?: (id: string) => void; 
  onDeleteRequest?: (entry: Entry) => void; 
  onArchiveRequest?: (entry: Entry) => void;
  isEditing?: boolean; 
  editingTaskId?: string | null; 
  onStartEdit?: (id: string, type: EntryType) => void; 
  onSaveEdit?: (
    id: string, 
    title: string, 
    details: string, 
    dueDate?: string, 
    contact?: string, 
    url?: string, 
    project?: string, 
    priority?: PriorityLevel,
    snoozedUntil?: string 
  ) => void; 
  onCancelEdit?: (id: string) => void; 
  allowActions: boolean; 
  onOpenDetailModal: (entry: Entry) => void;
  onOpenCompletionNotesModal?: (task: Entry) => void;
  onOpenQuickSnoozeMenu: (entry: Entry, event: React.MouseEvent) => void; 
  onUnsnoozeItem?: (itemId: string) => void;


  draggedItemId: string | null;
  onDragStartHandler: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (targetId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  existingProjects: string[];
}

type AriaHasPopupValue = boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

const ActionButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  'data-is-snooze-button'?: boolean;
  id?: string;
  'aria-haspopup'?: AriaHasPopupValue;
  'aria-controls'?: string;
}> = ({ onClick, ariaLabel, title, children, className, ...rest }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-full transition-colors duration-150 ${className}`}
    aria-label={ariaLabel}
    title={title}
    {...rest}
  >
    {children}
  </button>
);

const ClearInputButton: React.FC<{ onClick: (e: React.MouseEvent) => void; title: string; }> =
  ({ onClick, title }) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onClick(e); }}
    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full
               text-gray-400 hover:text-[rgb(var(--destructive-color))]
               focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent-color))]
               hover:bg-[rgba(var(--button-secondary-bg-color),0.3)]
               transition-colors duration-150 z-10"
    aria-label={title}
    title={title}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);


const getPriorityClasses = (priority?: PriorityLevel): string => {
  if (!priority || priority === PriorityLevel.Normal) return 'border-l-[rgb(var(--border-color))]'; 
  
  switch (priority) {
    case PriorityLevel.Critical:
      return 'border-l-red-500 border-l-4'; 
    case PriorityLevel.High:
      return 'border-l-yellow-400 border-l-4'; 
    case PriorityLevel.Low:
      return 'border-l-sky-500 border-l-4'; 
    default:
      return 'border-l-[rgb(var(--border-color))]';
  }
};


const EntryItem: React.FC<EntryItemProps> = ({
  entry,
  onToggleComplete,
  onDeleteRequest,
  onArchiveRequest,
  isEditing: isEditingNoteProp, 
  editingTaskId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  allowActions,
  onOpenDetailModal,
  onOpenCompletionNotesModal,
  onOpenQuickSnoozeMenu,
  onUnsnoozeItem,
  draggedItemId,
  onDragStartHandler,
  onDropHandler,
  onDragEndHandler,
  existingProjects,
}) => {
  const { id, title, details, type, isCompleted, completedAt, dueDate, contact, url, isArchived, archivedAt, project, priority, snoozedUntil, wokeUpAt } = entry;

  const isCurrentlySnoozed = snoozedUntil && new Date(snoozedUntil) > new Date();
  const isEditingCurrentEntry = (type === EntryType.Note && isEditingNoteProp && editingTaskId !== id) || 
                               (type === EntryType.Task && editingTaskId === id); 
                               
  const snoozeButtonId = `qs-btn-${entry.id}`;

  const [editTitle, setEditTitle] = useState(title);
  const [editDetails, setEditDetails] = useState(details || '');
  const [editDueDate, setEditDueDate] = useState(dueDate || '');
  const [editContact, setEditContact] = useState(contact || '');
  const [editUrl, setEditUrl] = useState(url || '');
  const [editProject, setEditProject] = useState(project || '');
  const [editPriority, setEditPriority] = useState(priority || PriorityLevel.Normal);
  const [editSnoozedUntilDate, setEditSnoozedUntilDate] = useState(snoozedUntil ? new Date(snoozedUntil).toISOString().split('T')[0] : '');
  const [editSnoozedUntilTime, setEditSnoozedUntilTime] = useState(snoozedUntil ? new Date(snoozedUntil).toTimeString().substring(0,5) : '');

  const detailsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (isEditingCurrentEntry) {
      setEditTitle(title);
      setEditDetails(details || '');
      setEditDueDate(dueDate || '');
      setEditContact(contact || '');
      setEditUrl(url || '');
      setEditProject(project || '');
      setEditPriority(priority || PriorityLevel.Normal);
      const snoozeTimeToEdit = snoozedUntil || wokeUpAt; 
      setEditSnoozedUntilDate(snoozeTimeToEdit ? new Date(snoozeTimeToEdit).toISOString().split('T')[0] : '');
      setEditSnoozedUntilTime(snoozeTimeToEdit ? new Date(snoozeTimeToEdit).toTimeString().substring(0,5) : '');
      
      if (detailsTextareaRef.current) {
        detailsTextareaRef.current.focus();
        detailsTextareaRef.current.scrollTop = detailsTextareaRef.current.scrollHeight;
        const len = detailsTextareaRef.current.value.length;
        detailsTextareaRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditingCurrentEntry, title, details, dueDate, contact, url, project, priority, snoozedUntil, wokeUpAt]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      alert('Title cannot be empty.');
      return;
    }
    
    let finalSnoozedUntil: string | undefined = undefined;
    if (editSnoozedUntilDate) { 
      const effectiveTime = editSnoozedUntilTime || "00:00"; 
      const snoozeDateTime = new Date(`${editSnoozedUntilDate}T${effectiveTime}:00`); 

      if (!isNaN(snoozeDateTime.getTime())) { 
        if (snoozeDateTime > new Date()) {
          finalSnoozedUntil = snoozeDateTime.toISOString();
        }
      }
    }


    if (onSaveEdit) {
      onSaveEdit(id, editTitle.trim(), editDetails.trim(), editDueDate, editContact, editUrl, editProject, editPriority, finalSnoozedUntil);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCancelEdit) onCancelEdit(id);
  };
  
  const handleUnsnoozeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnsnoozeItem) {
      onUnsnoozeItem(id);
    }
  };

  const cardBaseStyle = "p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out relative border group"; 
  const priorityClass = getPriorityClasses(priority);
  
  let cardSpecificStyle = `bg-[rgb(var(--card-bg-color))] border-r-[rgb(var(--border-color))] border-t-[rgb(var(--border-color))] border-b-[rgb(var(--border-color))] ${priorityClass} hover:shadow-lg`;
  let titleColor = "text-[rgb(var(--text-primary))]";
  let dateColor = "text-[rgb(var(--text-secondary))]";
  const actionIconColor = "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent-color))]";
  const deleteIconColor = "text-[rgb(var(--destructive-color))] hover:text-[rgb(var(--destructive-color-hover))]";


  if (isCompleted) {
    cardSpecificStyle = `bg-[rgb(var(--card-bg-color))] border-transparent border-[rgba(var(--completed-accent-color),0.3)] opacity-70 ${priorityClass}`; 
    titleColor = "text-[rgb(var(--completed-text-color))]"; 
    dateColor = "text-[rgb(var(--completed-text-color))]";
  } else if (isArchived) {
    cardSpecificStyle = `bg-[rgb(var(--card-bg-color))] border-transparent border-[rgba(var(--text-secondary),0.3)] opacity-60 ${priorityClass}`; 
    titleColor = "text-[rgb(var(--text-secondary))]";
  } else if (isEditingCurrentEntry) {
    cardSpecificStyle = `bg-[rgba(var(--accent-color),0.05)] border-[rgb(var(--accent-color))] shadow-xl ${priorityClass}`;
  } else {
     cardSpecificStyle = `bg-[rgb(var(--card-bg-color))] border-r-[rgb(var(--border-color))] border-t-[rgb(var(--border-color))] border-b-[rgb(var(--border-color))] ${priorityClass} hover:shadow-lg`;
  }


  const isCurrentlyBeingDragged = draggedItemId === id;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
        const targetElement = e.target as HTMLElement;
        if (targetElement.closest('button, input, textarea, a, select')) { 
            return; 
        }
    }
    if (!isEditingCurrentEntry) onOpenDetailModal(entry);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    if (allowActions && draggedItemId && draggedItemId !== id) setIsDragOver(true);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
     if (allowActions && draggedItemId && draggedItemId !== id) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleLocalDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    if(allowActions) onDropHandler(id, e);
  }
  
  const inputBaseClass = "w-full px-3 py-2 border border-[rgb(var(--input-border-color))] rounded-md shadow-sm focus:ring-1 focus:ring-[rgb(var(--accent-color))] focus:border-[rgb(var(--accent-color))] sm:text-sm bg-[rgb(var(--input-bg-color))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-placeholder))] dark-input-icons";
  const labelClass = "block text-xs font-medium text-[rgb(var(--text-secondary))] mb-0.5";
  const selectClass = `${inputBaseClass} appearance-auto pr-8`;


  return (
    <div
      onClick={handleCardClick}
      draggable={allowActions && !isEditingCurrentEntry} 
      onDragStart={(e) => allowActions && !isEditingCurrentEntry && onDragStartHandler(id, e)}
      onDragEnd={(e) => allowActions && !isEditingCurrentEntry && onDragEndHandler(e)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleLocalDrop}
      className={`${cardBaseStyle} ${cardSpecificStyle} ${isCurrentlyBeingDragged ? 'dragging-item' : ''} ${isDragOver ? 'drag-over-target-indicator' : ''} ${(allowActions && !isEditingCurrentEntry) ? 'drag-handle' : 'cursor-default'}`}
      aria-roledescription={(allowActions && !isEditingCurrentEntry) ? "Draggable item" : undefined}
      role="article" 
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(e); }}
    >
      {isEditingCurrentEntry ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <div>
            <label htmlFor={`edit-title-${id}`} className={labelClass}>Title</label>
            <input id={`edit-title-${id}`} type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputBaseClass} aria-label="Edit title" />
          </div>
          <div>
            <label htmlFor={`edit-details-${id}`} className={labelClass}>Details</label>
            <textarea ref={detailsTextareaRef} id={`edit-details-${id}`} value={editDetails} onChange={(e) => setEditDetails(e.target.value)} rows={3} className={inputBaseClass} placeholder="Edit details..." aria-label="Edit details" />
          </div>
           <div>
            <label htmlFor={`edit-project-${id}`} className={labelClass}>Project</label>
            <input id={`edit-project-${id}`} type="text" value={editProject} onChange={(e) => setEditProject(e.target.value)} className={inputBaseClass} placeholder="Edit project..." aria-label="Edit project" list={`project-suggestions-edit-${id}`} />
             <datalist id={`project-suggestions-edit-${id}`}>
                {existingProjects.map(p => <option key={p} value={p} />)}
              </datalist>
          </div>
          <div className="relative">
            <label htmlFor={`edit-dueDate-${id}`} className={labelClass}>Due Date</label>
            <input id={`edit-dueDate-${id}`} type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className={`${inputBaseClass} appearance-none dark-input-icons pr-10`} aria-label="Edit due date" />
            {editDueDate && <ClearInputButton onClick={() => setEditDueDate('')} title="Clear Due Date" />}
          </div>
          <div>
            <label htmlFor={`edit-priority-${id}`} className={labelClass}>Priority</label>
            <select id={`edit-priority-${id}`} value={editPriority} onChange={(e) => setEditPriority(e.target.value as PriorityLevel)} className={selectClass} aria-label="Edit priority">
              {Object.values(PriorityLevel).map(level => (
                <option key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`edit-contact-${id}`} className={labelClass}>Contact</label>
            <input id={`edit-contact-${id}`} type="text" value={editContact} onChange={(e) => setEditContact(e.target.value)} className={inputBaseClass} placeholder="Edit contact..." aria-label="Edit contact" />
          </div>
          <div>
            <label htmlFor={`edit-url-${id}`} className={labelClass}>URL</label>
            <input id={`edit-url-${id}`} type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className={inputBaseClass} placeholder="Edit URL..." aria-label="Edit URL" />
          </div>
           {(type === EntryType.Task || type === EntryType.Note) ? ( 
            <div className="grid grid-cols-2 gap-x-3 items-end">
                <div className="relative">
                    <label htmlFor={`edit-snooze-date-${id}`} className={labelClass}>Snooze Until Date (Optional)</label>
                    <input id={`edit-snooze-date-${id}`} type="date" value={editSnoozedUntilDate} onChange={(e) => setEditSnoozedUntilDate(e.target.value)} className={`${inputBaseClass} appearance-none dark-input-icons pr-10`} aria-label="Edit snooze date" min={new Date().toISOString().split('T')[0]}/>
                    {(editSnoozedUntilDate || editSnoozedUntilTime) && 
                        <ClearInputButton 
                            onClick={() => { setEditSnoozedUntilDate(''); setEditSnoozedUntilTime(''); }} 
                            title="Clear Snooze Date & Time" 
                        />
                    }
                </div>
                <div>
                    <label htmlFor={`edit-snooze-time-${id}`} className={labelClass}>Snooze Until Time</label>
                    <input id={`edit-snooze-time-${id}`} type="time" value={editSnoozedUntilTime} onChange={(e) => setEditSnoozedUntilTime(e.target.value)} className={`${inputBaseClass} appearance-none dark-input-icons`} aria-label="Edit snooze time" />
                </div>
            </div>
          ) : null}


          <div className="flex justify-end space-x-2 pt-2">
            <button onClick={handleCancel} className="px-3 py-1.5 text-sm font-medium text-[rgb(var(--button-secondary-text-color))] bg-[rgb(var(--button-secondary-bg-color))] hover:opacity-80 rounded-md transition-opacity">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 text-sm font-medium text-[rgb(var(--accent-text-color))] bg-[rgb(var(--accent-color))] hover:bg-[rgb(var(--accent-color-hover))] rounded-md transition-colors">Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-1.5 right-1.5 flex items-center space-x-0.5 z-10 opacity-10 group-hover:opacity-100 transition-opacity duration-200">
            {url && (
                <ActionButton
                  onClick={(e) => { e.stopPropagation(); window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer'); }}
                  ariaLabel={`Open URL for ${title}`}
                  title="Open URL"
                  className={actionIconColor}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </ActionButton>
              )}
            {allowActions && onStartEdit && !isArchived && (!isCompleted || type === EntryType.Note) && ( 
              <ActionButton onClick={(e) => { e.stopPropagation(); onStartEdit(id, type);}} ariaLabel={`Edit ${type.toLowerCase()} ${title}`} title="Edit" className={actionIconColor}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </ActionButton>
            )}
            {allowActions && onUnsnoozeItem && isCurrentlySnoozed && (
              <ActionButton onClick={handleUnsnoozeClick} ariaLabel={`Activate ${type.toLowerCase()} ${title}`} title="Activate Now" className={`${actionIconColor} hover:text-green-400`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L8.029 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
                </svg>
              </ActionButton>
            )}
            {allowActions && !isCompleted && !isArchived && !isCurrentlySnoozed && ( 
              <ActionButton 
                onClick={(e) => { e.stopPropagation(); onOpenQuickSnoozeMenu(entry, e);}} 
                ariaLabel={`Snooze ${type.toLowerCase()} ${title}`} 
                title="Snooze" 
                className={actionIconColor}
                data-is-snooze-button={true}
                id={snoozeButtonId}
                aria-haspopup="menu"
                aria-controls="qs-menu" 
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </ActionButton>
            )}
            {type === EntryType.Note && onArchiveRequest && !isArchived && allowActions && (
                 <ActionButton onClick={(e) => { e.stopPropagation(); onArchiveRequest(entry);}} ariaLabel={`Archive note ${title}`} title="Archive note" className={actionIconColor}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                 </ActionButton>
            )}
            {onDeleteRequest && allowActions && ( 
              <ActionButton onClick={(e) => { e.stopPropagation(); onDeleteRequest(entry);}} ariaLabel={`Delete ${type.toLowerCase()} ${title}`} title="Delete" className={deleteIconColor}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </ActionButton>
            )}
          </div>

          <div className="flex items-start">
            {type === EntryType.Task && (onToggleComplete || onOpenCompletionNotesModal) && ( 
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => { 
                    e.stopPropagation(); 
                    if (!isCompleted && onOpenCompletionNotesModal) {
                        onOpenCompletionNotesModal(entry);
                    } else if (isCompleted && onToggleComplete) {
                        onToggleComplete(id); 
                    }
                }} 
                className="form-checkbox h-4 w-4 text-[rgb(var(--accent-color))] bg-transparent border-2 border-[rgb(var(--input-border-color))] rounded focus:ring-2 focus:ring-[rgb(var(--accent-color))] focus:ring-offset-0 mr-3 mt-0.5 cursor-pointer flex-shrink-0"
                aria-label={`Mark task ${title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                disabled={Boolean((!allowActions && isCompleted) || (isCurrentlySnoozed && !allowActions))}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className={`flex-grow min-w-0 ${allowActions ? 'pr-16 sm:pr-20' : 'pr-2'}`}> 
              <h3 className={`text-base font-medium break-words ${titleColor}`}>
                {title}
              </h3>
            </div>
          </div>
          
          <div className="mt-1.5 flex justify-between items-start text-xs">
            <div className={`flex-shrink min-w-0 pr-2 ${dateColor} truncate`}>
                {project && <span className="font-medium text-[rgb(var(--highlight-color))]">{project}</span>}
                {project && contact && <span className="mx-1">-</span>}
                {contact && <span className="italic">{contact}</span>}
            </div>

            <div className={`flex-shrink-0 text-right ${dateColor} space-y-0.5`}>
              {dueDate && type === EntryType.Task && !isCompleted && !isArchived && (
                <p className="font-medium text-[rgb(var(--highlight-color))]">
                  Due: {formatDueDate(dueDate)}
                </p>
              )}
              {wokeUpAt && !isCurrentlySnoozed && !isCompleted && !isArchived && (
                 <p className="font-medium text-emerald-400">
                    Woke up: {formatDate(wokeUpAt)}
                 </p>
              )}
              {isCurrentlySnoozed && !wokeUpAt && !isCompleted && !isArchived && (
                <p className="font-medium text-sky-400">
                  Snoozed Until: {formatDate(snoozedUntil!)}
                </p>
              )}
            </div>
          </div>
          
          {(isCompleted || isArchived) && (
             <div className="mt-1.5 text-xs">
                {project && <span className={`font-medium text-[rgb(var(--highlight-color))] ${dateColor}`}>{project}</span>}
                {project && contact && <span className={`mx-1 ${dateColor}`}>-</span>}
                {contact && <span className={`italic ${dateColor}`}>{contact}</span>}
                {(project || contact) && (isCompleted || isArchived) && <div className="h-1"></div>}
            
                {isCompleted && completedAt && (
                    <p className={`${dateColor}`}>Completed: {formatDateShort(completedAt)}</p>
                )}
                {isArchived && archivedAt && (
                    <p className={`${dateColor}`}>Archived: {formatArchivedAtDate(archivedAt)}</p>
                )}
             </div>
          )}

           {!allowActions && isCurrentlySnoozed && snoozedUntil && !isCompleted && !isArchived && ( 
            <div className="text-right mt-1">
              <p className="text-xs font-medium text-sky-400">
                Snoozed Until: {formatDate(snoozedUntil)}
              </p>
            </div>
          )}
           {!allowActions && wokeUpAt && !isCurrentlySnoozed && !isCompleted && !isArchived && ( 
            <div className="text-right mt-1">
              <p className="text-xs font-medium text-emerald-400">
                Woke up: {formatDate(wokeUpAt)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EntryItem;
