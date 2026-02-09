import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonInput,
  IonItem,
  IonText
} from '@ionic/react';
import { useAuthStore } from '../../store/authStore';
import { useHistory } from 'react-router-dom';
import { callOutline, keypadOutline } from 'ionicons/icons';
import * as authService from '../../services/authService';
// Removed custom component imports

import logo from '../../assets/logo.svg';

const Login: React.FC = () => {
  const { login, setLoading, setError, clearError, isLoading, error } = useAuthStore();
  const history = useHistory();
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [pinError, setPinError] = useState('');

  const validateMobile = (value: string): boolean => {
    if (!value) {
      setMobileError('Mobile number is required');
      return false;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(value)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return false;
    }
    setMobileError('');
    return true;
  };

  const validatePin = (value: string): boolean => {
    if (!value) {
      setPinError('PIN is required');
      return false;
    }
    const pinRegex = /^[0-9]{4,6}$/;
    if (!pinRegex.test(value)) {
      setPinError('PIN must be 4-6 digits');
      return false;
    }
    setPinError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validate inputs
    const isMobileValid = validateMobile(mobile);
    const isPinValid = validatePin(pin);
    
    if (!isMobileValid || !isPinValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.login({ mobile, pin });
      
      if (response.success && response.user && response.token) {
        login(response.user, response.token);
        console.log('Login successful, role:', response.user.role);
        
        // Redirect based on user role
        if (response.user.role === 'SERVICE_PROVIDER') {
          console.log('Redirecting to /admin/dashboard');
          history.push('/admin/dashboard');
        } else if (response.user.role === 'CLEANER') {
          history.push('/cleaner/dashboard');
        } else {
          history.push('/customer/dashboard');
        }
      } else {
        setError(response.error || 'Login failed. Please try again.');
        setPin(''); // Clear PIN on error
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setPin(''); // Clear PIN on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{ '--background': 'var(--color-secondary)' }}>
        <div className="flex min-h-full items-center justify-center p-4">
          <IonCard className="w-full max-w-md shadow-lg border-0 bg-white/95 backdrop-blur-sm dark:bg-zinc-900/90 m-0">
            <IonCardHeader className="space-y-1 text-center pb-6">
              <div className="mx-auto w-24 h-24 mb-4">
                <img src={logo} alt="Glossly Logo" className="w-full h-full object-contain" />
              </div>
              <IonCardTitle className="ion-text-2xl ion-font-bold tracking-tight">Welcome to Glossly</IonCardTitle>
              <IonCardSubtitle className="text-muted-foreground">
                Enter your mobile number and PIN to sign in
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <IonItem className={`${mobileError ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                    <IonIcon slot="start" icon={callOutline} className="text-muted-foreground mr-3" />
                    <IonInput
                      label="Mobile Number"
                      labelPlacement="floating"
                      type="tel"
                      placeholder="9876543210"
                      value={mobile}
                      onIonInput={(e: CustomEvent) => {
                        const val = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10);
                        setMobile(val);
                        if (mobileError) validateMobile(val);
                      }}
                      onIonBlur={(e) => validateMobile((e.target as any).value)}
                      disabled={isLoading}
                      maxlength={10}
                    />
                  </IonItem>
                  {mobileError && (
                    <IonText color="danger" className="text-xs font-medium mt-1 pl-1">{mobileError}</IonText>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    {/* Label handled by IonInput floating label, or keep explicit if preferred. Using floating label above. */}
                    {/* keeping "Forgot PIN" link separate */}
                  </div>
                  <div className="flex justify-end">
                    <a href="#" className="text-xs font-medium text-primary hover:underline mb-1">
                        Forgot PIN?
                    </a>
                  </div>
                  <IonItem className={`${pinError ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                    <IonIcon slot="start" icon={keypadOutline} className="text-muted-foreground mr-3" />
                    <IonInput 
                      label="PIN"
                      labelPlacement="floating"
                      type="password" 
                      placeholder="Enter 4-6 digit PIN"
                      value={pin}
                      inputmode="numeric"
                      onIonInput={(e: CustomEvent) => {
                        const val = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6);
                        setPin(val);
                        if (pinError) validatePin(val);
                      }}
                      onIonBlur={(e) => validatePin((e.target as any).value)}
                      disabled={isLoading}
                      maxlength={6}
                    />
                  </IonItem>
                  {pinError && (
                    <IonText color="danger" className="text-xs font-medium mt-1 pl-1">{pinError}</IonText>
                  )}
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
                     <div className="text-destructive mt-0.5">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                     </div>
                     <p className="text-sm font-medium text-destructive">{error}</p>
                  </div>
                )}

                <IonButton type="submit" expand="block" className="mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <IonSpinner name="crescent" className="mr-2 h-4 w-4" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </IonButton>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <a href="/register" className="font-medium text-primary hover:underline">
                    Register
                  </a>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
