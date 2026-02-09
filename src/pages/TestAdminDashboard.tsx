import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Test page for Admin Dashboard
 * 
 * This page allows testing the modernized Admin dashboard by:
 * 1. Setting up a mock admin user in the auth store
 * 2. Navigating to the admin dashboard
 */
const TestAdminDashboard: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();

  const handleTestAdminDashboard = () => {
    // Set up mock admin user
    const mockAdmin = {
      id: 'admin-1',
      name: 'John Administrator',
      mobile: '9999999999',
      role: 'ADMIN' as const
    };
    
    login(mockAdmin, "dummy-token");
    
    // Navigate to admin dashboard
    history.push('/admin/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-full gap-4">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard Test</h2>
          <p className="text-center mb-6 max-w-md">
            Click the button below to test the modernized Admin dashboard with:
          </p>
          <ul className="list-disc list-inside mb-6 text-left">
            <li>GradientBackground component</li>
            <li>DashboardHeader with user info and logout</li>
            <li>StatCard components for key metrics</li>
            <li>GlassCard components for content sections</li>
            <li>Responsive grid layout (3-col desktop, 2-col tablet, 1-col mobile)</li>
            <li>Framer-motion animations</li>
          </ul>
          <IonButton 
            expand="block" 
            onClick={handleTestAdminDashboard}
            className="w-64"
          >
            Test Admin Dashboard
          </IonButton>
          <IonButton 
            expand="block" 
            fill="outline"
            onClick={() => history.push('/')}
            className="w-64"
          >
            Back to Home
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TestAdminDashboard;
