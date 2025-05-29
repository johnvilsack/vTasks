
# vTasks

A lightweight, browser-based application for managing tasks and notes with a sleek, exclusive dark theme. All data is stored locally in your browser.

## Overview

vTasks provides a simple and efficient way to keep track of your to-do items and important notes. It features a clean, dark user interface designed for focus and ease of use. With functionalities like drag-and-drop reordering, inline editing, priority management, project tagging, snooze options, data filtering, and local data persistence, it aims to be a handy tool for personal organization.

## Key Features

*   **Dual Entry Types**: Create and manage both **Tasks** and **Notes**.
*   **Exclusive Dark Theme**: A single, carefully crafted dark purple/magenta theme for optimal visual comfort.
*   **Rich Input Options**:
    *   Quick add for titles.
    *   Expandable options panel for details, project, due dates, priority, contact information, and URLs.
    *   Automatic `https://` prefixing for URLs.
    *   Project field with autocomplete based on existing active/snoozed projects.
    *   Priority selection (Critical, High, Normal, Low).
*   **Task Management**:
    *   Mark tasks as complete/incomplete.
    *   Option to add **completion notes** when a task is finished.
    *   View active and completed tasks in separate, organized lists.
    *   Completed tasks are grouped by the week of completion and display project/contact info.
    *   "Copy Titles" feature for completed tasks within a week.
*   **Note Management**:
    *   Create, edit, and view notes.
    *   Archive and unarchive notes.
    *   View active and archived notes in separate lists.
*   **Visual Priority Indicators**: Tasks and notes display a colored left border (Red for Critical, Yellow for High, Sky Blue for Low) if priority is not Normal.
*   **Snooze Functionality**:
    *   Snooze tasks or notes to a future date and time via a dedicated modal.
    *   Snoozed items are hidden from active lists and appear in a "View Snoozed Items" section.
    *   Items automatically reappear in active lists when their snooze time expires.
    *   Direct "Unsnooze" option on snoozed item cards.
*   **Filtering**:
    *   Filter active tasks and notes by Project and Priority.
    *   Filter options are dynamically populated based on items in the current view.
*   **Inline Editing**: Quickly edit title, details, project, due date, priority, snooze time, contact, and URL directly in the list view.
    *   "Clear" buttons for due date and snooze date in edit mode.
    *   Details textarea automatically scrolls to the bottom for easier editing.
*   **Detailed View**: A modal provides a comprehensive look at an entry's details, including snooze status.
*   **Drag & Drop Reordering**: Easily reorder active tasks and notes within their respective lists.
*   **Card UI Enhancements**:
    *   Clickable globe icon for URLs on cards.
    *   Project and contact information displayed on task cards.
    *   Action icons on cards have reduced opacity by default, becoming fully opaque on hover.
*   **Confirmation Dialogs**: Ensures user intent for critical actions like deletion and archiving.
*   **Data Import/Export**:
    *   Export all your data in **JSON** or **CSV** format.
    *   Import data from JSON or CSV files with options to **overwrite** or **merge** with existing data.
*   **Local Storage Persistence**: All data is saved in your browser's `localStorage`, ensuring your information is available across sessions on the same browser (key: `task-notes-entries-v3`).
*   **Responsive Design**: Adapts to various screen sizes for a consistent experience on desktop and mobile devices.

## Tech Stack

*   **Frontend**:
    *   **React 19**: Leverages functional components and hooks for a modern UI.
    *   **TypeScript**: For strong typing and improved code quality.
    *   **Vite**: Build tool for fast development and optimized production builds.
    *   **Tailwind CSS (v3 via CDN)**: For utility-first styling.
    *   Custom CSS: For theme variables, scrollbars, and specific component styles.
*   **Data Storage**: Browser `localStorage`.

## Application Structure

*   `index.html`: Main HTML file (root of the project), includes CDN links, CSS custom properties for the theme. Vite injects scripts here.
*   `vite.config.ts`: Configuration for the Vite build tool. **Crucially, this contains the `base` path setting for GitHub Pages deployment (e.g., `'/vtasks/'`).**
*   `package.json`: Manages project dependencies and scripts (e.g., `npm run dev`, `npm run build`).
*   `src/`: Contains all source code.
    *   `main.tsx`: Entry point for the React application (renders `App.tsx` into `index.html`).
    *   `App.tsx`: Core application component managing state, view modes, filtering, snoozing, and orchestrating child components.
    *   `types.ts`: Contains all TypeScript type definitions and enums (including `Entry`, `PriorityLevel`, `ActiveFilters`).
    *   `hooks/`: Custom React hooks (e.g., `useLocalStorage.ts`).
    *   `utils/`: Utility functions (e.g., `dateUtils.ts`).
    *   `components/`: Contains all UI components (e.g., `InputForm.tsx`, `EntryItem.tsx`, `Tabs.tsx`, `FilterControls.tsx`, various modals).
*   `.github/workflows/deploy-gh-pages.yml`: GitHub Actions workflow for automatic deployment to GitHub Pages.
*   `metadata.json`: Basic application metadata (name: "vTasks").
*   `requirements.md`: Detailed functional and technical requirements for vTasks.
*   `build.md`: High-level build instructions, suitable for AI-assisted development, reflecting current features.

## Getting Started Locally

1.  **Clone the repository:**
    ```bash
    # Ensure you are using the correct repository URL
    git clone https://github.com/johnvilsack/todonoter.git # Or your updated repo URL if it's now vtasks
    cd todonoter # Or your repository directory name
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start Vite's development server, usually at `http://localhost:5173`.

## Building for Production

To create a production-ready build (static files in the `dist` directory):
```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

1.  **Verify `vite.config.ts` `base` Path**:
    *   Open `vite.config.ts`.
    *   The `base` property **must** be set correctly for your GitHub Pages URL.
    *   For `https://johnvilsack.github.io/vtasks/`, the `base` path should be `'/vtasks/'`.
    ```typescript
    // vite.config.ts
    export default defineConfig(({ command }) => {
      const base = command === 'build' ? '/vtasks/' : '/'; // Ensure this matches your repo name for GH Pages
      return {
        // ... other config
        base: base,
      };
    });
    ```
2.  **Push to `main` branch**: When you push changes to your `main` branch, the GitHub Action defined in `.github/workflows/deploy-gh-pages.yml` will automatically build and deploy your project.
3.  **Configure GitHub Pages Settings in Repository**:
    *   In your GitHub repository, go to "Settings" > "Pages" (in the left sidebar).
    *   Under "Build and deployment":
        *   For "Source," select **"GitHub Actions"**.
    *   Your site should be live at your GitHub Pages URL (e.g., `https://username.github.io/vtasks/`) after the action completes successfully.

## How Data is Handled

All task and note data is stored directly in your web browser's `localStorage` under the key `task-notes-entries-v3`. This means:
*   Your data is private to your browser and device.
*   No data is sent to or stored on any external server.
*   Clearing your browser's site data for this application will remove all your tasks and notes.
*   You can use the "Export All Data" or "Import Data" features to back up or restore your information.

## Conceptual Features (Not Implemented)

*   The application description in `metadata.json` mentions "Full Google Account and Drive integration." This is a conceptual feature and is **not** implemented in the current version. The application operates entirely locally.

---

© 2025 John Vilsack
