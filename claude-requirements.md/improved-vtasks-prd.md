# vTasks 2.0 Product Requirements Document

## 1. Executive Summary

vTasks 2.0 is a task and note management application that enhances the original vTasks with cloud synchronization, an improved user interface, and extended functionality. The application maintains the core strengths of the original while addressing its limitations in data persistence and visual design.

This document outlines the requirements for vTasks 2.0 without prescribing specific implementation technologies, allowing development teams flexibility in their approach.

## 2. Product Goals

1. Implement cloud synchronization while maintaining offline functionality
2. Modernize the UI with a fresh, clean design supporting light and dark modes
3. Preserve the intuitive card layout and interaction model of the original app
4. Add advanced organization features including a Projects view and task dependencies
5. Enhance the user experience with inline editing, rich text support, and animations
6. Support responsive design for mobile, tablet, and desktop views

## 3. User Personas

### Personal Task Manager
- Uses vTasks to organize personal tasks and notes
- Values simplicity and quick task entry
- Accesses the application across different devices

### Project-Focused Professional
- Organizes work by projects and dependencies
- Requires more advanced filtering and organization
- Values the ability to prioritize and categorize items

### Periodic User
- Uses the app irregularly but needs persistent data
- Values quick re-engagement without complex setup
- Appreciates visual cues for item status

## 4. Core Data Model

### Entry (Base Model)
- id: Unique identifier
- title: Main title text
- details: Optional detailed description
- type: TASK or NOTE
- createdAt: Creation timestamp
- project: Optional project category
- priority: CRITICAL, HIGH, NORMAL, or LOW
- contact: Optional contact information
- url: Optional associated URL
- snoozedUntil: Optional timestamp for snooze expiration
- wokeUpAt: Optional timestamp for when item auto-unsnoozed
- tags: Optional array of tags for additional categorization
- category: Optional category for item classification
- stashed: Boolean indicating if item is in the stash area
- order: Numeric value for manual ordering

### Task-Specific Properties
- isCompleted: Boolean indicating completion status
- completedAt: Timestamp when task was completed
- completionNotes: Optional notes added upon completion
- dueDate: Optional due date for the task
- prerequisites: Optional array of task IDs that must be completed first

### Note-Specific Properties
- isArchived: Boolean indicating archive status
- archivedAt: Timestamp when note was archived

## 5. Functional Requirements

### 5.1 Data Persistence and Synchronization

#### Cloud Synchronization
- Store user data in a cloud key-value store with unique user identifiers
- Support automatic background synchronization when online
- Provide visual indicators of sync status
- Handle conflict resolution for changes made on multiple devices

#### Offline Functionality
- Store data locally for offline access
- Queue changes made offline for synchronization when connectivity returns
- Automatically sync when connection is restored

#### Data Import/Export
- Export all data in JSON format
- Export filtered data sets in JSON or CSV formats
- Import data from JSON with merge or overwrite options
- Provide timestamped export files

### 5.2 Task Management

#### Task Creation and Editing
- Quick add task with just a title
- Expandable form for additional details
- Inline editing of task details
- Edit tasks via detail modal
- Set due dates, priority, contacts, and URLs
- Auto-parse URLs in text fields
- Associate tasks with projects and categories
- Add tags to tasks for cross-cutting organization

#### Task Status Management
- Mark tasks as complete/incomplete with a checkbox
- Add completion notes when marking tasks complete
- View completed tasks in a separate list
- Define task dependencies (prerequisites)
- Stash tasks that are not currently actionable but should remain accessible

#### Task Organization
- Filter tasks by project, priority, category, and tags
- Sort tasks by creation date, due date, or priority
- Manually reorder tasks via drag and drop
- Group tasks by project in a collapsible project view

### 5.3 Note Management

#### Note Creation and Editing
- Create notes with title and details
- Support rich text editing with markdown
- Inline editing of note content
- Associate notes with projects, categories, and tags

#### Note Organization
- Filter notes by project, priority, category, and tags
- Archive and unarchive notes
- View archived notes separately
- Stash notes that are not currently relevant

### 5.4 Snooze Functionality

#### Snooze Configuration
- Snooze tasks or notes until a specific date and time
- Provide preset snooze durations (later today, tomorrow, next week)
- Default to 8:00 AM when selecting a new date without a specific time

#### Snooze Management
- Auto-unsnooze items when their snooze time expires
- Move unsnoozed items to the top of their respective lists
- Provide a dedicated view for all snoozed items
- Allow manual unsnoozing

### 5.5 User Interface Features

#### Views and Navigation
- Tab-based navigation between active tasks and notes
- Dedicated views for completed tasks, archived notes, and snoozed items
- Project view showing all items grouped by project
- Stash area for temporarily setting aside items
- Search functionality across all items with instant results

#### Card Layout and Design
- Maintain the existing card layout with improvements:
  - Checkbox vertically centered with the title text
  - Action buttons on the far right, visible on hover
  - Project and contact info on bottom left
  - Dates (snooze, due, completed, woke) on bottom right
