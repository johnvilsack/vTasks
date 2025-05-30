
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
*   `snoozedUntil`: (String, Optional) ISO 8601 date-time.

### 2.2. `PriorityLevel` Enum
`'CRITICAL'`, `'HIGH'`, `'NORMAL'`, `'LOW'`.

### 2.3. `ActiveFilters` Interface
For managing filter state: `project?: string`, `priority?: PriorityLevel`.

## 3. Application Layout & UI Components

Responsive design.

### 3.1. AppBar
*   Fixed top. Displays "vTasks". Uses theme colors.

### 3.2. Input Form
Persistent below AppBar.
*   **Entry Type Selection:** Segmented control ("Task", "Note").
*   **Title Input & "Add Details" Toggle:**
    *   Required text input for `title`. Placeholder dynamic.
    *   Icon button (plus/minus) on right of title input toggles "Options Panel". Styled for affordance.
*   **Options Panel (Collapsible):** Initially hidden.
    *   `Details`: Textarea.
    *   `Project`: Text input. Autocomplete based on existing active/snoozed projects.
    *   `Due Date`: Date input.
    *   `Priority`: Select dropdown (`Critical`, `High`, `Normal`, `Low`). Default to `Normal`.
    *   `Contact`: Text input.
    *   `URL`: URL input. Auto-prepends `https://` if scheme missing.
*   **Submission:** Full-width "Add Task"/"Add Note" button.
    *   On submit: Creates `Entry` (with `project`, `priority`), adds to list, clears form, collapses Options Panel, sets relevant tab active.

### 3.3. Main Content Area
Controlled by `viewMode` state (`'main'`, `'completed'`, `'archived'`, `'snoozed'`).

*   **Main View (`viewMode === 'main'`):**
    *   **Tabs & Filters:**
        *   Tabs: "Active Tasks", "Notes". Display filtered item counts. Active tab highlighted.
        *   **Filter Button & Dropdown:** To the right of tabs.
            *   Button: Filter icon. Toggles dropdown.
            *   Dropdown: Filter by "Project" and "Priority". Options (projects, priorities) dynamically populated from current view's active/snoozed items (pre-filter). "All" option for each. "Clear All Filters" button. Closes on outside click.
    *   **Tab Content:** Lists active tasks or notes (filtered).
    *   **Navigation Buttons (Order: Snoozed, Completed, Archived):**
        *   "View Snoozed Items": If snoozed items exist. Sets `viewMode = 'snoozed'`.
        *   "View Completed Tasks": If completed tasks exist. Sets `viewMode = 'completed'`.
        *   "View Archived Notes": If archived notes exist. Sets `viewMode = 'archived'`.
        *   Conditional rounded corners based on button visibility.
*   **Snoozed Items View (`viewMode === 'snoozed'`):**
    *   Header: "Snoozed Items". "← Back" button.
    *   List: Items with `snoozedUntil` in the future. Sorted by `snoozedUntil` (soonest first).
    *   Items are editable, can be unsnoozed, deleted, etc.
*   **Completed Tasks View (`viewMode === 'completed'`):**
    *   Header: "Completed Tasks". "← Back" button.
    *   List: Grouped by completion week (most recent first). Tasks within groups sorted by `completedAt` (most recent first).
    *   **Copy Titles Button:** Per week group, copies titles of tasks in that group to clipboard. Shows "Copied!" feedback.
*   **Archived Notes View (`viewMode === 'archived'`):**
    *   Header: "Archived Notes". "← Back" button. List sorted by `archivedAt` (most recent first).

### 3.4. Footer
*   Non-sticky.
*   **"Import Data" Button:** Opens "Import Data Modal".
*   **"Export All Data" Button:** Opens "Export Options Modal" (if data exists).
*   Copyright: "© 2025 John Vilsack".

## 4. Entry Item Component (Card Display)

### 4.1. General Appearance & Interaction
*   Rounded corners, shadow.
*   **Priority Indicator:** Colored left border (Critical: Red, High: Yellow, Low: Sky Blue). Normal priority: default border.
*   **Icon Opacity:** Action icons 10% opaque, 100% on hover.
*   Clicking card (not actions) opens "Detail Modal".
*   **Drag-and-Drop (Active Lists):** Draggable card. Visual cues for drag. Reorder within same type/status/snooze-state.

### 4.2. Content (Non-Editing State)
*   **Title:** Prominent. (No strikethrough for completed tasks).
*   **Task Checkbox (Active Tasks):** Left of title. Checking opens "Completion Notes Modal". Unchecking uncompletes.
*   **Project & Contact Info (Tasks):** Displayed below title (e.g., "ProjectX - ContactY"). Also on completed task cards.
*   **Dates (Layout):** Project/Contact info on left. Due Date / Snoozed Date on right, on same line. If both Due & Snooze Date for active task, Due Date above Snoozed Date on the right.
*   **Due Date:** If present, not completed/archived.
*   **Snoozed Date:** If `snoozedUntil` is future, not completed/archived. Formatted with time.
*   **Completed At Date:** For completed tasks.
*   **Archived At Date:** For archived notes.

