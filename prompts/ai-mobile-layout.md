
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

## 2. Global Elements (Mobile Context)

### 2.1. Theme & Typography
*   **Theme:** Adhere strictly to the dark theme variables (e.g., `--bg-color`, `--card-bg-color`, `--accent-color`). "Woke Up" status uses a distinct color (e.g., emerald green).
*   **Typography:** 'Inter' font family. Font sizes should be legible on mobile screens, potentially using responsive scaling or mobile-specific sizes. Body text `text-base` (Tailwind).

### 2.2. AppBar (`AppBar.tsx`)
*   **Position & Size:** Fixed to the top of the viewport, `4rem` (64px) height.
*   **Content:** Application title "vTasks" prominently displayed, typically left-aligned or centered.
*   **Interaction:** Non-interactive apart from being a persistent header.

### 2.3. Modal Dialogs (General Behavior)
*   **Overlay:** Full-screen `modal-overlay` with `rgba(var(--bg-color), 0.7)` background and `backdrop-filter: blur(5px)`. Tapping the overlay closes the modal.
*   **Content (`modal-content`):**
    *   Vertically and horizontally centered.
    *   `width: 90%`, `max-width: 500px` (adapts to screen).
    *   `max-height: 90vh`. Content within the modal body should be scrollable if it exceeds this height.
    *   Rounded corners, `rgb(var(--card-bg-color))` background.
*   **Closing:** Tappable "Close" icon (X) in the top-right corner of the modal content area, or a "Cancel"/"Close" button in the modal footer.

### 2.4. Footer (Page Bottom)
*   **Position:** Not sticky. Appears at the very bottom of the main page's scrollable content.
*   **Content:**
    *   "Import Data" and "Export All Data" buttons. On mobile, these buttons should be stacked vertically, each taking full available width for easy tapping, or side-by-side if screen width allows adequate tap targets.
    *   Copyright notice "© 2025 John Vilsack" below the buttons.
*   **Styling:** Buttons use `footerButtonClass` styling (accent color, smaller text).

## 3. Main Application Structure (`App.tsx`)

### 3.1. Overall Vertical Flow:
1.  **AppBar** (Fixed Top)
2.  **InputForm** (Persistent, directly below AppBar)
3.  **Main Content Area** (Scrollable, below InputForm, content changes based on `viewMode`)
4.  **Page Footer** (At the end of the scrollable content)

### 3.2. `viewMode` State:
Controls content within the "Main Content Area". Values: `'main'`, `'completed'`, `'archived'`, `'snoozed'`.

### 3.3. Notifications
*   Application requests notification permission on load if status is 'default'.
*   When an item automatically unsnoozes, a system notification is displayed if permission is granted.

## 4. Input Form (`InputForm.tsx`) - Mobile Layout

*   **Location:** Below AppBar, full width of the main content column.
*   **Type Selection (Task/Note):**
    *   Segmented control buttons ("Task", "Note").
    *   Each button takes roughly 50% of the form's width, side-by-side. Ensure clear visual separation and large tap areas.
    *   Active type is visually distinct (accent background).
*   **Title Input & "Add Details" Toggle:**
    *   **Title Input (`#title`):** Full width of the form. Placeholder text ("New task..." or "New note title...").
    *   **"Add Details" Button:**
        *   Icon button (Plus/Minus circle icon) positioned on the right side, *inside* the title input's visual container but as a distinct tappable element.
        *   Toggles visibility of the "Options Panel".
*   **Options Panel (Collapsible):**
    *   Expands vertically downwards from the title input when toggled.
    *   Each input field within the panel is stacked vertically, taking full width for easy interaction.
    *   **Fields:**
        *   `Details` (textarea): `rows={3}`, full width.
        *   `Project` (text input): Full width. Autocomplete suggestions (datalist) appear as native browser UI.
        *   `Due Date` (date input): Full width. Uses native mobile date picker. `dark-input-icons` class for styling.
        *   `Priority` (select): Full width. Uses native mobile select dropdown.
        *   `Contact` (text input): Full width.
        *   `URL` (url input): Full width.
    *   Labels are displayed above their respective inputs.
