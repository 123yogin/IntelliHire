import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  BookOpen,
  ClipboardList,
  Award
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/students', icon: Users, label: 'Students' },
        { to: '/tests', icon: FileText, label: 'Tests' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/settings', icon: Settings, label: 'Settings' }
      ];
    } else if (user?.role === 'recruiter') {
      return [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/create-test', icon: FileText, label: 'Create Test' },
        { to: '/my-tests', icon: ClipboardList, label: 'My Tests' },
        { to: '/candidates', icon: Users, label: 'Candidates' },
        { to: '/results', icon: Award, label: 'Results' }
      ];
    } else {
      return [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/available-tests', icon: BookOpen, label: 'Available Tests' },
        { to: '/my-results', icon: Award, label: 'My Results' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;