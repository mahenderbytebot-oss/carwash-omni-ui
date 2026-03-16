import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonRefresher, 
  IonRefresherContent, 
  IonToast, 
  IonButton, 
  IonCard, 
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonText,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  type RefresherEventDetail 
} from '@ionic/react';
import { 
  checkmarkCircleOutline,
  timeOutline,
  locationOutline,
  carOutline,
  alertCircleOutline,
  documentTextOutline,
  cloudUploadOutline
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { Network } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';
import { 
  getAssignedWashes, 
  updateWashStatus, 
  type WashAssignment 
} from '../../services/cleanerDashboardService';
import { processSyncQueue } from '../../services/offlineSyncService';

/**
 * Partner Dashboard Component
 * 
 * Shows assigned washes and allows cleaners to start/complete tasks.
 */
const PartnerDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  
  const [assignments, setAssignments] = useState<WashAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [fileMap, setFileMap] = useState<Record<number, File[]>>({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('success');
  const [isOffline, setIsOffline] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'inProgress' | 'completed' | 'total'>('pending');

  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  const fetchAssignments = async () => {
    try {
      const data = await getAssignedWashes();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to fetch assignments', error);
      setToastMessage('Failed to load assignments');
      setToastColor('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();

    let networkListener: PluginListenerHandle;

    const setupNetwork = async () => {
      // Check initial status
      const status = await Network.getStatus();
      setIsOffline(!status.connected);

      // Listen for network changes
      networkListener = await Network.addListener('networkStatusChange', async (status) => {
        setIsOffline(!status.connected);
        
        if (status.connected) {
          setToastMessage('Back online. Syncing changes...');
          setToastColor('success');
          try {
            await processSyncQueue();
            await fetchAssignments(); // refresh after sync
          } catch (e) {
            console.error('Failed to sync queue', e);
          }
        } else {
          setToastMessage('You are offline. Changes will be saved locally.');
          setToastColor('warning');
        }
      });
    };

    setupNetwork();

    return () => {
      if (networkListener) {
        networkListener.remove();
      }
    };
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchAssignments();
    event.detail.complete();
  };

  const handleStartTask = async (washId: number) => {
    setUpdating(washId);
    try {
      await updateWashStatus(washId, 'IN_PROGRESS');
      setToastMessage(isOffline ? 'Task started locally' : 'Task started!');
      setToastColor(isOffline ? 'warning' : 'success');
      await fetchAssignments();
    } catch {
      setToastMessage('Failed to start task');
      setToastColor('danger');
    } finally {
      setUpdating(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, washId: number) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setFileMap(prev => ({ ...prev, [washId]: files }));
    }
  };

  const handleCompleteTask = async (washId: number) => {
    setUpdating(washId);
    try {
      const photos = fileMap[washId];
      await updateWashStatus(washId, 'COMPLETED', undefined, photos);
      setToastMessage(isOffline ? 'Task completed locally' : 'Task completed!');
      setToastColor(isOffline ? 'warning' : 'success');
      // Clear files
      setFileMap(prev => {
        const newMap = { ...prev };
        delete newMap[washId];
        return newMap;
      });
      await fetchAssignments();
    } catch {
      setToastMessage('Failed to complete task');
      setToastColor('danger');
    } finally {
      setUpdating(null);
    }
  };

  const handleVehicleNotAvailable = async (washId: number) => {
    setUpdating(washId);
    try {
      await updateWashStatus(washId, 'VEHICLE_NOT_AVAILABLE', 'Vehicle not at parking location');
      setToastMessage(isOffline ? 'Marked as vehicle not available locally' : 'Marked as vehicle not available');
      setToastColor(isOffline ? 'warning' : 'success');
      await fetchAssignments();
    } catch {
      setToastMessage('Failed to update status');
      setToastColor('danger');
    } finally {
      setUpdating(null);
    }
  };

  // Calculate task statistics
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => ['COMPLETED', 'VERIFIED', 'VEHICLE_NOT_AVAILABLE', 'MISSED'].includes(a.status)).length,
    inProgress: assignments.filter(a => a.status === 'IN_PROGRESS').length,
    pending: assignments.filter(a => a.status === 'SCHEDULED' || a.status === 'ASSIGNED').length
  };

  const filteredAssignments = assignments.filter(a => {
    if (activeFilter === 'total') return true;
    if (activeFilter === 'pending') return ['SCHEDULED', 'ASSIGNED'].includes(a.status);
    if (activeFilter === 'inProgress') return a.status === 'IN_PROGRESS';
    if (activeFilter === 'completed') return ['COMPLETED', 'VERIFIED', 'VEHICLE_NOT_AVAILABLE', 'MISSED'].includes(a.status);
    return true;
  });

  const getStatusBadgeColor = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'medium' => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'VERIFIED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'SCHEDULED': return 'warning';
      case 'ASSIGNED': return 'warning';
      case 'VEHICLE_NOT_AVAILABLE': return 'danger';
      default: return 'medium';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return checkmarkCircleOutline;
      case 'IN_PROGRESS': return timeOutline;
      case 'SCHEDULED': return alertCircleOutline;
      default: return alertCircleOutline;
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding-bottom">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        
        <DashboardHeader
          title="Partner Dashboard"
          userName={user?.name || 'Cleaner'}
          userRole={user?.role || 'CLEANER'}
          onLogout={handleLogout}
        />

        <div className="ion-padding">
          <IonText color="dark">
            <h2 className="ion-no-margin ion-text-bold">
              Welcome back, {user?.name?.split(' ')[0] || 'Cleaner'}!
            </h2>
          </IonText>
          <IonText color="medium">
            <p className="ion-no-margin ion-margin-top">
              Here are your task assignments for today.
            </p>
          </IonText>
        </div>

        {isOffline && (
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 mx-4 mb-4 rounded-md text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IonIcon icon={alertCircleOutline} />
              <span>Offline Mode. Changes will sync when reconnected.</span>
            </div>
          </div>
        )}

        {/* Task Statistics Overview */}
        <IonCard className="ion-margin-horizontal ion-margin-bottom">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol 
                  size="3" 
                  className={`ion-text-center rounded-lg cursor-pointer ${activeFilter === 'pending' ? 'bg-warning/10 border border-warning/30' : ''}`} 
                  onClick={() => setActiveFilter('pending')}
                >
                   <IonText color="warning"><h1>{stats.pending}</h1></IonText>
                   <IonText color="medium"><p className="ion-no-margin" style={{ fontSize: '0.75rem' }}>Pending</p></IonText>
                </IonCol>
                <IonCol 
                  size="3" 
                  className={`ion-text-center rounded-lg cursor-pointer ${activeFilter === 'inProgress' ? 'bg-primary/10 border border-primary/30' : ''}`} 
                  onClick={() => setActiveFilter('inProgress')}
                >
                   <IonText color="primary"><h1>{stats.inProgress}</h1></IonText>
                   <IonText color="medium"><p className="ion-no-margin" style={{ fontSize: '0.75rem' }}>Active</p></IonText>
                </IonCol>
                <IonCol 
                  size="3" 
                  className={`ion-text-center rounded-lg cursor-pointer ${activeFilter === 'completed' ? 'bg-success/10 border border-success/30' : ''}`} 
                  onClick={() => setActiveFilter('completed')}
                >
                   <IonText color="success"><h1>{stats.completed}</h1></IonText>
                   <IonText color="medium"><p className="ion-no-margin" style={{ fontSize: '0.75rem' }}>Done</p></IonText>
                </IonCol>
                <IonCol 
                  size="3" 
                  className={`ion-text-center rounded-lg cursor-pointer ${activeFilter === 'total' ? 'bg-medium/10 border border-medium/30' : ''}`} 
                  onClick={() => setActiveFilter('total')}
                >
                   <IonText color="dark"><h1>{stats.total}</h1></IonText>
                   <IonText color="medium"><p className="ion-no-margin" style={{ fontSize: '0.75rem' }}>Total</p></IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Task Assignments */}
        <div className="ion-padding-horizontal">
          <div className="ion-padding-bottom flex justify-between items-center">
            <IonText color="dark"><h3 className="ion-no-margin ion-text-bold">Today's Assignments</h3></IonText>
          </div>

          {loading ? (
            <div className="ion-text-center ion-padding"><IonNote>Loading tasks...</IonNote></div>
          ) : assignments.length === 0 ? (
            <IonCard className="ion-margin-top">
              <IonCardContent className="ion-text-center ion-padding">
                <IonIcon icon={carOutline} style={{ fontSize: '4rem', color: 'var(--ion-color-medium)' }} />
                <IonText color="dark"><h3 className="ion-margin-top">No assignments for today</h3></IonText>
                <IonText color="medium"><p>Check back later for new tasks.</p></IonText>
              </IonCardContent>
            </IonCard>
          ) : filteredAssignments.length === 0 ? (
            <div className="ion-text-center ion-padding"><IonNote>No {activeFilter === 'inProgress' ? 'active' : activeFilter} tasks</IonNote></div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <IonCard key={assignment.id} className="ion-no-margin ion-margin-bottom">
                  <IonCardHeader className="ion-padding-top ion-padding-horizontal">
                    <div className="flex justify-between items-start w-full gap-2">
                      <div className="flex-1">
                        <IonText color="medium">
                          <h3 className="ion-no-margin" style={{ fontSize: '0.9rem' }}>{assignment.planName || 'Wash Service'}</h3>
                        </IonText>
                        <IonCardTitle className="ion-margin-top" style={{ fontSize: '1.25rem' }}>{assignment.customerName || 'Customer'}</IonCardTitle>
                      </div>
                      <div className="flex-shrink-0">
                        <IonBadge color={getStatusBadgeColor(assignment.status)} className="ion-padding-horizontal py-1 flex items-center gap-1">
                          <IonIcon icon={getStatusIcon(assignment.status)} />
                          {formatStatus(assignment.status)}
                        </IonBadge>
                      </div>
                    </div>
                  </IonCardHeader>
                  
                  <IonCardContent className="ion-no-padding">
                    <IonList lines="none">
                      <IonItem>
                        <IonIcon icon={locationOutline} slot="start" color="medium" />
                        <IonLabel className="ion-text-wrap">
                          <IonText color="medium"><p style={{ fontSize: '0.8rem' }}>Location</p></IonText>
                          <IonText color="dark"><h3>{assignment.customerAddress || 'Address not provided'}</h3></IonText>
                        </IonLabel>
                      </IonItem>
                      
                      <IonItem>
                        <IonIcon icon={carOutline} slot="start" color="medium" />
                        <IonLabel className="ion-text-wrap">
                          <IonText color="medium"><p style={{ fontSize: '0.8rem' }}>Vehicle</p></IonText>
                          <IonText color="dark"><h3>{assignment.vehicleMake} {assignment.vehicleModel} ({assignment.vehiclePlate})</h3></IonText>
                        </IonLabel>
                      </IonItem>
                      
                      <IonItem>
                        <IonIcon icon={timeOutline} slot="start" color="medium" />
                        <IonLabel className="ion-text-wrap">
                          <IonText color="medium"><p style={{ fontSize: '0.8rem' }}>Scheduled</p></IonText>
                          <IonText color="dark"><h3>{assignment.scheduledDateTime}</h3></IonText>
                        </IonLabel>
                      </IonItem>
                      
                      {assignment.notes && (
                        <IonItem>
                          <IonIcon icon={documentTextOutline} slot="start" color="medium" />
                          <IonLabel className="ion-text-wrap">
                            <IonText color="medium"><p style={{ fontSize: '0.8rem' }}>Notes</p></IonText>
                            <IonText color="dark"><p className="ion-text-italic">{assignment.notes}</p></IonText>
                          </IonLabel>
                        </IonItem>
                      )}
                    </IonList>

                    {/* Actions Area */}
                    <div className="ion-padding">
                      {(assignment.status === 'SCHEDULED' || assignment.status === 'ASSIGNED') && (
                        <div className="flex flex-col gap-2">
                          <IonButton 
                            expand="block"
                            color="success"
                            onClick={() => handleStartTask(assignment.id)}
                            disabled={updating === assignment.id}
                          >
                            {updating === assignment.id ? 'Starting...' : 'Start Task'}
                          </IonButton>
                          <IonButton 
                            expand="block"
                            fill="outline"
                            color="medium"
                            onClick={() => handleVehicleNotAvailable(assignment.id)}
                            disabled={updating === assignment.id}
                          >
                            {updating === assignment.id ? 'Updating...' : 'Vehicle Not Available'}
                          </IonButton>
                        </div>
                      )}

                      {assignment.status === 'IN_PROGRESS' && (
                        <div className="flex flex-col gap-3">
                           <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 text-center relative">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleFileSelect(e, assignment.id)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id={`file-upload-${assignment.id}`}
                            />
                            <div className="flex flex-col items-center justify-center pointer-events-none">
                              <IonIcon icon={cloudUploadOutline} style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }} color="primary" />
                              <IonText color="primary">
                                <h3 className="ion-no-margin" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                  {fileMap[assignment.id] && fileMap[assignment.id].length > 0
                                    ? `${fileMap[assignment.id].length} photos selected`
                                    : 'Tap to upload photos (optional)'}
                                </h3>
                              </IonText>
                              <IonText color="medium">
                                <p className="ion-no-margin" style={{ fontSize: '0.75rem' }}>Evidence of work done</p>
                              </IonText>
                            </div>
                          </div>

                          <IonButton 
                            expand="block"
                            color="primary"
                            onClick={() => handleCompleteTask(assignment.id)}
                            disabled={updating === assignment.id}
                          >
                            <IonIcon slot="start" icon={checkmarkCircleOutline} />
                            {updating === assignment.id ? 'Completing...' : 'Complete Task'}
                          </IonButton>
                        </div>
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>
        
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage('')}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default PartnerDashboard;
