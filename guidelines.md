# Build a Complete MERN Stack Task Management Application

## 1. Project Overview

Build a complete, production-style **Todo & Task Management Web Application** using the MERN stack.

The application should allow users to create, organize, track, update, and manage tasks through their entire lifecycle. It must provide both a traditional Todo/List view and a Kanban board where tasks move between workflow stages.

This must be a fully functional full-stack application, not just a UI prototype.

### Core requirements
- User registration, login, logout, and JWT authentication.
- Forgot password and reset password functionality.
- Create, view, edit, delete, and track tasks.
- Kanban board with drag-and-drop task movement.
- List view with sorting, filtering, search, and pagination.
- Individual task details on a separate page.
- Task status and activity tracking throughout the workflow.
- Dashboard with task statistics and progress.
- Responsive, modern, visually polished UI.
- Proper MongoDB integration and secure Express APIs.

## 2. Technology Stack

Use the following technologies.

### Frontend — `frontend/`
- React with Vite
- JavaScript
- React Context API for shared global application state (Tasks, SLA metrics, Auth, Filters)
- React Router DOM
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons
- React Hook Form for form handling
- Zod for validation where appropriate
- TanStack Query for API state, caching, and invalidation
- `@dnd-kit` for Kanban drag-and-drop
- Recharts for dashboard charts
- React Hot Toast or Sonner for notifications
- Day.js for date formatting

Use compatible, stable package versions and avoid unnecessary dependencies.

### Backend — `backend/`
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt for password hashing
- Zod or express-validator for request validation
- Nodemailer for password-reset emails
- Helmet, CORS, and rate limiting
- dotenv for environment variables

Use JavaScript with ES modules consistently throughout the project.

## 3. Mandatory Project Structure

Keep frontend and backend completely separated.

