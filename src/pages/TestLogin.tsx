import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

/**
 * Test page for Login component
 * 
 * This page provides a way to test the Login component with the new modern design.
 * It includes instructions for testing different user roles.
 */
const TestLogin: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login Component Test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Login Component - Modern Design Test</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Task 7.1 Implementation Checklist</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>✅ Gradient background using GradientBackground component</li>
              <li>✅ Glassmorphism effect on form container</li>
              <li>✅ Framer-motion animations (fade-in, slide-up)</li>
              <li>✅ Icons for email and password fields</li>
              <li>✅ Loading state with spinner</li>
              <li>✅ Mobile-first responsive design</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Test Credentials</h2>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold">Admin User</h3>
                <p>Email: admin@example.com</p>
                <p>Password: password123</p>
                <p className="text-sm text-gray-600">Expected: Redirect to /admin/dashboard</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold">Cleaner User</h3>
                <p>Email: cleaner@example.com</p>
                <p>Password: password123</p>
                <p className="text-sm text-gray-600">Expected: Redirect to /cleaner/dashboard</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold">Customer User</h3>
                <p>Email: customer@example.com</p>
                <p>Password: password123</p>
                <p className="text-sm text-gray-600">Expected: Redirect to /customer/dashboard</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Visual Features to Verify</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Animated gradient background with moving blobs</li>
              <li>Glassmorphism effect (frosted glass) on login form</li>
              <li>Smooth fade-in and slide-up animation on form load</li>
              <li>Person icon in email field</li>
              <li>Lock icon in password field</li>
              <li>Spinner appears in button during loading</li>
              <li>Form is centered and responsive on all screen sizes</li>
              <li>Error messages display in red with proper styling</li>
            </ul>
          </div>

          <IonButton 
            expand="block" 
            onClick={() => history.push('/login')}
            className="mt-6"
          >
            Go to Login Page
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TestLogin;
