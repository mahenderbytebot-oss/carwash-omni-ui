import React, { useState } from 'react';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput,
  IonList,
  IonNote
} from '@ionic/react';
import type { CreateTeamMemberRequest } from '../../services/teamService';

interface CreateTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTeamMemberRequest) => Promise<void>;
}

const CreateTeamMemberModal: React.FC<CreateTeamMemberModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateTeamMemberRequest>({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof CreateTeamMemberRequest, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      setFormData({ name: '', email: '', phone: '', password: '' }); // Reset form
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="pl-4">Add Team Member</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Name *</IonLabel>
            <IonInput 
              value={formData.name} 
              onIonChange={e => handleChange('name', e.detail.value!)} 
              placeholder="John Doe"
              required
            />
          </IonItem>
          
          <IonItem>
            <IonLabel position="stacked">Phone *</IonLabel>
            <IonInput 
              type="tel"
              value={formData.phone} 
              onIonChange={e => handleChange('phone', e.detail.value!)} 
              placeholder="1234567890"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput 
              type="email"
              value={formData.email} 
              onIonChange={e => handleChange('email', e.detail.value!)} 
              placeholder="john@example.com"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Password *</IonLabel>
            <IonInput 
              type="password"
              value={formData.password} 
              onIonChange={e => handleChange('password', e.detail.value!)} 
              placeholder="******"
              minlength={6}
              required
            />
            <IonNote slot="helper">Min 6 characters</IonNote>
          </IonItem>

          {error && (
            <div className="text-destructive text-sm mt-2 px-4">
              {error}
            </div>
          )}

          <div className="mt-6 px-2">
            <IonButton expand="block" onClick={handleSave} disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </IonButton>
          </div>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default CreateTeamMemberModal;
