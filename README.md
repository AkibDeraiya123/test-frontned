# Class Scheduler Frontend

Frontend UI for the **Class Scheduler** system — built for Excellence Driving, a driving school in Dubai, UAE. Manage schedules, upload data, view reports, and maintain masters (instructors, students, class types).

## Tech Stack

- **React 18** with **Vite**
- **React Router v6** for routing
- **Material UI (MUI) v5** for components and theming
- **TanStack React Query** for server state
- **Axios** for API requests
- **Recharts** for charts and reports
- **react-dropzone** for CSV uploads
- **date-fns** for date handling

## Prerequisites

- **Node.js** 18+ (or 20+ recommended)
- **npm** or **yarn**

## Getting Started

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root (or copy from `.env.example` if present):

```env
# API base URL (used when not using Vite dev proxy)
VITE_API_URL=https://your-api-host.com
```

- In **development**, Vite proxies `/api` to `http://localhost:5000` by default, so the backend can run locally.
- For **production** or when pointing to a remote API, set `VITE_API_URL` to your backend URL.

### Run development server

```bash
npm run dev
```

App runs at **http://localhost:5173**. The root path redirects to `/dashboard`.

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview production build locally

```bash
npm run preview
```

## Project structure

```
src/
├── App.jsx              # App shell, theme, routes
├── main.jsx             # Entry point, React Query & Router setup
├── components/
│   ├── common/          # Layout, shared UI
│   ├── configuration/   # Config form and related
│   └── upload/          # Upload status and related
└── pages/
    ├── Dashboard        # Overview and metrics
    ├── Upload           # CSV upload
    ├── Reports          # Reports and charts
    ├── Configuration    # System configuration
    ├── Masters          # Masters landing (if used)
    ├── Instructors      # Instructors master
    ├── Students         # Students master
    └── ClassTypes       # Class types master
```

## Main features

| Route            | Description                          |
|------------------|--------------------------------------|
| `/dashboard`     | Overview and key metrics             |
| `/upload`        | Upload CSV data                      |
| `/reports`       | Reports and visualizations           |
| `/configuration` | System configuration                |
| `/instructors`   | Instructors master data              |
| `/students`      | Students master data                 |
| `/class-types`   | Class types master data              |

## Backend

This frontend expects a backend API. In dev, API requests under `/api` are proxied to `http://localhost:5000`. Ensure the backend is running on that port when developing locally, or configure `VITE_API_URL` to point to your API.
