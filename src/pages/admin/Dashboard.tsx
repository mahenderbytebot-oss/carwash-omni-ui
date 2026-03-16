import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  alertCircleOutline,
  calendarOutline,
  personCircleOutline,
  timeOutline,
  peopleOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import StatCard from '../../components/ui/StatCard';
// Removed custom component imports
import { searchSubscriptions } from '../../services/subscriptionService';
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
  const [unassignedCount, setUnassignedCount] = useState<number>(0);
  const [expiredCount, setExpiredCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Pending Washes Modal State removed in favor of dedicated page

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const fetchData = async () => {
    try {
        const [cleanersData, washesData, customersData, unassignedData, expiredData] = await Promise.all([
            getAllCleaners(),
            getTodayWashes(),
            getAllCustomers('', 1000),
            searchSubscriptions('', 'ACTIVE', true, 0, 1),
            searchSubscriptions('', 'EXPIRED', false, 0, 1)
        ]);
        setCleaners(cleanersData);
        setTodayWashes(washesData);
        setTotalCustomers(customersData.length);
        setUnassignedCount(unassignedData.totalElements);
        setExpiredCount(expiredData.totalElements);
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
            {/* Action Required Section */}
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-3 px-1">Action Required</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <StatCard
                  title="Unassigned Subscriptions"
                  value={unassignedCount}
                  icon={alertCircleOutline}
                  onClick={() => history.push('/admin/subscription-management?unassigned=true')}
                  variant="outdated"
                />
                <StatCard
                  title="Expired Subscriptions"
                  value={expiredCount}
                  icon={timeOutline}
                  onClick={() => history.push('/admin/subscription-management?status=EXPIRED')}
                  variant="offline"
                />
                <StatCard
                  title="Daily Washes"
                  value={stats.totalWashes}
                  secondaryText={
                    <span className={stats.pendingBookings > 0 ? "text-red-500 font-bold" : ""}>
                      {stats.pendingBookings} Pending
                    </span>
                  }
                  icon={calendarOutline}
                  onClick={() => history.push('/admin/daily-washes')}
                  variant="total"
                />
              </div>
            </div>

            {/* Platform Overview Section */}
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-3 px-1">Platform Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={peopleOutline}
                  onClick={() => history.push('/admin/customers')}
                  variant="healthy" // Green for good
                />
                <StatCard
                  title="Total Partners"
                  value={stats.totalPartners}
                  icon={personCircleOutline}
                  onClick={() => history.push('/admin/cleaners')}
                  variant="outdated" // Orange/Warning for distinction
                />
              </div>
            </div>



            {/* Recent Bookings Section */}



          </div>
        </div>


        
        <IonLoading isOpen={loading} message="Loading dashboard..." />

      </IonContent>

    </IonPage>
  );
};

export default AdminDashboard;