*   **Submit Button:**
    *   Full width of the form, below the Options Panel (if visible) or title input.
    *   Label: "Add Task" or "Add Note" based on selected `type`.

## 5. Main Content Area - `viewMode === 'main'` - Mobile Layout

This area is housed within a card-like container with `rounded-lg` and `bg-[rgb(var(--card-bg-color))]`.

### 5.1. Tabs & Filters (`Tabs.tsx`, `FilterControls.tsx`)
*   **Tabs ("Active Tasks", "Notes"):**
    *   Displayed side-by-side, each taking roughly 50% of the container's width.
    *   Contain label and item count (e.g., "Active Tasks (5)").
    *   Active tab is highlighted (e.g., accent color bottom border, different text color).
    *   Fully tappable area for each tab.
*   **Filter Button (`FilterControls.tsx`):**
    *   Positioned to the far right of the tabs, within the same horizontal row.
    *   Icon-based (filter/funnel icon). Tappable.
    *   Toggles the Filter Dropdown.
*   **Filter Dropdown:**
    *   Appears below the tabs/filter button area when toggled.
    *   Takes significant width (e.g., `w-64`, but on mobile, might expand to nearly full width of the parent card).
    *   Contains:
        *   `Project` filter (select dropdown, "All Projects" default).
        *   `Priority` filter (select dropdown, "All Priorities" default).
        *   "Clear All Filters" button (full width within dropdown).
    *   Closes on tapping outside the dropdown area.
    *   Selects use native mobile UI.

### 5.2. Tab Content (`ActiveTaskList.tsx`, `NoteList.tsx`)
*   Displayed below the Tabs & Filters section, within the same parent card.
*   Consists of a vertically scrollable list of `EntryItem` cards.
*   If the list is empty, a centered message like "No active tasks!" or "No active notes." is displayed.
*   Min height of `250px` to ensure the card has substance even when empty.

### 5.3. Navigation Buttons (to other `viewMode`s)
*   Appear at the bottom of the main view card, below the tab content area.
*   Each button ("View Snoozed Items (X)", "View Completed Tasks (Y)", "View Archived Notes (Z)") is:
    *   Full width of the card.
    *   Stacked vertically if multiple are visible.
    *   Displays item counts.
    *   Conditionally rendered based on the existence of items in respective categories.
    *   Styling (`mainViewButtonClass`): specific background, text color, border.
    *   Corner rounding adjusts based on which buttons are visible (e.g., last visible button gets `rounded-b-lg`).

## 6. Entry Item (`EntryItem.tsx`) - Mobile Layout

Represents a single task or note card.

### 6.1. Card Layout & Interaction
*   Takes full available width within its list container, with standard padding (`p-3`).
*   Rounded corners, shadow.
*   **Priority Indicator:** Coloured left border (4px wide for Critical, High, Low).
*   **Main Tap Action:** Tapping the card (not specific action icons/inputs) opens the `DetailModal`.
*   **Drag-and-Drop (Active Lists):**
    *   The entire card acts as a drag handle (`drag-handle` class).
    *   On touch devices, a long-press might be the intuitive way to initiate drag, or rely on default browser drag behavior if sufficient.
    *   Visual feedback: `dragging-item` class (opacity, shadow, scale). `drag-over-target-indicator` (top border on potential drop target).

### 6.2. Content Display (Non-Editing State)
*   **Vertical flow is common on mobile.**
*   **Task Checkbox (Tasks only):**
    *   Positioned to the left of the title. Sufficient tap area (`h-4 w-4` with `mr-3 mt-0.5`).
    *   Tapping opens `CompletionNotesModal` if completing, or directly uncompletes.
*   **Title:**
    *   Main text element. Font medium. Wraps to multiple lines if necessary.
*   **Project & Contact Info:**
    *   Displayed below the title.
    *   Format: "[Project] - [Contact]". Can wrap. `text-xs`.
