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
  IonTextarea,
  IonToggle
} from '@ionic/react';
import { createPlan, type SubscriptionPlanRequest } from '../../services/subscriptionService';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SubscriptionPlanRequest>({
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    washesPerWeek: 1,
    active: true
  });

  const handleChange = (key: keyof SubscriptionPlanRequest, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.price < 0 || formData.durationDays < 1) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createPlan(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        durationDays: 30,
        washesPerWeek: 1,
        active: true
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create New Plan</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 max-w-md mx-auto">
          
          <div className="space-y-4">
            <IonItem>
              <IonLabel position="stacked">Plan Name *</IonLabel>
              <IonInput 
                value={formData.name} 
                onIonChange={e => handleChange('name', e.detail.value!)} 
                placeholder="e.g. Premium Monthly"
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea 
                value={formData.description} 
                onIonChange={e => handleChange('description', e.detail.value!)} 
                placeholder="Describe what's included..."
                rows={3}
              />
            </IonItem>

            <div className="grid grid-cols-2 gap-4">
              <IonItem>
                <IonLabel position="stacked">Price (₹) *</IonLabel>
                <IonInput 
                  type="number" 
                  value={formData.price} 
                  onIonChange={e => handleChange('price', parseFloat(e.detail.value!))} 
                  min="0"
                  step="0.01"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Duration (Days) *</IonLabel>
                <IonInput 
                  type="number" 
                  value={formData.durationDays} 
                  onIonChange={e => handleChange('durationDays', parseInt(e.detail.value!, 10))} 
                  min="1"
                  required
                />
              </IonItem>
            </div>

            <IonItem>
              <IonLabel position="stacked">Washes Per Week *</IonLabel>
              <IonInput 
                type="number" 
                value={formData.washesPerWeek} 
                onIonChange={e => handleChange('washesPerWeek', parseInt(e.detail.value!, 10))} 
                min="1"
                required
              />
            </IonItem>

            <IonItem lines="none">
              <IonLabel>Active</IonLabel>
              <IonToggle 
                checked={formData.active} 
                onIonChange={e => handleChange('active', e.detail.checked)} 
              />
            </IonItem>
          </div>

          {error && (
            <div className="text-destructive ion-text-sm px-4">
              {error}
            </div>
          )}

          <div className="pt-4 px-4">
            <IonButton expand="block" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default CreatePlanModal;
