import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton as StandardIonButton, IonSelect, IonSelectOption, IonLoading, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  peopleOutline, 
  personOutline, 
  cashOutline, 
  calendarOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import StatCard from '../../components/ui/StatCard';
// Removed custom component imports
import { getSubscriptions, assignCleaner } from '../../services/subscriptionService';
import { getAllCleaners } from '../../services/cleanerService';
import type { Subscription } from '../../services/customerService';
import type { Cleaner } from '../../services/cleanerService';

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
  const [loading, setLoading] = useState(true);
  
  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedCleanerId, setSelectedCleanerId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const fetchData = async () => {
    try {
        const [subsData, cleanersData] = await Promise.all([
            getSubscriptions(),
            getAllCleaners()
        ]);
        setSubscriptions(subsData);
        setCleaners(cleanersData);
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
    totalCustomers: 1247,
    activeCleaners: cleaners.filter(c => c.active).length || 23,
    todayRevenue: 3850,
    pendingBookings: 12
  };

  // Mock recent bookings data
  const recentBookings = [
    {
      id: '1',
      customerName: 'John Smith',
      service: 'Premium Wash',
      time: '10:30 AM',
      status: 'in-progress' as const,
      cleaner: 'Mike Johnson'
    },
    {
      id: '2',
      customerName: 'Sarah Williams',
      service: 'Basic Wash',
      time: '11:00 AM',
      status: 'pending' as const
    },
    {
      id: '3',
      customerName: 'David Brown',
      service: 'Deluxe Wash',
      time: '11:30 AM',
      status: 'completed' as const,
      cleaner: 'Tom Davis'
    },
    {
      id: '4',
      customerName: 'Emily Davis',
      service: 'Premium Wash',
      time: '12:00 PM',
      status: 'pending' as const
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                icon={peopleOutline}
                trend={{ value: 12, direction: 'up' }}
              />
              <StatCard
                title="Active Cleaners"
                value={stats.activeCleaners}
                icon={personOutline}
                trend={{ value: 5, direction: 'up' }}
              />
              <StatCard
                title="Today's Revenue"
                value={`$${stats.todayRevenue}`}
                icon={cashOutline}
                trend={{ value: 8, direction: 'up' }}
              />
              <StatCard
                title="Pending Bookings"
                value={stats.pendingBookings}
                icon={calendarOutline}
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
                                        Assign Cleaner
                                    </StandardIonButton>
                                </div>
                            ))}
                        </div>
                    </IonCardContent>
                </IonCard>
            )}

            {/* Recent Bookings Section */}
            <IonCard className="m-0">
              <IonCardHeader>
                <IonCardTitle>Recent Bookings</IonCardTitle>
                <IonCardSubtitle>Latest booking requests and their status</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="mb-3 sm:mb-0">
                        <div className="ion-font-medium">
                          {booking.customerName}
                        </div>
                        <div className="flex flex-wrap gap-2 ion-text-sm text-muted-foreground mt-1">
                          <span>{booking.service}</span>
                          <span>•</span>
                          <span>{booking.time}</span>
                          {booking.cleaner && (
                            <>
                              <span>•</span>
                              <span>Cleaner: {booking.cleaner}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <IonBadge color={getStatusBadgeVariant(booking.status)}>
                        {booking.status.replace('-', ' ')}
                      </IonBadge>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <StandardIonButton expand="block" fill="outline" color="medium">
                    View All Bookings
                  </StandardIonButton>
                </div>
              </IonCardContent>
            </IonCard>

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
                    <h3 className="ion-font-semibold">Manage Cleaners</h3>
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
                    <IonTitle>Assign Cleaner</IonTitle>
                    <IonButtons slot="end">
                        <StandardIonButton onClick={() => setShowAssignModal(false)}>Close</StandardIonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className="p-4 space-y-4">
                <p>Select a cleaner for subscription: <strong>{selectedSub?.planName}</strong></p>
                
                <IonSelect 
                    label="Cleaner" 
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
    </IonPage>
  );
};

export default AdminDashboard;
