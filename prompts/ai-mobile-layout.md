
# vTasks: Mobile Layout & Interactive Functionality PRD

## 1. Introduction

**Purpose:** This document details the mobile-specific layout and interactive functionality for the vTasks application. It aims to guide AI or human developers in replicating the intended user experience on touch-based mobile devices.

**Target Audience:** AI Models, Frontend Developers.

**Core Principles for Mobile:**
*   **Exclusive Dark Theme:** Maintain the established dark purple/magenta theme. All colors and styles are defined by CSS custom properties in `index.html`.
*   **Touch-First Design:** Ensure all interactive elements are easily tappable with sufficient spacing.
*   **Responsive & Adaptive:** Layouts should adapt gracefully to various mobile screen sizes, prioritizing content and ease of use.
*   **Performance:** Lightweight and responsive interactions.
*   **Notifications:** Support for desktop/system notifications when items unsnooze.
*   **Visual Feedback:** Brief animation on item cards when they unsnooze (auto or manual from snoozed state).

## 2. Global Elements (Mobile Context)

### 2.1. Theme & Typography
*   **Theme:** Adhere strictly to the dark theme variables. "Woke Up" status uses a distinct color (e.g., emerald green).
*   **Typography:** 'Inter' font family.

### 2.2. AppBar (`AppBar.tsx`)
*   **Position & Size:** Fixed top, `4rem` height.
*   **Content:** "vTasks" title.

### 2.3. Modal Dialogs (General Behavior)
*   **Overlay:** Full-screen, closes modal on tap.
*   **Content (`modal-content`):** Centered, `width: 90%`, `max-width: 500px`, `max-height: 90vh`. Scrollable body.

### 2.4. Footer (Page Bottom)
*   **Position:** Non-sticky.
*   **Content:** "Import Data", "Export All Data" buttons (stacked or side-by-side based on width). Copyright notice.

## 3. Main Application Structure (`App.tsx`)

### 3.1. Overall Vertical Flow:
1.  AppBar
2.  InputForm
3.  Main Content Area (Scrollable, changes with `viewMode`)
4.  Page Footer

### 3.2. `viewMode` State:
Controls content: `'main'`, `'completed'`, `'archived'`, `'snoozed'`.

### 3.3. Notifications & Animations
*   Application requests notification permission.
*   System notification on auto-unsnooze (if permitted).
*   `EntryItem` cards briefly flash their background (`animate-wakeup-flash` class) when they unsnooze (auto or manual from a snoozed state).

## 4. Input Form (`InputForm.tsx`) - Mobile Layout

*   **Location:** Below AppBar, full width.
*   **Type Selection (Task/Note):** Segmented control, 50/50 width.
*   **Title Input & "Add Details" Toggle:** Full-width title input. Icon button inside on right toggles Options Panel.
*   **Options Panel (Collapsible):** Vertical stack of full-width inputs (Details, Project, Due Date, Priority, Contact, URL).
*   **Submit Button:** Full width.

## 5. Main Content Area - `viewMode === 'main'` - Mobile Layout

Card-like container.

### 5.1. Tabs & Filters (`Tabs.tsx`, `FilterControls.tsx`)
*   **Tabs ("Active Tasks", "Notes"):** Side-by-side, ~50% width each. Show counts.
*   **Filter Button:** Icon button right of tabs. Toggles Filter Dropdown.
*   **Filter Dropdown:** Expands below, nearly full width. Project/Priority selects, "Clear All Filters" button.

### 5.2. Tab Content (`ActiveTaskList.tsx`, `NoteList.tsx`)
*   Scrollable list of `EntryItem` cards. Empty state message.
*   Cards for newly woken items (from auto or manual unsnooze of snoozed item) will have a brief background flash animation.

### 5.3. Navigation Buttons (to other `viewMode`s)
*   Bottom of main view card. Full width, stacked vertically if multiple. Show counts.

## 6. Entry Item (`EntryItem.tsx`) - Mobile Layout

### 6.1. Card Layout & Interaction
*   Full width, padding. Rounded, shadow, priority border.
*   **Animation:** Card background briefly animates (`animate-wakeup-flash`) if `animateNow` prop is true (triggered by unsnooze from a snoozed state).
*   Main tap opens `DetailModal`. Draggable in active lists.

