/**
 * Cleaner Details Page
 * 
 * Displays detailed information about a specific cleaner.
 */

import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  type RefresherEventDetail
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { arrowBack, callOutline, mailOutline, locationOutline } from 'ionicons/icons';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import { useAuthStore } from '../../../store/authStore';
// Removed custom component imports
import { getCleanerById, type Cleaner } from '../../../services/cleanerService';

const CleanerDetails: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [cleaner, setCleaner] = useState<Cleaner | null>(null);

  useEffect(() => {
    fetchCleaner();
  }, [id]);

  const fetchCleaner = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCleanerById(Number(id));
      setCleaner(data);
    } catch (error) {
      console.error('Failed to fetch cleaner', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchCleaner();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className="min-h-screen bg-background pb-8">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <DashboardHeader
            title="Cleaner Details"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={() => { logout(); history.push('/login'); }}
          />

          <div className="container mx-auto px-4 pt-6 space-y-6">
            {/* Back Button */}
            <IonButton fill="clear" onClick={() => history.goBack()} className="pl-0">
              <IonIcon icon={arrowBack} slot="start" />
              Back to Partners
            </IonButton>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading cleaner details...</div>
            ) : !cleaner ? (
              <div className="text-center py-12 border rounded-lg bg-card">
                <h3 className="text-lg font-semibold">Cleaner not found</h3>
              </div>
            ) : (
              <>
                {/* Header Card */}
                <IonCard className="m-0">
                  <IonCardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
                          {cleaner.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{cleaner.name}</h2>
                          <IonBadge color={cleaner.active ? "success" : "medium"} className="mt-1">
                            {cleaner.active ? 'Active' : 'Inactive'}
                          </IonBadge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <IonBadge color="secondary">{cleaner.assignedSubscriptionsCount} Subscriptions</IonBadge>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>

                {/* Contact Info */}
                <IonCard className="m-0">
                  <IonCardHeader>
                    <IonCardTitle>Contact Information</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <IonIcon icon={callOutline} className="text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{cleaner.phone || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <IonIcon icon={mailOutline} className="text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium">{cleaner.email || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <IonIcon icon={locationOutline} className="text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Address</div>
                          <div className="font-medium">
                            {cleaner.address ? `${cleaner.address}, ${cleaner.city || ''} ${cleaner.state || ''} ${cleaner.zipCode || ''}`.trim() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>

                {/* Emergency Contact */}
                {(cleaner.emergencyContactName || cleaner.emergencyContactPhone) && (
                  <IonCard className="m-0">
                    <IonCardHeader>
                      <IonCardTitle>Emergency Contact</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Name</div>
                          <div className="font-medium">{cleaner.emergencyContactName || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{cleaner.emergencyContactPhone || 'N/A'}</div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                )}
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CleanerDetails;
