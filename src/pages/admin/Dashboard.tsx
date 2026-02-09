import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton as StandardIonButton, IonSelect, IonSelectOption, IonLoading, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  peopleOutline, 
 
 
  calendarOutline,
  closeOutline,
  personCircleOutline,
  timeOutline,
  carSportOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import StatCard from '../../components/ui/StatCard';
// Removed custom component imports
import { getSubscriptions, assignCleaner } from '../../services/subscriptionService';
import { getAllCleaners } from '../../services/cleanerService';
import { getAllCustomers, type Subscription } from '../../services/customerService';
import type { Cleaner } from '../../services/cleanerService';
import { getTodayWashes } from '../../services/washService';
import type { WashRecord } from '../../services/washService';

/**
 * Admin Dashboard Component
 * 
 * Minimalist admin dashboard with statistics overview,
 * recent bookings, and management tools.
 */
const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [todayWashes, setTodayWashes] = useState<WashRecord[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedCleanerId, setSelectedCleanerId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);
  
  // Pending Washes Modal State
  const [showPendingModal, setShowPendingModal] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const fetchData = async () => {
    try {
        const [subsData, cleanersData, washesData, customersData] = await Promise.all([
            getSubscriptions(),
            getAllCleaners(),
            getTodayWashes(),
            getAllCustomers('', 1000)
        ]);
        setSubscriptions(subsData);
        setCleaners(cleanersData);
        setTodayWashes(washesData);
        setTotalCustomers(customersData.length);
    } catch (error) {
        console.error("Failed to fetch dashboard data", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unassignedSubscriptions = subscriptions.filter(s => !s.cleanerId && s.status === 'ACTIVE');

  const openAssignModal = (sub: Subscription) => {
      setSelectedSub(sub);
      setSelectedCleanerId(null);
      setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
      if (!selectedSub || !selectedCleanerId) return;
      
      try {
          setAssigning(true);
          // Assuming subscription id is string in interface but number in backend
          await assignCleaner(Number(selectedSub.id), selectedCleanerId);
          setShowAssignModal(false);
          fetchData(); // Refresh data
      } catch {
          alert('Failed to assign cleaner');
      } finally {
          setAssigning(false);
      }
  };

  // Mock statistics data
  const stats = {
    totalCustomers: totalCustomers,
    totalWashes: todayWashes?.length || 0,
    todayRevenue: 3850,
    pendingBookings: (todayWashes || []).filter(w => w.status === 'SCHEDULED' || w.status === 'ASSIGNED').length
  };



  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className="min-h-screen bg-background pb-8">
          <DashboardHeader
            title="Admin Dashboard"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={handleLogout}
          />

          <div className="container mx-auto px-4 pt-6 space-y-8">
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
              </h2>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your carwash business today.
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Total Washes Today"
                value={stats.totalWashes}
                icon={calendarOutline}
              />
              <StatCard
                title="Pending Washes Today"
                value={stats.pendingBookings}
                icon={calendarOutline}
                onClick={() => setShowPendingModal(true)}
              />
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                icon={peopleOutline}
              />
            </div>

            {/* Unassigned Subscriptions Widget */}
            {unassignedSubscriptions.length > 0 && (
                <IonCard className="border-orange-200 bg-orange-50/30 m-0">
                    <IonCardHeader>
                        <IonCardTitle className="flex items-center gap-2 text-orange-700 ion-text-lg">
                             Unassigned Subscriptions
                        </IonCardTitle>
                        <IonCardSubtitle>
                            These subscriptions have no assigned cleaner.
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="space-y-3">
                            {unassignedSubscriptions.map(sub => (
                                <div key={sub.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded border border-orange-100 shadow-sm">
                                    <div>
                                        <div className="ion-font-medium">{sub.planName}</div>
                                        <div className="ion-text-sm text-muted-foreground">
                                            {sub.customerName} • {sub.vehicleMake} {sub.vehicleModel} ({sub.vehiclePlate})
                                        </div>
                                        <div className="ion-text-xs text-gray-400 mt-1">
                                            {sub.scheduledDays?.join(', ')} • Starts: {sub.startDate}
                                        </div>
                                    </div>
                                    <StandardIonButton 
                                        size="small" 
                                        fill="outline"
                                        color="warning"
                                        onClick={() => openAssignModal(sub)}
                                    >
                                        Assign Partner
                                    </StandardIonButton>
                                </div>
                            ))}
                        </div>
                    </IonCardContent>
                </IonCard>
            )}

            {/* Recent Bookings Section */}


            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <IonCard className="hover:bg-accent/50 transition-colors cursor-pointer m-0" onClick={() => history.push('/admin/customers')}>
                <IonCardContent className="pt-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="ion-font-semibold">Manage Customers</h3>
                    <p className="ion-text-sm text-muted-foreground mt-1">
                      View and manage customer accounts
                    </p>
                  </div>
                  <StandardIonButton fill="outline" color="secondary" className="w-full">Open</StandardIonButton>
                </IonCardContent>
              </IonCard>

              <IonCard className="hover:bg-accent/50 transition-colors cursor-pointer m-0" onClick={() => history.push('/admin/team')}>
                <IonCardContent className="pt-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <span className="text-xl">🧹</span>
                  </div>
                  <div>
                    <h3 className="ion-font-semibold">Manage Partners</h3>
                    <p className="ion-text-sm text-muted-foreground mt-1">
                      Assign tasks and monitor performance
                    </p>
                  </div>
                  <StandardIonButton fill="outline" color="secondary" className="w-full">Open</StandardIonButton>
                </IonCardContent>
              </IonCard>

              <IonCard className="hover:bg-accent/50 transition-colors cursor-pointer m-0">
                <IonCardContent className="pt-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="ion-font-semibold">View Reports</h3>
                    <p className="ion-text-sm text-muted-foreground mt-1">
                      Analytics and business insights
                    </p>
                  </div>
                  <StandardIonButton fill="outline" color="secondary" className="w-full">Open</StandardIonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        </div>

        {/* Assignment Modal */}
        <IonModal isOpen={showAssignModal} onDidDismiss={() => setShowAssignModal(false)} className="auto-height">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Assign Partner</IonTitle>
                    <IonButtons slot="end">
                        <StandardIonButton onClick={() => setShowAssignModal(false)}>Close</StandardIonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className="p-4 space-y-4">
                <p>Select a cleaner for subscription: <strong>{selectedSub?.planName}</strong></p>
                
                <IonSelect 
                    label="Partner" 
                    placeholder="Select One" 
                    value={selectedCleanerId} 
                    onIonChange={e => setSelectedCleanerId(e.detail.value)}
                    fill="outline"
                    labelPlacement="floating"
                >
                    {cleaners.map(cleaner => (
                        <IonSelectOption key={cleaner.id} value={cleaner.id}>
                            {cleaner.name}
                        </IonSelectOption>
                    ))}
                </IonSelect>

                <StandardIonButton 
                    className="w-full" 
                    onClick={handleAssignSubmit} 
                    disabled={!selectedCleanerId || assigning}
                >
                    {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </StandardIonButton>
            </div>
        </IonModal>
        
        <IonLoading isOpen={loading} message="Loading dashboard..." />

      </IonContent>

      {/* Pending Washes Modal */}
      <IonModal isOpen={showPendingModal} onDidDismiss={() => setShowPendingModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Pending Washes Today</IonTitle>
            <IonButtons slot="end">
              <StandardIonButton onClick={() => setShowPendingModal(false)}>
                <IonIcon icon={closeOutline} />
              </StandardIonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4 space-y-6">
            {Object.entries(
              (todayWashes || [])
                .filter(w => w.status === 'SCHEDULED' || w.status === 'ASSIGNED')
                .reduce((acc, wash) => {
                  const cleanerName = wash.cleaner?.name || 'Unassigned';
                  if (!acc[cleanerName]) acc[cleanerName] = [];
                  acc[cleanerName].push(wash);
                  return acc;
                }, {} as Record<string, typeof todayWashes>)
            ).map(([cleanerName, washes]) => (
              <div key={cleanerName} className="space-y-2">
                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                   <IonIcon icon={personCircleOutline} className="text-xl text-primary" />
                   <h3 className="font-semibold text-lg">{cleanerName}</h3>
                   <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                     {washes.length}
                   </span>
                </div>
                <div className="grid gap-2 pl-2">
                  {washes.map(wash => (
                    <div key={wash.id} className="border rounded-md p-3 flex justify-between items-center bg-card">
                      <div>
                        <div className="flex items-center gap-2 font-medium">
                          <IonIcon icon={carSportOutline} className="text-muted-foreground" />
                          {wash.vehicle.make} {wash.vehicle.model}
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                           {wash.vehicle.registrationNumber}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 ml-6">
                           <IonIcon icon={timeOutline} className="text-[10px]" />
                           {new Date(wash.scheduledDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           {wash.customer?.name && ` • ${wash.customer.name}`}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wash.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {wash.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {(todayWashes || []).filter(w => w.status === 'SCHEDULED' || w.status === 'ASSIGNED').length === 0 && (
               <div className="text-center py-10 text-muted-foreground">
                 <p>No pending washes for today.</p>
               </div>
            )}
          </div>
        </IonContent>
      </IonModal>

    </IonPage>
  );
};

export default AdminDashboard;
