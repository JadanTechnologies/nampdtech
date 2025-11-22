
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  CreditCard, 
  UserCheck, 
  ShieldCheck,
  Award,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const isActive = (path: string) => location.pathname === path ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  const NavItem = ({ to, icon: Icon, label }: any) => (
    <div 
      onClick={() => {
        navigate(to);
        setMobileOpen(false);
      }}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${isActive(to)}`}
    >
      <Icon className="mr-3 h-6 w-6 flex-shrink0" />
      {label}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-900 text-white z-50 flex items-center justify-between p-4 shadow-md">
        <span className="font-bold text-lg tracking-wider">NAMPDTech</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex md:flex-col w-64 bg-gray-900 pt-20 md:pt-5 transition-transform duration-300 ease-in-out z-40`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gray-900 hidden md:flex">
          <h1 className="text-xl font-bold text-white tracking-wider">NAMPDTech</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            
            {/* Member Links */}
            {user.role === UserRole.MEMBER && (
              <>
                <NavItem to="/profile" icon={UserCheck} label="My Profile" />
                <NavItem to="/payments" icon={CreditCard} label="Payments" />
                <NavItem to="/digital-id" icon={ShieldCheck} label="Digital ID" />
                {/* Only show certificate if Active */}
                <NavItem to="/certificate" icon={Award} label="Certificate" />
              </>
            )}

            {/* Admin Links */}
            {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.STATE_ADMIN || user.role === UserRole.CHAIRMAN) && (
              <>
                <NavItem to="/approvals" icon={FileCheck} label="Approvals" />
                <NavItem to="/members" icon={Users} label="Members" />
                <NavItem to="/payments" icon={CreditCard} label="Finance" />
              </>
            )}
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-gray-800 p-4">
          <div 
            onClick={logout}
            className="flex-shrink-0 w-full group block cursor-pointer"
          >
            <div className="flex items-center">
              <div>
                <LogOut className="inline-block h-9 w-9 rounded-full text-gray-400 p-1 bg-gray-900" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