```text
task-management-app/
│
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── illustrations/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── kanban/
│   │   │   ├── forms/
│   │   │   └── ui/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── KanbanPage.jsx
│   │   │   ├── TaskDetailsPage.jsx
│   │   │   ├── CreateTaskPage.jsx
│   │   │   ├── EditTaskPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   │
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── mail.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   └── TaskActivity.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── task.service.js
│   │   │   ├── email.service.js
│   │   │   └── activity.service.js
│   │   │
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

Keep the architecture simple. Do not add unnecessary abstractions, duplicate files, microservices, or overly complicated patterns. Each file should have a clear purpose.

## 4. UI/UX Design Direction

Create a premium, modern SaaS task-management interface inspired by the usability and polish of Linear, Notion, and modern productivity dashboards. Do not copy their exact designs.

### Visual identity
- Clean, minimal, elegant, and professional.
- Soft neutral background with white or subtle tinted surfaces.
- Deep charcoal text, muted secondary text, and a tasteful indigo or violet accent.
- Use green for completed tasks, blue or violet for active work, and amber or red for overdue or high-priority tasks.
- Rounded cards, subtle borders, refined shadows, and consistent spacing.
- Use a modern font such as Inter or Geist.
- Use Lucide icons instead of emoji for application controls.
- Use subtle hover transitions and restrained animations.
- Ensure strong readability, consistent typography, and accessible contrast.

### Application layout

Build an application shell with:
- A persistent left sidebar on desktop.
- A top navigation bar with breadcrumbs, search, notifications, and profile menu.
- A main content area with consistent maximum widths and responsive spacing.
- A mobile-friendly sidebar drawer.
- Clear page titles, helpful subtitles, and prominent primary actions.

Sidebar navigation:
1. Dashboard
2. My Tasks
3. Kanban Board
4. Create Task
5. Profile / Settings

Show task counts where useful. Highlight the currently active navigation item.

### Design quality requirements
- Use skeleton loaders while fetching data.
- Provide helpful empty states with clear calls to action.
- Display confirmation dialogs before destructive actions.
- Include form validation messages and success/error notifications.
- Support keyboard navigation and visible focus states.
- Ensure the application works on mobile, tablet, and desktop.
- Avoid excessive gradients, giant empty spaces, generic template layouts, and unnecessary animations.

## 5. Authentication and User Management

Implement these pages:

### Register
Fields:
- Full name
- Email
- Password
- Confirm password

Requirements:
- Validate inputs on frontend and backend.
- Hash passwords with bcrypt.
- Prevent duplicate email registrations.
- Never return password hashes in API responses.

### Login
Fields:
- Email
- Password
- Show/hide password toggle
- Forgot password link
- Link to registration

Requirements:
- Authenticate against MongoDB.
- Issue a JWT after successful authentication.
- Provide a secure logout flow.
- Redirect authenticated users to the dashboard.
- Protect all private pages and APIs.

### Forgot password
- Accept the user's email.
- Return a generic response that does not reveal whether the account exists.
- Generate a cryptographically secure, single-use, expiring reset token.
- Store only a hash of the reset token in MongoDB.
- Send a password-reset URL through Nodemailer.
- Set a sensible token expiry, such as 15 minutes.
- Never expose the reset token in production API responses.

### Reset password
- Validate the token and its expiry.
- Allow the user to set and confirm a new password.
- Invalidate the token after use.
- Invalidate existing sessions or refresh credentials according to the chosen authentication design.
- Show clear success and error states.

### Authentication security
Prefer short-lived access tokens and secure, HttpOnly cookies where practical. If refresh tokens are implemented, rotate and revoke them correctly. Never store sensitive authentication credentials in localStorage by default.

Configure cookie security, CORS, and CSRF protection consistently with the selected authentication approach.

## 6. Task Management Features

Users should be able to create and manage tasks with the following fields:

- Task title — required.
- Description — optional.
- Status.
- Priority: Low, Medium, High, Urgent.
- Due date.
- Start date — optional.
- Tags or labels.
- Category — optional.
- Created date.
- Updated date.
- Completed date.
- Owner/user ID.
- Activity history.

Use the following workflow statuses:

1. **Created** — the task has been created and has not started.
2. **In Progress** — work is underway.
3. **Completed** — the task has been finished.

Use a consistent set of status values in the frontend, backend, and database. A task must never have conflicting status representations.

### Task operations
- Create a task.
- View all tasks belonging to the authenticated user.
- View one task on its own details page.
- Edit task information.
- Change task status.
- Change task priority.
- Set or update due dates.
- Delete a task with confirmation.
- Search tasks by title or description.
- Filter by status, priority, date range, and tags.
- Sort by created date, due date, priority, or updated date.
- Paginate results.
- Show overdue tasks.
- Show completed tasks and completion dates.

Validate all input on the server. Users must never be able to access or modify another user's tasks by changing an ID in a request.


## SLA MANAGEMENT & TASK TIME TRACKING

Implement a complete SLA (Service Level Agreement) and task lifecycle
time-tracking system across the application.

This must be a real, backend-powered feature using MongoDB timestamps
and task status history, not a frontend-only timer or mock data.

### 1. Task Lifecycle Time Tracking

Track how long each task spends in every workflow status.

The existing statuses are:
- Created
- In Progress
- Completed

For every task, record:

- `createdAt`: when the task was created.
- `startedAt`: when the task first entered In Progress.
- `completedAt`: when the task entered Completed.
- `updatedAt`: when the task was last updated.
- `currentStatusSince`: when the task entered its current status.
- `totalElapsedTime`: total time since task creation.
- `statusHistory`: complete history of status transitions.
- `timeInCreated`: cumulative time spent in Created.
- `timeInProgress`: cumulative time spent in In Progress.
- `timeInCompleted`: cumulative time spent in Completed.

Store timestamps as dates in MongoDB. Derive elapsed durations from
timestamps rather than relying on browser timers.

Important implementation rules:

- Record every successful status transition on the backend.
- When a task moves from Created to In Progress, close the Created
  interval and begin the In Progress interval.
- When a task moves from In Progress to Completed, close the In Progress
  interval and record the completion timestamp.
- If a task is reopened, preserve its previous history and begin a new
  interval for the new status.
- Support repeated transitions without losing historical durations.
- Do not count time twice when calculating cumulative status durations.
- Use server-generated timestamps as the source of truth.
- Calculate the current active interval dynamically when displaying
  elapsed time.
- Completed tasks must retain their final duration values.
- Record only successful changes; failed requests must not create
  false history entries.

Use a dedicated `TaskActivity` model or an equivalent status-history
structure to store transition events.

Each status-history entry should contain:

- Previous status.
- New status.
- Transition timestamp.
- Time spent in the previous status.
- User who performed the transition, when available.

Ensure task updates and corresponding history records are handled
consistently, preferably within a MongoDB transaction where supported.

### 2. SLA Configuration

Allow users to configure an SLA for each task.

Add these fields to the Task model:

- `slaDurationMinutes`: allowed completion time in minutes.
- `slaStartType`: either `creation` or `first_start`.
- `slaDeadline`: calculated SLA deadline.
- `slaStatus`: derived status for SLA reporting where appropriate.

SLA start behavior:

- `creation`: the SLA countdown begins when the task is created.
- `first_start`: the SLA countdown begins when the task first enters
  In Progress.

Calculate the deadline on the backend based on the selected start type
and configured duration.

Provide a configurable default SLA duration for new tasks. Allow users
to override it when creating or editing a task.

If the SLA starts on first_start, do not start the SLA countdown until
the task actually enters In Progress.

Keep SLA duration separate from the task's ordinary due date. A due date
is a target date chosen for the task; an SLA is a defined response or
completion-time commitment.

### 3. SLA Status Calculation

Support these SLA states:

- `Not Started`: SLA has not started yet.
- `On Track`: task is within its SLA deadline.
- `At Risk`: task is approaching its deadline.
- `Breached`: task is unfinished and the SLA deadline has passed.
- `Met`: task was completed within the SLA deadline.
- `Completed Late`: task was completed after the SLA deadline.

Requirements:

- Calculate SLA state using server timestamps and the current time.
- Make the at-risk threshold configurable, with a sensible default
  such as the final 20% of the allowed SLA duration.
- Do not mark completed tasks as currently breached.
- Preserve whether a completed task met or missed its SLA.
- Recalculate derived SLA state whenever the task is retrieved or when
  relevant data changes.
- Do not depend on a browser timer to determine whether an SLA is breached.
- Handle missing SLA configuration safely.
- Make SLA status consistent across the dashboard, task list, Kanban
  board, and task details page.

### 4. Task Creation and Editing UI

Update the Create Task and Edit Task pages.

Add these fields:

- SLA duration.
- SLA start condition:
  - From task creation.
  - From first start.
- Optional SLA enable/disable control.

Display the calculated SLA deadline as a preview whenever possible.

Validate the SLA duration on both frontend and backend. Reject negative,
invalid, or unreasonable values according to configured limits.

Changing an SLA configuration must not silently rewrite historical
status durations or past activity records.

Define and document what happens when an SLA is changed after it has
already started. Preserve historical reporting and make the new
deadline calculation explicit.

### 5. Kanban Board Enhancements

Update task cards in all three columns.

Each card should display:

- Current status.
- Time spent in the current status.
- Total task age.
- SLA status indicator.
- SLA countdown or overdue duration.
- Task priority.
- Due date, if configured.

Examples:

Created
- Waiting for: 2h 15m
- Task age: 2h 15m
- SLA: On Track

In Progress
- In progress for: 5h 30m
- Task age: 7h 45m
- SLA: At Risk
- Time remaining: 30m

Completed
- Completed in: 6h 40m
- SLA: Met

These values are examples for presentation only. All displayed values
must be calculated from real task data.

Use compact, readable badges and subtle visual indicators. Avoid
crowding the task cards with too much information.

Show full time-tracking details on the task details page.

### 6. Task Details Page: Time Tracking Panel

Add a dedicated "Time Tracking & SLA" panel.

Display:

- Task creation timestamp.
- First-start timestamp.
- Completion timestamp, if completed.
- Current status duration.
- Total elapsed time.
- Cumulative time spent in each status.
- SLA duration.
- SLA start condition.
- SLA deadline.
- Remaining SLA time or time overdue.
- Final SLA outcome for completed tasks.

Include a chronological status timeline showing when the task entered
and left each status and how long it stayed there.

Example:

Created
  Entered: 09:00 AM
  Left: 11:00 AM
  Duration: 2h

In Progress
  Entered: 11:00 AM
  Left: 04:30 PM
  Duration: 5h 30m

Completed
  Entered: 04:30 PM
  Duration: Final status

Use actual stored timestamps and history. Never fabricate missing
historical transitions.

For tasks created before this feature is implemented, clearly indicate
when historical time data is unavailable. Do not invent previous
status-transition timestamps.

### 7. Dashboard: SLA Analytics

Add an SLA overview section to the main dashboard.

Include summary cards for:

- Tasks currently on track.
- Tasks at risk.
- Active SLA breaches.
- Tasks completed within SLA.
- Tasks completed late.
- Average task completion time.

Add useful charts showing:

- Tasks by SLA status.
- Average time spent in each workflow status.
- On-time versus late completion rate.
- Task completion time trends over time.

Provide filters for date range, task priority, and task status where
appropriate.

Calculate analytics from actual MongoDB data and valid status-history
records. Do not use hardcoded statistics.

Clearly distinguish active SLA breaches from tasks that were completed
late.

### 8. Task List: Filtering and Sorting

Extend the My Tasks page with:

- Filter by SLA status.
- Filter by breached tasks.
- Filter by tasks at risk.
- Filter by completed-on-time tasks.
- Sort by SLA deadline.
- Sort by longest time in current status.
- Sort by oldest unfinished task.
- Sort by total elapsed time.

Display the SLA deadline, current status duration, and SLA indicator
in the list without making the layout congested.

Perform filtering and sorting on the backend for paginated task lists.

### 9. Backend API Requirements

Extend the existing task APIs instead of creating unnecessary
duplicate endpoints.

Support:

- Creating a task with SLA configuration.
- Updating SLA settings.
- Retrieving calculated time-tracking information.
- Retrieving status-transition history.
- Filtering tasks by SLA state.
- Sorting by SLA deadline and status duration.
- Returning SLA analytics in the dashboard response.

Example task response fields:

{
  "status": "In Progress",
  "createdAt": "2026-10-23T09:00:00.000Z",
  "startedAt": "2026-10-23T11:00:00.000Z",
  "currentStatusSince": "2026-10-23T11:00:00.000Z",
  "slaDurationMinutes": 480,
  "slaStartType": "creation",
  "slaDeadline": "2026-10-23T17:00:00.000Z",
  "timeTracking": {
    "currentStatusMinutes": 120,
    "totalElapsedMinutes": 120,
    "timeInCreatedMinutes": 120,
    "timeInProgressMinutes": 0,
    "timeInCompletedMinutes": 0
  },
  "sla": {
    "status": "On Track",
    "remainingMinutes": 360,
    "overdueMinutes": 0
  }
}

The values above are illustrative. Calculate all values dynamically.
Use a consistent API response format and appropriate date serialization.

Never trust duration, elapsed-time, or SLA-status values supplied by
the frontend. Calculate or validate them on the backend.

### 10. Background Processing and Reliability

Do not create a continuously running timer for every task.

Elapsed durations and SLA states should be calculated from timestamps
when requested.

If email or in-app notifications are supported, optionally notify
users when a task approaches its SLA deadline or breaches it.

For notifications:

- Avoid sending duplicate breach alerts.
- Make notification thresholds configurable.
- Do not block ordinary task operations if a notification service fails.
- Use a background job or scheduled process only when required for
  deadline-triggered notifications.

The UI must still show the correct SLA state when the user opens the
application, even if no background job is running.

Use consistent timezone handling. Store timestamps in UTC and format
them in the user's local timezone in the frontend.

### 11. Testing Requirements

Add automated tests verifying:

- Task creation timestamps.
- Every status transition and its history.
- Correct time-in-status calculations.
- Correct total elapsed time.
- Reopening a completed task without losing previous history.
- SLA countdown before the deadline.
- At-risk threshold behavior.
- Active SLA breach detection.
- Completion within SLA.
- Completion after SLA.
- SLA start from task creation.
- SLA start from first start.
- Changing SLA settings without corrupting historical data.
- Filtering and sorting by SLA state.
- Accurate dashboard analytics.
- Correct handling of missing historical data.
- Correct behavior across timezone boundaries.
- Failed task updates not producing false history entries.

Use a controllable clock or injected time provider in tests so deadline
scenarios can be tested deterministically.

### 12. Acceptance Criteria

This feature is complete only when:

1. Every successful status transition is recorded.
2. Time spent in each status is calculated correctly.
3. Total task age is distinct from time spent in the current status.
4. SLA deadlines are calculated from the configured start condition.
5. SLA state updates correctly as time passes.
6. Completed tasks retain their final SLA outcome.
7. Kanban cards show concise time and SLA information.
8. Task details show the complete status timeline.
9. Dashboard SLA analytics reflect real database records.
10. Users can filter and sort tasks by SLA state.
11. The frontend cannot manipulate authoritative timing values.
12. Historical records remain intact after status changes or reopening.
13. The implementation integrates with the existing MERN architecture.
14. Existing authentication, task CRUD, list, Kanban, and dashboard
    functionality continues to work.
15. The application is tested end to end, with no fake timers,
    hardcoded SLA metrics, or placeholder interactions.

## 7. Dashboard Page

Create a meaningful dashboard using real data from the backend.

### Summary cards
- Total tasks.
- Created tasks.
- In-progress tasks.
- Completed tasks.
- Overdue tasks.

### Additional sections
- Tasks due today.
- Upcoming deadlines.
- Recently updated tasks.
- Recently completed tasks.
- Task completion rate.
- Task distribution by status.
- Task distribution by priority.

Use Recharts for appropriate charts. Keep charts simple and visually consistent.

All counts and charts must come from actual database queries or accurate derived data. Do not hardcode dashboard statistics.

Clicking a summary card should navigate to the task list with the corresponding filter applied.

## 8. My Tasks — List View

Create a dedicated `/tasks` page.

### Layout
At the top:
- Page title: My Tasks.
- Total task count.
- Search field.
- Create Task button.
- Filter and sort controls.
- View switcher for List and Kanban.

### Task table or list
Display:
- Task title.
- Status.
- Priority.
- Due date.
- Tags.
- Created date.
- Last updated date.
- Actions menu.

Requirements:
- Use status badges with consistent colors.
- Use priority indicators.
- Support sorting by column where appropriate.
- Provide pagination with current page, page size, total results, previous, and next controls.
- Preserve applicable filters when moving between pages.
- Include a page-size selector, such as 10, 20, or 50.
- Provide loading, empty, and error states.
- Debounce search requests to avoid unnecessary API calls.

Use server-side filtering, sorting, and pagination. Do not download every task and paginate only in the browser.

## 9. Kanban Board

Create a dedicated `/kanban` page.

The board must contain three columns:

- Created
- In Progress
- Completed

Each column should display:
- Status title.
- Number of tasks in that status.
- Add-task action.
- Task cards.

### Kanban task cards
Display:
- Task title.
- Short description when available.
- Priority.
- Due date.
- Tags.
- Overdue indicator.

### Drag-and-drop functionality
- Allow users to drag a task between columns.
- Update the task's status in the backend.
- Reflect the change in the database.
- Update the interface optimistically where appropriate.
- Roll back the UI if the API request fails.
- Record status changes in the activity history.
- Update the dashboard counts and task-list data.
- Prevent accidental duplicate updates.
- Support keyboard-accessible alternatives for changing status.

Tasks should remain in the correct column after refreshing the page.

If the board uses pagination or task limits, make that limitation clear and provide a way to access all tasks. Do not silently hide tasks.

## 10. Separate Task Details Page

Every task must have its own dedicated page, for example:

`/tasks/:taskId`

Clicking a task card or title should open its details page.

Display:
- Full task title.
- Full description.
- Current status.
- Priority.
- Due date and relevant dates.
- Tags and category.
- Created and last-updated timestamps.
- Edit button.
- Delete button.
- Status-change control.
- Activity timeline.

The page should have a polished layout with a clear information hierarchy.

### Activity timeline
Show meaningful events such as:
- Task created.
- Title or description updated.
- Priority changed.
- Due date changed.
- Status moved from Created to In Progress.
- Status moved from In Progress to Completed.
- Task reopened, if reopening is allowed.
- Task deleted, if deletion history is retained.

Each activity event should contain:
- Event type.
- Timestamp.
- Relevant previous and new values where appropriate.
- Actor/user reference.

Create activity records on the server when changes succeed. Do not fabricate history on the frontend.

Keep the task details page distinct from the list and Kanban views. The user should not have to open an edit modal just to read the full task.

## 11. Create and Edit Task Pages

Create separate pages:
- `/tasks/new`
- `/tasks/:taskId/edit`

Build a clean form with:
- Title.
- Description.
- Status.
- Priority.
- Start date.
- Due date.
- Tags.
- Category, if implemented.

Requirements:
- Validate required fields.
- Prevent invalid date ranges.
- Show field-level errors.
- Disable duplicate submissions while saving.
- Show success or error notifications.
- Redirect to the task details page after a successful save.
- Prefill all existing values on the edit page.
- Handle missing tasks and API errors gracefully.

Do not duplicate form logic unnecessarily; use a reusable task form component.

## 12. MongoDB Data Models

### User model

Include:
- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`
- Password-reset token hash and expiry fields.
- Session or refresh-token fields only if required by the chosen authentication design.

