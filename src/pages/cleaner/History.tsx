import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent, 
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonText,
  IonItem,
  IonLabel,
  IonButton,
  IonDatetime,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  type RefresherEventDetail
} from '@ionic/react';
import { 
  calendarOutline, 
  filterOutline, 
  locationOutline, 
  carOutline 
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { getWashHistory, type WashAssignment } from '../../services/cleanerDashboardService';

const PartnerHistory: React.FC = () => {
  const { user, logout } = useAuthStore();

  const [washes, setWashes] = useState<WashAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const pageSize = 10;

  const fetchHistory = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const data = await getWashHistory(
        startDate || undefined, 
        endDate || undefined, 
        status || undefined, 
        currentPage, 
        pageSize
      );
      
      if (reset) {
        setWashes(data.content);
      } else {
        setWashes(prev => [...prev, ...data.content]);
      }
      
      setTotalElements(data.totalElements);
      // Check if we have more pages
      setHasMore(data.number < data.totalPages - 1);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(true);
  }, []); // Initial load

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchHistory(true);
    event.detail.complete();
  };

  const handleInfinite = async (ev: CustomEvent<void>) => {
    await fetchHistory();
    (ev.target as HTMLIonInfiniteScrollElement).complete();
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    fetchHistory(true);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    setShowFilterModal(false);
    // Needed to trigger re-fetch after state update effectively
    // We can just call fetchHistory(true) but states might not be updated yet in closure
    // So we use a timeout or effect, but for simplicity here:
    setTimeout(() => {
        // Re-fetch with cleared values
        getWashHistory(undefined, undefined, undefined, 0, pageSize).then(data => {
            setWashes(data.content);
            setTotalElements(data.totalElements);
            setHasMore(data.number < data.totalPages - 1);
            setPage(1);
        });
    }, 100);
  };

  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'VERIFIED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'SCHEDULED': return 'warning';
      case 'ASSIGNED': return 'warning';
      case 'VEHICLE_NOT_AVAILABLE': return 'danger';
      case 'MISSED': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonContent>
        <DashboardHeader
          title="Wash History"
          userName={user?.name || 'Cleaner'}
          userRole={user?.role || 'CLEANER'}
          onLogout={handleLogout}
        />

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding">
           <div className="flex justify-between items-center mb-4">
               <div>
                   <IonText color="dark"><h2 className="ion-no-margin font-bold">History</h2></IonText>
                   <IonText color="medium"><p className="ion-no-margin text-sm">{totalElements} records found</p></IonText>
               </div>
               <IonButton fill="outline" size="small" onClick={() => setShowFilterModal(true)}>
                   <IonIcon icon={filterOutline} slot="start" />
                   Filters
               </IonButton>
           </div>

           {/* Active Filters Display */}
           {(startDate || endDate || status) && (
               <div className="flex gap-2 flex-wrap mb-4">
                   {startDate && <IonBadge color="light">From: {startDate}</IonBadge>}
                   {endDate && <IonBadge color="light">To: {endDate}</IonBadge>}
                   {status && <IonBadge color="light">Status: {status}</IonBadge>}
               </div>
           )}

           <div className="space-y-4">
               {washes.map(wash => (
                   <IonCard key={wash.id} className="ion-no-margin">
                       <IonCardHeader>
                           <div className="flex justify-between">
                               <div>
                                   <IonCardSubtitle>{wash.planName || 'Wash'}</IonCardSubtitle>
                                   <IonCardTitle className="text-lg">{wash.customerName}</IonCardTitle>
                               </div>
                               <IonBadge color={getStatusBadgeColor(wash.status)}>{wash.status}</IonBadge>
                           </div>
                       </IonCardHeader>
                       <IonCardContent>
                           <p className="flex items-center gap-2 mb-1">
                               <IonIcon icon={calendarOutline} />
                               {new Date(wash.scheduledDateTime).toLocaleDateString()} {new Date(wash.scheduledDateTime).toLocaleTimeString()}
                           </p>
                           <p className="flex items-center gap-2 mb-1">
                               <IonIcon icon={locationOutline} />
                               {wash.customerAddress}
                           </p>
                           <p className="flex items-center gap-2">
                               <IonIcon icon={carOutline} />
                               {wash.vehicleMake} {wash.vehicleModel} - {wash.vehiclePlate}
                           </p>
                           {wash.notes && (
                               <p className="mt-2 text-sm italic text-gray-500">Note: {wash.notes}</p>
                           )}
                       </IonCardContent>
                   </IonCard>
               ))}
           </div>
           
           {washes.length === 0 && !loading && (
               <div className="text-center p-8 text-gray-500">
                   <p>No wash history found.</p>
               </div>
           )}

           <IonInfiniteScroll
               onIonInfinite={handleInfinite}
               threshold="100px"
               disabled={!hasMore}
           >
               <IonInfiniteScrollContent
                   loadingSpinner="bubbles"
                   loadingText="Loading more data..."
               />
           </IonInfiniteScroll>
        </div>

        {/* Filter Modal */}
        <IonModal isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <IonContent className="ion-padding">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filter History</h2>
                    <IonButton fill="clear" onClick={() => setShowFilterModal(false)}>Close</IonButton>
                </div>
                
                <div className="space-y-4">
                    <IonItem>
                        <IonLabel position="stacked">Status</IonLabel>
                        <IonSelect value={status} placeholder="Select Status" onIonChange={e => setStatus(e.detail.value)}>
                            <IonSelectOption value="">All</IonSelectOption>
                            <IonSelectOption value="COMPLETED">Completed</IonSelectOption>
                            <IonSelectOption value="VEHICLE_NOT_AVAILABLE">Vehicle Not Available</IonSelectOption>
                            <IonSelectOption value="IN_PROGRESS">In Progress</IonSelectOption>
                            <IonSelectOption value="MISSED">Missed</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <div className="grid grid-cols-2 gap-4">
                        <IonItem>
                            <IonLabel position="stacked">From Date</IonLabel>
                            <IonDatetime 
                                presentation="date" 
                                value={startDate} 
                                onIonChange={e => setStartDate(Array.isArray(e.detail.value) ? e.detail.value[0] : e.detail.value || '')}
                            />
                        </IonItem>
                         <IonItem>
                            <IonLabel position="stacked">To Date</IonLabel>
                            <IonDatetime 
                                presentation="date" 
                                value={endDate} 
                                onIonChange={e => setEndDate(Array.isArray(e.detail.value) ? e.detail.value[0] : e.detail.value || '')}
                            />
                        </IonItem>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <IonButton expand="block" fill="outline" className="flex-1" onClick={clearFilters}>
                            Clear
                        </IonButton>
                        <IonButton expand="block" className="flex-1" onClick={applyFilters}>
                            Apply Filters
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default PartnerHistory;
