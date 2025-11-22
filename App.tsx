import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Approvals } from './pages/Approvals';
import { Payments } from './pages/Payments';
import { Members } from './pages/Members';
import { Certificate } from './pages/Certificate';
import { DigitalID } from './pages/DigitalID';
import { Profile } from './pages/Profile';

const { BrowserRouter: Router, Routes, Route, Navigate } = ReactRouterDOM;

// Protected Route Wrapper
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/approvals" element={<PrivateRoute><Layout><Approvals /></Layout></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Layout><Payments /></Layout></PrivateRoute>} />
            <Route path="/members" element={<PrivateRoute><Layout><Members /></Layout></PrivateRoute>} />
            <Route path="/certificate" element={<PrivateRoute><Layout><Certificate /></Layout></PrivateRoute>} />
            <Route path="/digital-id" element={<PrivateRoute><Layout><DigitalID /></Layout></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;