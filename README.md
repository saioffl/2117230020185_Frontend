# Priority Notification Inbox System

A React-based frontend application that displays notifications sorted by priority using a weighted scoring algorithm combining notification type, freshness, and view status.

## Features

- **Weighted Priority Sorting** - Notifications ranked by type weight, freshness, and read status
- **Real-time Filtering** - Filter by all, new, or viewed notifications
- **Search Functionality** - Full-text search across notification messages
- **Persistent State** - View status saved to localStorage
- **Responsive Design** - Mobile and desktop optimized UI
- **Dark Theme** - Modern glass-morphism styling with Vanilla CSS

## Project Structure

```
2117230020185_frontend/
├── notification_app_fe/      # React frontend application
│   ├── src/
│   │   ├── App.jsx           # Main component with notification logic
│   │   ├── App.css           # Responsive styling
│   │   ├── index.css         # Global dark theme
│   │   └── main.jsx          # React entry point
│   ├── public/               # Static assets
│   ├── index.html            # HTML entry point
│   ├── package.json          # Dependencies
│   ├── vite.config.ts        # Vite configuration (port 3000)
│   └── README.md             # Frontend setup
├── notification_app_be/      # Backend API service
├── logging_middleware/       # Logging utilities
├── notification_system_design.md  # System architecture
└── .gitignore

```

## Quick Start (Frontend)

```bash
cd notification_app_fe
npm install
npm run dev
```

Server runs on `http://localhost:3000`

## Tech Stack

- **React** 19.2.5
- **Vite** 8.0.10 (build tool)
- **JavaScript** (JSX, no TypeScript)
- **Vanilla CSS** (no external frameworks)

## Notification Weight Algorithm

```
Score = TypeScore + FreshnessBoost + UnreadBoost

Type Weights:
- Security: 100
- Billing: 90
- Task: 82
- System: 54
- Reminder: 48
- Social: 35
```

## API Integration

Frontend connects to notification service at: `http://20.207.122.201/evaluation-service/notifications`

### Expected Notification Format
```json
{
  "id": "unique-identifier",
  "type": "notification-type",
  "message": "notification-content",
  "timestamp": "ISO-8601-timestamp"
}
```

## Development

- Run `npm run lint` to check code quality
- Run `npm run build` to create production build
- Run `npm run preview` to preview production build locally

**How to run the frontend (human-friendly steps)**

- Open a terminal and go to the frontend folder:

  ```bash
  cd notification_app_fe
  ```

- Install the project dependencies (only the first time or when you change packages):

  ```bash
  npm install --legacy-peer-deps
  ```

- Start the development server (this opens a live, auto-reloading site):

  ```bash
  npm run dev
  ```

  By default the app runs on `http://localhost:3000`. If you need to force the port, run:

  ```bash
  npx vite --port 3000
  ```

- Open the address shown in the terminal (`http://localhost:3000`) in your browser.

- To stop the server press `Ctrl+C` in the terminal, or run this from another shell:

  ```bash
  pkill -f vite
  ```

Tips and environment variables

- If you were given registration credentials or a token, store them in a local environment file so the app can use them. Create a file named `.env.local` inside `notification_app_fe` with values like:

  ```text
  VITE_ACCESS_TOKEN=your_access_token_here
  VITE_ACCESS_CODE=BTCDqT
  VITE_CLIENT_ID=your_client_id
  VITE_CLIENT_SECRET=your_client_secret
  ```

  Do not commit `.env.local` to GitHub. It's already excluded by the repository `.gitignore`.

- If the UI shows "Showing sample data because the notification API is unavailable", open your browser DevTools → Network and Console and check:
  - The request to `/evaluation-service/notifications` is sent.
  - The `Authorization` header is present (Bearer token) if required.
  - The response status and body. If you see a 4xx/5xx error, copy the response and paste it here and I will help diagnose.

Build and preview (production)

- Create a production build and preview it locally:

  ```bash
  npm run build
  npm run preview
  ```

If you want, I can also add a short script to automate creating `.env.local` from a template — tell me if you'd like that.