Use unique email indexing and appropriate normalization.

### Task model

Include:
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `startDate`
- `completedAt`
- `tags`
- `category`
- `user` — reference to the owner.
- `createdAt`
- `updatedAt`

Use Mongoose timestamps and add indexes for common queries, including owner, status, due date, and creation date where appropriate.

Validate enums and field types at the schema and request-validation layers.

### TaskActivity model

Include:
- `task`
- `user`
- `action`
- `field`
- `oldValue`
- `newValue`
- `createdAt`

Use an appropriate retention or deletion strategy. If a task is deleted permanently, explicitly decide whether its activity records are also deleted or retained in a suitable audit model. Do not leave orphaned records accidentally.

Use consistent references and ownership checks.

## 13. REST API Endpoints

Use `/api/v1` as the API prefix.

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Tasks

```text
POST   /api/v1/tasks
GET    /api/v1/tasks
GET    /api/v1/tasks/:taskId
PATCH  /api/v1/tasks/:taskId
DELETE /api/v1/tasks/:taskId
PATCH  /api/v1/tasks/:taskId/status
GET    /api/v1/tasks/:taskId/activity
```

The list endpoint should support query parameters such as:

```text
GET /api/v1/tasks?page=1&limit=10
GET /api/v1/tasks?status=in_progress
GET /api/v1/tasks?priority=high
GET /api/v1/tasks?search=meeting
GET /api/v1/tasks?startDate=2026-10-01&endDate=2026-10-31
GET /api/v1/tasks?sortBy=dueDate&order=asc
```

