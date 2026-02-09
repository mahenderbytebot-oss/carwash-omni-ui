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
import { createCleaner, type CreateCleanerRequest } from '../../services/cleanerService';
import { useAuthStore } from '../../store/authStore';

interface CreateCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCleanerModal: React.FC<CreateCleanerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<Omit<CreateCleanerRequest, 'serviceProviderId'>>({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof CreateCleanerRequest, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setError('Name, Phone, and Password are required.');
      setToastMessage('Name, Phone, and Password are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createCleaner({
        ...formData,
        serviceProviderId: user?.serviceProviderId || 0
      });
      setToastMessage('Partner created successfully!');
      
      setTimeout(() => {
        setFormData({
          name: '', phone: '', email: '', password: '', address: '', city: '', state: '', zipCode: ''
        });
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create cleaner');
      setToastMessage(err.message || 'Failed to create cleaner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="pl-4">Add New Partner</IonTitle>
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
              <IonLabel position="stacked">Phone *</IonLabel>
              <IonInput 
                value={formData.phone} 
                onIonChange={e => handleChange('phone', e.detail.value!)} 
                type="tel"
                placeholder="Ex. 555-0123"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password *</IonLabel>
              <IonInput 
                value={formData.password} 
                onIonChange={e => handleChange('password', e.detail.value!)} 
                type="password"
                placeholder="Min 6 characters"
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
              {loading ? 'Creating...' : 'Create Partner'}
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

export default CreateCleanerModal;
