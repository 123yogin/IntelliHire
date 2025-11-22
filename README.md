# IntelliHire - AI-Powered Proctored Testing Platform

<div align="center">

![IntelliHire](https://img.shields.io/badge/IntelliHire-AI%20Proctored%20Testing-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)

**A comprehensive online examination platform with AI-powered proctoring capabilities for secure and fair assessments.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Configuration](#-configuration) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [API & Database](#-api--database)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

IntelliHire is a modern, full-stack web application designed to facilitate online examinations with advanced AI-powered proctoring. The platform supports three distinct user roles (Admin, Recruiter, and Student) and provides a comprehensive solution for creating, managing, and taking secure online tests.

### Key Highlights

- **AI-Powered Proctoring**: Real-time monitoring with face detection, tab-switch detection, voice detection, and suspicious activity tracking
- **Multi-Role System**: Separate dashboards and functionalities for Admins, Recruiters, and Students
- **Comprehensive Analytics**: Detailed insights and reports for performance tracking
- **Modern UI/UX**: Beautiful, responsive interface built with Tailwind CSS
- **Secure & Scalable**: Built on Supabase for reliable backend infrastructure

---

## ✨ Features

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Recruiter, Student)
- Secure login system with Supabase authentication
- Protected routes based on user roles

### 📝 Test Management

#### For Recruiters:
- Create custom tests with multiple question types (MCQ, Subjective, Coding)
- Configure test settings (duration, negative marking, proctoring level)
- Manage test availability and activation
- View and edit existing tests
- Track candidate performance

#### For Admins:
- View all tests across the platform
- Monitor test statistics and analytics
- Manage platform-wide settings

### 👨‍🎓 Student Features
- Browse available tests
- Take proctored examinations
- View personal results and performance
- Track exam history

### 🤖 AI Proctoring System
- **Face Detection**: Monitors student presence during exam
- **Multiple Face Detection**: Detects if multiple people are present
- **Tab Switch Detection**: Tracks browser tab switching
- **Voice Detection**: Monitors audio input for suspicious activity
- **Suspicious Movement Detection**: AI-powered movement analysis
- **Violation Tracking**: Real-time logging of all proctoring violations
- **Cheating Probability Score**: AI-calculated risk assessment

### 📊 Analytics & Reporting
- Comprehensive dashboard with key metrics
- Visual charts and graphs (using Recharts)
- Export capabilities (PDF, Excel)
- Performance tracking and trends
- Violation reports and statistics

### 👥 Student Management
- Add and manage student profiles
- Enrollment number tracking
- Course and branch information
- Profile photo and resume management
- Bulk student operations

### 🎯 Candidate Management
- View all candidates who took tests
- Filter and search candidates
- Detailed candidate profiles
- Performance comparison

---

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 6.3.5** - Build tool and dev server
- **React Router DOM 6.26.0** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Additional Libraries
- **Recharts 2.15.4** - Data visualization
- **jsPDF 3.0.1** - PDF generation
- **xlsx 0.18.5** - Excel file handling
- **dotenv 16.4.5** - Environment variable management

### Development Tools
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **Git**
- **Supabase Account** (for backend services)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Final Project of Sem 7/project"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Note down your project URL and anon key
3. (Optional) Get your service role key for database seeding

### 4. Configure Environment Variables

Create a `.env` file in the `project` directory:

```env
# Required: Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For database seeding
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ Important**: The following environment variables are **REQUIRED** for the application to work:

- **`VITE_SUPABASE_URL`**: Your Supabase project URL
  - Find it in your Supabase project settings under "API" → "Project URL"
  - Format: `https://xxxxxxxxxxxxx.supabase.co`

- **`VITE_SUPABASE_ANON_KEY`**: Your Supabase anonymous/public key
  - Find it in your Supabase project settings under "API" → "Project API keys" → "anon public"
  - This key is safe to expose in client-side code

**How to get your Supabase credentials:**
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. Paste them into your `.env` file

### 5. Set Up Database Schema

You'll need to create the following tables in your Supabase database:

- `users` - User authentication and profiles
- `students` - Student information
- `tests` - Test/Exam definitions
- `questions` - Question bank
- `exam_sessions` - Active exam sessions
- `exam_results` - Completed exam results
- `proctoring_violations` - Proctoring violation logs
- `organizations` - Company/Institution data

Refer to your database schema documentation or use the seed script structure as a reference.

### 6. Seed Database (Optional)

To populate the database with sample data:

```bash
npm run seed
```

