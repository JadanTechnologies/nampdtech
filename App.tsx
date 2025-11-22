import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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

// Protected Route Wrapper for v5
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            
            {/* Protected Routes */}
            <Route path="/approvals">
              <ProtectedRoute><Approvals /></ProtectedRoute>
            </Route>
            <Route path="/payments">
              <ProtectedRoute><Payments /></ProtectedRoute>
            </Route>
            <Route path="/members">
              <ProtectedRoute><Members /></ProtectedRoute>
            </Route>
            <Route path="/certificate">
              <ProtectedRoute><Certificate /></ProtectedRoute>
            </Route>
            <Route path="/digital-id">
              <ProtectedRoute><DigitalID /></ProtectedRoute>
            </Route>
            <Route path="/profile">
              <ProtectedRoute><Profile /></ProtectedRoute>
            </Route>
            
            {/* Dashboard - Must be exact to avoid catching sub-routes */}
            <Route exact path="/">
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            </Route>
            
            {/* Fallback */}
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;