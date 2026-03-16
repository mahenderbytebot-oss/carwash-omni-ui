import React, { useState, useEffect, useRef } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent, 
  IonToast, 
  IonIcon, 
  IonButton,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  type RefresherEventDetail 
} from '@ionic/react';
import { 
  carSportOutline,
  timeOutline,
  personCircleOutline,
  addCircleOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { getTodayWashes, generateWashTask, type WashRecord } from '../../services/washService';
import { getScheduledSubscriptionsToday } from '../../services/subscriptionService';
import type { Subscription } from '../../services/customerService';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { useAuthStore } from '../../store/authStore';

const DailyWashes: React.FC = () => {
  const { user, logout } = useAuthStore();

  const [segment, setSegment] = useState<'generated' | 'missing'>('generated');
  const [generatedWashes, setGeneratedWashes] = useState<WashRecord[]>([]);
  const [missingSubscriptions, setMissingSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | number | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const hasFetched = useRef(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const washesData = await getTodayWashes();
      const scheduledSubs = await getScheduledSubscriptionsToday();

      console.log('--- DEBUG DAILY WASHES ---', { scheduledSubs, washesData });

      // Find which scheduled subscriptions do NOT have a wash generated today
      // Compare by subscription ID (most reliable — wash records are linked to subscriptions)
      const generatedSubscriptionIds = new Set(
        washesData
          .filter(w => w.subscriptionId != null)
          .map(w => w.subscriptionId!)
      );
      const missing = scheduledSubs.filter(sub => {
        return !generatedSubscriptionIds.has(Number(sub.id));
      });

      console.log('Missing subscriptions computed:', missing);

      setGeneratedWashes(washesData);
      setMissingSubscriptions(missing);
    } catch (error) {
      console.error('Error fetching daily washes data:', error);
      setToastMessage('Failed to load data. Please try again.');
      setToastColor('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchData();
    event.detail.complete();
  };

  const handleGenerate = async (subscriptionId: number) => {
    setGeneratingId(subscriptionId);
    try {
      await generateWashTask(subscriptionId);
      setToastMessage('Wash task generated safely!');
      setToastColor('success');
      await fetchData(); // Refresh lists
    } catch (error: unknown) {
      console.error('Error generating wash task:', error);
      setToastMessage('Failed to generate task. It may already exist.');
      setToastColor('danger');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateAllMissing = async () => {
    if (missingSubscriptions.length === 0) {
      setToastMessage('There are no missing subscriptions for today.');
      setToastColor('success');
      return;
    }
    setGeneratingAll(true);
    let successCount = 0;
    try {
      for (const sub of missingSubscriptions) {
        await generateWashTask(Number(sub.id));
        successCount++;
      }
      setToastMessage(`Successfully generated ${successCount} tasks!`);
      setToastColor('success');
      setSegment('generated');
    } catch (error) {
      console.error('Error generating multiple wash tasks:', error);
      setToastMessage(`Failed after generating ${successCount} tasks. Please try again.`);
      setToastColor('danger');
    } finally {
      setGeneratingAll(false);
      await fetchData();
    }
  };

  // Group generated washes by cleaner
  const groupedWashes = (generatedWashes || [])
  .reduce((acc, wash) => {
    const cleanerName = wash.cleanerName || 'Unassigned';
    if (!acc[cleanerName]) acc[cleanerName] = [];
    acc[cleanerName].push(wash);
    return acc;
  }, {} as Record<string, WashRecord[]>);

  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="min-h-screen bg-background pb-8">
          <DashboardHeader
            title="Daily Washes"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={handleLogout}
          />

          <div className="container mx-auto px-4 pt-6 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Today's Washes</h2>
                <p className="text-muted-foreground mt-1">
                  Manage tasks scheduled for today and generate missing ones.
                </p>
              </div>
              <IonButton 
                onClick={handleGenerateAllMissing} 
                disabled={generatingAll || generatingId !== null} 
                color="primary" 
                className="font-semibold"
              >
                {generatingAll ? <IonSpinner name="dots" /> : (
                  <>
                    <IonIcon icon={addCircleOutline} slot="start" />
                    Generate Missing Tasks
                  </>
                )}
              </IonButton>
            </div>

            <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as 'generated' | 'missing')} mode="ios" className="bg-muted p-1 rounded-lg">
              <IonSegmentButton value="generated">
                <IonLabel className="font-medium">
                  Generated ({generatedWashes.length})
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="missing">
                <IonLabel className="font-medium">
                  Missing ({missingSubscriptions.length})
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {loading ? (
              <div className="flex justify-center p-12">
                <IonSpinner />
              </div>
            ) : (
              <>
                {segment === 'generated' && (
                  <div className="space-y-6">
                    {Object.entries(groupedWashes).map(([cleanerName, washes]) => (
                      <div key={cleanerName} className="space-y-3">
                        <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg border border-border">
                          <IonIcon icon={personCircleOutline} className="text-xl text-primary" />
                          <h3 className="font-semibold text-lg">{cleanerName}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                            {washes.length} tasks
                          </span>
                        </div>
                        <div className="grid gap-3 pl-3">
                          {washes.map(wash => (
                            <div key={wash.id} className="border border-border/50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card shadow-sm hover:shadow-md transition-shadow">
                              <div className="mb-3 sm:mb-0">
                                <div className="flex items-center gap-2 font-medium text-lg">
                                  <IonIcon icon={carSportOutline} className="text-muted-foreground" />
                                  {wash.vehicleMake} {wash.vehicleModel}
                                </div>
                                <div className="text-sm font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md inline-block mt-1.5 ml-6">
                                  {wash.vehiclePlate}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 ml-6">
                                  <IonIcon icon={timeOutline} className="opacity-70" />
                                  {new Date(wash.scheduledDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  {wash.customerName && <span className="text-foreground/80 font-medium ml-1">• {wash.customerName}</span>}
                                </div>
                              </div>
                              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border self-end sm:self-auto ${
                                wash.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {wash.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {generatedWashes.length === 0 && (
                      <div className="text-center py-16 border border-dashed rounded-lg bg-muted/30">
                        <IonIcon icon={alertCircleOutline} className="text-4xl text-muted-foreground mb-3" />
                        <p className="text-lg font-medium text-foreground">No washes generated for today</p>
                        <p className="text-muted-foreground mt-1">Check the missing tab if any were expected</p>
                      </div>
                    )}
                  </div>
                )}

                {segment === 'missing' && (
                  <div className="space-y-4">
                    {missingSubscriptions.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-6">
                        <IonIcon icon={alertCircleOutline} className="text-xl shrink-0 mt-0.5" />
                        <p>These subscriptions are scheduled for a wash today based on their plan, but no corresponding wash task has been generated in the system. Click "Generate" to manually create the task for the cleaner.</p>
                      </div>
                    )}

                    {missingSubscriptions.map(sub => (
                       <div key={sub.id} className="border border-border/80 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card shadow-sm hover:shadow-md transition-shadow gap-4">
                         <div>
                            <div className="flex items-center gap-2 font-medium text-lg">
                              <IonIcon icon={carSportOutline} className="text-muted-foreground" />
                              {sub.vehicleMake} {sub.vehicleModel}
                            </div>
                            <div className="text-sm font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md inline-block mt-1.5 ml-6">
                              {sub.vehiclePlate}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm mt-3 ml-6 text-foreground/80">
                               {sub.customerName && <span className="font-medium mr-2">{sub.customerName}</span>}
                               {sub.planName && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded ml-auto sm:ml-0 font-medium border border-primary/20">{sub.planName}</span>}
                            </div>
                         </div>
                         <IonButton 
                           color="primary" 
                           fill="solid"
                           size="small"
                           disabled={generatingId === sub.id}
                           onClick={() => handleGenerate(Number(sub.id))}
                           className="font-medium tracking-wide w-full sm:w-auto mt-2 sm:mt-0"
                         >
                           {generatingId === sub.id ? <IonSpinner name="dots" /> : (
                             <>
                               <IonIcon icon={addCircleOutline} slot="start" />
                               Generate Task
                             </>
                           )}
                         </IonButton>
                       </div>
                    ))}

                    {missingSubscriptions.length === 0 && (
                      <div className="text-center py-16 border border-dashed rounded-lg bg-muted/30">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IonIcon icon={carSportOutline} className="text-xl text-green-600" />
                        </div>
                        <p className="text-lg font-medium text-foreground">All caught up!</p>
                        <p className="text-muted-foreground mt-1">No missing washes detected for today.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          onDidDismiss={() => setToastMessage('')}
          position="bottom"
          buttons={[{ text: 'OK', role: 'cancel' }]}
        />
      </IonContent>
    </IonPage>
  );
};

export default DailyWashes;
