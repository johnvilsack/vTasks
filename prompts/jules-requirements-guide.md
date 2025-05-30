## 1. Core Application Purpose
The application, "vTasks", is a lightweight, user-friendly, and data-driven web-based tool designed for efficient personal task and note management. Its primary goal is to allow users to seamlessly create, view, edit, organize (through features like project tagging, priority levels, and drag-and-drop reordering), track (completing tasks, snoozing items), and manage their tasks and notes. The application emphasizes a sleek, exclusive dark theme for optimal visual comfort and stores all user data locally in the browser, ensuring privacy and client-side performance. It aims to provide a comprehensive yet simple solution for personal organization without server-side data storage.

## 2. General Technical Requirements

*   **Platform Agnosticism:** The application should be designed primarily as a responsive web application, ensuring accessibility on modern web browsers across desktop and mobile devices. The architectural choices should facilitate potential future adaptations for dedicated desktop or mobile applications.
*   **Programming Language Agnosticism:** The AI is empowered to select the most suitable programming language(s) for the development of both frontend and any potential backend components, considering maintainability, performance, and ecosystem.
*   **Framework Agnosticism:** The AI has the autonomy to choose the most appropriate frameworks, libraries, and tools for UI development, application logic, state management, and data handling, aligning with modern best practices.
*   **Data Storage Strategy:**
    *   The application must prioritize a robust client-side data presence, ensuring data is readily available for fast UI rendering and supporting extensive offline or near-offline capabilities (client-side hydration).
    *   Moving beyond the original application's reliance on `localStorage`, this guide encourages the adoption of more scalable and feature-rich solutions. The AI should evaluate and select from alternatives such as:
        *   **Browser-based databases:** IndexedDB is highly recommended for complex client-side querying, larger data sets, and improved performance over `localStorage`.
        *   **File-based storage:** This could be relevant if future iterations include dedicated desktop application versions.
        *   **Cloud-based synchronization (Optional but Recommended for multi-device use):** If a cloud backend is integrated, its primary role should be data synchronization across a user's devices and for backup purposes. The core application functionality must remain intact and highly performant when offline.
    *   **Data Import/Export:** Comprehensive data import and export functionalities (e.g., in JSON, CSV formats) are mandatory. This ensures user data ownership, portability, and facilitates backup/restore operations, irrespective of the chosen storage mechanism.

## 3. Data Structures

The application's data management will revolve around the following conceptual data structures. The AI should select appropriate, specific data types based on the chosen technology stack, while adhering to the conceptual definitions below.

### 3.1. `Entry` Object
This is the central object representing a single task or note.

*   **`id`**: `String` - A universally unique identifier (e.g., UUID) for the entry. (Required)
*   **`title`**: `String` - The main title or summary of the task/note. (Required)
*   **`details`**: `String` (Optional) - Detailed description, content, or notes for the entry.
*   **`type`**: `EntryType` (Enum) - Specifies whether the entry is a 'TASK' or a 'NOTE'. (Required)
*   **`createdAt`**: `DateTime` - Timestamp indicating when the entry was created (ISO 8601 format string is recommended for interoperability). (Required)
*   **`isCompleted`**: `Boolean` - For entries of type 'TASK', indicates if the task is completed. Defaults to `false`.
*   **`completedAt`**: `DateTime` (Optional) - For entries of type 'TASK', timestamp of when the task was marked as completed (ISO 8601 format string recommended).
*   **`completionNotes`**: `String` (Optional) - For entries of type 'TASK', any notes or comments added specifically upon task completion.
*   **`dueDate`**: `Date` (Optional) - For entries of type 'TASK', the date when the task is due (YYYY-MM-DD format string recommended).
*   **`contact`**: `String` (Optional) - Contact information (e.g., name, email, phone number, or a general textual reference) associated with the entry.
*   **`url`**: `String` (Optional) - A URL relevant to the entry. Should be stored in a valid URL format.
*   **`isArchived`**: `Boolean` - For entries of type 'NOTE', indicates if the note is archived. Defaults to `false`.
*   **`archivedAt`**: `DateTime` (Optional) - For entries of type 'NOTE', timestamp of when the note was archived (ISO 8601 format string recommended).
*   **`project`**: `String` (Optional) - A project name, tag, or category to classify and group the entry.
*   **`priority`**: `PriorityLevel` (Enum) - The priority level assigned to the entry. Defaults to 'NORMAL'.
*   **`snoozedUntil`**: `DateTime` (Optional) - Timestamp indicating when a snoozed item should transition back to an active state (ISO 8601 format string with time component recommended).

