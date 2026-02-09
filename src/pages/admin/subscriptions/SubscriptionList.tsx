/**
 * Subscription Plan List Page
 * 
 * Displays a list of all subscription plans for the service provider.
 * Allows creating new plans.
 */

import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonRefresher, 
  IonRefresherContent, 
  IonButton,
  type RefresherEventDetail
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addOutline } from 'ionicons/icons';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import { useAuthStore } from '../../../store/authStore';
import { Card, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { getPlans, type Plan } from '../../../services/subscriptionService';
import CreatePlanModal from '../../../components/subscriptions/CreatePlanModal';
import CreateSubscriptionWizard from '../../../components/subscriptions/CreateSubscriptionWizard';

const SubscriptionList: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(true);
  
  // Plans Data
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isCreateSubscriptionWizardOpen, setIsCreateSubscriptionWizardOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const plansData = await getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchData();
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
            title="Subscription Plans"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={() => { logout(); history.push('/login'); }}
          />

          <div className="container mx-auto px-4 pt-6 space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="ion-text-3xl ion-font-bold ion-tracking-tight">Subscription Plans</h2>
                <p className="text-muted-foreground mt-1">
                  Manage plans and customer subscriptions
                </p>
              </div>
              <div className="flex gap-2">
                <IonButton fill="outline" onClick={() => setIsCreateSubscriptionWizardOpen(true)}>
                  <IonIcon icon={addOutline} slot="start" />
                  New Subscription
                </IonButton>
                <IonButton onClick={() => setIsCreatePlanModalOpen(true)}>
                  <IonIcon icon={addOutline} slot="start" />
                  New Plan
                </IonButton>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="space-y-4">
                 {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading plans...</div>
                 ) : plans.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-card">
                      <h3 className="ion-text-lg ion-font-semibold">No plans available</h3>
                      <p className="text-muted-foreground mt-1">Create a plan to get started.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plans.map(plan => (
                        <Card key={plan.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                             <div className="flex justify-between items-start mb-2">
                               <h3 className="ion-font-bold ion-text-xl">{plan.name}</h3>
                               <Badge variant="outline">₹{plan.price}</Badge>
                            </div>
                            <p className="text-muted-foreground ion-text-sm mb-4">{plan.description}</p>
                            <div className="space-y-2 ion-text-sm">
                               <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="ion-font-medium">30 Days</span>
                                </div>
                               <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Washes</span>
                                  <span className="ion-font-medium">4 / week</span>
                               </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                 )}
            </div>

            <CreatePlanModal
              isOpen={isCreatePlanModalOpen}
              onClose={() => setIsCreatePlanModalOpen(false)}
              onSuccess={() => fetchData()}
            />
            
            <CreateSubscriptionWizard
              isOpen={isCreateSubscriptionWizardOpen}
              onClose={() => setIsCreateSubscriptionWizardOpen(false)}
              onSuccess={() => {
                setIsCreateSubscriptionWizardOpen(false);
              }}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SubscriptionList;
