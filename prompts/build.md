
# AI-Assisted Build Instructions for vTasks

## 1. Introduction

**Objective:** Develop "vTasks," a web application for task and note management.

**Core Purpose:** Allow users to create, view, edit, complete, archive (notes only), snooze, filter, and delete tasks and notes. The application must be lightweight, user-friendly, and data-driven.

**Data Storage:** All user data must be persisted locally in the user's web browser (`localStorage`). No server-side storage.

**Theme:** **Single, exclusive dark theme.** No light mode. Aesthetic: modern, clean, focused.

## 2. Data Model

### 2.1. `Entry` Object
Central data structure for tasks and notes. Attributes:

*   `id`: (String) Unique identifier (`crypto.randomUUID()`).
*   `title`: (String) Required.
*   `details`: (String, Optional)
*   `type`: (Enum/String) `'TASK'` or `'NOTE'`.
*   `createdAt`: (String) ISO 8601 date-time.
*   `isCompleted`: (Boolean) For `TASK`. Default: `false`.
*   `completedAt`: (String, Optional) ISO 8601 date-time.
*   `completionNotes`: (String, Optional) For `TASK`.
*   `dueDate`: (String, Optional) ISO 8601 date (YYYY-MM-DD).
*   `contact`: (String, Optional)
*   `url`: (String, Optional)
*   `isArchived`: (Boolean) For `NOTE`. Default: `false`.
*   `archivedAt`: (String, Optional) ISO 8601 date-time.
*   `project`: (String, Optional) Project name/tag.
*   `priority`: (Enum/String `PriorityLevel`) `CRITICAL`, `HIGH`, `NORMAL` (default), `LOW`.
*   `snoozedUntil`: (String, Optional) ISO 8601 date-time. Cleared when item auto-unsnoozes or is manually unsnoozed.
*   `wokeUpAt`: (String, Optional) ISO 8601 date-time, set when item auto-unsnoozes or is manually unsnoozed from a snoozed state. Cleared on subsequent interaction (e.g., card click if not snoozed), re-snooze, completion, or archiving.

### 2.2. `PriorityLevel` Enum
`'CRITICAL'`, `'HIGH'`, `'NORMAL'`, `'LOW'`.

### 2.3. `ActiveFilters` Interface
For managing filter state: `project?: string`, `priority?: PriorityLevel`.

## 3. Application Layout & UI Components

Responsive design.

### 3.1. AppBar
*   Fixed top. Displays "vTasks".

### 3.2. Input Form
Persistent below AppBar. Segmented control (Task/Note), Title input, collapsible Options Panel (Details, Project, Due Date, Priority, Contact, URL). Submit button.

### 3.3. Main Content Area
Controlled by `viewMode` state (`'main'`, `'completed'`, `'archived'`, `'snoozed'`).

*   **Main View (`viewMode === 'main'`):**
    *   **Tabs & Filters:** "Active Tasks", "Notes" tabs with counts. Filter button & dropdown for Project/Priority.
    *   **Tab Content:** Lists active tasks or notes.
    *   **Navigation Buttons:** To "Snoozed", "Completed", "Archived" views.
*   **Snoozed Items View (`viewMode === 'snoozed'`):** Lists items with future `snoozedUntil`.
*   **Completed Tasks View (`viewMode === 'completed'`):** Grouped by completion week.
*   **Archived Notes View (`viewMode === 'archived'`):** Sorted by `archivedAt`.

### 3.4. Footer
Non-sticky. "Import Data", "Export All Data" buttons. Copyright.

## 4. Entry Item Component (Card Display)

### 4.1. General Appearance & Interaction
*   Rounded card, shadow, priority border.
*   Clicking card opens "Detail Modal". If the item has `wokeUpAt` (and isn't actively snoozed), this click also clears `wokeUpAt`. Draggable in active lists.

### 4.2. Content (Non-Editing State)
*   Title, Task Checkbox. Project & Contact.
*   Dates: Due Date, "Snoozed Until:" (if future `snoozedUntil`), "Woke up:" (if `wokeUpAt` set and not yet cleared, distinct color), Completed/Archived At.

### 4.3. Action Icons (Top-Right, conditional)
*   URL, Edit.
*   **Activate Icon (Play style)**: For actively snoozed items. Sets `wokeUpAt`.
*   **Snooze Icon (Clock style)**: For active items (non-snoozed, including those with uncleared `wokeUpAt`). Opens "Snooze Modal". Hidden if `isCurrentlySnoozed`.
*   Archive, Delete.

### 4.4. Inline Editing Mode
Inputs for Title, Details, Project, Due Date (clearable), Priority, Contact, URL. Snooze Date/Time inputs (date clearable). Saving while setting a new snooze clears `wokeUpAt`.

## 5. Modals

### 5.1. Detail Modal
*   Header: Title, Action Icons (Edit, Snooze/Activate, Archive/Unarchive, Delete, Close).
    *   **Activate Icon (Play style)**: Shown only if item is *currently snoozed*.
    *   **Snooze Icon (Clock style)**: Shown if item is active and *not currently snoozed* (this includes items that have woken up).
*   Body: Displays entry fields. "Woke up:" shown if applicable and not cleared.
*   Footer: Task completion button.

### 5.2. Other Modals
(ConfirmDelete, CompletionNotes, ConfirmArchive, ExportOptions, ImportData, SnoozeModal).
*   **Snooze Modal**: Used for initial snoozing and re-snoozing woken items. Snoozing clears `wokeUpAt`.

## 6. State Management & Data Flow

*   **Primary Data Store:** `entries: Entry[]` in `localStorage` (key: `task-notes-entries-v3`).
*   **Key States:** `entries`, `activeTab`, `viewMode`, `editingNoteId`, `editingTaskId`, `draggedItemId`, `activeFilters`, modal states.
*   **Periodic Unsnooze:** Checks snoozed items. If item auto-unsnoozes:
    *   Sets `wokeUpAt`, clears `snoozedUntil`.
*   **Setting/Clearing `wokeUpAt`**:
    *   SET: On auto-unsnooze or manual unsnooze (activation) of a snoozed item.
    *   CLEARED: On card click (if `wokeUpAt` present and not actively snoozed), re-snooze, edit to new future snooze, completion, or archiving.
*   Derived data memoized.

## 7. Utility Functions

Date utilities for formatting (`formatDate` for full date/time, `formatDueDate`, etc.).

## 8. Data Import/Export Functionality

JSON/CSV, includes all fields like `wokeUpAt`. Timestamped filenames. Robust parsing. Overwrite/merge modes.

## 9. Styling & Theme (Exclusive Dark Theme)

CSS custom properties from `index.html`. Tailwind. Custom scrollbars. `color-scheme: dark` for date/time pickers.

## 10. Accessibility (A11Y)

Semantic HTML, ARIA, keyboard navigation, focus, contrast.

## 11. Error Handling & Edge Cases

Empty list messages, required title. Import/export alerts.