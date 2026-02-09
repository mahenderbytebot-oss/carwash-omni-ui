import React, { useEffect } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { BrowserRouter } from 'react-router-dom';
import CleanerDashboard from './cleaner/Dashboard';
import { useAuthStore } from '../store/authStore';

// Setup Ionic
setupIonicReact();

/**
 * Test page for Cleaner Dashboard
 * 
 * This component sets up a test environment for the modernized Cleaner dashboard.
 * It simulates an authenticated cleaner user and renders the dashboard.
 */
const TestCleanerDashboard: React.FC = () => {
  const { login } = useAuthStore();

  // Set up mock cleaner user on mount
  useEffect(() => {
    login({
      id: 'cleaner-123',
      name: 'Mike Johnson',
      mobile: '8888888888',
      role: 'CLEANER'
    }, 'dummy-token');
  }, [login]);

  return (
    <IonApp>
      <BrowserRouter>
        <CleanerDashboard />
      </BrowserRouter>
    </IonApp>
  );
};

export default TestCleanerDashboard;
