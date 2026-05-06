# Priority Notification Inbox System

A React-based frontend application that displays notifications sorted by priority using a weighted scoring algorithm combining notification type, freshness, and view status.


## Steps

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


  ```bash
  npm run build
  npm run preview
  ```

If you want, I can also add a short script to automate creating `.env.local` from a template — tell me if you'd like that.