*   **Dates (Due Date / Snoozed Date / Woke Up Date):**
    *   Displayed below Project/Contact or aligned to the right if there's a clear separation. On narrow screens, stacking is preferred.
    *   `Due Date`: "Due: [Formatted Date]". `text-xs`, often highlighted color.
    *   `Snoozed Date`: "Snoozed: [Formatted Date & Time]". `text-xs`, often distinct color (e.g., sky blue). Shown if item is actively snoozed and not just woken up.
    *   `Woke Up Date`: "Woke up: [Formatted Date & Time]". `text-xs`, distinct color (e.g., emerald green). Shown if item auto-unsnoozed and not re-snoozed. Takes display precedence over a past snooze time.
    *   If both Due and (Snoozed/Woke Up) exist for an active task, they are stacked.
*   **Completed/Archived Dates:** Displayed clearly, usually below project/contact on respective cards. "Completed: [Date]", "Archived: [Date]". `text-xs`.

### 6.3. Action Icons (Top-Right Corner)
*   Arranged horizontally in the top-right corner of the card.
*   Icons are small (`h-4 w-4`). Each button `p-1.5` for adequate tap area.
*   `group-hover:opacity-100` for desktop; on mobile, opacity might be consistently higher or rely on tap feedback.
*   **Icons (conditional):** URL (Globe), Edit (Pencil), Unsnooze (Bell Slash), Snooze (Clock - hidden if item has `wokeUpAt`), Archive (Archive Box), Delete (Trash).

### 6.4. Inline Editing Mode
*   Expands the card content to show input fields.
*   All input fields are stacked vertically, taking full width.
    *   `Title` (text input)
    *   `Details` (textarea, `rows={3}`)
    *   `Project` (text input with datalist)
    *   `Due Date` (date input with native picker, "Clear" (X) button inside on the right)
    *   `Priority` (select with native dropdown)
    *   `Contact` (text input)
    *   `URL` (url input)
    *   `Snooze Until Date` (date input, "Clear" (X) button)
    *   `Snooze Until Time` (time input)
*   Labels above inputs.
*   **"Clear" (X) Button for Dates:** Small, circular, positioned inside the date input on the right, vertically centered. Tappable.
*   **"Save" & "Cancel" Buttons:**
    *   Displayed at the bottom of the editing view.
    *   Stacked vertically (Save above Cancel) or side-by-side, each taking ~50% width.
    *   Saving clears `wokeUpAt` status.

## 7. Other Views (`viewMode !== 'main'`) - Mobile Layout

These views generally consist of a header and a list of `EntryItem` cards.

### 7.1. Snoozed Items View (`SnoozedList.tsx`)
*   **Header:**
    *   Title: "Snoozed Items" (left-aligned).
    *   "← Back" button (top-left, prominent tap target) to return to `viewMode = 'main'`.
*   **List:** Vertically scrollable list of `EntryItem` cards (these are editable, snoozable again, etc.).

### 7.2. Completed Tasks View (`CompletedTaskList.tsx`)
*   **Header:** Title "Completed Tasks", "← Back" button.
*   **List:**
    *   Tasks grouped by week (e.g., "Week 30 (Jul 22 - Jul 28), 2024"). Week headers are distinct.
    *   **"Copy Titles" Button:** Per week group, typically an icon button (copy icon) to the right of the week header. Tappable. Shows brief "Copied!" feedback.
    *   `EntryItem` cards within each group are non-interactive for actions (e.g., no edit/delete icons), display-only.

### 7.3. Archived Notes View (`ArchivedNoteList.tsx`)
*   **Header:** Title "Archived Notes", "← Back" button.
*   **List:** Vertically scrollable list of `EntryItem` cards (display-only for actions).

## 8. Modal Interactions - Mobile Layout & Functionality

Modal content (`modal-content`) is generally structured with a header, a scrollable body, and a footer for actions.

