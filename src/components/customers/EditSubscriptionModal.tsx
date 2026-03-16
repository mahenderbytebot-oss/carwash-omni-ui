import React, { useState, useEffect } from 'react';
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
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { getPlans, updateSubscriptionPlan, type Plan } from '../../services/subscriptionService';
import type { Subscription } from '../../services/customerService';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ isOpen, subscription, onClose, onSuccess }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [scheduledDays, setScheduledDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      if (subscription) {
        setSelectedPlanId(subscription.planId || '');
        setStartDate(
          subscription.startDate
            ? new Date(subscription.startDate).toISOString()
            : new Date().toISOString()
        );
        setScheduledDays(subscription.scheduledDays || []);
      } else {
        setSelectedPlanId('');
        setStartDate(new Date().toISOString());
        setScheduledDays([]);
      }
      setError(null);
    }
  }, [isOpen, subscription]);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err: unknown) {
      console.warn('Using mock plans', err);
      setPlans([
        { id: 'p1', name: 'Basic Wash', price: 29.99, description: 'Weekly basic wash', features: [], washesPerWeek: 1 },
        { id: 'p2', name: 'Premium Wash', price: 49.99, description: 'Weekly premium wash + wax', features: [], washesPerWeek: 4 },
        { id: 'p3', name: 'Deluxe Detail', price: 89.99, description: 'Daily detailing', features: [], washesPerWeek: 7 },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!subscription) return;

    if (!selectedPlanId) {
      setError('Please select a plan.');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlanId);
    if (plan && (plan.washesPerWeek || 7) < 7) {
       if (scheduledDays.length === 0) {
           setError(`Please select ${plan.washesPerWeek} wash day(s).`);
           return;
       }
       if (scheduledDays.length !== plan.washesPerWeek) {
           setError(`Please select exactly ${plan.washesPerWeek} day(s). You selected ${scheduledDays.length}.`);
           return;
       }
    }

    try {
      setLoading(true);
      setError(null);
      await updateSubscriptionPlan(subscription.id, { 
        planId: selectedPlanId,
        startDate,
        scheduledDays: (plan?.washesPerWeek || 7) < 7 ? scheduledDays : undefined
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to change subscription plan');
      } else {
        setError('Failed to change subscription plan');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanObj = plans.find(p => p.id === selectedPlanId);
  const showDaysSelection = selectedPlanObj && (selectedPlanObj.washesPerWeek || 7) < 7;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="pl-4">Change Subscription Plan</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <IonList lines="full">
            <IonItem>
              <IonLabel position="stacked">Select Plan *</IonLabel>
              <IonSelect value={selectedPlanId} onIonChange={e => {
                  setSelectedPlanId(e.detail.value);
                  setScheduledDays([]); // Reset days when plan changes
              }}>
                {plans.map(plan => (
                  <IonSelectOption key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price}/mo ({plan.washesPerWeek || 7} washes/wk)
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {showDaysSelection && (
                <IonItem>
                    <IonLabel position="stacked">Select Wash Days ({selectedPlanObj?.washesPerWeek}) *</IonLabel>
                    <IonSelect 
                        multiple={true} 
                        value={scheduledDays} 
                        onIonChange={e => setScheduledDays(e.detail.value)}
                        placeholder="Select Days"
                    >
                        <IonSelectOption value="MONDAY">Monday</IonSelectOption>
                        <IonSelectOption value="TUESDAY">Tuesday</IonSelectOption>
                        <IonSelectOption value="WEDNESDAY">Wednesday</IonSelectOption>
                        <IonSelectOption value="THURSDAY">Thursday</IonSelectOption>
                        <IonSelectOption value="FRIDAY">Friday</IonSelectOption>
                        <IonSelectOption value="SATURDAY">Saturday</IonSelectOption>
                        <IonSelectOption value="SUNDAY">Sunday</IonSelectOption>
                    </IonSelect>
                </IonItem>
            )}

            <IonItem>
              <IonLabel position="stacked">Start Date</IonLabel>
              <IonInput
                type="date"
                value={startDate.split('T')[0]}
                onIonChange={e => setStartDate(e.detail.value!)}
              />
            </IonItem>
          </IonList>

          {error && (
            <div className="text-destructive ion-text-sm mt-4 px-4">
              {error}
            </div>
          )}

          <div className="mt-6 px-4">
            <IonButton expand="block" type="submit" disabled={loading}>
              {loading ? 'Changing Plan...' : 'Change Plan'}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonModal>
  );
};

// Start Date input helper since IonDatetime can be large
import { IonInput } from '@ionic/react';

export default EditSubscriptionModal;
