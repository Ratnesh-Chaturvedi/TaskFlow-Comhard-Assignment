# TaskFlow — Modern Full-Stack MERN Task Management Application

A complete, production-grade **Task & Productivity Management Web Application** built with the **MERN** stack (MongoDB, Express, React with Vite, Node.js) and styled to match the modern, elegant **TaskFlow** design aesthetic with soft pastel themes, Kanban drag-and-drop, interactive analytics, and audit logging.

---

## ✨ Features & Capabilities

### 1. Dashboard Page (Exact UI Match + SLA Overview)
- **Top Bar**: Search bar with `⌘ + K` command palette shortcut, notification bell with unread badge counter, and user profile avatar.
- **Metric Cards with Sparklines**:
  - **Total Tasks**: `24` (`↑ 12%`) with purple wave sparkline.
  - **Created**: `8` (`↑ 6%`) with blue wave sparkline.
  - **In Progress**: `7` (`↑ 2%`) with orange wave sparkline.
  - **Completed**: `7` (`↑ 18%`) with green wave sparkline.
- **SLA & Time Tracking Panel**:
  - Real-time SLA analytics: **On Track**, **At Risk**, **Active Breaches**, **Met SLA**, **On-Time Rate**, and **Average Resolution Time**.
- **Task Overview (Donut Chart)**: Recharts-powered segmented donut chart with centered completion rate (`67% Completed`) and colored status counts.
- **Upcoming Deadlines**: Real-time sorted urgency list with status dot indicators, colored badges (`Today`, `Tomorrow`, `Nov 2, 2025`, `Nov 3, 2025`), and navigation links.
- **Recent Tasks**: Table view with checkboxes, status badges, priority arrows, and quick actions.
- **"Stay on track!" Banner**: 3D checklist graphic with direct `[Create Task ->]` quick action.

### 2. SLA Management & Lifecycle Time Tracking
- **Lifecycle Tracking**: Precise timestamp recording for `createdAt`, `startedAt`, `completedAt`, and `currentStatusSince`.
- **Interval Accounting**: Dynamic cumulative tracking for time spent in `Created`, `In Progress`, and `Completed`.
- **Status Transition History**: Chronological audit trail tracking each transition, timestamp, duration spent, and actor.
- **SLA State Calculation**:
  - States: `On Track`, `At Risk` (final 20% countdown), `Breached`, `Met`, `Completed Late`, `Not Started`.
  - Configurable SLA durations with presets (2h, 4h, 8h, 24h, 48h) and start triggers (`creation` vs `first_start`).
- **Dedicated Time Tracking Panel on Task Details**: Visual progress breakdown, remaining time countdown, and chronological history table.

### 3. React Context API Shared State Architecture
- `TaskContext`: Global shared store managing all tasks, active filter states, live metric synchronizations, real-time SLA calculations, and optimistic Kanban updates.
- Eliminates stale counts and prop drilling between the Sidebar counter, Dashboard, List view, and Kanban board.

### 2. My Tasks — List View (`/tasks`)
- Server-side and client-side synchronized filtering by status (`Created`, `In Progress`, `Completed`) and priority (`Low`, `Medium`, `High`, `Urgent`).
- Debounced live search across task titles and descriptions.
- Multi-field sorting (created date, due date, title).
- Full pagination with customizable page size selector (10, 20, 50 rows per page).
- Inline status toggling and quick deletion with confirmation modal.
- View switcher toggle between List view and Kanban view.

### 3. Kanban Board (`/kanban`)
- Three distinct workflow columns: **Created**, **In Progress**, and **Completed**.
- Fluid drag-and-drop task movement between columns.
- Live optimistic status updates with automatic rollback on API failure.
- Accessible alternative status dropdowns on every card for keyboard and screen-reader accessibility.
- Automatic overdue badge indicators on expired tasks.

### 4. Separate Task Details Page (`/tasks/:taskId`)
- Dedicated full page for each individual task.
- Interactive status selector for instant lifecycle transitions.
- Complete task metadata: title, description, priority, category, tags, start date, due date, and timestamps.
- **Activity Timeline**: Full audit history recording task creation, status changes, priority shifts, and updates.
- Quick navigation to edit and delete modal.

### 5. Create & Edit Task Pages (`/tasks/new`, `/tasks/:taskId/edit`)
- Unified reusable form component with field-level validation.
- Date range verification (prevents due date before start date).
- Tagging and categorization support.
- Disabled duplicate submission state with loading spinners.