### 3.2. `EntryType` Enum
Defines the fundamental types for an `Entry`.

*   `TASK`: Represents an actionable item that can be tracked towards completion.
*   `NOTE`: Represents a piece of information or a note that is not necessarily actionable in the same way as a task.

### 3.3. `PriorityLevel` Enum
Defines the distinct priority levels that can be assigned to an `Entry`.

*   `CRITICAL`: Highest priority, demanding immediate attention.
*   `HIGH`: Important, should be addressed soon.
*   `NORMAL`: Standard priority level.
*   `LOW`: Less urgent, can be addressed when time permits.

### 3.4. `ActiveFilters` Object
Represents the criteria currently applied by the user to filter the displayed list of entries.

*   **`project`**: `String` (Optional) - If specified, filters entries to only those matching this project name.
*   **`priority`**: `PriorityLevel` (Enum) (Optional) - If specified, filters entries to only those matching this priority level.

## 4. UI/UX - General Principles

This section outlines the general principles for the application's user interface and user experience.

### 4.1. Responsiveness & Layout Modes

The application must be highly responsive and adapt gracefully to various screen sizes and device types. Two primary layout modes should be supported:

*   **Compact Mode (Mobile/Single Pane Focus):**
    *   Optimized for smaller screens (e.g., mobile phones or narrow browser windows).
    *   This mode should present information and controls in a manner suitable for touch interaction and limited screen real estate, likely involving a single primary content pane with clear navigation for accessing different views or functions. Input forms might be presented as overlays or dedicated views.
*   **Expanded Mode (Tablet/Desktop Focus):**
    *   Designed for larger screens (e.g., tablets, desktop computers, or wider browser windows).
    *   This mode should leverage the additional space to enhance productivity and information visibility. It might feature:
        *   A **sidebar or dedicated panel** for global navigation, quick access to input forms (or a persistent input area), filtering controls, settings, or other management functions.
        *   A **main content area** for displaying lists of entries (tasks, notes), detailed views of selected items, or dashboards.
*   **Mode Switching:**
    *   The application should ideally implement **automatic adaptation** between Compact and Expanded modes based on viewport width.
    *   Consideration may be given to a user-controlled option to manually switch or prefer a specific mode if it enhances usability without adding undue complexity.

### 4.2. Theme & Styling (Optional Styling Guidance)

*   **Aesthetic:** The application should aim for a modern, clean, and intuitive visual design that promotes user focus and ease of navigation. Clarity and readability are paramount.
*   **Color Scheme (AI Discretion with Mandatory Dual Modes):**
    *   The original "vTasks" application utilized an exclusive dark theme with specific purple/magenta accents. Adherence to this specific theme is **optional**.
    *   The AI is encouraged to either:
        1.  Propose a new, professionally designed color scheme that is suitable for a productivity-focused application, ensuring accessibility and pleasant visual ergonomics.
        2.  Be prepared to accept and implement a custom color scheme if provided by the user in a subsequent interaction.
