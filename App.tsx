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
const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
      }
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            
            {/* Protected Routes */}
            <PrivateRoute path="/approvals" component={Approvals} />
            <PrivateRoute path="/payments" component={Payments} />
            <PrivateRoute path="/members" component={Members} />
            <PrivateRoute path="/certificate" component={Certificate} />
            <PrivateRoute path="/digital-id" component={DigitalID} />
            <PrivateRoute path="/profile" component={Profile} />
            
            {/* Dashboard - needs exact to not match others if placed above, but in switch order matters */}
            <PrivateRoute path="/" exact component={Dashboard} />
            
            {/* Fallback */}
            <Redirect to="/" />
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;