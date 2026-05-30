# Support CRM System

A full-stack customer support ticketing system built with Node.js, Express, SQLite, and React.

## Tech Stack
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Frontend:** React + Vite + Tailwind CSS
- **Deployment:** Render (backend) + Vercel (frontend)

## Features
- Create support tickets with customer info
- List all tickets with search and filter
- Filter by status: Open, In Progress, Closed
- View ticket details
- Update status and add notes

## Setup Instructions

### Backend
cd backend
npm install
node server.js

### Frontend
cd frontend
npm install
npm run dev

## API Endpoints
- POST /api/tickets — Create ticket
- GET /api/tickets — List all tickets
- GET /api/tickets/:id — Get single ticket
- PUT /api/tickets/:id — Update ticket
