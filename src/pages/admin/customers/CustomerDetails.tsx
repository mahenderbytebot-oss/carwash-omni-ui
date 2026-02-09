/**
 * Customer Details Page
 * 
 * Displays customer profile, vehicles, and subscriptions.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonRefresher, 
  IonRefresherContent,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  useIonAlert,
  useIonToast,
  type RefresherEventDetail
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  arrowBack, 
  carOutline, 
  addOutline, 
  cardOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import { useAuthStore } from '../../../store/authStore';
// Removed custom component imports
import { getCustomerById, type Customer } from '../../../services/customerService';
import { deleteVehicle } from '../../../services/vehicleService';

import AddVehicleModal from '../../../components/customers/AddVehicleModal';
import AddSubscriptionModal from '../../../components/customers/AddSubscriptionModal';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { user, logout } = useAuthStore();
  /* State for Tabs */
  const [activeTab, setActiveTab] = useState<'vehicles' | 'payments' | 'history'>('vehicles');
  const [payments, setPayments] = useState<import('../../../services/customerService').Payment[]>([]);
  const [historyItems, setHistoryItems] = useState<import('../../../services/customerService').WashHistory[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal states
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const fetchCustomerDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      console.error('Failed to fetch customer details', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPayments = useCallback(async () => {
    if (payments.length > 0) return;
    try {
      setLoadingPayments(true);
      const data = await import('../../../services/customerService').then(m => m.getCustomerPayments(id));
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments', err);
    } finally {
      setLoadingPayments(false);
    }
  }, [id, payments.length]);

  const fetchHistory = useCallback(async () => {
    if (historyItems.length > 0) return;
    try {
      setLoadingHistory(true);
      const data = await import('../../../services/customerService').then(m => m.getCustomerHistory(id));
      setHistoryItems(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [id, historyItems.length]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    } else if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, fetchPayments, fetchHistory]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchCustomerDetails();
    if (activeTab === 'payments') {
        setPayments([]); // Force refresh
        fetchPayments();
    }
    if (activeTab === 'history') {
        setHistoryItems([]); // Force refresh
        fetchHistory();
    }
    event.detail.complete();
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    presentAlert({
      header: 'Delete Vehicle',
      message: 'Are you sure you want to delete this vehicle?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await deleteVehicle(vehicleId);
              presentToast({
                message: 'Vehicle deleted successfully',
                duration: 2000,
                color: 'success'
              });
              fetchCustomerDetails(); // Refresh
            } catch (err) {
              console.error(err);
              presentToast({
                message: 'Failed to delete vehicle',
                duration: 2000,
                color: 'danger'
              });
            }
          }
        }
      ]
    });
  };

  const handleOpenAddSubscription = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setIsAddSubscriptionOpen(true);
  };

  if (loading) {
     return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!customer) {
    return <div className="flex h-screen items-center justify-center">Customer not found</div>;
  }

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <div className="min-h-screen bg-background pb-8">
          <DashboardHeader
            title="Customer Details"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={() => { logout(); history.push('/login'); }}
          />

          <div className="container mx-auto px-4 pt-6 space-y-6">
            <IonButton fill="clear" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} slot="start" />
              Back to Customers
            </IonButton>

            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <IonCard className="md:col-span-1 h-fit m-0">
                <IonCardHeader>
                  <IonCardTitle>Profile</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="space-y-4">
                  <div className="flex flex-col items-center pb-4 border-b">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary ion-text-2xl ion-font-bold mb-3">
                      {customer.name.charAt(0)}
                    </div>
                    <h2 className="ion-text-xl ion-font-bold">{customer.name}</h2>
                    <p className="text-muted-foreground">{customer.role}</p>
                  </div>
                  
                  <div className="space-y-3 ion-text-sm">
                    <div>
                      <label className="text-muted-foreground block ion-text-xs uppercase ion-font-medium">Mobile</label>
                      <div className="ion-font-medium">{customer.mobile}</div>
                    </div>
                    <div>
                      <label className="text-muted-foreground block ion-text-xs uppercase ion-font-medium">Email</label>
                      <div className="ion-font-medium break-all">{customer.email || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-muted-foreground block ion-text-xs uppercase ion-font-medium">Address</label>
                      <div className="ion-font-medium">{customer.address || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <IonButton fill="outline" expand="block" color="medium">
                    <IonIcon icon={createOutline} slot="start" />
                    Edit Profile
                  </IonButton>
                </IonCardContent>
              </IonCard>

              {/* Tabs Section */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Ionic Segment Tabs */}
                <IonSegment 
                  value={activeTab} 
                  onIonChange={(e) => setActiveTab(e.detail.value as 'vehicles' | 'payments' | 'history')}
                  mode="ios"
                  className="mb-4"
                >
                  <IonSegmentButton value="vehicles">
                    <IonLabel>Vehicles</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="payments">
                    <IonLabel>Payments</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="history">
                    <IonLabel>History</IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {/* Vehicles Tab */}
                {activeTab === 'vehicles' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                        <h3 className="ion-text-xl ion-font-bold">Vehicles ({customer.vehicles?.length || 0})</h3>
                        <IonButton color="primary" onClick={() => setIsAddVehicleOpen(true)}>
                            <IonIcon icon={addOutline} slot="start" />
                            Add Vehicle
                        </IonButton>
                        </div>

                        {(!customer.vehicles || customer.vehicles.length === 0) ? (
                        <div className="text-center py-8 border rounded-lg bg-card text-muted-foreground">
                            No vehicles registered. Add one to get started.
                        </div>
                        ) : (
                          <div className="space-y-4">
                            {customer.vehicles.map(vehicle => (
                            <IonCard key={vehicle.id} className="m-0">
                                <IonCardContent className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                    <div className="p-3 bg-secondary rounded-lg">
                                        <IonIcon icon={carOutline} className="text-2xl" />
                                    </div>
                                    <div>
                                        <h4 className="ion-font-bold ion-text-lg">{vehicle.year > 0 ? vehicle.year : ''} {vehicle.make} {vehicle.model}</h4>
                                        <div className="ion-text-sm text-muted-foreground space-y-1">
                                            {vehicle.color && <p>Color: {vehicle.color}</p>}
                                            <p className="font-mono bg-muted inline-block px-2 py-0.5 rounded ion-text-xs">{vehicle.registrationNumber}</p>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 min-w-[150px]">
                                        {vehicle.subscriptions && vehicle.subscriptions.length > 0 ? (
                                        vehicle.subscriptions.map(sub => (
                                            <div key={sub.id} className="border rounded p-2 bg-muted/20 ion-text-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="ion-font-semibold">{sub.planName}</span>
                                                <IonBadge color={sub.status === 'ACTIVE' || sub.status === 'active' ? 'primary' : 'medium'}>{sub.status}</IonBadge>
                                            </div>
                                            <div className="ion-text-xs text-muted-foreground">
                                                Expires: {sub.endDate}
                                            </div>
                                            {sub.scheduledDays && sub.scheduledDays.length > 0 && (
                                                <div className="ion-text-xs text-muted-foreground mt-1">
                                                    Days: {sub.scheduledDays.map(d => d.substring(0, 3)).join(', ')}
                                                </div>
                                            )}
                                            </div>
                                        ))
                                        ) : (
                                        <IonButton 
                                            fill="outline" 
                                            size="small"
                                            expand="block"
                                            onClick={() => handleOpenAddSubscription(vehicle.id)}
                                        >
                                            <IonIcon icon={cardOutline} slot="start" />
                                            Add Subscription
                                        </IonButton>
                                        )}
                                        
                                        <IonButton 
                                        fill="clear"
                                        size="small"
                                        color="danger"
                                        expand="block"
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                        >
                                        <IonIcon icon={trashOutline} slot="start" />
                                        Remove Vehicle
                                        </IonButton>
                                    </div>
                                </div>
                                </IonCardContent>
                            </IonCard>
                            ))}
                        </div>
                        )}
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="space-y-4">
                        <h3 className="ion-text-xl ion-font-bold">Payment History</h3>
                        {loadingPayments ? (
                            <div className="text-center py-4">Loading payments...</div>
                        ) : payments.length === 0 ? (
                            <div className="text-center py-8 border rounded-lg bg-card text-muted-foreground">
                                No payment history found.
                            </div>
                        ) : (
                            payments.map(payment => (
                                <IonCard key={payment.id} className="m-0">
                                    <IonCardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <div className="ion-font-bold ion-text-lg">${payment.amount.toFixed(2)}</div>
                                            <div className="ion-text-sm text-muted-foreground">{new Date(payment.paymentDate).toLocaleDateString()}</div>
                                            <div className="ion-text-xs text-muted-foreground mt-1">{payment.paymentMethod} • {payment.transactionId}</div>
                                        </div>
                                        <IonBadge color={payment.status === 'COMPLETED' ? 'success' : 'medium'}>
                                            {payment.status}
                                        </IonBadge>
                                    </IonCardContent>
                                </IonCard>
                            ))
                        )}
                    </div>
                )}

                {/* Service History Tab */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        <h3 className="ion-text-xl ion-font-bold">Service History</h3>
                        {loadingHistory ? (
                            <div className="text-center py-4">Loading history...</div>
                        ) : historyItems.length === 0 ? (
                            <div className="text-center py-8 border rounded-lg bg-card text-muted-foreground">
                                No service history found.
                            </div>
                        ) : (
                            historyItems.map(item => (
                                <IonCard key={item.id} className="m-0">
                                    <IonCardContent className="p-4">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div className="min-w-0">
                                                <h4 className="ion-font-bold ion-text-sm sm:ion-text-base break-words">{item.vehicleInfo}</h4>
                                                <div className="ion-text-sm text-muted-foreground">
                                                    Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <IonBadge color={item.status === 'COMPLETED' ? 'success' : 'medium'} className="shrink-0">
                                                {item.status}
                                            </IonBadge>
                                        </div>
                                        <div className="ion-text-sm flex gap-4 mt-2">
                                            <div>
                                                <span className="text-muted-foreground">Cleaner:</span> {item.cleanerName}
                                            </div>
                                            {item.rating && (
                                                <div>
                                                    <span className="text-muted-foreground">Rating:</span> {item.rating} ★
                                                </div>
                                            )}
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            ))
                        )}
                    </div>
                )}

              </div>
            </div>
            
            <AddVehicleModal 
              isOpen={isAddVehicleOpen}
              customerId={id}
              onClose={() => setIsAddVehicleOpen(false)}
              onSuccess={fetchCustomerDetails}
            />

            <AddSubscriptionModal
              isOpen={isAddSubscriptionOpen}
              vehicleId={selectedVehicleId}
              onClose={() => setIsAddSubscriptionOpen(false)}
              onSuccess={fetchCustomerDetails}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomerDetails;
