# Notification System Design

## Overview
A priority-based notification inbox system that displays top N most important notifications determined by a weighted scoring algorithm.

## Architecture

### Components

#### Frontend (notification_app_fe)
- **React Application** - Display layer for notifications
- **Weight Calculation** - Client-side scoring algorithm
- **State Management** - React hooks for notification state
- **Local Storage** - Persistence of viewed notification IDs
- **Filters** - All, New, Viewed tabs
- **Search** - Full-text search across notifications

#### Backend (notification_app_be)
- **API Service** - Notification endpoints
- **Authentication** - Access control
- **Database** - Notification storage
- **Logging** - Request/response logging

#### Logging Middleware
- Request logging
- Response tracking
- Error logging
- Performance metrics

## Weight Calculation Algorithm

```
Score = TypeScore + FreshnessBoost + UnreadBoost

Where:
- TypeScore = notification type weight (security: 100, billing: 90, task: 82, etc.)
- FreshnessBoost = newer notifications get higher boost
- UnreadBoost = unviewed notifications get priority boost
```

### Type Weight Mapping
- Security: 100
- Billing: 90
- Task: 82
- System: 54
- Reminder: 48
- Social: 35

## API Structure

### Notification Object
```json
{
  "id": "unique-identifier",
  "type": "notification-type",
  "message": "notification-content",
  "timestamp": "ISO-8601-timestamp"
}
```

### Endpoints
- `GET /notifications` - Fetch all notifications
- `GET /notifications/top/:n` - Fetch top N notifications
- `POST /notifications/:id/view` - Mark notification as viewed

## UI/UX

### Layout
- **Priority Panel** (60%) - Top N important notifications
- **Control Panel** (40%) - Filters, search, settings

### Features
- Real-time updates
- Dark theme with glass-morphism
- Responsive design (mobile & desktop)
- View state persistence
- Search functionality
- Customizable top N count (1-6)

## Technology Stack

### Frontend
- React 19.2.5
- Vite 8.0.10 (Build tool)
- Vanilla CSS (Responsive, dark theme)
- JavaScript/JSX

### Styling Approach
- Vanilla CSS with custom properties
- Responsive breakpoints
- CSS Grid for layout
- No external UI framework

## Data Flow

1. App mounts → Fetch notifications from API
2. Calculate weight score for each notification
3. Sort by score (descending)
4. Display top N in priority panel
5. Load viewed IDs from localStorage
6. Mark new/viewed status
7. Filter and search as needed
8. Persist view state on interaction
