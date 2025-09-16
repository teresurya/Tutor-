# Tutor-Student Web Application

## Prerequisites
- Node.js 20+
- PostgreSQL database running on localhost:5432
- Database credentials: postgres/1234

## Project Structure
- `apps/web`: React + Vite frontend
- `apps/api`: Node.js + Express API with PostgreSQL

## How to Run the Project

### 1. Setup Database
Ensure PostgreSQL is running with:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: 1234
- Database: postgres (default database)

### 2. Start Backend API
```bash
cd apps/api
npm install
npm run build
.\start-server.bat
```
The API will run on http://localhost:4000

### 3. Start Frontend (in a new terminal)
```bash
cd apps/web
npm install
npm run dev
```
The frontend will run on http://localhost:5173

### 4. Test the Application
- Visit http://localhost:5173 in your browser
- Test registration: Click "Register" and create a new account
- Test login: Click "Login" with your credentials
- View tutors: Click "Find Tutors" to see available tutors
- API health: http://localhost:4000/health should return `{"ok":true}`

## API Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /tutors` - List approved tutors
- `POST /tutors` - Create tutor profile
- `POST /bookings` - Create booking
- `POST /admin/tutors/:id/approve` - Approve tutor
- `POST /meeting` - Generate meeting links

## Environment Variables
The API uses these environment variables (set in start-server.bat):
```
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev-secret
DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres
```

## Features Working
✅ PostgreSQL persistence
✅ User authentication (register/login)
✅ Tutor management
✅ Frontend-backend integration
✅ API endpoints tested and working


