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
  IonSearchbar,
  IonSpinner,
  IonIcon
} from '@ionic/react';
import { personOutline } from 'ionicons/icons';
import { getAllCustomers, getCustomerById, type Customer, type Vehicle } from '../../services/customerService';
import { getPlans, addSubscription, type Plan } from '../../services/subscriptionService';
import { Button } from '../ui/Button';

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Mon' },
  { value: 'TUESDAY', label: 'Tue' },
  { value: 'WEDNESDAY', label: 'Wed' },
  { value: 'THURSDAY', label: 'Thu' },
  { value: 'FRIDAY', label: 'Fri' },
  { value: 'SATURDAY', label: 'Sat' },
  { value: 'SUNDAY', label: 'Sun' }
];

interface CreateSubscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSubscriptionWizard: React.FC<CreateSubscriptionWizardProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  
  // Selections
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerVehicles, setCustomerVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  // Search
  const [searchText, setSearchText] = useState<string>('');



  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchPlans();
    }
  }, [isOpen]);

  // Debounce search customers
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        fetchCustomers(searchText);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchText, step]);

  const resetForm = () => {
    setStep(1);
    setSelectedCustomer(null);
    setCustomerVehicles([]);
    setSelectedVehicleId('');
    setSelectedPlanId('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setSelectedDays([]);
    setError(null);
    setSearchText('');
  };

  const fetchCustomers = async (query: string) => {
    try {
      setLoading(true);
      const data = await getAllCustomers(query);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCustomerSelect = async (customer: Customer) => {
    try {
      setLoading(true);
      // Fetch full details to get vehicles
      const detailedCustomer = await getCustomerById(customer.id);
      setSelectedCustomer(detailedCustomer);
      setCustomerVehicles(detailedCustomer.vehicles || []);
      setStep(2);
    } catch {
      setError('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVehicleId || !selectedPlanId) {
      setError('Please select a vehicle and a plan.');
      return;
    }

    const plan = plans.find(p => p.id.toString() === selectedPlanId);
    if (plan && plan.features && plan.features.some(f => f.toLowerCase().includes('weekly'))) {
         // rough check, ideally washesPerWeek should be in Plan interface
    }

    try {
      setLoading(true);
      await addSubscription(selectedVehicleId, {
        planId: selectedPlanId,
        startDate,
        scheduledDays: selectedDays.length > 0 ? selectedDays : undefined
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as any).message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="px-4">
        <IonSearchbar 
          value={searchText} 
          onIonInput={e => setSearchText(e.detail.value!)} 
          placeholder="Search customer by name or mobile..."
          className="px-0"
        />
      </div>
      
      {loading ? (
        <div className="text-center py-4"><IonSpinner /></div>
      ) : (
        <IonList>
          {customers.length === 0 ? (
             <div className="text-center py-4 text-muted-foreground">No customers found</div>
          ) : (
            customers.map(customer => (
              <IonItem 
                key={customer.id} 
                button 
                detail 
                onClick={() => handleCustomerSelect(customer)}
              >
                <IonIcon slot="start" icon={personOutline} className="text-muted-foreground" />
                <IonLabel>
                  <h2>{customer.name}</h2>
                  <p>{customer.mobile}</p>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 pt-2">
      <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between">
        <div>
          <h3 className="ion-font-semibold">{selectedCustomer?.name}</h3>
          <p className="ion-text-sm text-muted-foreground">{selectedCustomer?.mobile}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Change</Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="ion-text-sm ion-font-medium mb-1.5 block">Select Vehicle</label>
          {customerVehicles.length === 0 ? (
            <div className="ion-text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              This customer has no vehicles. Add a vehicle to the customer first.
            </div>
          ) : (
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ion-text-sm ring-offset-background file:border-0 file:bg-transparent file:ion-text-sm file:ion-font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              <option value="">Select a vehicle...</option>
              {customerVehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
           <label className="ion-text-sm ion-font-medium mb-1.5 block">Select Plan</label>
           <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ion-text-sm ring-offset-background file:border-0 file:bg-transparent file:ion-text-sm file:ion-font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
            >
              <option value="">Select a plan...</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - ₹{p.price}
                </option>
              ))}
            </select>
        </div>

        <div>
           <label className="ion-text-sm ion-font-medium mb-1.5 block">Start Date</label>
           <input 
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ion-text-sm ring-offset-background file:border-0 file:bg-transparent file:ion-text-sm file:ion-font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
        </div>

        <div>
           <label className="ion-text-sm ion-font-medium mb-1.5 block">Schedule Days (Optional)</label>
           <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => (
                <div 
                   key={day.value}
                   className={`
                      cursor-pointer px-3 py-1.5 rounded-full ion-text-xs ion-font-medium border transition-colors
                      ${selectedDays.includes(day.value) 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-input'}
                   `}
                   onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </div>
              ))}
           </div>
           <p className="ion-text-xs text-muted-foreground mt-1">Select prefered wash days</p>
        </div>
      </div>

       {error && <div className="text-destructive ion-text-sm">{error}</div>}

       <div className="pt-4">
         <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={loading || !selectedVehicleId || !selectedPlanId}
          >
            {loading ? 'Processing...' : 'Create Subscription'}
          </Button>
       </div>
    </div>
  );

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Subscription</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default CreateSubscriptionWizard;
