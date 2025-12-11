# Notification System - Server

This is the backend API for the Notification System, built with **Bun**, **Express**, **MongoDB**, and **TypeScript**. It handles user authentication, notification provider configuration, and dispatching notifications across multiple channels (Email, SMS, Push).

## Features

- **Authentication**: JWT-based login and registration.
- **Provider Management**: CRUD APIs to configure credentials for:
  - **Email** (SMTP)
  - **SMS** (Twilio, etc.)
  - **FCM** (Firebase Cloud Messaging)
- **Notification Engine**: Centralized endpoint to trigger notifications.
  - Currently implements a mock dispatch service (logs to DB).
  - Scalable design to add real provider SDKs.
- **Logging**: detailed history of all sent notifications stored in MongoDB.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Language**: TypeScript
- **Security**: Helmet, CORS, Bcrypt

## Setup & Running

### Prerequisites

- [Bun](https://bun.sh) installed.
- MongoDB running locally or via Docker.

### Local Development

1.  **Install Dependencies**:

    ```bash
    bun install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root (optional, defaults provided in code for dev):

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/notification-system
    JWT_SECRET=your_super_secret_key
    ```

3.  **Seed Database**:
    Create the initial Admin user:

    ```bash
    bun run seed
    ```

    _Creates user: `admin@example.com` / `admin123`_

4.  **Start Server**:
    ```bash
    bun run dev
    ```

### Docker Support

The server is containerized and runs alongside MongoDB via Docker Compose.

```bash
# In the project root
docker compose up -d
```

The API will be available at `http://localhost:5001` (mapped to internal port 5000).

## API Endpoints

### Auth

- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Login and get JWT

### Configuration

- `GET /api/config` - List all configured providers
- `POST /api/config` - Add/Update a provider configuration
- `DELETE /api/config/:id` - Remove a configuration

### Notifications

- `POST /api/notifications/send` - Trigger a notification
- `GET /api/notifications/logs` - View notification history

## Directory Structure

- `src/controllers`: Request handlers
- `src/models`: Mongoose schemas (User, NotificationLog, NotificationConfig)
- `src/routes`: API route definitions
- `src/services`: Business logic for dispatching notifications
