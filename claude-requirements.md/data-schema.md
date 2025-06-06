# vTasks 2.0 Data Schema

This document provides guidance on implementing the data storage and synchronization model for vTasks 2.0. It is designed to be implementation-agnostic while providing sufficient detail for developers.

## 1. Key-Value Storage Design

vTasks 2.0 uses a key-value storage model to facilitate easy data export/import and cloud synchronization.

### 1.1 User Identity

Each user has a unique identifier that serves as the namespace for their data:

```
user:<user_id>
```

User profile information:

```
user:<user_id>:profile
```

### 1.2 Entry Storage

All entries (tasks and notes) are stored with their full data:

```
user:<user_id>:entries:<entry_id>
```

### 1.3 Collection Indexes

To facilitate efficient retrieval, the system maintains index collections:

```
user:<user_id>:index:tasks
user:<user_id>:index:notes
user:<user_id>:index:completed
user:<user_id>:index:archived
user:<user_id>:index:snoozed
user:<user_id>:index:stashed
user:<user_id>:index:projects
user:<user_id>:index:tags
user:<user_id>:index:categories
```

These indexes contain entry IDs organized for quick access.

### 1.4 Settings

User settings are stored in a dedicated key:

```
user:<user_id>:settings
```

### 1.5 Sync Metadata

Synchronization metadata to track changes:

```
user:<user_id>:sync:last_sync
user:<user_id>:sync:change_log
```

## 2. Data Structures

### 2.1 Entry Structure

```json
{
  "id": "unique-identifier",
  "title": "Entry title",
  "details": "Optional detailed description with markdown support",
  "type": "TASK | NOTE",
  "createdAt": "2025-06-05T10:30:00Z",
  "updatedAt": "2025-06-05T11:45:00Z",
  "project": "Optional project name",
  "priority": "CRITICAL | HIGH | NORMAL | LOW",
  "contact": "Optional contact information",
  "url": "Optional associated URL",
  "snoozedUntil": "Optional ISO timestamp",
  "wokeUpAt": "Optional ISO timestamp",
  "tags": ["tag1", "tag2"],
  "category": "Optional category name",
  "stashed": false,
  "order": 1000,
  
  // Task-specific properties (only for type: "TASK")
  "isCompleted": false,
  "completedAt": "Optional ISO timestamp",
  "completionNotes": "Optional notes on completion",
  "dueDate": "Optional ISO date",
  "prerequisites": ["prerequisite-task-id-1", "prerequisite-task-id-2"],
  
  // Note-specific properties (only for type: "NOTE")
  "isArchived": false,
  "archivedAt": "Optional ISO timestamp"
}
```

### 2.2 User Profile Structure

```json
{
  "id": "user-unique-identifier",
  "displayName": "User's display name",
  "email": "user@example.com",
  "createdAt": "2025-06-01T00:00:00Z",
  "lastSyncedAt": "2025-06-05T12:00:00Z"
}
```

### 2.3 Settings Structure

```json
{
  "theme": "light | dark | system",
  "sortPreference": {
    "byPriority": true,
    "byDueDate": false,
    "unsnoozedAtTop": true,
    "manualOrder": false
  },
  "syncFrequency": "immediate | hourly | daily",
  "defaultView": "tasks | notes | projects",
  "cardDensity": "compact | comfortable | spacious"
}
```

### 2.4 Index Structures

Each index is an array of entry IDs, potentially with metadata for efficient filtering:

```json
{
  "entries": [
    "entry-id-1",
    "entry-id-2"
  ],
  "lastUpdated": "2025-06-05T12:00:00Z"
}
```

Project index includes project names and entry mappings:

```json
{
  "projects": {
    "Project A": ["entry-id-1", "entry-id-3"],
    "Project B": ["entry-id-2", "entry-id-4"]
  },
  "lastUpdated": "2025-06-05T12:00:00Z"
}
```

### 2.5 Sync Change Log Structure

```json
{
  "changes": [
    {
      "id": "change-unique-id",
      "entryId": "affected-entry-id",
      "operation": "CREATE | UPDATE | DELETE",
      "timestamp": "2025-06-05T11:45:00Z",
      "deviceId": "device-identifier",
      "synced": true
    }
  ],
  "lastProcessed": "2025-06-05T12:00:00Z"
}
```

## 3. Synchronization Protocol

### 3.1 Initialization

When a user accesses the application on a new device:

1. Authenticate user and retrieve user ID
2. Download all entry data and indexes
3. Initialize local storage with downloaded data
4. Record last sync timestamp

### 3.2 Regular Synchronization

During normal operation:

1. Record all changes to the local change log
2. When online, periodically:
   - Send unsynced changes to the server
   - Retrieve changes from other devices since last sync
   - Apply remote changes to local storage
   - Update last sync timestamp

### 3.3 Conflict Resolution

When conflicting changes are detected:

1. For simple fields (title, priority), use the most recent change
2. For complex fields (details with markdown), attempt to merge changes
3. If automatic merging is impossible, keep both versions and notify user
4. Allow user to manually resolve conflicts

### 3.4 Offline Operation

When offline:

1. Continue recording changes to local change log
2. Mark changes as unsynced
3. When connectivity resumes, perform regular synchronization
4. Provide visual indicator of sync status

## 4. Local Storage Organization

### 4.1 Primary Storage

The application uses the browser's IndexedDB for primary local storage:

- `entries`: Stores all entry objects
- `indexes`: Stores index collections for quick access
- `settings`: Stores user settings
- `syncLog`: Stores the change log for synchronization
- `userData`: Stores user profile information

### 4.2 Backup Storage

The application maintains a backup in localStorage:

- `vtasks_user_id`: User identifier
- `vtasks_last_sync`: Last successful sync timestamp
- `vtasks_entries_v1`: Compressed snapshot of essential data

## 5. Implementation Guidance

### 5.1 Data Access Patterns

Optimize for these common access patterns:

1. Retrieving all active tasks
2. Retrieving all notes
3. Filtering by project, priority, and tags
4. Searching across all entries
5. Checking task prerequisites

### 5.2 Performance Considerations

1. Use pagination for large datasets
2. Implement lazy loading for details and history
3. Throttle synchronization to balance freshness and performance
4. Use efficient data structures for indexes
5. Compress data for network transfers

### 5.3 Security Considerations

1. Encrypt sensitive data in transit and at rest
2. Use secure authentication methods
3. Implement rate limiting for API requests
4. Validate all data on both client and server
5. Audit all data access

### 5.4 Migration Strategy

When migrating from the original vTasks:

1. Extract data from localStorage
2. Transform to the new schema
3. Upload to cloud storage
4. Initialize the new application with the migrated data