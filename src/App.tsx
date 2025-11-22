import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Analytics from './components/Analytics';
import LoginForm from './components/Auth/LoginForm';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import RecruiterDashboard from './components/Dashboard/RecruiterDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import ExamInterface from './components/Exam/ExamInterface';
import ExamResults from './components/Exam/ExamResults';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Results from './components/Results/Results';
import Settings from './components/Settings';
import Candidates from './components/Students/Candidates';
import StudentManagement from './components/Students/StudentManagement';
import AllTests from './components/Test/AllTests';
import AvailableTests from './components/Test/AvailableTests';
import CreateTest from './components/Test/CreateTest';
import MyResults from './components/Test/MyResults';
import MyTests from './components/Test/MyTests';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'recruiter':
        return <RecruiterDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={getDashboardComponent()} />
            
            {/* Admin Routes */}
            {user.role === 'admin' && (
              <>
                <Route path="/students" element={<StudentManagement />} />
                <Route path="/tests" element={<AllTests />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}
            
            {/* Recruiter Routes */}
            {user.role === 'recruiter' && (
              <>
                <Route path="/create-test" element={<CreateTest />} />
                <Route path="/my-tests" element={<MyTests />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/results" element={<Results />} />
              </>
            )}
            
            {/* Student Routes */}
            {user.role === 'student' && (
              <>
                <Route path="/available-tests" element={<AvailableTests />} />
                <Route path="/my-results" element={<MyResults />} />
              </>
            )}
            
            {/* Common Routes */}
            <Route path="/exam/:testId" element={<ExamInterface />} />
            <Route path="/exam-completed" element={
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Exam Completed Successfully!</h2>
                <p className="text-gray-600">Your responses have been submitted and are being processed.</p>
              </div>
            } />
            <Route path="/exam-results" element={<ExamResults />} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;