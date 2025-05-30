
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Entry, EntryType, TabView, PriorityLevel, ActiveFilters } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import InputForm from './components/InputForm';
import Tabs from './components/Tabs';
import ActiveTaskList from './components/ActiveTaskList';
import NoteList from './components/NoteList';
import CompletedTaskList from './components/CompletedTaskList';
import ArchivedNoteList from './components/ArchivedNoteList';
import SnoozedList from './components/SnoozedList'; 
import DetailModal from './components/DetailModal';
import AppBar from './components/AppBar';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import CompletionNotesModal from './components/CompletionNotesModal';
import ConfirmArchiveModal from './components/ConfirmArchiveModal'; 
import ExportOptionsModal from './components/ExportOptionsModal';
import ImportDataModal, { ImportMode } from './components/ImportDataModal';
import SnoozeModal from './components/SnoozeModal'; 

type ViewMode = 'main' | 'completed' | 'archived' | 'snoozed'; 

const App: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<Entry[]>('task-notes-entries-v3', []); 
  const [activeTab, setActiveTab] = useState<TabView>(TabView.ActiveTasks);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); 
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<Entry | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Entry | null>(null);

  const [isCompletionNotesModalOpen, setIsCompletionNotesModalOpen] = useState(false);
  const [taskForCompletionNotes, setTaskForCompletionNotes] = useState<Entry | null>(null);

  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false); 
  const [itemToArchive, setItemToArchive] = useState<Entry | null>(null); 

  const [isExportOptionsModalOpen, setIsExportOptionsModalOpen] = useState(false);
  const [isImportDataModalOpen, setIsImportDataModalOpen] = useState(false); 

  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false); 
  const [entryToSnooze, setEntryToSnooze] = useState<Entry | null>(null); 

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [notificationPermissionState, setNotificationPermissionState] = useState<NotificationPermission>('default');
  const [animateWakeUpForIds, setAnimateWakeUpForIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    if (typeof Notification !== "undefined") {
        console.log("Initial Notification.permission:", Notification.permission);
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log("Notification.requestPermission result:", permission);
                setNotificationPermissionState(permission);
            });
        } else {
            setNotificationPermissionState(Notification.permission);
        }
    } else {
        console.log("Notifications API not supported.");
    }
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);


  // Periodically check for unsnoozing items
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowTime = now.getTime();
      const nowISO = now.toISOString();
      let changed = false;
      const originalEntriesSnapshot = [...entries]; 

      const updatedEntries = entries.map(entry => {
        if (entry.snoozedUntil && new Date(entry.snoozedUntil).getTime() <= nowTime) {
          changed = true;
          const { snoozedUntil: _snoozed, ...rest } = entry; 
          const wokenEntry = { ...rest, wokeUpAt: nowISO, snoozedUntil: undefined };

          if (notificationPermissionState === 'granted') {
            new Notification('vTasks Wake Up!', {
              body: `Item "${wokenEntry.title}" is now active.`,
              icon: '/vite.svg' 
            });
            console.log(`Notification sent for ${wokenEntry.title}`);
          } else {
            console.log(`Notification permission not granted for ${wokenEntry.title}. State: ${notificationPermissionState}`);
          }
          return wokenEntry;
        }
        return entry;
      });

      if (changed) {
        const newlyWokenEntries = updatedEntries.filter(updatedEntry => {
            const originalEntry = originalEntriesSnapshot.find(oe => oe.id === updatedEntry.id);
            return originalEntry?.snoozedUntil && !updatedEntry.snoozedUntil && updatedEntry.wokeUpAt;
        });

        if (newlyWokenEntries.length > 0) {
            const newIdsToAnimate = new Set(newlyWokenEntries.map(e => e.id));
            setAnimateWakeUpForIds(prev => new Set([...prev, ...newIdsToAnimate]));

            setTimeout(() => {
                setAnimateWakeUpForIds(currentAnimatingIds => {
                    const nextAnimatingIds = new Set(currentAnimatingIds);
                    newIdsToAnimate.forEach(id => nextAnimatingIds.delete(id));
                    return nextAnimatingIds;
                });
            }, 2000); 
        }
        setEntries(updatedEntries);
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [entries, setEntries, notificationPermissionState]);


  const handleOpenDetailModal = (entry: Entry) => {
    setSelectedEntryForDetail(entry);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedEntryForDetail(null);
  }, []);

  const requestDeleteConfirmation = (entry: Entry) => {
    setItemToDelete(entry);
    setIsDeleteConfirmOpen(true);
  };

  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const confirmDeleteEntry = useCallback(() => {
    if (!itemToDelete) return;
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== itemToDelete.id));
    if (editingNoteId === itemToDelete.id) setEditingNoteId(null);
    if (editingTaskId === itemToDelete.id) setEditingTaskId(null);
    if(selectedEntryForDetail?.id === itemToDelete.id) handleCloseDetailModal();
    cancelDeleteConfirmation();
  }, [setEntries, editingNoteId, editingTaskId, selectedEntryForDetail, itemToDelete, handleCloseDetailModal]);


  const handleOpenCompletionNotesModal = (task: Entry) => {
    setTaskForCompletionNotes(task);
    setIsCompletionNotesModalOpen(true);
  };

  const handleCloseCompletionNotesModal = () => {
    setIsCompletionNotesModalOpen(false);
    setTaskForCompletionNotes(null);
  };

  const handleSaveCompletionNotes = useCallback((notes: string) => {
    if (!taskForCompletionNotes) return;
    const completedAtTime = new Date().toISOString();

    const { snoozedUntil: _snoozedRemoved, wokeUpAt: _wokeUpRemoved, ...taskDetailsRelevant } = taskForCompletionNotes;

    const updatedTask: Entry = {
      ...taskDetailsRelevant,
      isCompleted: true,
      completedAt: completedAtTime,
      completionNotes: notes.trim() || undefined,
      wokeUpAt: undefined, 
      snoozedUntil: undefined, 
    };

    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === taskForCompletionNotes.id ? updatedTask : entry
      )
    );
    if (selectedEntryForDetail?.id === taskForCompletionNotes.id) {
        setSelectedEntryForDetail(updatedTask); 
        handleCloseDetailModal(); 
    }
    handleCloseCompletionNotesModal();
  }, [setEntries, taskForCompletionNotes, selectedEntryForDetail, handleCloseDetailModal]);

  const requestArchiveConfirmation = (entry: Entry) => { 
    setItemToArchive(entry);
    setIsArchiveConfirmOpen(true);
  };

  const cancelArchiveConfirmation = () => { 
    setIsArchiveConfirmOpen(false);
    setItemToArchive(null);
  };

  const confirmArchiveNote = useCallback(() => { 
    if (!itemToArchive) return;
    const isNowArchived = !itemToArchive.isArchived;
    const updatedArchivedTime = isNowArchived ? new Date().toISOString() : undefined;
    
    let updatedNote: Entry;
    if (isNowArchived) {
        const { snoozedUntil: _snoozedRemoved, wokeUpAt: _wokeUpRemoved, ...itemDetailsRelevant } = itemToArchive;
        updatedNote = {
            ...itemDetailsRelevant,
            isArchived: true,
            archivedAt: updatedArchivedTime,
            wokeUpAt: undefined, 
            snoozedUntil: undefined, 
        };
    } else { 
        const { wokeUpAt: _wokeUpRemoved, ...itemDetailsRelevant } = itemToArchive;
        updatedNote = {
            ...itemDetailsRelevant,
            isArchived: false,
            archivedAt: undefined,
            wokeUpAt: undefined, 
        };
    }

    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === itemToArchive.id ? updatedNote : entry
      )
    );
    if (editingNoteId === itemToArchive.id) setEditingNoteId(null);
    if (selectedEntryForDetail?.id === itemToArchive.id) {
        setSelectedEntryForDetail(updatedNote);
    }
    cancelArchiveConfirmation();
  }, [setEntries, editingNoteId, selectedEntryForDetail, itemToArchive]);


  const addEntry = useCallback((
    title: string, 
    details: string, 
    type: EntryType, 
    dueDate?: string, 
    contact?: string, 
    url?: string,
    project?: string,
    priority?: PriorityLevel
  ) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      title,
      details: details || undefined,
      type,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      isArchived: false,
      dueDate: dueDate || undefined,
      contact: contact || undefined,
      url: url || undefined,
      project: project || undefined,
      priority: priority || PriorityLevel.Normal,
      completionNotes: undefined,
      snoozedUntil: undefined,
      wokeUpAt: undefined,
    };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
    if (type === EntryType.Task) setActiveTab(TabView.ActiveTasks);
    else if (type === EntryType.Note) setActiveTab(TabView.Notes);
    setViewMode('main'); 
    setEditingNoteId(null); 
    setEditingTaskId(null);
  }, [setEntries]);

  const toggleTaskCompletion = useCallback((id: string, notes?: string) => { 
    setEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === id && entry.type === EntryType.Task) {
          const nowCompleted = !entry.isCompleted;
          if (nowCompleted) {
            const { snoozedUntil: _snoozedRemoved, wokeUpAt: _wokeUpRemoved, ...entryDetailsRelevant } = entry;
            return {
              ...entryDetailsRelevant,
              isCompleted: true,
              completedAt: new Date().toISOString(),
              completionNotes: notes ? notes : (entry.completionNotes ? entry.completionNotes : undefined),
              wokeUpAt: undefined, 
              snoozedUntil: undefined,
            };
          } else { 
             const { wokeUpAt: _wokeUpRemoved, ...entryDetailsRelevant } = entry;
            return { 
              ...entryDetailsRelevant, 
              isCompleted: false, 
              completedAt: undefined,
              completionNotes: undefined,
              wokeUpAt: undefined, 
            };
          }
        }
        return entry;
      })
    );
    if (selectedEntryForDetail?.id === id) {
        setSelectedEntryForDetail(prev => {
          if (!prev || prev.type !== EntryType.Task) return null;
          const nowCompleted = !prev.isCompleted;
           const { snoozedUntil: _snoozedRemoved, wokeUpAt: _wokeUpRemoved, ...prevDetailsRelevant } = prev;
          if (nowCompleted) {
            return {
                ...prevDetailsRelevant,
                isCompleted: true,
                completedAt: new Date().toISOString(),
                completionNotes: notes ? notes : (prev.completionNotes ? prev.completionNotes : undefined),
                wokeUpAt: undefined,
                snoozedUntil: undefined,
            };
          } else {
            return {
              ...prevDetailsRelevant, 
              isCompleted: false, 
              completedAt: undefined,
              completionNotes: undefined,
              wokeUpAt: undefined,
            };
          }
        });
    }
  }, [setEntries, selectedEntryForDetail]);


  const handleStartEdit = useCallback((id: string, type: EntryType) => {
    handleCloseDetailModal(); 
    if (type === EntryType.Note) {
      setEditingNoteId(id);
      setEditingTaskId(null);
    } else if (type === EntryType.Task) {
      setEditingTaskId(id);
      setEditingNoteId(null);
    }
  }, [handleCloseDetailModal]);

  const handleSaveEdit = useCallback((
    id: string, 
    newTitle: string, 
    newDetails: string, 
    newDueDate?: string, 
    newContact?: string, 
    newUrl?: string,
    newProject?: string,
    newPriority?: PriorityLevel,
    newSnoozedUntil?: string 
    ) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id
          ? { 
              ...entry, 
              title: newTitle, 
              details: newDetails.trim() || undefined,
              dueDate: newDueDate || undefined,
              contact: newContact?.trim() || undefined,
              url: newUrl?.trim() || undefined,
              project: newProject?.trim() || undefined,
              priority: newPriority || PriorityLevel.Normal,
              snoozedUntil: newSnoozedUntil || undefined, 
              wokeUpAt: newSnoozedUntil ? undefined : entry.wokeUpAt, 
            }
          : entry
      )
    );
    setEditingNoteId(null);
    setEditingTaskId(null);
  }, [setEntries]);

  const handleCancelEdit = useCallback(() => { 
    setEditingNoteId(null); 
    setEditingTaskId(null);
  }, []);


  const handleDragStart = useCallback((id: string, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', id); } catch (error) { console.warn("setData failed", error); }
    document.body.classList.add('is-grabbing');
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
    document.body.classList.remove('is-grabbing');
  }, []);
  
  const handleDrop = useCallback((targetId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const localDraggedItemId = draggedItemId || e.dataTransfer.getData('text/plain');

    const cleanup = () => {
        if (draggedItemId !== null) setDraggedItemId(null); 
        if (document.body.classList.contains('is-grabbing')) document.body.classList.remove('is-grabbing');
    };

    if (!localDraggedItemId || localDraggedItemId === targetId) {
      cleanup();
      return;
    }

    setEntries(currentEntries => {
      const entriesCopy = [...currentEntries];
      const draggedIdx = entriesCopy.findIndex(entry => entry.id === localDraggedItemId);
      const targetIdx = entriesCopy.findIndex(entry => entry.id === targetId);

      if (draggedIdx === -1 || targetIdx === -1) return currentEntries;
      
      const draggedEntry = entriesCopy[draggedIdx];
      const targetEntry = entriesCopy[targetIdx];
      
      const isDraggedSnoozed = !!draggedEntry.snoozedUntil && new Date(draggedEntry.snoozedUntil).getTime() > new Date().getTime();
      const isTargetSnoozed = !!targetEntry.snoozedUntil && new Date(targetEntry.snoozedUntil).getTime() > new Date().getTime();
      
      const isDraggedWoken = !!draggedEntry.wokeUpAt && !isDraggedSnoozed;
      const isTargetWoken = !!targetEntry.wokeUpAt && !isTargetSnoozed;


      if (draggedEntry.type !== targetEntry.type || 
          draggedEntry.isArchived !== targetEntry.isArchived ||
          (draggedEntry.type === EntryType.Task && draggedEntry.isCompleted !== targetEntry.isCompleted) ||
          isDraggedSnoozed !== isTargetSnoozed ||
          isDraggedWoken !== isTargetWoken 
          ) {
        return currentEntries; 
      }

      const [movedItem] = entriesCopy.splice(draggedIdx, 1);
      const finalTargetIdx = entriesCopy.findIndex(entry => entry.id === targetId); 
      entriesCopy.splice(finalTargetIdx, 0, movedItem); 
      return entriesCopy;
    });
    cleanup();
  }, [draggedItemId, setEntries]);

  const openExportOptionsModal = useCallback(() => {
    if (entries.length === 0) {
      alert("No data to export.");
      return;
    }
    setIsExportOptionsModalOpen(true);
  }, [entries]);

  const closeExportOptionsModal = useCallback(() => {
    setIsExportOptionsModalOpen(false);
  }, []);
  
  const openImportDataModal = useCallback(() => {
    setIsImportDataModalOpen(true);
  }, []);

  const closeImportDataModal = useCallback(() => {
    setIsImportDataModalOpen(false);
  }, []);


  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getTimestampedFilename = (base: string, extension: string): string => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    return `${base}-${timestamp}.${extension}`;
  };

  const handleExportJSON = useCallback(() => {
    if (entries.length === 0) return;
    const jsonData = JSON.stringify(entries, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    triggerDownload(blob, getTimestampedFilename('vtasks-export', 'json')); 
    closeExportOptionsModal();
  }, [entries, closeExportOptionsModal]);
  
  const escapeCSVField = (field: any): string => {
    if (field === null || typeof field === 'undefined') {
      return '';
    }
    let stringField = String(field);
    if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
      stringField = stringField.replace(/"/g, '""'); 
      return `"${stringField}"`; 
    }
    return stringField;
  };

  const CSV_HEADERS: (keyof Entry)[] = [
      'id', 'title', 'details', 'type', 'createdAt', 'isCompleted', 'completedAt',
      'completionNotes', 'dueDate', 'contact', 'url', 'isArchived', 'archivedAt',
      'project', 'priority', 'snoozedUntil', 'wokeUpAt' 
  ];

  const convertToCSV = (data: Entry[]): string => {
    if (!data || data.length === 0) return '';
    const csvRows = [
      CSV_HEADERS.join(','), 
      ...data.map(entry =>
        CSV_HEADERS.map(headerKey =>
          escapeCSVField(entry[headerKey])
        ).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const handleExportCSV = useCallback(() => {
    if (entries.length === 0) return;
    const csvData = convertToCSV(entries);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, getTimestampedFilename('vtasks-export', 'csv')); 
    closeExportOptionsModal();
  }, [entries, closeExportOptionsModal]);

  const parseCSVLine = (line: string): string[] => {
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i+1] === '"') { 
                currentField += '"';
                i++; 
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    fields.push(currentField);
    return fields;
  };

  const parseImportedCSV = (csvString: string): Entry[] | null => {
    try {
      const lines = csvString.split(/\r?\n/);
      if (lines.length < 2) return null; 

      const headerLine = lines.shift()!;
      const parsedHeaders = parseCSVLine(headerLine).map(h => h.trim());
      
      const expectedHeadersSet = new Set(CSV_HEADERS);
      const minExpectedHeaders = CSV_HEADERS.slice(0, CSV_HEADERS.indexOf('project')); 

      if (parsedHeaders.length < minExpectedHeaders.length || !minExpectedHeaders.every(h => parsedHeaders.includes(h as string))) {
        console.error("CSV headers do not match minimum expected headers.", parsedHeaders, minExpectedHeaders);
        alert("Import failed: CSV headers are missing essential fields.");
        return null;
      }

      const importedEntries: Entry[] = [];
      for (const line of lines) {
        if (line.trim() === '') continue; 
        const values = parseCSVLine(line);
        
        const entry: Partial<Entry> = {};
        parsedHeaders.forEach((header, index) => {
          const key = header as keyof Entry;
          const value = values[index];

          if (!expectedHeadersSet.has(key)) return;

          if (value === '' || value === null || typeof value === 'undefined') {
            (entry as any)[key] = undefined; 
            return;
          }

          switch (key) {
            case 'isCompleted':
            case 'isArchived':
              (entry as any)[key] = value.toLowerCase() === 'true';
              break;
            case 'type':
              const determinedType = value === 'TASK' ? EntryType.Task : (value === 'NOTE' ? EntryType.Note : undefined);
              entry.type = determinedType;
              if (entry.type === undefined) {
                throw new Error(`Invalid entry type: ${value}`);
              }
              break;
            case 'priority':
                const priorityVal = value.toUpperCase() as PriorityLevel;
                if (Object.values(PriorityLevel).includes(priorityVal)) {
                    (entry as any)[key] = priorityVal;
                } else {
                    (entry as any)[key] = PriorityLevel.Normal; 
                }
                break;
            case 'wokeUpAt': 
                 (entry as any)[key] = value || undefined;
                 break;
            default:
              (entry as any)[key] = value; 
          }
        });
        
        if (!entry.id || !entry.title || !entry.type || !entry.createdAt || typeof entry.isCompleted === 'undefined') {
            console.warn("Skipping entry due to missing required fields:", entry);
            continue;
        }
        if (!entry.priority) entry.priority = PriorityLevel.Normal;
        if (entry.wokeUpAt === '') entry.wokeUpAt = undefined;


        importedEntries.push(entry as Entry);
      }
      return importedEntries;
    } catch (error) {
      console.error("Error parsing CSV:", error);
      return null;
    }
  };
  
  const parseImportedJSON = (jsonString: string): Entry[] | null => {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data)) return null;
      
      const importedEntries: Entry[] = data.reduce((acc: Entry[], item) => {
        if (item && typeof item.id === 'string' && typeof item.title === 'string' &&
            typeof item.type === 'string' && (item.type === EntryType.Task || item.type === EntryType.Note) &&
            typeof item.createdAt === 'string' && typeof item.isCompleted === 'boolean'
           ) {
            const fullEntry: Entry = {
                ...item,
                project: item.project || undefined,
                priority: item.priority || PriorityLevel.Normal,
                snoozedUntil: item.snoozedUntil || undefined,
                wokeUpAt: item.wokeUpAt || undefined,
            };
            acc.push(fullEntry);
        } else {
            console.warn("Invalid entry in JSON filtered out:", item);
        }
        return acc;
      }, []);

      return importedEntries;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const handleImportData = useCallback(async (file: File, mode: ImportMode) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      let parsedData: Entry[] | null = null;

      if (file.name.endsWith('.json')) {
        parsedData = parseImportedJSON(content);
      } else if (file.name.endsWith('.csv')) {
        parsedData = parseImportedCSV(content);
      } else {
        alert("Unsupported file type. Please select a JSON or CSV file.");
        closeImportDataModal();
        return;
      }

      if (parsedData) {
        if (mode === 'overwrite') {
          setEntries(parsedData);
          alert(`Data imported successfully. ${parsedData.length} entries loaded (Overwrite mode).`);
        } else { 
          const newEntriesWithNewIds = parsedData.map(entry => ({
            ...entry,
            id: crypto.randomUUID() 
          }));
          setEntries(prevEntries => [...prevEntries, ...newEntriesWithNewIds]);
          alert(`Data merged successfully. ${newEntriesWithNewIds.length} new entries added.`);
        }
        setActiveTab(TabView.ActiveTasks); 
        setViewMode('main');
      } else {
        alert("Import failed. Invalid file format or corrupted data. Please check the console for more details.");
      }
      closeImportDataModal();
    };
    reader.onerror = () => {
        alert("Failed to read the file.");
        closeImportDataModal();
    };
    reader.readAsText(file);
  }, [setEntries, closeImportDataModal]);

  const handleOpenSnoozeModal = (entry: Entry) => {
    setEntryToSnooze(entry);
    setIsSnoozeModalOpen(true);
    if (isDetailModalOpen) handleCloseDetailModal();
  };

  const handleCloseSnoozeModal = () => {
    setIsSnoozeModalOpen(false);
    setEntryToSnooze(null);
  };

  const handleConfirmSnooze = useCallback((snoozeUntilValue: string) => {
    if (!entryToSnooze) return;
    setEntries(prevEntries =>
      prevEntries.map(e =>
        e.id === entryToSnooze.id
          ? { ...e, snoozedUntil: snoozeUntilValue, wokeUpAt: undefined } 
          : e
      )
    );
    if (selectedEntryForDetail?.id === entryToSnooze.id) {
      setSelectedEntryForDetail(prev => prev ? { ...prev, snoozedUntil: snoozeUntilValue, wokeUpAt: undefined } : null);
    }
    handleCloseSnoozeModal();
  }, [entryToSnooze, setEntries, selectedEntryForDetail]);

  const handleUnsnoozeItem = useCallback((itemId: string) => {
    const nowISO = new Date().toISOString();
    let entryWasSnoozedAndTriggeredAnimation = false;
  
    setEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === itemId) {
          let newWokeUpAt: string | undefined = entry.wokeUpAt; // Preserve existing wokeUpAt if not previously snoozed
          if (entry.snoozedUntil) { // If it was snoozed (even if in the past)
            newWokeUpAt = nowISO;
            entryWasSnoozedAndTriggeredAnimation = true;
          } else { // If it was not snoozed, clicking unsnooze should clear wokeUpAt
            newWokeUpAt = undefined;
          }
          
          const { snoozedUntil: _snoozed, wokeUpAt: _currentWokeUp, ...rest } = entry;
          return { ...rest, snoozedUntil: undefined, wokeUpAt: newWokeUpAt };
        }
        return entry;
      })
    );
  
    if (entryWasSnoozedAndTriggeredAnimation) {
      setAnimateWakeUpForIds(prev => new Set([...prev, itemId]));
      setTimeout(() => {
          setAnimateWakeUpForIds(currentAnimatingIds => {
              const nextAnimatingIds = new Set(currentAnimatingIds);
              nextAnimatingIds.delete(itemId);
              return nextAnimatingIds;
          });
      }, 2000); // Animation duration (1.5s) + buffer (0.5s)
    }
  
    if (selectedEntryForDetail?.id === itemId) {
      setSelectedEntryForDetail(prev => {
        if (!prev) return null;
        let newWokeUpAtForDetail: string | undefined = prev.wokeUpAt;
        if (prev.snoozedUntil) {
            newWokeUpAtForDetail = nowISO;
        } else {
            newWokeUpAtForDetail = undefined;
        }
        const { snoozedUntil: _snoozed, wokeUpAt: _currentWokeUp, ...rest } = prev;
        return { ...rest, snoozedUntil: undefined, wokeUpAt: newWokeUpAtForDetail };
      });
    }
  }, [setEntries, selectedEntryForDetail]);


  const nowTimeForFiltering = useMemo(() => new Date().getTime(), [entries, viewMode, activeTab, activeFilters, animateWakeUpForIds]); 

  const baseActiveTasks = useMemo(() => entries.filter(entry => 
    entry.type === EntryType.Task && 
    !entry.isCompleted && 
    (!entry.snoozedUntil || new Date(entry.snoozedUntil).getTime() <= nowTimeForFiltering)
  ), [entries, nowTimeForFiltering]);

  const baseActiveNotes = useMemo(() => entries.filter(entry => 
    entry.type === EntryType.Note && 
    !entry.isArchived &&
    (!entry.snoozedUntil || new Date(entry.snoozedUntil).getTime() <= nowTimeForFiltering)
  ), [entries, nowTimeForFiltering]);
  
  const activeTasks = useMemo(() => baseActiveTasks.filter(task => {
    const projectMatch = !activeFilters.project || task.project === activeFilters.project;
    const priorityMatch = !activeFilters.priority || task.priority === activeFilters.priority;
    return projectMatch && priorityMatch;
  }), [baseActiveTasks, activeFilters]);

  const activeNotes = useMemo(() => baseActiveNotes.filter(note => {
    const projectMatch = !activeFilters.project || note.project === activeFilters.project;
    const priorityMatch = !activeFilters.priority || note.priority === activeFilters.priority;
    return projectMatch && priorityMatch;
  }), [baseActiveNotes, activeFilters]);


  const completedTasks = useMemo(() => entries.filter(entry => entry.type === EntryType.Task && entry.isCompleted)
    .sort((a,b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()), [entries]);
  
  const archivedNotes = useMemo(() => entries.filter(entry => entry.type === EntryType.Note && entry.isArchived)
    .sort((a,b) => new Date(b.archivedAt || 0).getTime() - new Date(a.archivedAt || 0).getTime()), [entries]);

  const snoozedEntries = useMemo(() => entries.filter(entry => 
    entry.snoozedUntil && new Date(entry.snoozedUntil).getTime() > nowTimeForFiltering 
  ).sort((a,b) => new Date(a.snoozedUntil!).getTime() - new Date(b.snoozedUntil!).getTime()), [entries, nowTimeForFiltering]);

  const existingProjectsForAutocomplete = useMemo(() => {
    const projects = new Set<string>();
    entries.forEach(entry => {
      const isSnoozed = entry.snoozedUntil && new Date(entry.snoozedUntil).getTime() > nowTimeForFiltering;
      const isActiveTask = entry.type === EntryType.Task && !entry.isCompleted;
      const isActiveNote = entry.type === EntryType.Note && !entry.isArchived;

      if (entry.project && (isSnoozed || (isActiveTask && !isSnoozed) || (isActiveNote && !isSnoozed))) {
        projects.add(entry.project);
      }
    });
    return Array.from(projects).sort();
  }, [entries, nowTimeForFiltering]);
  
  const projectsInView = useMemo(() => {
    const sourceList = activeTab === TabView.ActiveTasks ? baseActiveTasks : baseActiveNotes;
    return Array.from(new Set(sourceList.map(e => e.project).filter((p): p is string => !!p))).sort();
  }, [activeTab, baseActiveTasks, baseActiveNotes]);

  const prioritiesInView = useMemo(() => {
    const sourceList = activeTab === TabView.ActiveTasks ? baseActiveTasks : baseActiveNotes;
    return Array.from(new Set(sourceList.map(e => e.priority).filter((p): p is PriorityLevel => !!p))).sort();
  }, [activeTab, baseActiveTasks, baseActiveNotes]);


  const handleSetFilter = (filterType: keyof ActiveFilters, value: string | undefined) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
    setIsFilterDropdownOpen(false);
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    setIsFilterDropdownOpen(false);
  };

  const toggleFilterDropdown = useCallback(() => {
    setIsFilterDropdownOpen(prev => !prev);
  }, []);


  const renderCurrentTabView = () => {
    switch (activeTab) {
      case TabView.ActiveTasks:
        return <ActiveTaskList 
                  tasks={activeTasks} 
                  onToggleComplete={toggleTaskCompletion}
                  onDeleteRequest={requestDeleteConfirmation}
                  editingTaskId={editingTaskId}
                  onStartEditTask={(id) => handleStartEdit(id, EntryType.Task)}
                  onSaveTaskEdit={handleSaveEdit}
                  onCancelEditTask={handleCancelEdit}
                  onOpenDetailModal={handleOpenDetailModal}
                  onOpenCompletionNotesModal={handleOpenCompletionNotesModal} 
                  onOpenSnoozeModal={handleOpenSnoozeModal}
                  onUnsnoozeItem={handleUnsnoozeItem}
                  draggedItemId={draggedItemId} 
                  onDragStartHandler={handleDragStart} 
                  onDropHandler={handleDrop} 
                  onDragEndHandler={handleDragEnd}
                  existingProjects={existingProjectsForAutocomplete} 
                  animateWakeUpForIds={animateWakeUpForIds}
                />;
      case TabView.Notes:
        return <NoteList 
                  notes={activeNotes} 
                  onDeleteRequest={requestDeleteConfirmation}
                  onArchiveRequest={requestArchiveConfirmation} 
                  editingNoteId={editingNoteId} 
                  onStartEdit={(id) => handleStartEdit(id, EntryType.Note)}
                  onSaveEdit={handleSaveEdit} 
                  onCancelEdit={handleCancelEdit} 
                  onOpenDetailModal={handleOpenDetailModal} 
                  onOpenSnoozeModal={handleOpenSnoozeModal}
                  onUnsnoozeItem={handleUnsnoozeItem}
                  draggedItemId={draggedItemId} 
                  onDragStartHandler={handleDragStart} 
                  onDropHandler={handleDrop} 
                  onDragEndHandler={handleDragEnd}
                  existingProjects={existingProjectsForAutocomplete}
                  animateWakeUpForIds={animateWakeUpForIds}
                />;
      default: return null;
    }
  };

  const mainViewButtonClass = "w-full mt-0 first:mt-0 py-2.5 px-4 border-t border-[rgb(var(--divider-color))] text-sm font-medium text-[rgb(var(--text-secondary))] bg-[rgb(var(--card-bg-color))] hover:bg-[rgba(var(--accent-color),0.1)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent-color))] transition-colors duration-150";
  const footerButtonClass = "px-3 py-1.5 text-xs font-medium text-[rgb(var(--accent-color))] bg-[rgba(var(--accent-color),0.15)] hover:bg-[rgba(var(--accent-color),0.25)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--accent-color))] focus:ring-offset-[rgb(var(--bg-color))] transition-colors duration-150 ease-in-out";

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-color))]">
      <AppBar title="vTasks" />
      
      <main className="pt-20 pb-20 px-2 sm:px-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          <InputForm onAddEntry={addEntry} existingProjects={existingProjectsForAutocomplete} /> 

          {viewMode === 'main' && (
            <>
              <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg"> 
                <Tabs 
                  activeTab={activeTab} 
                  onTabChange={tab => { handleCancelEdit(); setActiveTab(tab); }} 
                  activeTaskCount={activeTasks.length} 
                  noteCount={activeNotes.length} 
                  activeFilters={activeFilters}
                  onSetFilter={handleSetFilter}
                  projectsInView={projectsInView}
                  prioritiesInView={prioritiesInView}
                  isFilterDropdownOpen={isFilterDropdownOpen}
                  onToggleFilterDropdown={toggleFilterDropdown}
                  onClearFilters={clearFilters}
                  filterDropdownRef={filterDropdownRef}
                />
                <div className="p-3 sm:p-4 min-h-[250px]">
                  {renderCurrentTabView()}
                </div>
                
                {snoozedEntries.length > 0 && (
                   <button
                    type="button"
                    onClick={() => setViewMode('snoozed')}
                    className={`${mainViewButtonClass} ${ (completedTasks.length === 0 && archivedNotes.length === 0) ? 'rounded-b-lg' : ''}`}
                   >
                    View Snoozed Items ({snoozedEntries.length})
                   </button>
                )}
                {completedTasks.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setViewMode('completed')} 
                    className={`${mainViewButtonClass} ${ (archivedNotes.length === 0 && snoozedEntries.length === 0) ? 'rounded-b-lg' : (archivedNotes.length === 0 && snoozedEntries.length > 0 ? '' : (archivedNotes.length > 0 && snoozedEntries.length === 0 ? 'rounded-b-lg' : '')) }`}
                  >
                    View Completed Tasks ({completedTasks.length})
                  </button>
                )}
                {archivedNotes.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setViewMode('archived')} 
                    className={`${mainViewButtonClass} rounded-b-lg`}
                  >
                    View Archived Notes ({archivedNotes.length})
                  </button>
                )}
                 {(snoozedEntries.length === 0 && completedTasks.length === 0 && archivedNotes.length === 0) && (
                    <div className="rounded-b-lg h-1"></div> 
                )}
              </div>
            </>
          )}

          {viewMode === 'completed' && (
            <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg p-3 sm:p-4 mt-6">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[rgb(var(--divider-color))]">
                <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Completed Tasks</h2>
                <button onClick={() => setViewMode('main')} className={`${footerButtonClass} !text-xs`}>&larr; Back</button>
              </div>
              <CompletedTaskList tasks={completedTasks} onOpenDetailModal={handleOpenDetailModal} existingProjects={existingProjectsForAutocomplete} />
            </div>
          )}
          {viewMode === 'archived' && (
            <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg p-3 sm:p-4 mt-6">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[rgb(var(--divider-color))]">
                <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Archived Notes</h2>
                <button onClick={() => setViewMode('main')} className={`${footerButtonClass} !text-xs`}>&larr; Back</button>
              </div>
              <ArchivedNoteList notes={archivedNotes} onOpenDetailModal={handleOpenDetailModal} existingProjects={existingProjectsForAutocomplete} />
            </div>
          )}
           {viewMode === 'snoozed' && (
            <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg p-3 sm:p-4 mt-6">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[rgb(var(--divider-color))]">
                <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Snoozed Items</h2>
                <button onClick={() => setViewMode('main')} className={`${footerButtonClass} !text-xs`}>&larr; Back</button>
              </div>
              <SnoozedList 
                entries={snoozedEntries} 
                onOpenDetailModal={handleOpenDetailModal} 
                existingProjects={existingProjectsForAutocomplete} 
                onOpenSnoozeModal={handleOpenSnoozeModal}
                onUnsnoozeItem={handleUnsnoozeItem}
                onDeleteRequest={requestDeleteConfirmation}
                onArchiveRequest={requestArchiveConfirmation}
                onToggleComplete={toggleTaskCompletion}
                onOpenCompletionNotesModal={handleOpenCompletionNotesModal}
                onStartEdit={(id, type) => handleStartEdit(id, type)}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                editingNoteId={editingNoteId}
                editingTaskId={editingTaskId}
                draggedItemId={null} 
                onDragStartHandler={() => {}} 
                onDropHandler={() => {}}
                onDragEndHandler={() => {}}
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-[rgb(var(--bg-color))] border-t border-[rgb(var(--divider-color))] p-3 text-xs text-center text-[rgb(var(--text-secondary))] mt-8">
         <div className="flex justify-center space-x-3">
            <button onClick={openImportDataModal} className={`${footerButtonClass} !text-xs`}>Import Data</button>
            <button onClick={openExportOptionsModal} className={`${footerButtonClass} !text-xs`}>Export All Data</button>
         </div>
         <p className="mt-1.5 opacity-75">&copy; 2025 John Vilsack</p>
      </footer>

      {isDetailModalOpen && selectedEntryForDetail && (
        <DetailModal 
            entry={selectedEntryForDetail} 
            onClose={handleCloseDetailModal} 
            onToggleComplete={toggleTaskCompletion}
            onDeleteRequest={requestDeleteConfirmation}
            onArchiveRequest={requestArchiveConfirmation} 
            onStartEdit={handleStartEdit}
            onOpenCompletionNotesModal={handleOpenCompletionNotesModal}
            onOpenSnoozeModal={handleOpenSnoozeModal}
            onUnsnoozeItem={handleUnsnoozeItem}
        />
      )}
      {isDeleteConfirmOpen && itemToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteConfirmOpen}
          onClose={cancelDeleteConfirmation}
          onConfirm={confirmDeleteEntry}
          itemName={itemToDelete.title}
        />
      )}
      {isCompletionNotesModalOpen && taskForCompletionNotes && (
        <CompletionNotesModal
          isOpen={isCompletionNotesModalOpen}
          onClose={() => { 
            if (taskForCompletionNotes && !taskForCompletionNotes.isCompleted) { 
                 handleSaveCompletionNotes(''); 
            } else {
                 handleCloseCompletionNotesModal(); 
            }
          }}
          onSave={handleSaveCompletionNotes}
          taskTitle={taskForCompletionNotes.title}
        />
      )}
      {isArchiveConfirmOpen && itemToArchive && ( 
        <ConfirmArchiveModal
          isOpen={isArchiveConfirmOpen}
          onClose={cancelArchiveConfirmation}
          onConfirm={confirmArchiveNote}
          itemName={itemToArchive.title}
          isArchiving={!itemToArchive.isArchived} 
        />
      )}
      {isExportOptionsModalOpen && (
        <ExportOptionsModal
          isOpen={isExportOptionsModalOpen}
          onClose={closeExportOptionsModal}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
        />
      )}
      {isImportDataModalOpen && (
        <ImportDataModal
          isOpen={isImportDataModalOpen}
          onClose={closeImportDataModal}
          onImport={handleImportData}
        />
      )}
      {isSnoozeModalOpen && entryToSnooze && (
        <SnoozeModal
          isOpen={isSnoozeModalOpen}
          onClose={handleCloseSnoozeModal}
          onConfirmSnooze={handleConfirmSnooze}
          entryTitle={entryToSnooze.title}
          currentSnoozeUntil={entryToSnooze.snoozedUntil}
        />
      )}
    </div>
  );
};

export default App;
