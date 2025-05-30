# vTasks Application Requirements Guide

## Application Overview

Build a lightweight, client-side task and note management application that enables users to create, organize, and manage tasks and notes with advanced features like snoozing, filtering, and data portability.

### Core Principles
- **Client-side focused**: Primary functionality operates locally with client-side data hydration
- **Responsive design**: Adaptive layout for mobile (single-pane) and tablet/desktop (sidebar + main content)
- **Data portability**: Robust import/export capabilities
- **Modern UX**: Intuitive interactions with drag-and-drop, inline editing, and modal workflows

## Data Structure

### Primary Entity: Entry
```
Entry {
  id: string (unique identifier)
  title: string (required)
  details?: string (optional rich content)
  type: enum('TASK' | 'NOTE')
  createdAt: ISO timestamp
  
  // Task-specific fields
  isCompleted: boolean (default: false)
  completedAt?: ISO timestamp
  completionNotes?: string
  dueDate?: ISO date string (YYYY-MM-DD)
  
  // Note-specific fields
  isArchived: boolean (default: false)
  archivedAt?: ISO timestamp
  
  // Common fields
  contact?: string
  url?: string
  project?: string (used for grouping/filtering)
  priority: enum('CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW') (default: NORMAL)
  snoozedUntil?: ISO timestamp (full date-time)
}
```

### Supporting Data Structures
```
ActiveFilters {
  project?: string
  priority?: PriorityLevel
  searchQuery?: string
}

ViewMode: enum('main' | 'completed' | 'archived' | 'snoozed')
TabView: enum('active_tasks' | 'notes')
```

## Application Layout & Navigation

### Responsive Layout Modes
**Compact Mode (Mobile)**
- Single-pane layout
- Collapsible sections
- Bottom sheet or modal-based input forms
- Swipe gestures for navigation

**Expanded Mode (Tablet/Desktop)**
- Sidebar: Input forms, filters, settings
- Main content area: Card lists and detail views
- Split-screen capabilities

### Layout Structure

#### Fixed Application Bar
- Application title/branding
- Search functionality (global search across all entries)
- Settings button (toggles settings panel/modal)

#### Settings Panel/Modal
Contains:
- Layout toggle: Compact ↔ Expanded mode
- Theme toggle: Light ↔ Dark mode (Optional)
- Import Data function
- Export Data function
- Other application preferences

#### Input Area (Sidebar in Expanded, Modal/Sheet in Compact)
**Entry Type Selection**
- Segmented control or toggle: Task vs Note

**Primary Input**
- Title field (required)
- Expandable options trigger (icon button anchored to right side of title input)

**Expandable Options Panel** (Initially collapsed)
- Details: Multi-line text area
- Project: Text input with autocomplete from existing projects
- Due Date: Date picker (tasks only)
- Priority: Dropdown selector
- Contact: Text input
- URL: URL input with automatic https:// prefixing
- Snooze: Date/time picker for future scheduling

#### Main Content Area

**Navigation Tabs with Counters**
- Active Tasks (with filtered count)
- Notes (with filtered count)

**Filter Controls** (Adjacent to tabs)
- Filter dropdown/panel
- Dynamic options based on current view's data
- Project filter (populated from active entries)
- Priority filter
- Clear filters option

**Secondary Navigation Buttons** (Conditional visibility)
- "View Snoozed Items" (if snoozed entries exist)
- "View Completed Tasks" (if completed tasks exist)
- "View Archived Notes" (if archived notes exist)

**Content Lists**
Different views based on current mode:
- Active items (tasks/notes) - with drag-and-drop reordering
- Completed tasks - grouped by completion week
- Archived notes - chronologically sorted
- Snoozed items - sorted by snooze date

## Entry Card Design

### Visual Structure
**Priority Indication**
- Colored left border (Critical: red, High: yellow, Low: blue, Normal: default)

**Content Layout**
- Title (prominent display)
- Task checkbox (tasks only, left of title)
- Project and contact info (displayed below title as "Project - Contact")
- Date information (right-aligned):
  - Due date (if present, not completed/archived)
  - Snoozed date with time (if snoozed, not completed/archived)
  - Completed date (completed tasks)
  - Archived date (archived notes)

**Action Icons** (Top-right corner)
- Conditional visibility based on entry state
- Reduced opacity (10%) with full opacity on hover
- Icons include:
  - Globe (URL) - opens link
  - Pencil (Edit) - toggles inline editing
  - Clock (Snooze) - opens snooze modal
  - Bell-slash (Unsnooze) - immediately unsnoozes
  - Archive box (Archive) - opens confirmation
  - Trash (Delete) - opens confirmation

### Interactive Behaviors
**Click Actions**
- Card click (not on actions): Opens detail modal
- Checkbox (tasks): Opens completion notes modal or toggles completion
- Action icons: Execute respective functions