Support combining valid filters.

### Dashboard

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/activity
```

### User

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me
```

Add a change-password endpoint if it is implemented as a separate profile feature.

### API response consistency

Use a consistent response structure.

Successful paginated response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "A clear error message",
  "errors": []
}
```

Return appropriate HTTP status codes, including 400, 401, 403, 404, 409, 422 where appropriate, and 500 for unexpected server errors.

Do not expose stack traces, credentials, password hashes, reset tokens, or sensitive internal errors to clients.

## 14. Backend Architecture and Business Logic

Follow this request flow:

```text
HTTP Request
    ↓
Express Router
    ↓
Authentication Middleware
    ↓
Request Validation
    ↓
Controller
    ↓
Service / Business Logic
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Consistent JSON Response
```

Responsibilities:
- Routes define endpoints.
- Middleware handles authentication, validation, and common request processing.
- Controllers handle HTTP requests and responses.
- Services implement reusable business logic and task lifecycle rules.
- Models define database schemas.
- Error middleware handles errors consistently.

Do not put the entire application into `server.js` or one large controller.

Implement:
- Centralized error handling.
- Request validation.
- Ownership checks for every task operation.
- Safe filtering and sorting.
- Correct pagination metadata.
- Secure password-reset flow.
- Activity logging for successful mutations.
- Database connection handling.
- Health endpoint: `GET /api/v1/health`.

Use environment variables for secrets and deployment-specific settings.

## 15. Images, Icons, and Seed Data

The application is primarily a productivity tool, so prioritize functional UI over decorative imagery.

### Assets
- Use Lucide React icons for navigation, actions, status, priority, calendar, and search.
- Use a small, tasteful empty-state illustration if it improves the interface.
- Use local SVG illustrations where practical.
- Avoid large stock photos or unrelated background images.
- Do not reference broken, nonexistent, or randomly guessed image URLs.
- If using external images, use a reputable source and ensure the assets are accessible and appropriately licensed.

### Demo data
Create an optional development-only seed script that generates:
- One demo user.
- Approximately 20–30 realistic tasks.
- A mix of Created, In Progress, and Completed tasks.
- A range of priorities and due dates.
- Tasks with tags.
- A few overdue tasks.
- A reasonable activity history.

Make the demo data realistic and useful for testing every view.

The seed script must be safe to run intentionally in a development database. Never seed demo users or sample records automatically in production.

Do not hardcode demo tasks or dashboard values into frontend components. All application task data must be retrieved from the API.

## 16. Frontend Functionality and State Management

Create a reusable Axios instance in `frontend/src/services/api.js`.

Requirements:
- Configure the backend base URL through an environment variable.
- Handle authentication credentials consistently.
- Add request and response interceptors where useful.
- Handle expired sessions without creating redirect loops.
- Centralize API methods in service files.
- Use React Context API (`TaskContext`, `AuthContext`) for shared global application state, active filters, task counters, and real-time SLA metrics across views.
- Use TanStack Query for server state caching and synchronization where appropriate.
- Invalidate or update affected queries and context state after task mutations.
- Preserve filters and pagination in URL query parameters where appropriate.
- Show consistent loading, error, and empty states.
- Prevent unnecessary API requests.
- Avoid duplicated API logic across pages.

Do not build fake interactions that only change local component state when the backend should persist the change.

## 17. Environment Configuration

Create `backend/.env.example` with:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/task_management
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=15m
COOKIE_SECRET=replace_with_another_long_random_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=TaskFlow <no-reply@taskflow.local>
PASSWORD_RESET_URL=http://localhost:5173/reset-password
```

