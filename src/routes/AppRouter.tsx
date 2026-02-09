import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Unauthorized from '../pages/Unauthorized';
import TestCheckpoint from '../pages/TestCheckpoint';
import TestLogin from '../pages/TestLogin';
import TestAdminDashboard from '../pages/TestAdminDashboard';
import { RoleRoute } from '../components/shared/RoleRoute';
import AdminLayout from '../layouts/AdminLayout';
import CleanerLayout from '../layouts/CleanerLayout';
import CustomerLayout from '../layouts/CustomerLayout';

const AppRouter: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/unauthorized" component={Unauthorized} />
      <Route exact path="/test-checkpoint" component={TestCheckpoint} />
      <Route exact path="/test-login" component={TestLogin} />
      <Route exact path="/test-admin-dashboard" component={TestAdminDashboard} />
      
      <RoleRoute path="/admin" roles={['SERVICE_PROVIDER', 'ADMIN']} component={AdminLayout} />
      {/* <Route path="/admin" component={AdminLayout} /> */}
      
      <RoleRoute path="/cleaner" roles={['CLEANER']} component={CleanerLayout} />
      
      <RoleRoute path="/customer" roles={['CUSTOMER']} component={CustomerLayout} />

      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </IonRouterOutlet>
  );
};

export default AppRouter;
