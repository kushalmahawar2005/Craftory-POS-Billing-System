# Craftory POS - AI Powered Billing System

A modern, high-performance POS and Billing system for small businesses, built with Next.js, Prisma, and PostgreSQL.

## 🚀 Quick Start with Docker

The easiest way to get started is using Docker Compose. This will set up the app, the database, and a database management tool automatically.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Node.js (if running locally without Docker).

### 2. Setup Environment
Copy the example environment file:
```bash
cp .env.example .env
```
*(No need to change DB settings if using Docker, the defaults work automatically!)*

### 3. Start the system
```bash
docker compose up -d
```

### 4. Access URLs
- **App:** [http://localhost:3000](http://localhost:3000)
- **Database GUI (Adminer):** [http://localhost:8080](http://localhost:8080)
  - **Server:** `db`
  - **Username:** `craftory_admin`
  - **Password:** `Craftory@POS2026`
  - **Database:** `craftory_pos`

---

## 🛠 Manual Development (Local)

If you prefer to run the app on your local machine and only use Docker for the database:

### 1. Start only the Database
```bash
docker compose up -d db
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📂 Project Structure
- `/src/app/api` - Backend routes
- `/src/app/app` - Dashboard and Protected UI
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## 🔒 Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
