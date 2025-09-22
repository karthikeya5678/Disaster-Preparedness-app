import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './lib/AuthContext';
import ManageDrillsPage from './pages/ManageDrillsPage';

// Import all necessary layouts and pages for the application
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHomePage from './pages/DashboardHomePage';
import CoursesPage from './pages/CoursesPage';
import ProgressPage from './pages/ProgressPage';
import DrillsPage from './pages/DrillsPage';
import ChildProgressPage from './pages/ChildProgressPage';
import ProfilePage from './pages/ProfilePage';
import ModulePage from './pages/ModulePage';
import ManageModulesPage from './pages/ManageModulesPage';
import ManageChildPage from './pages/ManageChildPage';
import GamesPage from './pages/GamesPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import ManageStudentsPage from './pages/ManageStudentsPage'; // Ensure this page is imported

// This component correctly redirects any authenticated user to their main dashboard area.
const HomeRedirect = () => {
  const { currentUser } = useAuth();
  if (!currentUser) { 
    return <Navigate to="/login" />; 
  }
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Routes>
      {/* --- Public Routes (Accessible to everyone) --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<HomeRedirect />} />

      {/* --- Main Dashboard Area (with Persistent Sidebar) --- */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      >
        {/* These are the pages that appear inside the dashboard layout */}
        <Route index element={<DashboardHomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="drills" element={<DrillsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="child-progress" element={<ChildProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="manage-child" element={<ManageChildPage />} />
        <Route path="emergency-contacts" element={<EmergencyContactsPage />} />
        <Route path="manage-drills" element={<ManageDrillsPage />} />

        {/* --- THIS IS THE CRITICAL FIX --- */}
        {/* The route for the teacher's management page is now correctly defined here. */}
        <Route path="manage-students" element={<ManageStudentsPage />} />
      </Route>

      {/* --- Full-Screen "Focus" Pages (without the main dashboard sidebar) --- */}
      <Route 
        path="/modules/:moduleId" 
        element={<ProtectedRoute><ModulePage /></ProtectedRoute>} 
      />
       <Route 
        path="/manage-modules" 
        element={<ProtectedRoute><ManageModulesPage /></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;