### 4.3. Action Icons (Top-Right, if `allowActions === true`, conditional visibility)
*   **URL Icon (Globe):** If `entry.url` exists. Opens URL.
*   **Edit Icon (Pencil):** For active/snoozed items. Toggles inline editing.
*   **Unsnooze Icon (Bell Slash):** For snoozed items. Unsnoozes directly. Hides Snooze icon.
*   **Snooze Icon (Clock):** For active (non-snoozed, non-completed, non-archived) items. Opens "Snooze Modal".
*   **Archive Icon (Archive Box):** For active notes. Opens "Confirm Archive Modal".
*   **Delete Icon (Trash Can):** For active/snoozed items. Opens "Confirm Delete Modal".

### 4.4. Inline Editing Mode
Triggered by "Edit" icon.
*   Input fields for: `Title`, `Details` (textarea scrolls to bottom, focuses end), `Project` (autocomplete), `Due Date` (with "Clear" (X) button), `Priority` (select), `Contact`, `URL`.
*   **Snooze Fields:** `Snooze Until Date` (with "Clear" (X) button), `Snooze Until Time`. Defaults to 12 AM if time empty. "Clear" button should be small, circular, inside the input field, vertically centered.
*   "Save", "Cancel" buttons. Title required.

## 5. Modals

Overlay with backdrop. Centered content.

### 5.1. Detail Modal
*   Trigger: Card click.
*   Header: Title. Action Icons (Edit, Snooze/Unsnooze, Archive/Unarchive, Delete, Close).
*   Body (Scrollable): "Label: Value" for Type, Project, Priority (if not Normal), Details, Due Date, Contact, URL (clickable), Created At, Completed At (with Completion Notes), Archived At, Snoozed Until (with time).
*   Footer (Tasks): "Mark as Complete"/"Mark as Incomplete". Marking complete opens "Completion Notes Modal".

### 5.2. Confirm Delete Modal
*   Standard confirmation. Message includes item title.

### 5.3. Completion Notes Modal
*   Trigger: Marking task complete. Title includes task title. Textarea for notes.
*   Buttons: "Skip & Complete", "Save Notes & Complete Task".

### 5.4. Confirm Archive Modal
*   Standard confirmation. Dynamic titles/messages for archive/unarchive.

### 5.5. Export Options Modal
*   Trigger: "Export All Data" button. Title: "Export Data".
*   Buttons: "Export as JSON", "Export as CSV", "Cancel".

### 5.6. Import Data Modal
*   Trigger: "Import Data" button. Title: "Import Data". File input (JSON/CSV).
*   **Import Mode Radio Buttons:** "Overwrite existing data", "Merge with existing data". Merge assigns new UUIDs.
*   Warning messages. Buttons: "Import File", "Cancel".

### 5.7. Snooze Modal
*   Trigger: Snooze icon. Title: "Snooze Item", includes item title.
*   Inputs: Snooze Date, Snooze Time. Defaults time to 12 AM if only date provided. Validates future time.
*   Buttons: "Snooze", "Cancel".

## 6. State Management & Data Flow

*   **Primary Data Store:** `entries: Entry[]`. Persisted to `localStorage` (key: `task-notes-entries-v3`).
*   **Key States:** `entries`, `activeTab`, `viewMode`, `editingNoteId`, `editingTaskId`, `draggedItemId`, `activeFilters`, `isFilterDropdownOpen`, modal visibility states.
*   **Periodic Unsnooze:** Check snoozed items every minute and unsnooze if `snoozedUntil` has passed.
*   **Derived Data:** Memoized lists for active (filtered), completed, archived, snoozed items. Memoized project lists for autocomplete and filter options.
*   Reactive UI updates.

## 7. Utility Functions

### 7.1. Date Utilities
*   `getWeekOfYear`, `getWeekDates`, `formatWeekDateRange`, `formatDate` (full with time), `formatDueDate`, `formatDateShort`, `formatArchivedAtDate`.

## 8. Data Import/Export Functionality

*   **Filename:** `vtasks-export-YYYYMMDD_HHMMSS.[json|csv]`.
*   **JSON/CSV:** Handle all `Entry` fields including `project`, `priority`, `snoozedUntil`.
*   **CSV Parsing:** Robustly handle escaped fields.
*   **Import Logic:** Validate structure. Handle overwrite/merge modes.

## 9. Styling & Theme (Exclusive Dark Theme)

*   Use CSS custom properties (see `index.html`).
*   Includes colors for main layout, text, accents, inputs, buttons, priorities (Critical: Red, High: Yellow, Low: Sky Blue for borders).
*   Typography: 'Inter'.
*   Custom scrollbars. Dark mode for native date/time pickers (`color-scheme: dark`).

## 10. Accessibility (A11Y)

*   Semantic HTML, ARIA labels/roles, color contrast, keyboard navigability, focus indicators.

## 11. Error Handling & Edge Cases

*   Empty list messages. Title input required.
*   Alerts for import/export issues.