### 6.2. Content Display (Non-Editing State)
*   Vertical flow. Task Checkbox (left of title). Title. Project & Contact info.
*   **Dates**: Due Date, "Snoozed Until:" (if `snoozedUntil` future), "Woke up:" (if `wokeUpAt` set, distinct emerald color). Completed/Archived At. Stacked if necessary.

### 6.3. Action Icons (Top-Right Corner)
*   Horizontal row. Adequate tap spacing.
*   **Icons (conditional):** URL, Edit.
    *   **Activate Icon (Play style)**: For actively snoozed items. Activates item, clears `snoozedUntil`, sets `wokeUpAt`.
    *   **Snooze Icon (Clock style)**: For active items (non-snoozed, including those with `wokeUpAt`). Opens `SnoozeModal`. Hidden if actively snoozed.
    *   Archive, Delete.

### 6.4. Inline Editing Mode
*   Expands card. Full-width, stacked inputs: Title, Details, Project, Due Date (clearable X), Priority, Contact, URL. Snooze Date (clearable X) & Time.
*   "Save" & "Cancel" buttons at bottom (stacked or side-by-side). Saving a new snooze clears `wokeUpAt`.

## 7. Other Views (`viewMode !== 'main'`) - Mobile Layout

### 7.1. Snoozed Items View (`SnoozedList.tsx`)
*   Header: "Snoozed Items", "← Back" button.
*   List: `EntryItem` cards (editable, can be re-snoozed/unsnoozed).

### 7.2. Completed Tasks View (`CompletedTaskList.tsx`)
*   Header: "Completed Tasks", "← Back" button.
*   List: Grouped by week. "Copy Titles" icon button per group. `EntryItem` cards display-only.

### 7.3. Archived Notes View (`ArchivedNoteList.tsx`)
*   Header: "Archived Notes", "← Back" button.
*   List: `EntryItem` cards (display-only).

## 8. Modal Interactions - Mobile Layout & Functionality

### 8.1. Detail Modal (`DetailModal.tsx`)
*   **Header:** Title (left), Action Icons (Edit, Snooze/Activate, Archive/Unarchive, Delete) and Close X (right).
    *   **Snooze Icon (Clock style)** shown if item is active and can be snoozed (including items that have `wokeUpAt` set but are not currently snoozed).
    *   **Activate Icon (Play style)** shown if item is currently snoozed (`isCurrentlySnoozed`). Clicking it sets `wokeUpAt`. Also, if an item has `wokeUpAt` set (is not currently snoozed), this icon's action (if available through some logic path, though DetailModal primarily relies on EntryItem's state) would clear `wokeUpAt`.
*   **Body (Scrollable):** Vertical "Label: Value" pairs. "Woke Up At" shown with distinct style. "Snoozed Until:" label used.
*   **Footer (Tasks):** "Mark as Complete"/"Mark as Incomplete" button.

### 8.2. Confirmation Modals
*   Icon, Title, Message. "Action" and "Cancel" buttons (stacked or side-by-side).

### 8.3. Completion Notes Modal
*   Icon, Title, Task reference. Textarea. "Save Notes & Complete", "Skip & Complete" buttons.

### 8.4. Export Options Modal
*   Icon, Title. "Export JSON", "Export CSV", "Cancel" buttons (stacked).

### 8.5. Import Data Modal
*   Icon, Title. File Input. Radio buttons (Overwrite/Merge). Warnings. "Import File", "Cancel" buttons (stacked).

### 8.6. Snooze Modal (`SnoozeModal.tsx`)
*   Icon, Title, Item reference. Date & Time inputs (stacked or grid). "Snooze", "Cancel" buttons.
*   Snoozing an item (newly or re-snoozing a woken one) sets `snoozedUntil` and clears `wokeUpAt`.

## 9. Touch Interactions & Feedback

*   Buttons: Visual feedback on tap.
*   List Items (Draggable): Long-press to drag.
*   Scroll: Native mobile behavior.
*   No Hover Dependence.

This document outlines the mobile-specific considerations for vTasks.
