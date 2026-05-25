# Green Valley High School Management System

Green Valley High School Management System is a full-stack school administration platform built with a React frontend and a Node.js/Express backend on top of MongoDB. It supports role-based access for admins, teachers, students, and parents, and brings together academic management, assignments, grades, attendance, notifications, and school fee tracking in one application.

## Overview

This project is organized as two separate apps:

- `front-end`: React + Vite client application
- `backend`: Express + MongoDB REST API

The system currently includes:

- Admin management for students, teachers, courses, assignments, academic years, and payments
- Teacher workflows for attendance, classes, and grade submission
- Student dashboards for results, attendance, assignments, notifications, and payments
- Parent dashboards for child-linked results, notifications, and payments
- Payment flows with both Chapa integration and mock payment support
- JWT-based authentication with role-aware routing
- Light and dark mode UI with a modern dashboard shell

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Recharts
- Tailwind tooling in the project

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs
- CORS

## Project Structure

```text
SMS/
|-- README.md
|-- backend/
|   |-- package.json
|   |-- server.js
|   |-- seed.js
|   |-- .env
|   `-- src/
|       |-- app.js
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- models/
|       |-- routes/
|       |-- scripts/
|       `-- utils/
`-- front-end/
    |-- package.json
    |-- .env
    `-- src/
        |-- api/
        |-- assets/
        |-- components/
        |-- context/
        |-- landing-pages/
        |-- pages/
        |-- routes/
        |-- utils/
        |-- App.jsx
        |-- App.css
        |-- index.css
        `-- main.jsx
```

## Main Folders

### Backend

- `src/app.js`: Express app setup, middleware, route registration, and `/api/test`
- `src/config`: database and payment configuration
- `src/controllers`: request handlers for auth, grades, students, teachers, payments, notifications, and more
- `src/middleware`: JWT auth middleware and route protection
- `src/models`: Mongoose models for users, students, teachers, parents, grades, payments, notifications, and academic years
- `src/routes`: REST route definitions
- `src/scripts`: utility scripts for sample data, payment setup, academic years, notifications, and parent linking
- `server.js`: backend entrypoint that loads env variables, connects MongoDB, and starts the server
- `seed.js`: base admin user seeding script

### Frontend

- `src/api`: Axios instance and API service wrappers
- `src/components`: shared UI and feature-level components
- `src/context`: auth, theme, and shared state providers
- `src/landing-pages`: public landing page and login UI
- `src/pages/admin`: admin dashboard pages
- `src/pages/teacher`: teacher dashboard pages
- `src/pages/student`: student dashboard pages
- `src/pages/parent`: parent dashboard pages
- `src/routes`: application routing and protected route logic
- `src/index.css`: global theme tokens and light/dark styling

## Roles and Access

The system supports four roles:

- `ADMIN`
- `TEACHER`
- `STUDENT`
- `PARENT`

Login checks multiple collections in this order:

1. Admin users from `User`
2. Teachers from `Teacher`
3. Students from `Student`
4. Parents from `Parent`

After login, the frontend routes users to the correct dashboard:

- Admin: `/admin`
- Teacher: `/teacher`
- Student: `/student`
- Parent: `/parent`

## Core Features

### Admin

- Manage students
- Manage teachers
- Manage courses
- Manage assignments
- Manage academic years
- View and manage payments
- Generate monthly payments
- Apply fines and suspension checks
- Release grades and compute totals/rankings

### Teacher

- View assigned classes
- Record attendance
- Submit and save draft grades

### Student

- View dashboard summary
- View released results
- View attendance
- View assignments
- View notifications
- View payment history and make payments

### Parent

- View only linked child information
- View child results
- View parent notification history
- View and pay child fee balances

## API Modules

The backend registers these main route groups:

- `/api/auth`
- `/api/students`
- `/api/teachers`
- `/api/courses`
- `/api/assignments`
- `/api/grading-setting`
- `/api/academic-years`
- grade routes under `/api/...`
- notification routes under `/api/...`
- payment routes under `/api/...`

Useful test endpoint:

- `GET /api/test`

## Environment Variables

Create your own `.env` files in both apps. Do not commit real secrets.

### Backend `.env`

The backend uses these variables:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `CHAPA_SECRET_KEY`
- `CHAPA_API_URL`
- `FRONTEND_URL`

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/sms
JWT_SECRET=replace_with_a_secure_secret
PORT=3000
CHAPA_SECRET_KEY=replace_with_chapa_key
CHAPA_API_URL=https://api.chapa.co/v1
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

The frontend uses:

- `VITE_API_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

