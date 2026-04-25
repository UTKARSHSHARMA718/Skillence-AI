# AI-Powered Bootcamp Reviewer Platform

An enterprise-grade, AI-powered interview and review platform designed to evaluate newly onboarded employees based on their learning materials. The system simulates an interactive, real-time voice interview environment where users respond to topic-based questions, and their performance is analyzed instantly.

## 🌟 Key Features

### For Users (Employees)
* **Secure Authentication**: Robust login, password reset, and session management.
* **Customizable Sessions**: Select 5 to 15 specific topics for each review session.
* **Real-time AI Interviews**: Engage in voice-based, interactive interviews driven by AI.
* **Live Transcription**: View real-time speech-to-text for both the AI reviewer and the user.
* **Progress Tracking**: Access a dedicated dashboard detailing past performance, session reports, and overall improvement trends.

### For Administrators
* **Advanced Analytics Dashboard**: Comprehensive metrics including total users, completion rates, pass/fail ratios, and session activity over the last 30 days.
* **Cost Tracking**: Detailed breakdowns of VAPI call costs, evaluation costs, and total operational expenses.
* **User Management**: Add, remove, and manage users with full pagination support.
* **Detailed Reporting**: Dive deep into individual user profiles to review their past session reports and performance metrics.

## 🚀 Strong Points & Technical Excellence

This project is built with modern software engineering best practices, ensuring scalability, maintainability, and a premium user experience:

* **Modern Stack**: Built on the powerful combination of **Next.js** (Frontend) and **NestJS** (Backend), providing a robust, server-rendered, and API-first architecture.
* **Type Safety**: End-to-end **TypeScript** implementation ensures fewer runtime errors and an excellent developer experience.
* **State-of-the-Art AI Integration**: Leverages **Vapi AI** for seamless voice interactions and **OpenAI** for intelligent response evaluation and topic extraction.
* **Robust Database Architecture**: Uses **Prisma ORM** for type-safe database queries and schema management.
* **High-Performance UI**: Beautiful, responsive interfaces built with **Tailwind CSS v4**, enriched with fluid animations using **Framer Motion** and **Lottie**, and optimized data fetching via **React Query**.
* **Enterprise Security**: Secure authentication flows utilizing **Next-Auth** and **JWT** (JSON Web Tokens).
* **Containerized Deployment**: Fully dockerized frontend and backend with `docker` and `docker-compose` support for consistent environments across development and production.

## 🛠️ Technology Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16, React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, Lottie React
- **State & Data Fetching**: TanStack React Query
- **Forms & Validation**: React Hook Form + Zod
- **AI Integration**: `@vapi-ai/web`
- **Charts**: Recharts

### Backend (`/backend`)
- **Framework**: NestJS 10
- **Database ORM**: Prisma
- **Authentication**: Passport.js, JWT
- **AI Services**: OpenAI SDK
- **Email Services**: Nodemailer
- **Testing**: Jest

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose
- Database (e.g., PostgreSQL)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env` and configure it).
4. Run database migrations and generate the Prisma client:
   ```bash
   npm run generate
   ```
5. Start the backend server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env` and configure it).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Docker Setup
To run the services using Docker:
```bash
# Inside the backend directory
docker build -t bootcamp_ai_backend .
docker run --rm -p 5000:5000 bootcamp_ai_backend
```
*(Refer to the `docker-compose.yml` files in the respective directories for orchestrated setups)*

## 🛡️ License

This project is proprietary and confidential.
