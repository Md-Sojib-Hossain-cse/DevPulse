# DevPulse – Internal Tech Issue Tracker API

A collaborative backend system for reporting bugs, tracking issues, and managing feature requests for development teams.

---

## Live API

https://devpulse-livid-iota.vercel.app

---

## Features

- User authentication (JWT based)
- Role based access control (Contributor / Maintainer)
- Create, update, delete issues
- Issue filtering (type, status, sorting)
- Secure password hashing using bcrypt
- Centralized error handling
- PostgreSQL with raw SQL (no ORM)

---

## Tech Stack

- Node.js (v24+)
- Express.js
- TypeScript
- PostgreSQL (pg driver)
- JWT (jsonwebtoken)
- bcrypt

---

## User Roles

### Contributor

- Register & login
- Create issues
- View all issues
- Update own issue (only if status = open)

### Maintainer

- All contributor permissions
- Update any issue
- Delete issues
- Manage workflow status

---

## Authentication Flow

1. User logs in
2. Server validates credentials
3. JWT is generated (includes id, name, role)
4. Client sends token in header:

5. Server verifies token before protected routes

---

## Database Schema

### Users Table

- id (serial primary key)
- name (text)
- email (unique text)
- password (hashed text)
- role (contributor | maintainer)
- created_at (timestamp)
- updated_at (timestamp)

### Issues Table

- id (serial primary key)
- title (varchar 150)
- description (text)
- type (bug | feature_request)
- status (open | in_progress | resolved)
- reporter_id (integer)
- created_at (timestamp)
- updated_at (timestamp)

---

## API Endpoints

### 🔹 Auth

#### POST `/api/auth/signup`

Register new user

#### POST `/api/auth/login`

Login user & get JWT token

---

### 🔹 Issues

#### POST `/api/issues`

Create issue (auth required)

#### GET `/api/issues`

Get all issues (filters supported)

#### GET `/api/issues/:id`

Get single issue

#### PATCH `/api/issues/:id`

Update issue (role-based access)

#### DELETE `/api/issues/:id`

Delete issue (maintainer only)

---

## Issue Update Rules

- Maintainer → can update any issue
- Contributor → can update own issue only if status = `open`
- Allowed fields: title, description, type
- Status update allowed only for maintainer

---

## Setup Instructions

```bash
# Clone repository
git clone https://github.com/Md-Sojib-Hossain-cse/DevPulse

# Install dependencies
npm install

# Create .env file
NODE_ENV=production
PORT=5000
DB_CONNECTION_STRING=your_connection_string
BCRYPT_SALT_ROUND=12
PRIVATE_KEY=your_private_key

# Run development server
npm run dev
```

## Key Design Decisions

- Raw SQL used (no ORM as per requirement)
- No JOINs used (manual batching for relations)
- Centralized error handling middleware
- Role-based authorization at service layer
- Secure ownership validation via JWT payload

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Optional details"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Deployment

- Backend: Vercel / Render / Railway
- Database: NeonDB / Supabase / ElephantSQL

---

## Project Structure

```id="x8q2ld"
src/
 ├── modules/
 ├── middleware/
 ├── config/
 ├── utils/
 ├── db/
 ├── routes/
 └── app.ts
```

##  Author

Built for Level-2 Web Development Assignment  
Focused on clean architecture, security, and scalability.
