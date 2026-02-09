import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonButton, 
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  useIonViewWillEnter,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import {
  addCircleOutline,
  timeOutline,
  locationOutline,
  carOutline,
  calendarOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { getMyWashes, type WashRecord } from '../../services/washService';
import { format } from 'date-fns';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [todayWashes, setTodayWashes] = useState<WashRecord[]>([]);
  const [activeTabWashes, setActiveTabWashes] = useState<WashRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallel fetch for efficiency
      const [todayData, tabData] = await Promise.all([
        getMyWashes('TODAY'),
        getMyWashes(activeTab.toUpperCase())
      ]);
      
      setTodayWashes(todayData.content);
      setActiveTabWashes(tabData.content);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    loadData();
  });

  const handleTabChange = async (tab: 'upcoming' | 'past') => {
    setActiveTab(tab);
    setLoading(true);
    try {
      const data = await getMyWashes(tab.toUpperCase());
      setActiveTabWashes(data.content);
    } catch (error) {
      console.error('Error filtering washes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadData();
    event.detail.complete();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'primary';
      case 'ASSIGNED': return 'secondary';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'VERIFIED': return 'success';
      case 'MISSED': return 'medium'; // Updated from SKIPPED
      default: return 'medium';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className="min-h-screen bg-background pb-8">
          <DashboardHeader
            title="Dashboard"
            userName={user?.name || 'Customer'}
            userRole={user?.role || 'CUSTOMER'}
            onLogout={handleLogout}
          />

          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div className="container mx-auto px-4 pt-6 space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
              </h2>
              <p className="text-muted-foreground">
                Here is your vehicle service overview.
              </p>
            </div>

            {/* Today's Wash Status */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <IonIcon icon={timeOutline} className="text-primary" />
                Today's Wash Status
              </h3>
              
              {loading && todayWashes.length === 0 ? (
                 <div className="flex justify-center p-4"><IonSpinner /></div>
              ) : todayWashes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {todayWashes.map((wash) => (
                    <IonCard key={wash.id} className="m-0 border-l-4 border-l-primary">
                      <IonCardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{wash.vehicle?.make} {wash.vehicle?.model}</h4>
                            <p className="text-sm text-muted-foreground uppercase">{wash.vehicle?.registrationNumber}</p>
                          </div>
                          <IonBadge color={getStatusBadgeColor(wash.status)}>{wash.status.replace('_', ' ')}</IonBadge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm mt-3">
                           <IonIcon icon={locationOutline} />
                           <span>Location available in details</span>
                        </div>
                        
                        {wash.cleaner && (
                          <div className="mt-3 p-3 bg-secondary/10 rounded-lg flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                                {wash.cleaner.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-medium">Partner: {wash.cleaner.name}</p>
                               <p className="text-xs text-muted-foreground">{wash.cleaner.mobile}</p>
                             </div>
                          </div>
                        )}
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              ) : (
                <IonCard className="m-0 bg-muted/30 border-dashed">
                  <IonCardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <IonIcon icon={calendarOutline} className="text-4xl text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No washes scheduled for today.</p>
                  </IonCardContent>
                </IonCard>
              )}
            </div>

            {/* Tabs for Upcoming/Past */}
            <div>
              <IonSegment value={activeTab} onIonChange={e => handleTabChange(e.detail.value as any)} className="mb-4">
                <IonSegmentButton value="upcoming">
                  <IonLabel>Upcoming</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="past">
                  <IonLabel>Past History</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              {loading ? (
                <div className="flex justify-center p-8"><IonSpinner /></div>
              ) : activeTabWashes.length > 0 ? (
                <div className="space-y-4">
                  {activeTabWashes.map((wash) => (
                    <IonCard key={wash.id} className="m-0">
                      <IonCardContent className="flex flex-col sm:flex-row gap-4 p-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <div>
                               <h4 className="font-bold">{wash.subscription?.planName || 'Wash Service'}</h4>
                               <p className="text-sm text-muted-foreground">{formatDate(wash.scheduledDateTime)}</p>
                             </div>
                             <IonBadge color={getStatusBadgeColor(wash.status)}>{wash.status}</IonBadge>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <IonIcon icon={carOutline} className="text-muted-foreground" />
                            <span>{wash.vehicle?.make} {wash.vehicle?.model} ({wash.vehicle?.registrationNumber})</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-center gap-2 sm:border-l sm:pl-4">
                           <IonButton fill="outline" size="small" routerLink={`/customer/washes/${wash.id}`}>
                             Details
                           </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 opacity-60">
                   <IonIcon icon={alertCircleOutline} className="text-4xl mb-2" />
                   <p>No {activeTab} washes found.</p>
                </div>
              )}
            </div>
            
            {/* Quick Action */}
            <div className="fixed bottom-6 right-6 z-10">
               <IonButton routerLink="/customer/book" shape="round" className="shadow-lg" size="large">
                  <IonIcon slot="start" icon={addCircleOutline} />
                  Book Wash
               </IonButton>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomerDashboard;
