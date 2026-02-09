import React, { useEffect } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import CustomerDashboard from './customer/Dashboard';
import { useAuthStore } from '../store/authStore';

// Import Ionic styles
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

/**
 * Test page for Customer Dashboard
 * 
 * This page sets up a mock authenticated customer user and displays
 * the Customer dashboard for visual testing and verification.
 */
const TestCustomerDashboard: React.FC = () => {
  const { login } = useAuthStore();

  // Set up mock customer user on mount
  useEffect(() => {
    login({
      id: '3',
      name: 'Alice Johnson',
      mobile: '9876543210',
      role: 'CUSTOMER'
    }, 'dummy-token');
  }, [login]);

  return (
    <IonApp>
      <Router>
        <Route exact path="/">
          <Redirect to="/customer/dashboard" />
        </Route>
        <Route path="/customer/dashboard" component={CustomerDashboard} />
        <Route path="/login">
          <Redirect to="/customer/dashboard" />
        </Route>
      </Router>
    </IonApp>
  );
};

export default TestCustomerDashboard;
