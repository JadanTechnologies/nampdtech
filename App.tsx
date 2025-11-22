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

// Protected Route Wrapper
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Redirect to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            <Route path="/login"><Login /></Route>
            <Route path="/register"><Register /></Route>
            
            {/* Protected Routes */}
            <Route path="/approvals"><PrivateRoute><Layout><Approvals /></Layout></PrivateRoute></Route>
            <Route path="/payments"><PrivateRoute><Layout><Payments /></Layout></PrivateRoute></Route>
            <Route path="/members"><PrivateRoute><Layout><Members /></Layout></PrivateRoute></Route>
            <Route path="/certificate"><PrivateRoute><Layout><Certificate /></Layout></PrivateRoute></Route>
            <Route path="/digital-id"><PrivateRoute><Layout><DigitalID /></Layout></PrivateRoute></Route>
            <Route path="/profile"><PrivateRoute><Layout><Profile /></Layout></PrivateRoute></Route>
            
            {/* Dashboard must be exact or last to avoid catching everything */}
            <Route path="/" exact><PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute></Route>
            
            {/* Fallback */}
            <Route path="*"><Redirect to="/" /></Route>
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;