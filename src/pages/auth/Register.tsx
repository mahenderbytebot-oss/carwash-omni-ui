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
import { personAddOutline, callOutline, lockClosedOutline, mailOutline, locationOutline } from 'ionicons/icons';
import * as authService from '../../services/authService';
// Removed custom component imports

const Register: React.FC = () => {
  const { login, setLoading, setError, clearError, isLoading, error } = useAuthStore();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    confirmPin: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Mobile number must be 10 digits';
      isValid = false;
    }

    if (!formData.pin.trim()) {
      errors.pin = 'PIN is required';
      isValid = false;
    } else if (!/^\d{4,6}$/.test(formData.pin)) {
      errors.pin = 'PIN must be 4-6 digits';
      isValid = false;
    }

    if (formData.pin !== formData.confirmPin) {
      errors.confirmPin = 'PINs do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Map form data to RegisterRequest
      const registerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.pin, // Using pin as password
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      const response = await authService.registerCustomer(registerData);
      
      if (response.success && response.user && response.token) {
        login(response.user, response.token);
        history.push('/customer/dashboard'); // Redirect to customer dashboard
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{ '--background': 'var(--color-secondary)' }}>
        <div className="flex min-h-full items-center justify-center p-4">
          <IonCard className="w-full max-w-lg shadow-lg border-0 bg-white/95 backdrop-blur-sm dark:bg-zinc-900/90 my-8 m-0">
            <IonCardHeader className="space-y-1 text-center pb-6">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <IonIcon icon={personAddOutline} className="text-primary text-2xl" />
              </div>
              <IonCardTitle className="ion-text-2xl ion-font-bold tracking-tight">Create Account</IonCardTitle>
              <IonCardSubtitle className="text-muted-foreground">
                Enter your details to register as a Customer
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <IonItem className={`${formErrors.name ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                        <IonInput
                            label="Full Name"
                            labelPlacement="floating"
                            placeholder="John Doe"
                            value={formData.name}
                            onIonInput={handleChange}
                            id="name"
                        />
                      </IonItem>
                      {formErrors.name && <IonText color="danger" className="text-xs mt-1 pl-1">{formErrors.name}</IonText>}
                    </div>

                    <div className="space-y-2">
                      <IonItem className={`${formErrors.email ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                         <IonIcon slot="start" icon={mailOutline} className="text-muted-foreground" />
                         <IonInput
                             label="Email"
                             labelPlacement="floating"
                             type="email"
                             placeholder="john@example.com"
                             value={formData.email}
                             onIonInput={handleChange}
                             id="email"
                         />
                      </IonItem>
                      {formErrors.email && <IonText color="danger" className="text-xs mt-1 pl-1">{formErrors.email}</IonText>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <IonItem className={`${formErrors.phone ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                        <IonIcon slot="start" icon={callOutline} className="text-muted-foreground" />
                        <IonInput
                            label="Mobile Number"
                            labelPlacement="floating"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onIonInput={handleChange}
                            id="phone"
                            maxlength={10}
                        />
                      </IonItem>
                      {formErrors.phone && <IonText color="danger" className="text-xs mt-1 pl-1">{formErrors.phone}</IonText>}
                    </div>
                </div>

                {/* Security */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <IonItem className={`${formErrors.pin ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                         <IonIcon slot="start" icon={lockClosedOutline} className="text-muted-foreground" />
                         <IonInput
                             label="PIN (Password)"
                             labelPlacement="floating"
                             type="password"
                             placeholder="4-6 digits"
                             value={formData.pin}
                             onIonInput={handleChange}
                             id="pin"
                             maxlength={6}
                         />
                      </IonItem>
                      {formErrors.pin && <IonText color="danger" className="text-xs mt-1 pl-1">{formErrors.pin}</IonText>}
                    </div>

                    <div className="space-y-2">
                      <IonItem className={`${formErrors.confirmPin ? 'ion-invalid' : ''} border rounded-md`} lines="none">
                        <IonIcon slot="start" icon={lockClosedOutline} className="text-muted-foreground" />
                        <IonInput
                             label="Confirm PIN"
                             labelPlacement="floating"
                             type="password"
                             placeholder="Re-enter PIN"
                             value={formData.confirmPin}
                             onIonInput={handleChange}
                             id="confirmPin"
                             maxlength={6}
                        />
                      </IonItem>
                      {formErrors.confirmPin && <IonText color="danger" className="text-xs mt-1 pl-1">{formErrors.confirmPin}</IonText>}
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <IonItem lines="none" className="border rounded-md">
                    <IonIcon slot="start" icon={locationOutline} className="text-muted-foreground" />
                    <IonInput
                        label="Address"
                        labelPlacement="floating"
                        placeholder="123 Main St"
                        value={formData.address}
                        onIonInput={handleChange}
                        id="address"
                    />
                  </IonItem>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <IonItem lines="none" className="border rounded-md">
                            <IonInput
                                label="City"
                                labelPlacement="floating"
                                placeholder="City"
                                value={formData.city}
                                onIonInput={handleChange}
                                id="city"
                            />
                        </IonItem>
                    </div>
                    <div className="space-y-1">
                        <IonItem lines="none" className="border rounded-md">
                            <IonInput
                                label="State"
                                labelPlacement="floating"
                                placeholder="State"
                                value={formData.state}
                                onIonInput={handleChange}
                                id="state"
                            />
                        </IonItem>
                    </div>
                    <div className="space-y-1">
                         <IonItem lines="none" className="border rounded-md">
                            <IonInput
                                label="Zip"
                                labelPlacement="floating"
                                placeholder="Zip"
                                value={formData.zipCode}
                                onIonInput={handleChange}
                                id="zipCode"
                            />
                        </IonItem>
                    </div>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
                     <p className="text-sm font-medium text-destructive">{error}</p>
                  </div>
                )}

                <IonButton type="submit" expand="block" className="mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <IonSpinner name="crescent" className="mr-2 h-4 w-4" />
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </IonButton>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="font-medium text-primary hover:underline">
                    Sign In
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

export default Register;
