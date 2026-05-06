# Notification App Backend

Backend service for the notification system handling:
- Notification storage and retrieval
- Weight calculation coordination
- Logging and monitoring
- API endpoints

## Structure

- `routes/` - API endpoint definitions
- `models/` - Data models
- `middleware/` - Middleware functions
- `controllers/` - Business logic

## Setup

```bash
npm install
npm start
```

## API Endpoints

- GET /notifications - Fetch all notifications
- GET /notifications/top/:n - Fetch top N notifications by weight
- POST /notifications/:id/view - Mark notification as viewed
- POST /notifications - Create notification (admin only)