Adapt cookie and refresh-token settings to the actual authentication implementation.

Create `frontend/.env.example` with:

```dotenv
VITE_API_URL=http://localhost:5000/api/v1
```

Never commit actual `.env` files, secrets, SMTP passwords, or database credentials.

Provide a development-only password-reset delivery strategy if SMTP is not configured, such as a safe local email preview or console-only link that is never enabled in production.

## 18. Testing Requirements

Do not consider the application finished until the major flows have been tested.

### Authentication tests
- Successful registration.
- Duplicate email rejection.
- Successful login.
- Invalid credentials rejection.
- Protected routes reject unauthenticated requests.
- Forgot password works without revealing account existence.
- Valid reset token changes the password.
- Expired and reused reset tokens are rejected.

### Task tests
- Create, retrieve, edit, and delete a task.
- Update task status.
- Reject invalid task data.
- Reject access to another user's tasks.
- Search and filters return correct results.
- Date filtering works with the selected timezone rules.
- Pagination returns correct metadata.
- Sorting returns correctly ordered results.
- Activity history records successful changes.
- Failed mutations do not create false activity records.

### Frontend tests
- Authentication forms validate correctly.
- List and Kanban views display real API data.
- Drag-and-drop persists status changes.
- API failures are shown clearly.
- Dashboard statistics match the database.
- Task detail and edit pages handle missing tasks.
- Responsive layouts work at mobile and desktop widths.