### 6. Authentication & User Profile (`/login`, `/register`, `/forgot-password`, `/profile`)
- User registration and login with bcrypt password hashing and JWT authentication.
- Secure HTTP-only cookies and Bearer token fallback.
- Forgot password flow generating cryptographically secure, single-use, 15-minute expiring tokens.
- Nodemailer email integration with development console preview fallback.
- Profile settings to edit full name, avatar image URL, and update passwords.

---

## 🛠 Technology Stack

### Frontend (`frontend/`)
- **Core**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom color tokens, modern typography, and glassmorphism
- **Icons**: Lucide React
- **API State & Caching**: TanStack Query (`@tanstack/react-query`)
- **HTTP Client**: Axios with request and response interceptors
- **Kanban**: Drag-and-drop with optimistic state synchronization
- **Charts**: Recharts (PieChart / Donut chart)
- **Notifications**: React Hot Toast

### Backend (`backend/`)
- **Runtime**: Node.js (ES Modules `"type": "module"`)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS with credentials, express-rate-limit
- **Email**: Nodemailer with SMTP and local development preview
- **Logging**: Morgan

---

## 📁 Project Structure

```text
COMHARD/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # CommandPalette, Illustrations, Sparklines
│   │   │   ├── forms/          # TaskForm (reusable)
│   │   │   └── layout/         # Sidebar, TopBar, AppLayout
│   │   ├── context/            # AuthContext with demo credentials
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── Dashboard.jsx   # UI Screenshot match
│   │   │   ├── TasksPage.jsx   # List view with filters & pagination
│   │   │   ├── KanbanPage.jsx  # 3-column Kanban board with drag-and-drop
│   │   │   ├── TaskDetailsPage.jsx # Details & Activity Timeline
│   │   │   ├── CreateTaskPage.jsx
│   │   │   ├── EditTaskPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/           # api.js, authService.js, taskService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── config/             # db.js, mail.js
│   │   ├── constants/          # status.js
│   │   ├── controllers/        # auth, task, dashboard, user
│   │   ├── middleware/         # auth, error, validate, rateLimit
│   │   ├── models/             # User, Task, TaskActivity
│   │   ├── routes/             # auth, task, dashboard, user
│   │   ├── services/           # auth, task, email, activity
│   │   ├── utils/              # seed.js (rich demo dataset)
│   │   ├── validators/         # auth, task schemas (Zod)
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
Run from the root directory:
```bash
# Install root orchestration tools
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Variables
Both `backend/.env` and `frontend/.env` have been pre-configured with default development settings:
- Backend port: `5000`
- MongoDB URI: `mongodb://127.0.0.1:27017/task_management`
- Frontend port: `5173`
- Client API URL: `http://localhost:5000/api/v1`

### 3. Seed the Database (Optional)
To populate MongoDB with the demo user (`ratnesh@example.com`) and tasks identical to the UI screenshot:
```bash
cd backend
npm run seed
```

### 4. Run the Development Servers
From the root directory:
```bash
npm run dev
```
Or run each separately:
- **Backend**: `cd backend && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend**: `cd frontend && npm run dev` (Runs on `http://localhost:5173`)

### 5. Access the Application
Open your browser to:
👉 **`http://localhost:5173`**

Demo credentials:
- **Email**: `ratnesh@example.com`
- **Password**: `password123`
*(The app is pre-authenticated in demo mode so you can preview the UI immediately!)*

---

## 📡 REST API Endpoints Reference

All endpoints are prefixed with `/api/v1`:

### Authentication (`/api/v1/auth`)
- `POST /register` — Register a new account
- `POST /login` — Log in and receive JWT token + cookie
- `POST /logout` — Invalidate session and clear cookies
- `GET  /me` — Retrieve currently logged-in user profile
- `POST /forgot-password` — Generate expiring reset token and email
- `POST /reset-password` — Verify token and update password

### Tasks (`/api/v1/tasks`)
- `POST   /` — Create new task (title, description, status, priority, dates, tags)
- `GET    /` — List tasks with query filtering (`status`, `priority`, `search`, `page`, `limit`, `sortBy`, `order`)
- `GET    /:taskId` — Retrieve single task details
- `PATCH  /:taskId` — Update task details
- `DELETE /:taskId` — Delete task permanently
- `PATCH  /:taskId/status` — Quick status transition
- `GET    /:taskId/activity` — Get full activity timeline for a task

### Dashboard (`/api/v1/dashboard`)
- `GET /summary` — Aggregated counts (`total`, `created`, `inProgress`, `completed`, `overdue`), completion rate, status distribution, and upcoming deadlines
- `GET /activity` — Recent activity log across all user tasks

### User (`/api/v1/users`)
- `GET   /me` — User details
- `PATCH /me` — Update name and avatar
- `POST  /change-password` — Verify old password and set new password

### System
- `GET /api/v1/health` — Service health and uptime check
