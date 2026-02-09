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
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { addVehicle, type AddVehicleRequest } from '../../services/vehicleService';

interface AddVehicleModalProps {
  isOpen: boolean;
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, customerId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AddVehicleRequest>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    type: 'sedan'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof AddVehicleRequest, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.make || !formData.model || !formData.licensePlate) {
      setError('Make, Model, and License Plate are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await addVehicle(customerId, formData);
      setFormData({
        make: '', model: '', year: new Date().getFullYear(), color: '', licensePlate: '', type: 'sedan'
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="pl-4">Add Vehicle</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <IonList lines="full">
            <IonItem>
              <IonLabel position="stacked">Make *</IonLabel>
              <IonInput 
                value={formData.make} 
                onIonChange={e => handleChange('make', e.detail.value!)} 
                placeholder="Ex. Toyota"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Model *</IonLabel>
              <IonInput 
                value={formData.model} 
                onIonChange={e => handleChange('model', e.detail.value!)} 
                placeholder="Ex. Camry"
                required
              />
            </IonItem>
            <div className="flex gap-2">
              <IonItem className="flex-1">
                <IonLabel position="stacked">Year</IonLabel>
                <IonInput 
                  value={formData.year} 
                  onIonChange={e => handleChange('year', parseInt(e.detail.value!, 10))} 
                  type="number"
                />
              </IonItem>
              <IonItem className="flex-1">
                <IonLabel position="stacked">Color</IonLabel>
                <IonInput 
                  value={formData.color} 
                  onIonChange={e => handleChange('color', e.detail.value!)} 
                  placeholder="Ex. Silver"
                />
              </IonItem>
            </div>
            <IonItem>
              <IonLabel position="stacked">License Plate *</IonLabel>
              <IonInput 
                value={formData.licensePlate} 
                onIonChange={e => handleChange('licensePlate', e.detail.value!)} 
                placeholder="Ex. ABC-123"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Type</IonLabel>
              <IonSelect value={formData.type} onIonChange={e => handleChange('type', e.detail.value)}>
                <IonSelectOption value="sedan">Sedan</IonSelectOption>
                <IonSelectOption value="suv">SUV</IonSelectOption>
                <IonSelectOption value="truck">Truck</IonSelectOption>
                <IonSelectOption value="van">Van</IonSelectOption>
                <IonSelectOption value="coupe">Coupe</IonSelectOption>
                <IonSelectOption value="other">Other</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {error && (
            <div className="text-destructive ion-text-sm mt-4 px-4">
              {error}
            </div>
          )}

          <div className="mt-6 px-4">
            <IonButton expand="block" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Vehicle'}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default AddVehicleModal;