Example:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd SMS
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../front-end
npm install
```

## Initialize the Project End to End

Follow this order for a clean local setup.

### 1. Configure environment variables

- Add `backend/.env`
- Add `front-end/.env`

### 2. Start MongoDB

Make sure your MongoDB server is running locally, or update `MONGO_URI` to point to your hosted MongoDB instance.

### 3. Seed admin users

From the `backend` folder:

```bash
node seed.js
```

This creates sample admin-style login accounts such as:

- `GVA2018011`
- `GVA2018012`
- `GVA2018013`

Default password:

```text
ChangeMe@123
```

### 4. Seed or register the rest of your academic data

Depending on your data flow, use the scripts in `backend/src/scripts` to initialize the system:

- `createAcademicYears.js`
- `createSampleNotifications.js`
- `generatePayments.js`
- `initPaymentSettings.js`
- `registerTeachers.js`
- `seedParents.js`
- `linkStudentsToParents.js`

Some of these do not yet have npm aliases, so run them directly with Node from the `backend` folder when needed.

Example:

```bash
node src/scripts/createAcademicYears.js
node src/scripts/initPaymentSettings.js
```

### 5. Seed parent accounts

From the `backend` folder:

```bash
npm run seed:parents
```

Sample parent usernames:

- `GVP2024001`
- `GVP2024002`
- `GVP2024003`

Default password:

```text
ChangeMe@123
```

### 6. Link students to parents

From the `backend` folder:

```bash
npm run link:parents
```

Important note:

The sample linking script currently assumes student usernames like:

- `GVS2024001`
- `GVS2024002`
- `GVS2024003`
- `GVS2024004`
- `GVS2024005`

If your real student usernames differ, update `backend/src/scripts/linkStudentsToParents.js` before running it.

### 7. Start the backend

From the `backend` folder:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

By default the API runs on:

```text
http://localhost:3000
```

### 8. Start the frontend

From the `front-end` folder:

```bash
npm run dev
```

Vite usually serves the app on:

```text
http://localhost:5173
```

## Available Scripts

### Backend

```bash
npm run dev
npm start
npm run seed:parents
npm run link:parents
node seed.js
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Payments

The project includes two payment paths:

- Chapa integration for real payment initialization and verification
- Mock payment endpoints for local testing

Related backend payment routes include:

- `/api/payment-settings`
- `/api/payments/all`
- `/api/payments/student/:studentId`
- `/api/payments/chapa/initialize`
- `/api/payments/chapa/verify`
- `/api/payments/mock/initialize`
- `/api/payments/mock/verify`
- `/api/parent/children`

## Parent Role Notes

The parent flow is designed so a parent does not browse all school data. A parent should only access records for linked children. This currently applies to:

- parent dashboard child summaries
- child payment pages and payment history
- child released results
- parent notifications page

The student model contains a `parent` reference, and the parent model stores summarized child references in `children`.

## Development Notes

- The frontend API base URL is read from `VITE_API_URL`, with a fallback to `http://localhost:3000/api`
- CORS currently allows local frontend/backend origins in `backend/src/app.js`
- Authentication uses JWT bearer tokens stored in local storage on the frontend
- The project has working build output for the frontend, but lint warnings/errors may still exist in some files

## Recommended Local Startup Checklist

Use this sequence when bringing the whole system up for the first time:

1. Start MongoDB
2. Configure `backend/.env`
3. Configure `front-end/.env`
4. Run `node seed.js`
5. Run setup scripts for academic years and payment settings if needed
6. Run `npm run seed:parents`
7. Run `npm run link:parents`
8. Start the backend with `npm run dev`
9. Start the frontend with `npm run dev`
10. Open `http://localhost:5173`

## Suggested Improvements

- Add a root-level workspace package configuration for one-command startup
- Add `.env.example` files for both apps
- Add npm scripts for all backend setup scripts
- Add automated tests for auth, grades, and payment workflows
- Clean remaining lint issues in the frontend
- Add a complete receipt download endpoint if payment receipts are required in the UI

## License

This repository does not currently declare a project-specific license. Add one if you plan to distribute or publish the system.


