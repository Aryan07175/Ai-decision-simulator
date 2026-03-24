# AI Decision Simulator

A powerful "What-if engine for life decisions." This platform helps users simulate, trace, and visualize the potential outcomes of their complex life choices using artificial intelligence.

## 🏗 Architecture

The project is structured as a modern monorepo containing three main components:

- **Frontend**: A sleek, premium user interface built with **Next.js 16** (App Router), React 19, and Lucide React. It includes animated backgrounds, dynamic particle effects, and local state management for a seamless experience.
- **Backend**: A robust REST API built with **Node.js** and **Express**. It uses **Drizzle ORM** to interface safely and efficiently with a PostgreSQL database.
- **AI Service**: A dedicated service handling the core decision-simulation logic and AI inferences.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Docker (for PostgreSQL database)

### Installation & Running Locally

#### 1. Start the Database
The project includes a `docker-compose.yml` to quickly spin up the necessary PostgreSQL database.
```bash
docker-compose up -d
```

#### 2. Backend Setup
Navigate to the backend directory, install dependencies, run migrations, and start the development server.
```bash
cd backend
npm install
npm run generate  # Generate Drizzle schema
npm run migrate   # Push schema to the database
npm run dev       # Start the Express API server
```

#### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the Next.js development server.
```bash
cd frontend
npm install
npm run dev       # Start the Next.js frontend locally
```

#### 4. AI Service Setup
Please refer to the `ai-service` directory for specific language and dependency setup instructions for the AI engine.

thank you for visiting this repo 