Use Vitest and React Testing Library for suitable frontend tests and a compatible backend testing framework such as Vitest or Jest with Supertest.

## 19. Execution Plan

Build the application in this order.

**Phase 1 — Project setup**
- Create the root project and separate frontend/backend directories.
- Configure dependencies, environment examples, scripts, and database connection.
- Create the Express application and Vite frontend.

**Phase 2 — Backend foundation**
- Implement User, Task, and TaskActivity models.
- Implement authentication, JWT protection, validation, and error handling.
- Implement all task APIs, ownership checks, filtering, sorting, pagination, and activity logging.
- Implement dashboard APIs and password-reset functionality.

**Phase 3 — Frontend foundation**
- Implement the application shell, sidebar, navigation, shared UI components, and API services.
- Implement registration, login, forgot-password, and reset-password pages.

**Phase 4 — Task features**
- Build the task list, create page, edit page, task details page, and Kanban board.
- Connect every feature to the backend.
- Implement filters, pagination, sorting, drag-and-drop, and activity timeline.

**Phase 5 — Dashboard and polish**
- Implement real statistics and charts.
- Add skeletons, notifications, empty states, error states, responsive behavior, and accessibility improvements.

**Phase 6 — Verification**
- Run frontend and backend.
- Execute tests and fix errors.
- Verify all critical workflows end to end.
- Update the README with setup instructions.

