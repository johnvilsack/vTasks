

export enum EntryType {
  Task = 'TASK',
  Note = 'NOTE',
}

export enum PriorityLevel {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Normal = 'NORMAL',
  Low = 'LOW',
}

export interface Entry {
  id: string;
  title: string;
  details?: string;
  type: EntryType;
  createdAt: string; // ISO Date string
  isCompleted: boolean;
  completedAt?: string; // ISO Date string
  completionNotes?: string; // Notes added when a task is completed
  dueDate?: string; // ISO Date string for due date
  contact?: string; // Contact info
  url?: string; // URL associated with the entry
  isArchived?: boolean; // For notes
  archivedAt?: string; // ISO Date string, for notes
  project?: string; // Optional project name
  priority?: PriorityLevel; // Optional priority level
  snoozedUntil?: string; // ISO Date string, if item is snoozed
  wokeUpAt?: string; // ISO Date string, when item automatically unsnoozed
}

export enum TabView {
  ActiveTasks = 'ACTIVE_TASKS',
  Notes = 'NOTES',
  CompletedTasks = 'COMPLETED_TASKS', // Kept for viewMode logic, not a direct tab anymore
  ArchivedNotes = 'ARCHIVED_NOTES', // For viewMode logic
}

export interface ActiveFilters {
  project?: string;
  priority?: PriorityLevel;
}

export enum QuickSnoozeOption {
  LaterToday = 'LATER_TODAY', // +4 hours
  Tomorrow = 'TOMORROW', // Tomorrow 8 AM
  ThisWeekend = 'THIS_WEEKEND', // This Friday 5 PM (or next if past)
  NextWeek = 'NEXT_WEEK', // Next Monday 8 AM
  DayAfterTomorrow = 'DAY_AFTER_TOMORROW', // Day after tomorrow 8 AM
  WeeklySurprise = 'WEEKLY_SURPRISE', // Random time in next 7 days
  PickDateTime = 'PICK_DATE_TIME', // Opens SnoozeModal
}