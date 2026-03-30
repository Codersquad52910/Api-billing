# API Billing Platform

A full-stack API billing and usage analytics platform that enables organizations to manage API keys, track usage metrics with geographic granularity, and generate automated billing reports.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Frontend │     │  Admin Frontend  │     │  External APIs  │
│   (React/Vite)  │     │  (React/Vite)    │     │  (Consumers)    │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                         │
         │    ┌──────────────────┼─────────────────────────┘
         │    │                  │
    ┌────▼────▼──────────────────▼────┐
    │       Express.js Backend        │
    │  ┌──────────┐  ┌──────────────┐ │
    │  │   Auth   │  │  API Usage   │ │
    │  │Middleware │  │  Middleware  │ │
    │  └──────────┘  └──────────────┘ │
    │  ┌──────────────────────────┐   │
    │  │       Route Handlers     │   │
    │  │  auth │ admin │ services │   │
    │  │  keys │ usage │ superadm │   │
    │  └──────────────────────────┘   │
    │  ┌──────────────────────────┐   │
    │  │    Background Services   │   │
    │  │  cron │ email │ reports  │   │
    │  └──────────────────────────┘   │
    └────────────────┬────────────────┘
                     │
              ┌──────▼──────┐
              │   MongoDB   │
              │  (Mongoose) │
              └─────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Admin Panel** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **Email** | Nodemailer (Gmail SMTP) |
| **Scheduling** | node-cron |
| **Geolocation** | geoip-lite, request-ip |

## Project Structure

```
Api-billing-main/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/       # Auth & API tracking middleware
│   ├── models/          # Mongoose schemas (User, APIKey, Service, Usage)
│   ├── routes/          # Express route handlers
│   ├── services/        # Background services (cron, email, reports)
│   ├── utils/           # Shared constants, logger, validators
│   └── server.js        # Application entry point
├── frontend/            # User-facing React application
│   └── src/
│       ├── api/         # Axios API client modules
│       ├── components/  # Reusable UI components
│       ├── context/     # React context providers
│       └── pages/       # Page-level components
├── admin-frontend/      # Admin panel React application
│   └── src/
│       ├── components/  # Admin UI components
│       └── pages/       # Admin page components
└── package.json         # Root workspace configuration
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** >= 9.x

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/api-billing
JWT_SECRET=your_jwt_secret_here
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your_admin_password
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
```

### Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install admin frontend dependencies
cd ../admin-frontend && npm install
```

### Running Locally

```bash
# Start backend (from /backend)
npm start

# Start user frontend (from /frontend)
npm run dev

# Start admin panel (from /admin-frontend)
npm run dev
```

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user account |
| POST | `/login` | Authenticate and receive JWT |
| POST | `/verify-otp` | Verify email via OTP |
| POST | `/resend-otp` | Request a new OTP |
| POST | `/forgot-password` | Request password reset OTP |
| POST | `/reset-password` | Reset password with OTP |
| GET | `/me` | Get authenticated user profile |

### API Keys (`/api/keys`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Generate a new API key |
| GET | `/` | List user's API keys |
| DELETE | `/:id` | Delete an API key |

### Usage Analytics (`/api/usage`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get raw usage records |
| GET | `/stats` | Get aggregated usage statistics |
| GET | `/region` | Get usage breakdown by region |

### Services (`/api/services`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List active services |
| GET | `/all` | List all services (admin) |
| POST | `/` | Create a service (admin) |
| PUT | `/:id` | Update a service (admin) |
| DELETE | `/:id` | Delete a service (admin) |
| POST | `/:id/subscribe` | Subscribe to a service |

### Admin (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview` | System overview statistics |
| GET | `/users` | User list with usage stats |
| PUT | `/keys/:id/rate` | Update API key billing rate |

## Role-Based Access

| Role | Permissions |
|------|------------|
| `user` | Register, manage own keys, view own usage, subscribe to services |
| `admin` | All user permissions + manage services, view all users, update rates |
| `super_admin` | All admin permissions + create admin accounts |

## License

This project is part of an academic coursework submission.
