import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonBadge,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonButton
} from '@ionic/react';
import {
  carOutline,
  addCircleOutline,
  warningOutline,
  checkmarkCircleOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { getMyVehicles } from '../../services/vehicleService';
import type { Vehicle } from '../../services/customerService';
import { useIonViewWillEnter } from '@ionic/react';
import { format } from 'date-fns';

const MyCars: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  const loadVehicles = async () => {
    if (!user?.customerId) {
        console.error("No customer ID found for user");
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const data = await getMyVehicles(user.customerId);
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    loadVehicles();
  });

  const handleRefresh = async (event: CustomEvent) => {
    await loadVehicles();
    event.detail.complete();
  };

  const getActiveSubscription = (vehicle: Vehicle) => {
    if (!vehicle.subscriptions || vehicle.subscriptions.length === 0) return null;
    return vehicle.subscriptions.find(sub => sub.active === true || sub.status === 'ACTIVE');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className="min-h-screen bg-background pb-20">
          <DashboardHeader
            title="My Cars"
            userName={user?.name || 'Customer'}
            userRole={user?.role || 'CUSTOMER'}
            onLogout={handleLogout}
          />

          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div className="container mx-auto px-4 pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">My Vehicles</h2>
                <p className="text-muted-foreground">Manage your cars and subscriptions</p>
              </div>
              <IonButton routerLink="/customer/vehicles/add" size="small">
                <IonIcon slot="start" icon={addCircleOutline} />
                Add Car
              </IonButton>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><IonSpinner /></div>
            ) : vehicles.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => {
                  const activeSub = getActiveSubscription(vehicle);
                  return (
                    <IonCard key={vehicle.id} className="m-0 overflow-hidden">
                      <div className="h-2 bg-primary w-full"></div>
                      <IonCardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                              <IonIcon icon={carOutline} className="text-xl" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">{vehicle.make} {vehicle.model}</h3>
                              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded w-fit mt-1">
                                {vehicle.registrationNumber}
                              </p>
                              {vehicle.color && <p className="text-xs text-muted-foreground mt-1 capitalize">{vehicle.color}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4 mt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Subscription Status</span>
                            {activeSub ? (
                              <IonBadge color="success" className="flex items-center gap-1">
                                <IonIcon icon={checkmarkCircleOutline} />
                                Active
                              </IonBadge>
                            ) : (
                              <IonBadge color="medium" className="flex items-center gap-1">
                                <IonIcon icon={warningOutline} />
                                Inactive
                              </IonBadge>
                            )}
                          </div>

                          {activeSub ? (
                            <div className="bg-success/10 rounded-lg p-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Plan</span>
                                <span className="font-semibold">{activeSub.planName}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Expires</span>
                                <span className="font-semibold">{formatDate(activeSub.endDate)}</span>
                              </div>
                              {activeSub.scheduledDays && activeSub.scheduledDays.length > 0 && (
                                <div className="text-xs text-muted-foreground mt-1 pt-1 border-t border-success/20">
                                  Days: {Array.isArray(activeSub.scheduledDays) ? activeSub.scheduledDays.join(', ') : activeSub.scheduledDays}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                              <p className="text-sm text-muted-foreground mb-2">No active subscription</p>
                              <IonButton fill="outline" size="small" className="w-full text-xs h-8" routerLink={`/customer/subscribe/${vehicle.id}`}>
                                Purchase Plan
                              </IonButton>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                           <IonButton fill="clear" size="small" className="w-full" routerLink={`/customer/vehicles/${vehicle.id}`}>
                             Details
                           </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/30">
                <IonIcon icon={alertCircleOutline} className="text-5xl text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No vehicles found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Add your first vehicle to start booking services and managing subscriptions.
                </p>
                <IonButton routerLink="/customer/vehicles/add">
                  <IonIcon slot="start" icon={addCircleOutline} />
                  Add New Vehicle
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyCars;
