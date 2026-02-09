import React from 'react';
import { IonPage, IonContent, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  addCircleOutline,
  timeOutline,
  locationOutline,
  carOutline,
  checkmarkCircleOutline,
  ribbonOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
// Removed custom component imports

interface CustomerBooking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  cleaner?: string;
  price: number;
  location?: string;
}

const CustomerDashboard: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const upcomingAppointments: CustomerBooking[] = [
    {
      id: '1',
      service: 'Premium Wash & Wax',
      date: 'Today',
      time: '2:00 PM',
      status: 'scheduled',
      cleaner: 'Mike Johnson',
      price: 49.99,
      location: '123 Main St'
    },
    {
      id: '2',
      service: 'Interior Detailing',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'scheduled',
      cleaner: 'Sarah Williams',
      price: 79.99,
      location: '123 Main St'
    },
    {
      id: '3',
      service: 'Express Wash',
      date: 'Dec 28',
      time: '3:30 PM',
      status: 'scheduled',
      price: 29.99,
      location: '123 Main St'
    }
  ];

  const serviceHistory: CustomerBooking[] = [
    {
      id: '4',
      service: 'Premium Wash',
      date: 'Dec 20, 2024',
      time: '11:00 AM',
      status: 'completed',
      cleaner: 'Tom Davis',
      price: 39.99
    },
    {
      id: '5',
      service: 'Basic Wash',
      date: 'Dec 15, 2024',
      time: '2:00 PM',
      status: 'completed',
      cleaner: 'Mike Johnson',
      price: 24.99
    },
    {
      id: '6',
      service: 'Deluxe Wash & Wax',
      date: 'Dec 10, 2024',
      time: '9:30 AM',
      status: 'completed',
      cleaner: 'Sarah Williams',
      price: 59.99
    }
  ];

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'scheduled': return 'secondary';
      case 'in-progress': return 'destructive'; // Using destructive for alert/progress for now, or default
      case 'completed': return 'default';
      default: return 'outline';
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

          <div className="container mx-auto px-4 pt-6 space-y-8">
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
              </h2>
              <p className="text-muted-foreground">
                Manage your vehicle services and appointments.
              </p>
            </div>

            {/* Quick Booking Card */}
            <IonCard className="bg-primary text-primary-foreground border-none m-0">
              <IonCardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary-foreground/10 rounded-full">
                       <IonIcon icon={addCircleOutline} className="text-2xl" />
                    </div>
                    <h3 className="ion-text-2xl ion-font-bold">Book a New Service</h3>
                  </div>
                  <p className="text-primary-foreground/80 mb-4 max-w-lg">
                    Choose from our premium car wash services and schedule at your convenience.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 ion-text-sm text-primary-foreground/70">
                    <span className="flex items-center gap-1">
                      <IonIcon icon={carOutline} /> Multiple Services
                    </span>
                    <span className="flex items-center gap-1">
                      <IonIcon icon={timeOutline} /> Flexible Scheduling
                    </span>
                    <span className="flex items-center gap-1">
                      <IonIcon icon={ribbonOutline} /> Loyalty Rewards
                    </span>
                  </div>
                </div>
                <IonButton size="large" fill="solid" color="secondary" className="shrink-0 w-full sm:w-auto font-semibold">
                  Book Now
                </IonButton>
              </IonCardContent>
            </IonCard>

            {/* Upcoming Appointments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="ion-text-xl ion-font-semibold ion-tracking-tight">Upcoming Appointments</h3>
                <IonButton fill="clear" size="small" className="ion-text-sm">View all</IonButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAppointments.map((appointment) => (
                  <IonCard key={appointment.id} className="m-0">
                    <IonCardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <IonBadge color={getStatusBadgeVariant(appointment.status)}>
                          {appointment.status}
                        </IonBadge>
                        <span className="ion-font-bold ion-text-lg">${appointment.price.toFixed(2)}</span>
                      </div>
                      <IonCardTitle className="ion-text-lg mt-2">{appointment.service}</IonCardTitle>
                      <IonCardSubtitle>
                        {appointment.date} at {appointment.time}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="space-y-2 ion-text-sm text-muted-foreground">
                         <div className="flex items-center gap-2">
                            <IonIcon icon={locationOutline} className="text-base" />
                            <span>{appointment.location || 'N/A'}</span>
                         </div>
                         {appointment.cleaner && (
                           <div className="flex items-center gap-2">
                              <IonIcon icon={carOutline} className="text-base" />
                              <span>Cleaner: {appointment.cleaner}</span>
                           </div>
                         )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <IonButton fill="outline" size="small" className="w-full">Reschedule</IonButton>
                        <IonButton fill="clear" size="small" className="w-full">Details</IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            </div>

            {/* Service History */}
            <div className="space-y-4">
               <h3 className="ion-text-xl ion-font-semibold ion-tracking-tight">Service History</h3>
               <IonCard className="m-0">
                 <IonCardContent className="p-0">
                    <div className="divide-y">
                      {serviceHistory.map((service) => (
                        <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                               <IonIcon icon={checkmarkCircleOutline} className="text-xl" />
                            </div>
                            <div>
                               <p className="ion-font-medium">{service.service}</p>
                               <p className="ion-text-sm text-muted-foreground">{service.date} • {service.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                             <div className="text-right">
                                <p className="ion-font-bold">${service.price.toFixed(2)}</p>
                                {service.cleaner && <p className="ion-text-xs text-muted-foreground">{service.cleaner}</p>}
                             </div>
                             <IonButton fill="outline" size="small">Book Again</IonButton>
                          </div>
                        </div>
                      ))}
                    </div>
                 </IonCardContent>
               </IonCard>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomerDashboard;
