# Notification System - Client

This is the frontend dashboard for the Notification System, built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It provides a user-friendly interface to manage settings, test notifications, and view logs.

## Features

- **Dashboard UI**: Responsive layout with sidebar navigation.
- **Authentication**: Login page protected by JWT integration.
- **System Settings**: UI forms to configure SMTP, SMS, and FCM credentials securely.
- **Testing Module**: Interactive tool to send test notifications and view real-time status.
- **Notification Logs**: History table showing success/failure status of sent messages.

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI based)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Setup & Running

### Prerequisites

- Node.js or Bun installed.
- The Backend Server must be running (see `../server/README.md`).

### Development

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    bun install
    ```

2.  **Environment Setup**:
    Check `src/services/api.ts` to ensure the `baseURL` matches your running server (default: `http://localhost:5001/api`).

3.  **Start Dev Server**:
    ```bash
    npm run dev
    # or
    bun run dev
    ```

4.  **Access**:
    Open your browser at `http://localhost:5173`.
    *Login with: `admin@example.com` / `admin123`*

## Project Structure

- `src/components`: UI components (Dashboard, Settings, Testing, etc.)
- `src/services`: API integration services (Auth, Config, Notifications)
- `src/providers`: Theme and context providers
- `src/ui`: Reusable UI elements (Buttons, Inputs, Cards) from shadcn/ui

## Docker

The frontend is currently set up for local development but can be added to the main `docker-compose.yml` if needed for production deployment.