### 8.1. Detail Modal (`DetailModal.tsx`)
*   **Header:**
    *   Entry `title` (left, can wrap).
    *   Action Icons (Edit, Snooze/Unsnooze, Archive/Unarchive, Delete) and "Close" (X) icon (right). Icons need good tap spacing. Snooze icon hidden if `wokeUpAt` is set.
*   **Body (Scrollable):**
    *   "Label: Value" pairs stacked vertically (e.g., "Type: Task", "Project: Alpha", "Details: ..."). Labels are `text-xs`, values `text-sm`. URLs are tappable links.
    *   Displays "Snoozed Until" or "Woke Up At" (with distinct styling) as appropriate.
*   **Footer (Tasks only):**
    *   "Mark as Complete" / "Mark as Incomplete" button. Full width or right-aligned.

### 8.2. Confirmation Modals (`ConfirmDeleteModal.tsx`, `ConfirmArchiveModal.tsx`)
*   **Icon:** A warning/action-specific icon at the top.
*   **Title:** e.g., "Confirm Deletion".
*   **Message:** e.g., "Are you sure you want to delete '[ItemName]'?".
*   **Action Buttons:**
    *   "Delete" / "Archive" button (destructive/primary action style).
    *   "Cancel" button (secondary style).
    *   Buttons stacked vertically (primary on top) or side-by-side, full width combined.

### 8.3. Completion Notes Modal (`CompletionNotesModal.tsx`)
*   **Icon & Title:** e.g., Checkmark icon, "Completion Notes". Task title referenced.
*   **Textarea:** For notes, `rows={4}`, full width.
*   **Action Buttons:**
    *   "Save Notes & Complete Task".
    *   "Skip & Complete".
    *   Buttons stacked or side-by-side, full width combined.

### 8.4. Export Options Modal (`ExportOptionsModal.tsx`)
*   **Icon & Title:** e.g., Export icon, "Export Data".
*   **Action Buttons:**
    *   "Export as JSON".
    *   "Export as CSV".
    *   "Cancel".
    *   All buttons stacked vertically, full width.

### 8.5. Import Data Modal (`ImportDataModal.tsx`)
*   **Icon & Title:** e.g., Import icon, "Import Data".
*   **File Input:** Standard HTML file input, styled for theme. Full width. `accept=".json,.csv"`.
*   **Import Mode Radio Buttons:**
    *   "Overwrite existing data".
    *   "Merge with existing data".
    *   Stacked vertically, with labels. Standard radio button appearance.
*   **Warning Messages:** Displayed below radio buttons based on selection.
*   **Action Buttons:** "Import File" (disabled until file selected), "Cancel". Stacked, full width.

### 8.6. Snooze Modal (`SnoozeModal.tsx`)
*   **Icon & Title:** e.g., Clock icon, "Snooze Item". Item title referenced.
*   **Date & Time Inputs:**
    *   Stacked vertically or side-by-side grid. Full width inputs.
    *   Uses native mobile date/time pickers.
*   **Action Buttons:** "Snooze", "Cancel". Stacked or side-by-side, full width combined.
    *   Snoozing clears any `wokeUpAt` status.

## 9. Touch Interactions & Feedback

*   **Buttons:** All buttons should provide visual feedback on tap (e.g., brief change in background color, slight scale effect via CSS transform).
*   **List Items (Draggable):** Long-press to initiate drag. Haptic feedback if possible via browser capabilities (though not explicitly required by styling).
*   **Scroll:** Native mobile scrolling behavior (momentum, bounce). Custom scrollbars in `index.html` are primarily for desktop aesthetics; mobile OS typically handles scrollbar display.
*   **Focus States:** While primarily for keyboard navigation, ensure focus states are not obtrusive on mobile if accidentally triggered.
*   **No Hover Dependence:** Functionality should not rely on hover states; all actions accessible via tap.

This document should provide a comprehensive guide for implementing the mobile experience of vTasks.
Ensure all Tailwind classes and custom CSS variables from `index.html` are correctly applied to achieve the described visual results.
```