## 20. Final Acceptance Criteria

The project is complete only when all of the following are true:

1. The frontend runs independently from the backend.
2. The backend connects to MongoDB successfully.
3. Registration and login work with real users.
4. JWT-protected APIs reject unauthorized requests.
5. Password reset works with expiring, single-use tokens.
6. Tasks persist in MongoDB.
7. Each user can access only their own tasks.
8. Task status transitions work consistently.
9. Dragging a task between Kanban columns persists the new status.
10. Search, filtering, sorting, and pagination work together.
11. Each task has a dedicated details page.
12. Activity history records real changes.
13. Dashboard statistics reflect actual task data.
14. All important actions show useful feedback.
15. The UI is responsive, accessible, and visually polished.
16. There are no broken routes, placeholder buttons, fake statistics, or dead-end interactions.
17. Both projects have working development scripts and clear setup documentation.
18. No production secrets or credentials are committed.

## Final Instructions to Antigravity

First inspect the current workspace. If a project already exists, preserve useful code and integrate with it rather than blindly overwriting files.

Then implement the application in small, verifiable steps. Create the actual files, install the required dependencies, connect the frontend to the backend, and run the application.

Do not stop after generating the folder structure or UI mockups. Do not leave important features as TODO comments, hardcoded arrays, placeholder API calls, or nonfunctional buttons.

After implementation:
- Run the frontend and backend.
- Check the browser console and server logs.
- Fix runtime errors and failed requests.
- Run the available tests.
- Verify the critical flows against the actual database.
- Document any external configuration required, particularly MongoDB and email delivery.

Prefer simple, readable, maintainable JavaScript code over unnecessary complexity. If a requirement cannot be completed because an external service or credential is unavailable, implement the appropriate integration and clearly explain what must be configured rather than pretending it works.

**Deliver a complete, usable, full-stack task management application with a polished UI and correctly functioning backend.**
