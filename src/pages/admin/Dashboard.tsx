import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton as StandardIonButton, IonLoading, IonIcon } from '@ionic/react';
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
import { getAllCustomers } from '../../services/customerService';
import { getAllCleaners } from '../../services/cleanerService';
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


  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [todayWashes, setTodayWashes] = useState<WashRecord[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  

  
  // Pending Washes Modal State
  const [showPendingModal, setShowPendingModal] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const fetchData = async () => {
    try {
        const [cleanersData, washesData, customersData] = await Promise.all([
            getAllCleaners(),
            getTodayWashes(),
            getAllCustomers('', 1000)
        ]);
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





  // Mock statistics data
  const stats = {
    totalCustomers: totalCustomers,
    totalWashes: todayWashes?.length || 0,
    todayRevenue: 3850,
    pendingBookings: (todayWashes || []).filter(w => w.status === 'SCHEDULED' || w.status === 'ASSIGNED').length,
    totalPartners: cleaners.length
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
                onClick={() => history.push('/admin/customers')}
              />
              <StatCard
                title="Total Partners"
                value={stats.totalPartners}
                icon={personCircleOutline}
                onClick={() => history.push('/admin/cleaners')}
              />
            </div>



            {/* Recent Bookings Section */}



          </div>
        </div>


        
        <IonLoading isOpen={loading} message="Loading dashboard..." />

      </IonContent>

      {/* Pending Washes Modal */}
      <IonModal isOpen={showPendingModal} onDidDismiss={() => setShowPendingModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="pl-4">Pending Washes Today</IonTitle>
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
