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