- Visual distinction for different item states:
  - Normal tasks with clean appearance
  - Snoozed items with light color background
  - Completed tasks with light grey appearance
  - Stashed items with distinct visual treatment

#### Responsive Design
- Mobile view optimized for smaller screens
- Tablet/desktop view with sidebar navigation and main content area
- Ability to toggle between views manually
- Automatic view selection based on device detection

#### Animation and Visual Feedback
- Animate unsnoozed tasks appearing in the active list
- Smooth transitions for expanding/collapsing project groups
- Visual feedback for synchronization events
- Subtle animations for completing tasks and archiving notes

### 5.6 Settings and Preferences

#### Application Settings
- Toggle between light and dark mode
- Configure auto-sorting preferences:
  - By priority
  - By due date
  - Keep unsnoozed items at top
  - Manual ordering
- Sync frequency configuration
- Default view selection
- Card display density options

## 6. User Interface Requirements

### 6.1 General UI Principles

- Clean, modern aesthetic inspired by minimalist design principles
- Support for light and dark modes with smooth transitions
- Consistent spacing, typography, and color usage
- Accessible design with sufficient contrast and clear visual hierarchy
- Responsive layout adapting to different screen sizes

### 6.2 Mobile Interface

#### Navigation
- Bottom tab bar for primary navigation
- Swipe gestures for common actions
- Pull to refresh for sync
- Floating action button for new item creation

#### Card Display
- Full-width cards with optimized touch targets
- Swipe actions for quick operations
- Collapsible sections for detailed information

### 6.3 Tablet/Desktop Interface

#### Layout
- Two-panel design with navigation sidebar and content area
- Wider cards with more visible metadata
- Keyboard shortcuts for power users
- Enhanced drag and drop capabilities

#### Project View
- Kanban-style view option for projects
- Collapsible project sections
- Visual indicators for dependencies between tasks

### 6.4 Common UI Components

#### Input Form
- Segmented control to toggle between task and note creation
- Expandable details section
- Auto-complete for projects, categories, and tags
- Rich text editor for details field

#### Card Components
- Priority indicator on left border
- Title with completion checkbox for tasks
- Metadata section with project, contact, and tags
- Action buttons with hover reveal
- Status indicators for snooze, completion, and archiving

#### Filter Controls
- Filter dropdown for projects, priorities, categories, and tags
- Search bar with instant results
- Clear filters option
- Save filter combinations option

## 7. Technical Considerations

### 7.1 Data Storage Strategy

- Client-side storage for offline functionality
- Cloud key-value store for synchronization
- Conflict resolution strategy
- Efficient data querying for filters and search

### 7.2 Synchronization

- Incremental sync to minimize data transfer
- Background sync with retry mechanism
- User-initiated manual sync option
- Intelligent sync scheduling based on connectivity and battery status

### 7.3 Performance Considerations

- Efficient rendering of long lists
- Lazy loading of data
- Optimized animations
- Minimal network requests

## 8. User Workflows

### 8.1 Task Creation and Management

1. User opens the app and selects the task creation option
2. User enters a task title and optional details
3. User adds metadata such as due date, project, priority
4. User saves the task
5. The task appears in the active tasks list
6. User can later:
   - Complete the task
   - Edit the task
   - Snooze the task
   - Move the task to the stash
   - Delete the task

### 8.2 Project Organization

1. User navigates to the Projects view
2. User sees all tasks and notes grouped by project
3. User can expand/collapse project sections
4. User can add items to projects
5. User can rearrange items within a project
6. User can set dependencies between tasks in a project

### 8.3 Search and Filter

1. User enters a search term in the search bar
2. Results appear instantly as user types
3. User can apply additional filters to search results
4. User can take actions on items directly from search results

## 9. Future Considerations

The following features are noted but deferred to future versions:

- Collaboration features and shared projects
- Calendar integration
- Recurring tasks
- Time tracking
- Advanced analytics and productivity insights

## 10. Implementation Phases

### Phase 1: Core Functionality
- Cloud synchronization
- Offline capability
- UI redesign with light/dark mode
- Responsive design

### Phase 2: Enhanced Organization
- Projects view
- Stash functionality
- Tagging system
- Categories
- Prerequisites/dependencies

### Phase 3: User Experience Improvements
- Rich text/markdown support
- Inline editing
- Search functionality
- Animations and transitions
- Settings and preferences

## Appendix A: UI Reference

### Card Layout Reference
```
┌────────────────────────────────────────────────┐
│ ◉ Task Title                             •••   │
│                                                │
│ Optional details would appear here...          │
│                                                │
│ Project - Contact                 Due: Jun 5   │
└────────────────────────────────────────────────┘
```

Key elements:
- Checkbox vertically centered with title
- Action buttons (•••) on far right (visible on hover)
- Project and contact on bottom left
- Dates on bottom right

### State Visualization Reference
- Normal task: Clean background
- Snoozed task: Light colored background
- Completed task: Light grey background
- Stashed task: Distinctive pattern or border
- Priority levels: Left border color coding