*   **Mandatory Light and Dark Modes:**
    *   Regardless of the base color scheme chosen or provided, the application **must** offer both a **Light Mode** and a **Dark Mode**.
    *   A clear, easily discoverable, and persistent user control (e.g., a toggle switch in the application's settings or header) must be provided to allow users to switch between these modes.
    *   All UI components, text, and backgrounds must be appropriately styled for both Light and Dark modes to ensure excellent readability, contrast, and visual consistency.

### 4.3. Layout Guidance (AI Flexibility)

*   **Functional Priority over Visual Prescription:** While specific UI elements and their functionalities (derived from the original application or newly introduced) will be detailed in subsequent sections (e.g., "Application Components"), their exact visual placement, sizing, and styling are largely at the AI's discretion, unless explicitly mandated.
*   **Logical Grouping and User Flow:** The AI should prioritize a logical and intuitive arrangement of information and interactive elements. For instance:
    *   Input fields for creating a new task or note should be grouped cohesively.
    *   Actions related to an individual entry (e.g., edit, delete, snooze on a task card) should be clearly associated with that entry and easily accessible.
    *   Filtering controls should be positioned logically in relation to the content they affect.
*   **AI's Design Prerogative:** The AI is tasked with determining the most effective, user-friendly, and aesthetically pleasing layout for both Compact and Expanded modes. The objective is to create a highly usable and efficient application, not necessarily a strict visual replica of any previous design, unless specific components are explicitly requested to be so. Functional requirements from the original app should be seen as a guide to *what* the user should be able to do, rather than a rigid blueprint for *how* it must look.

## 5. Application Components and Functionality

This section details the specific components and their functionalities. While some UI patterns from the original application are referenced for their functional value, the AI has the flexibility to innovate on the visual presentation unless a behavior is explicitly mandated.

### 5.1. Main Application Layout

*   **5.1.1. Header/AppBar:**
    *   **Function:** Displays the application title (e.g., "vTasks" or AI-selected name). May also contain global navigation elements or action buttons (e.g., Settings Icon Button) depending on the chosen layout mode (Compact/Expanded).
    *   **Behavior:** Typically fixed or sticky at the top of the screen for consistent visibility and access.
*   **5.1.2. Input Area/Form:**
    *   **Function:** Allows users to efficiently create new tasks or notes. This area should be persistently visible or very easily accessible from the primary view in both Compact and Expanded modes.
    *   **Components:**
        *   **Entry Type Selection:** A clear mechanism (e.g., segmented control, tabs, radio buttons) to allow the user to select whether they are creating a 'TASK' or a 'NOTE'. The label of the submission button and available fields in the Options Panel may change based on this selection.
        *   **Title Input:** A primary text input field for the `Entry.title`. This field is required. Placeholder text should be dynamic based on entry type (e.g., "New task title...", "New note title...").
        *   **"Add Details" Functionality / Options Panel Toggle:**
            *   **Concept:** Provides access to less frequently used or more detailed input fields for an entry, keeping the initial input form clean and simple.
            *   **Behavior:** An icon button (e.g., a 'plus' icon, 'tune' icon, 'expand' icon) or a clearly labeled text button (e.g., "More Options", "Details") should be available, typically positioned in close proximity to the title input (e.g., to its right or directly below). Activating this control reveals/expands the "Options Panel". The control's visual state should toggle (e.g., icon changes to 'minus' or 'collapse') to indicate it can hide/collapse the panel again.
        *   **Options Panel (Collapsible/Expandable):**
            *   **Function:** Contains additional input fields for an entry, revealed by the "Add Details" control.
            *   **Fields (common and type-specific):**
                *   `Details`: Multi-line text area for `Entry.details`.
                *   `Project`: Text input for `Entry.project`. Should offer autocomplete suggestions based on existing project names from active and snoozed entries.
                *   `Due Date` (Task-specific): Date picker input for `Entry.dueDate`.
                *   `Priority`: Select dropdown, radio group, or similar UI element for `Entry.priority` (CRITICAL, HIGH, NORMAL, LOW). Default to 'NORMAL'.
                *   `Contact`: Text input for `Entry.contact`.
                *   `URL`: Text input for `Entry.url`. Should perform basic validation (e.g., check for `.` and a character after it) and ideally auto-prefix `https://` if no scheme (http/https) is provided.
        *   **Submission Button:** A prominent, clearly labeled button (e.g., "Add Task", "Add Note", "Create") to submit the new entry. On successful submission, the input form (including the Options Panel) should typically clear its content and reset to its default state (Options Panel hidden if it was initially). The relevant list view should update to show the new entry.
*   **5.1.3. Content Area:**
    *   **Function:** The primary workspace for displaying lists of entries (e.g., active tasks, notes), search results, and potentially detailed views of selected items if not using a modal approach for details. This area will house the various list views.
*   **5.1.4. Footer / Settings Area & Global Actions:**
    *   **Concept:** A designated area for application-wide settings and actions. This could be a traditional footer bar, a section within a sidebar (in Expanded Mode), or integrated into a global action menu triggered from the Header.
    *   **Settings Icon Button / Menu:**
        *   **Function:** A single, easily accessible icon button (e.g., gear icon, ellipsis icon, hamburger icon for Compact mode) that opens a menu, dropdown, or navigates to a dedicated settings view/modal.
        *   **Settings Options (to be included in the menu/view):**
            *   **Toggle Compact/Expanded Mode (Optional):** If manual mode switching is implemented (as per Section 4.1).
            *   **Toggle Light/Dark Theme:** Allows the user to switch between light and dark themes. The current selection should be clearly indicated.
            *   **Import Data:** Initiates the data import process by opening the `ImportDataModal`.
            *   **Export Data:** Initiates the data export process by opening the `ExportOptionsModal`. This option might be disabled if there is no data to export.

### 5.2. Entry Display (Cards)

Entries (tasks and notes) should be displayed as individual "cards" within their respective lists.

*   **5.2.1. Key Information Display:** Each card must clearly display:
    *   `Entry.title`.
    *   Relevant dates (e.g., `dueDate` for tasks, `snoozedUntil` if snoozed, `completedAt` for completed tasks, `archivedAt` for archived notes). Date formatting should be user-friendly.
    *   `Entry.project` and `Entry.contact` if available (especially for tasks).
    *   Visual indication of entry `type` (Task/Note) if not clear from the list context (e.g., via an icon).
*   **5.2.2. Visual Priority Indicator (Optional but Recommended):**
    *   A subtle visual cue (e.g., a colored border on one side of the card, a colored dot) to indicate `Entry.priority` if it's not 'NORMAL' (e.g., Red for CRITICAL, Yellow for HIGH, Blue for LOW).
*   **5.2.3. Action Icons/Controls:**
    *   **Function:** Provide quick access to common actions for an entry, directly on its card. These should be contextually available (e.g., "Archive" for notes, "Complete" for tasks).
    *   **Common Actions (typically as icon buttons):**
        *   **Edit:** Initiates inline editing for the entry (see Section 5.6).
        *   **Delete:** Opens a `ConfirmDeleteModal`.
        *   **Snooze:** Opens the `SnoozeModal` for active items.
        *   **Unsnooze:** For snoozed items, allows direct unsnoozing without a modal, or opens `SnoozeModal` for editing snooze time.
        *   **URL Link:** If `entry.url` exists, a clickable icon (e.g., globe) to open the URL in a new tab.
    *   **Task-Specific Actions:**
        *   **Complete/Uncomplete Checkbox/Toggle:** Allows marking a task as complete or incomplete. Marking complete should trigger the `CompletionNotesModal`.
    *   **Note-Specific Actions:**
        *   **Archive/Unarchive:** Opens `ConfirmArchiveModal` for active notes, or allows direct unarchiving/opens modal for archived notes.
*   **5.2.4. Click-to-Detail:**
    *   **Behavior:** Clicking on the main body of a card (i.e., not on a specific action icon or interactive element within the card) should open the `DetailModal` for that entry, providing a comprehensive view of all its fields.
*   **5.2.5. Drag & Drop Reordering:**
    *   **Function:** Allow users to manually reorder active tasks and active notes within their respective lists.
    *   **Behavior:** Standard drag-and-drop visual cues. Reordering should persist. This functionality is typically limited to active, non-snoozed items.

### 5.3. List Views

The application will feature several distinct list views to organize and display entries. Each specialized view should have a clear heading and a "← Back" navigation button/link to return to the main/previous view.

*   **5.3.1. Active Tasks List:**
    *   Displays non-completed, non-snoozed tasks. Filterable by project/priority. Supports drag-and-drop reordering.
*   **5.3.2. Notes List (Primary View):**
    *   Displays non-archived, non-snoozed notes. Filterable by project/priority. Supports drag-and-drop reordering.
*   **5.3.3. Completed Tasks List:**
    *   Displays tasks marked as `isCompleted = true`.
    *   **Grouping:** Tasks should be grouped by a relevant time period of completion (e.g., "Completed this Week", "Completed Last Week", "Completed Earlier" or by specific weeks like "Week of Oct 20-26"). Groups should be sorted with the most recent completions first.
    *   **"Copy Titles" Feature:** Within each group, a button or control to copy the titles of all tasks in that group to the clipboard.
    *   Tasks in this view are generally not editable but can be uncompleted (moved back to active).
*   **5.3.4. Archived Notes List:**
    *   Displays notes marked as `isArchived = true`. Sorted by `archivedAt` (most recent first).
    *   Notes in this view can be unarchived (moved back to active notes list) or deleted.
*   **5.3.5. Snoozed Items List:**
    *   Displays all tasks and notes whose `snoozedUntil` date/time is in the future. Sorted by `snoozedUntil` (items due to unsnooze soonest appear first).
    *   Items can be edited (including snooze time), unsnoozed immediately, or deleted.
*   **5.3.6. Tabbed Navigation for Main Lists (Conceptual):**
    *   In the main content area (when not in a specialized view like Completed or Snoozed), a tab-like navigation should allow switching between "Active Tasks" and "Notes" lists. These tabs should ideally show item counts (potentially filtered counts).

### 5.4. Filtering Controls

*   **Function:** Allow users to narrow down the displayed entries in active task and note lists based on `project` and `priority`.
*   **Accessibility:** Filtering controls should be easily accessible, perhaps via a "Filter" button near the list views or integrated into a sidebar in Expanded Mode.
*   **Components:**
    *   **Project Filter:** Dropdown or similar control, dynamically populated with unique project names from all currently viewable (active/snoozed) entries. An "All Projects" option should be present.
    *   **Priority Filter:** Dropdown or similar control for `PriorityLevel`. An "All Priorities" option should be present.
*   **Behavior:** Applying a filter should update the current list view in real-time. Active filters should be clearly indicated, and a "Clear All Filters" button should be provided.

### 5.5. Search Functionality (Global Search)

*   **Function:** Provide a global search capability to find entries across various relevant fields.
*   **Accessibility:** A search input field should be prominently displayed, possibly in the Header or a persistent search bar.
*   **Scope:** Search should query `title`, `details`, `project`, and `contact` fields of all non-archived and non-completed entries. Consideration for searching archived/completed items can be an enhancement.
*   **Behavior:** Search results should be displayed in a clear list format, similar to other list views. Highlighting search terms within results is desirable. Clearing the search query should restore the previous view.

### 5.6. Inline Editing

*   **Function:** Allow users to quickly edit the primary fields of an entry directly within its card in the list view, without needing to open a full modal for simple changes.
*   **Trigger:** Typically an "Edit" icon on the entry card.
*   **Editable Fields (within the card):** `title` (text input), `details` (textarea, should auto-expand or scroll if content is large), `project` (text input with autocomplete), `dueDate` (date picker), `priority` (select/dropdown), `contact` (text input), `url` (text input), `snoozedUntil` (date/time picker).
*   **Controls:**
    *   "Save" and "Cancel" buttons must be clearly visible within the editing interface on the card.
    *   "Clear" buttons (e.g., an 'X' icon) for optional date fields like `dueDate` and `snoozedUntil` to easily remove their values.
*   **Behavior:** `Title` is required. `Details` textarea should ideally focus at the end of the text and auto-scroll to the bottom for easier editing of long notes. Saving updates the entry and exits editing mode. Canceling discards changes and exits editing mode.

### 5.7. Modals / Dialogs

Modals should be used for focused interactions that require user input or confirmation, or for displaying detailed information. They should overlay the main content, and be dismissible via an explicit "Close" or "Cancel" button, or by pressing the Escape key.

*   **5.7.1. Detail Modal:**
    *   **Trigger:** Clicking an entry card (not on an action button).
    *   **Content:** Displays all fields of an `Entry` in a readable, well-formatted way (e.g., "Label: Value" pairs). Include `createdAt`, `completedAt`, `completionNotes`, `archivedAt`, `snoozedUntil` as applicable. URLs should be clickable.
    *   **Actions:** May include action buttons relevant to the item's state (e.g., Edit, Delete, Snooze, Archive/Unarchive, Mark Complete/Incomplete) for convenience, potentially mirroring card actions. A primary "Close" button.
*   **5.7.2. Confirmation Modals (e.g., `ConfirmDeleteModal`, `ConfirmArchiveModal`):**
    *   **Trigger:** Actions like deleting an entry or archiving a note.
    *   **Content:** A clear message stating the action and the title of the item affected (e.g., "Delete task 'My Important Task'?").
    *   **Actions:** Buttons like "Confirm" / "Delete" / "Archive" and "Cancel".
*   **5.7.3. Completion Notes Modal:**
    *   **Trigger:** Marking a task as complete.
    *   **Content:** Displays the task title. A textarea for `Entry.completionNotes`.
    *   **Actions:** "Save Notes & Complete" and "Skip & Complete" (or similar labels).
*   **5.7.4. Snooze Modal:**
    *   **Trigger:** Clicking the "Snooze" action on an entry card or in the Detail Modal.
    *   **Content:** Displays the item title. Inputs for snooze date and time. Must validate that the selected date/time is in the future. Default time can be set (e.g., 9 AM or 12 AM if only date is provided).
    *   **Actions:** "Snooze" and "Cancel".
*   **5.7.5. Import/Export Modals (triggered from Settings):**
    *   **`ImportDataModal`:**
        *   **Content:** File input (`.json`, `.csv`). Radio buttons or dropdown for import mode: "Overwrite existing data" or "Merge with existing data" (merge assigns new UUIDs to imported items). Warnings about data loss for overwrite.
        *   **Actions:** "Import File" and "Cancel".
    *   **`ExportOptionsModal`:**
        *   **Content:** Options to export as JSON or CSV.
        *   **Actions:** "Export as JSON", "Export as CSV", "Cancel". File download should be initiated with a sensible filename (e.g., `vtasks-export-YYYYMMDD_HHMMSS.[json|csv]`).

## 6. Non-Functional Requirements

Beyond specific features, the following non-functional requirements are crucial for the application's success and user satisfaction.

### 6.1. Client-Side Performance & Offline Capability
*   **Client-Centric Operations:** The application architecture must prioritize client-side operations for most user interactions. This is key to achieving a fast, fluid user experience with near-instantaneous UI updates for common actions like creating, editing, and organizing entries.
*   **Offline First Functionality:** Core application functionality—including creating new entries, viewing and editing existing entries, managing projects, priorities, and snoozing items—must be fully available when the user is offline or experiencing an unstable internet connection. All data necessary for these operations should be stored locally.
*   **Graceful Synchronization:** If cloud-based synchronization is implemented, it should operate seamlessly in the background. The application must gracefully handle offline periods, queueing changes locally and automatically synchronizing them when connectivity is restored without user intervention or data loss.

### 6.2. Data Persistence & Reliability
*   **Agnostic yet Reliable Storage:** While the specific data storage mechanism (e.g., IndexedDB, file-system via specific APIs, or a cloud backend) is an AI implementation choice (as per Section 2.4), it must ensure the reliable persistence of all user data. Mechanisms to prevent data loss due to browser crashes, updates, or storage quotas (within reasonable limits) should be considered.
*   **Data Integrity and Consistency:** The application must ensure that data remains consistent and uncorrupted through all operations. If schema changes are necessary in future updates, migrations should be handled gracefully.
*   **Mandatory Import/Export:** Regardless of the primary storage solution, robust, user-initiated data import and export features (e.g., in JSON and CSV formats) are mandatory. This empowers users with data ownership, facilitates backups, and allows migration to/from other systems.
*   **Privacy & Security for Cloud Solutions:** If any cloud-based storage or synchronization features are implemented, they must adhere to strong data privacy and security principles. This includes, but is not limited to, encryption of data in transit and at rest, clear user consent mechanisms, and transparent policies regarding data handling and ownership.

### 6.3. Accessibility (A11Y)
*   **WCAG 2.1 AA Adherence:** The application must be designed and developed to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as a minimum standard. This ensures usability for people with a wide range of disabilities.
*   **Key Accessibility Considerations:**
    *   **Keyboard Navigability:** All interactive elements, controls, and features must be fully operable using only a keyboard. Logical focus order and visible focus indicators are essential.
    *   **Semantic HTML & ARIA:** Employ semantic HTML5 elements to accurately convey structure and meaning. Use ARIA (Accessible Rich Internet Applications) roles and attributes appropriately to enhance accessibility for dynamic content, custom controls, and complex interactions.
    *   **Focus Management:** Implement logical and predictable focus management, especially in modals, dynamic forms, and list views.
    *   **Color Contrast & Themes:** Ensure sufficient color contrast for text, UI elements, and graphical objects to be perceivable by users with low vision or color blindness. This must be maintained across both Light and Dark themes.
    *   **Screen Reader Compatibility:** Design and test for compatibility with common screen readers (e.g., NVDA, JAWS, VoiceOver). Ensure all content and interactive elements are properly announced and operable.
    *   **Resizable Text & Zoom:** The application should support browser zoom and text resizing without loss of content or functionality.
    *   **Alternative Text for Images:** All informative images and icons (if not purely decorative) must have appropriate alternative text.

### 6.4. Error Handling & User Feedback
*   **Graceful Error Management:** The application must handle potential errors gracefully, preventing abrupt crashes or loss of user data.
*   **Clear and Informative Messages:** Error messages should be presented in a clear, concise, and user-friendly language, avoiding technical jargon. They should explain what went wrong and, if possible, suggest how the user might resolve the issue or what action they can take next.
*   **Loading & Processing States:** Visually indicate loading, processing, or synchronization states clearly to the user, especially for operations that might take a noticeable amount of time (e.g., importing large data files, initial data load, syncing with a cloud service). This prevents user uncertainty and repeated actions.
*   **Confirmation & Success Messages:** Provide explicit confirmation messages for critical actions (e.g., successful data import/export, entry deletion, task completion). This reassures the user that their action was processed correctly.
*   **Input Validation Feedback:** Provide real-time or on-submit validation feedback for input forms, guiding the user to correct any errors (e.g., a required field is empty, URL format is invalid).
