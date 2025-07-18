import React, { useState } from 'react';
import { Users, Calendar, FileText, DollarSign, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/clients' },
    { id: 'services', label: 'Services', icon: FileText, path: '/services' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/appointments' },
    { id: 'sessions', label: 'Session Notes', icon: FileText, path: '/sessions' },
    { id: 'payments', label: 'Payments', icon: DollarSign, path: '/payments' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
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
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  isActive
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
          <div className='container mx-auto px-4 py-8'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;