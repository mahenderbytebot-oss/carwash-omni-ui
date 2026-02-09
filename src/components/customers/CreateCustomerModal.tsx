import React, { useState } from 'react';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonToast
} from '@ionic/react';
import { createCustomer, type CreateCustomerRequest } from '../../services/customerService';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: '',
    mobile: '',
    email: '',
    pin: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof CreateCustomerRequest, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.mobile || !formData.pin) {
      setError('Name, Mobile, and PIN are required.');
      setToastMessage('Name, Mobile, and PIN are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createCustomer(formData);
      setToastMessage('Customer created successfully!');
      
      // Delay closing to show toast
      setTimeout(() => {
        setFormData({
          name: '', mobile: '', email: '', pin: '', address: '', city: '', state: '', zipCode: ''
        });
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
      setToastMessage(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="pl-4">Add New Customer</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <IonList lines="full">
            <IonItem>
              <IonLabel position="stacked">Name *</IonLabel>
              <IonInput 
                value={formData.name} 
                onIonChange={e => handleChange('name', e.detail.value!)} 
                placeholder="Ex. John Doe"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Mobile *</IonLabel>
              <IonInput 
                value={formData.mobile} 
                onIonChange={e => handleChange('mobile', e.detail.value!)} 
                type="tel"
                placeholder="Ex. 555-0123"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">PIN (Password) *</IonLabel>
              <IonInput 
                value={formData.pin} 
                onIonChange={e => handleChange('pin', e.detail.value!)} 
                type="password"
                placeholder="Ex. 1234"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput 
                value={formData.email} 
                onIonChange={e => handleChange('email', e.detail.value!)} 
                type="email"
                placeholder="Ex. john@example.com"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Address</IonLabel>
              <IonInput 
                value={formData.address} 
                onIonChange={e => handleChange('address', e.detail.value!)} 
                placeholder="Ex. 123 Main St"
              />
            </IonItem>
            <div className="flex gap-2">
              <IonItem className="flex-1">
                <IonLabel position="stacked">City</IonLabel>
                <IonInput 
                  value={formData.city} 
                  onIonChange={e => handleChange('city', e.detail.value!)} 
                />
              </IonItem>
              <IonItem className="flex-1">
                <IonLabel position="stacked">State</IonLabel>
                <IonInput 
                  value={formData.state} 
                  onIonChange={e => handleChange('state', e.detail.value!)} 
                />
              </IonItem>
            </div>
            <IonItem>
              <IonLabel position="stacked">Zip Code</IonLabel>
              <IonInput 
                value={formData.zipCode} 
                onIonChange={e => handleChange('zipCode', e.detail.value!)} 
                inputMode="numeric"
              />
            </IonItem>
          </IonList>

          {error && (
            <div className="text-destructive text-sm mt-4 px-4">
              {error}
            </div>
          )}

      <div className="mt-6 px-4">
            <IonButton expand="block" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Customer'}
            </IonButton>
          </div>
        </form>
      </IonContent>
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setToastMessage('')}
        color={error ? 'danger' : 'success'}
      />
    </IonModal>
  );
};

export default CreateCustomerModal;