**Note**: Ensure you have set `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file for the seed script to work properly.

---

## ⚙️ Configuration

### Environment Variables

The application requires the following environment variables to be set in a `.env` file:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ **Yes** | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ **Yes** | Your Supabase anonymous/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ No | Service role key (only needed for database seeding) |

**Example `.env` file:**
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Optional
```

**Note**: Make sure your `.env` file is in the `project` directory (same level as `package.json`). Never commit your `.env` file to version control!

### Vite Configuration

The project uses Vite with React plugin. Configuration can be found in `vite.config.ts`.

### Tailwind CSS

Tailwind is configured in `tailwind.config.js`. Customize colors, spacing, and other design tokens here.

### ESLint

ESLint configuration is in `eslint.config.js`. It includes React hooks and TypeScript rules.

---

## 💻 Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality:

```bash
npm run lint
```

---

## 📁 Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── Analytics.tsx    # Analytics dashboard
│   │   ├── Auth/            # Authentication components
│   │   │   └── LoginForm.tsx
│   │   ├── Dashboard/       # Role-specific dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── RecruiterDashboard.tsx
│   │   │   └── StudentDashboard.tsx
│   │   ├── Exam/            # Exam interface components
│   │   │   ├── ExamInterface.tsx
│   │   │   └── ExamResults.tsx
│   │   ├── Layout/          # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── Results/         # Results components
│   │   │   └── Results.tsx
│   │   ├── Settings.tsx     # Settings page
│   │   ├── Students/        # Student management
│   │   │   ├── AddStudentModal.tsx
│   │   │   ├── Candidates.tsx
│   │   │   └── StudentManagement.tsx
│   │   └── Test/           # Test management
│   │       ├── AllTests.tsx
│   │       ├── AvailableTests.tsx
│   │       ├── CreateTest.tsx
│   │       ├── EditTestModal.tsx
│   │       ├── MyResults.tsx
│   │       └── MyTests.tsx
│   ├── context/             # React Context providers
│   │   ├── AppContext.tsx   # Global app state
│   │   └── AuthContext.tsx  # Authentication state
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   ├── supabaseClient.ts    # Supabase client configuration
│   └── vite-env.d.ts        # Vite type definitions
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
└── seed.js                  # Database seeding script
```

---

## 👥 User Roles

### 🔴 Admin
- **Dashboard**: Platform-wide statistics and overview
- **Student Management**: Add, edit, and manage all students
- **Test Management**: View all tests across the platform
- **Analytics**: Comprehensive platform analytics
- **Settings**: System-wide configuration

### 🟡 Recruiter
- **Dashboard**: Personal dashboard with test statistics
- **Create Test**: Build custom tests with various question types
- **My Tests**: Manage created tests
- **Candidates**: View and manage candidates who took tests
- **Results**: Detailed results and performance analysis

### 🟢 Student
- **Dashboard**: Personal dashboard with available tests
- **Available Tests**: Browse and select tests to take
- **Take Exam**: Proctored exam interface
- **My Results**: View personal exam results and history

---

## 🔌 API & Database

### Supabase Integration

The application uses Supabase for:
- **Authentication**: User login and session management
- **Database**: PostgreSQL database with Row Level Security
- **Real-time**: Real-time updates for exam sessions
- **Storage**: File storage for resumes and profile photos

### Database Tables

Key tables include:
- `users` - User accounts and authentication
- `students` - Student profiles and information
- `tests` - Test definitions and configurations
- `questions` - Question bank
- `exam_sessions` - Active examination sessions
- `exam_results` - Completed exam results
- `proctoring_violations` - Proctoring event logs

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |

---

## 🎨 Features in Detail

### Proctoring System

The AI proctoring system monitors:
- **Face Detection**: Ensures student is present and focused
- **Tab Switching**: Detects when students switch browser tabs
- **Voice Detection**: Monitors for unauthorized audio
- **Multiple Faces**: Detects presence of multiple people
- **Movement Analysis**: Tracks suspicious movements

All violations are logged with timestamps, severity levels, and descriptions.

### Question Types

- **MCQ (Multiple Choice Questions)**: Single or multiple correct answers
- **Subjective Questions**: Text-based answers
- **Coding Questions**: Programming challenges

### Test Configuration

Tests can be configured with:
- Custom duration
- Question shuffling
- Negative marking
- Proctoring level (strict, moderate, off)
- Tab switch restrictions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is part of a Semester 7 Final Project. All rights reserved.

---

## 👨‍💻 Author

**Semester 7 Final Project**

---

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- React team for the amazing framework
- All open-source contributors whose libraries made this project possible

---

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Supabase**

⭐ Star this repo if you find it helpful!

</div>

