import { useState } from 'react';
import { Users, Calendar, FileText, DollarSign, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Pages
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signup';
import ForgotPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-password';
import AuthCallbackPage from './pages/auth/callback';

// Main App Components
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import Appointments from './components/Appointments';
import SessionNotes from './components/SessionNotes';
import Payments from './components/Payments';
import Analytics from './components/Analytics';
import ServicesManagement from './components/ServicesManagement';
import MainLayout from './components/layout/MainLayout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Main App Content with Routing
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ClientManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ServicesManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Appointments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SessionNotes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Payments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Analytics />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'sessions', label: 'Session Notes', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'appointments':
        return <Appointments />;
      case 'sessions':
        return <SessionNotes />;
      case 'payments':
        return <Payments />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
          <h1 className='text-xl font-bold text-teal-800'>WellnessCRM</h1>
          <div className='flex items-center space-x-2'>
            <button
              onClick={handleSignOut}
              className='hidden lg:flex items-center px-3 py-1 text-sm text-red-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
            >
              <LogOut size={16} className='mr-1' />
              Sign Out
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className='lg:hidden p-2 rounded-md hover:bg-gray-100'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className='mt-6'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className='mr-3 text-violet-600' />
                {item.label}
              </button>
            );
          })}

          <div className='lg:hidden mt-6 px-6'>
            <button
              onClick={handleSignOut}
              className='w-full flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors'
            >
              <LogOut size={20} className='mr-3' />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 lg:hidden'>
          <div className='flex items-center justify-between h-16 px-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='p-2 rounded-md hover:bg-gray-100'
            >
              <Menu size={24} />
            </button>
            <h1 className='text-lg font-semibold text-violet-800'>WellnessCRM</h1>
            <button onClick={handleSignOut} className='p-2 rounded-md hover:bg-gray-100'>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto'>
          <div className='container mx-auto px-4 py-8'>{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