**Drag and Drop** (Active lists only)
- Visual drag indicators
- Reordering within same type/status
- Visual feedback during drag operations

**Inline Editing Mode**
- Triggered by edit icon
- Input fields for all editable properties
- Clear buttons for date fields (small, circular, positioned within input)
- Auto-complete for project field
- Save/Cancel buttons
- Title field required validation

## Modal System

### Detail Modal
**Header**
- Entry title
- Action icons (edit, snooze/unsnooze, archive/unarchive, delete, close)

**Body** (Scrollable)
- Formatted display of all entry properties
- Label: Value pairs for all non-empty fields
- Clickable URLs
- Formatted dates and timestamps

**Footer** (Tasks only)
- Complete/Incomplete toggle button

### Specialized Modals
**Completion Notes Modal**
- Task title in header
- Text area for completion notes
- "Skip & Complete" and "Save Notes & Complete" buttons

**Snooze Modal**
- Item title in header
- Date and time inputs
- Default time to 12:00 AM if only date provided
- Future time validation
- Snooze/Cancel buttons

**Confirmation Modals**
- Delete confirmation (includes item title)
- Archive/Unarchive confirmation

**Data Management Modals**
- Export options (JSON/CSV format selection)
- Import modal with file picker and merge/overwrite options

## Search Functionality

### Global Search
- Search across titles, details, project names, and contact information
- Real-time filtering as user types
- Search applies to current view context (active, completed, archived, snoozed)
- Clear search functionality
- Search term highlighting in results (Optional)

## Data Management & Persistence

### Storage Requirements
- Client-side data persistence (alternatives to localStorage: IndexedDB, WebSQL, or cloud sync)
- Automatic data hydration on application load
- Periodic data backup/sync capabilities

### Import/Export System
**Export Capabilities**
- JSON format (complete data structure)
- CSV format (flattened structure)
- Filename convention: `vtasks-export-YYYYMMDD_HHMMSS.[json|csv]`

**Import Capabilities**
- JSON and CSV format support
- Two import modes:
  - Overwrite: Replace all existing data
  - Merge: Add imported items with new unique IDs
- Data validation and error handling
- Progress feedback for large imports

### Data Processing Features
**Automatic Unsnoozing**
- Periodic check (every minute) for expired snooze times
- Automatic return of items to active lists

**Autocomplete Systems**
- Project name autocomplete based on existing active/snoozed entries
- Dynamic filter option population

## User Experience Workflows

### Entry Creation Flow
1. Select entry type (Task/Note)
2. Enter title (required)
3. Optionally expand advanced options
4. Configure project, priority, dates, contact, URL
5. Submit to create entry
6. Form clears and relevant tab becomes active

### Entry Management Flows
**Completion Workflow** (Tasks)
1. Check task checkbox or use detail modal button
2. Optional completion notes modal
3. Task moves to completed view
4. Grouped by completion week

**Snooze Workflow**
1. Click snooze icon or use detail modal
2. Select future date/time in snooze modal
3. Item disappears from active view
4. Appears in snoozed items view
5. Automatically returns when snooze expires

**Archive Workflow** (Notes)
1. Click archive icon or use detail modal
2. Confirmation dialog
3. Note moves to archived view
4. Can be unarchived to return to active view

### Filtering and Search Workflows
**Filter Application**
1. Click filter button/dropdown
2. Select project and/or priority criteria
3. Lists update in real-time
4. Filter state persists across tab switches
5. Clear filters option available

**Search Usage**
1. Enter search term in global search
2. Results filter in real-time across current view
3. Search works within filtered results
4. Clear search to return to full view

## Technical Considerations

### Performance Requirements
- Smooth drag-and-drop interactions
- Real-time search and filtering
- Efficient rendering of large entry lists
- Responsive layout transitions

### Accessibility Requirements
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- Color contrast compliance
- Focus indicators for all interactive elements

### Data Validation
- Required field validation
- Date/time format validation
- URL format validation with auto-correction
- Unique ID generation for all entries

## Design Specifications (Optional)

### Theme System
- Support for light and dark themes
- User preference persistence
- System theme detection capability
- Smooth theme transitions

### Visual Design Guidelines
- Modern, clean interface aesthetic
- Consistent spacing and typography
- Intuitive iconography
- Smooth animations and transitions
- Card-based design system
- Responsive grid layouts

### Color Coding System
- Priority-based color indicators
- Status-based visual differentiation
- Consistent color palette throughout application
- Accessibility-compliant color choices

## Success Criteria

The application should provide:
1. Intuitive task and note creation with rich metadata support
2. Flexible viewing and organization options
3. Powerful search and filtering capabilities
4. Seamless data portability
5. Responsive design across all device sizes
6. Smooth, modern user interactions
7. Reliable data persistence and recovery
8. Accessibility compliance for all users