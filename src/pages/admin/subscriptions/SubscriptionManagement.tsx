import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButtons,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonSpinner,
  useIonAlert,
  useIonToast,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonModal,
  IonLabel,
  IonToggle
} from '@ionic/react';
import { search, refresh, cash, time, person } from 'ionicons/icons';
import { searchSubscriptions, renewSubscription, updatePaymentStatus, assignCleaner } from '../../../services/subscriptionService';
import type { Subscription } from '../../../services/customerService';
import { getAllCleaners, type Cleaner } from '../../../services/cleanerService';
import { Button } from '../../../components/ui/Button';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import { useAuthStore } from '../../../store/authStore';
import { useHistory, useLocation } from 'react-router-dom'; 

const SubscriptionManagement: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const { user, logout } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>('');
  
  // Initialize from URL params
  const [status, setStatus] = useState<string>(queryParams.get('status') || '');
  const [unassignedOnly, setUnassignedOnly] = useState<boolean>(queryParams.get('unassigned') === 'true');
  
  // Sync state with URL params when they change
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const statusParam = params.get('status');
      const unassignedParam = params.get('unassigned');
      
      if (statusParam !== null && statusParam !== status) {
          setStatus(statusParam);
      }
      
      if (unassignedParam !== null) {
          setUnassignedOnly(unassignedParam === 'true');
      }
  }, [location.search]);

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  // Payment Modal State
  const [paymentMode, setPaymentMode] = useState<string>('CASH');
  const [onlineType, setOnlineType] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  
  // Cleaner Assignment State
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedCleanerId, setSelectedCleanerId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState<boolean>(false);
  
  const [present] = useIonAlert();
  const [presentToast] = useIonToast();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await searchSubscriptions(keyword, status, unassignedOnly, page);
      setSubscriptions(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      presentToast({
          message: 'Failed to fetch subscriptions',
          duration: 2000,
          color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  }, [keyword, status, unassignedOnly, page, presentToast]);

  useEffect(() => {
    fetchData();
    fetchCleaners();
  }, [fetchData]);

  const fetchCleaners = async () => {
      try {
          const data = await getAllCleaners();
          setCleaners(data.filter(c => c.active));
      } catch (error) {
          console.error("Failed to load cleaners", error);
      }
  };

  useEffect(() => {
      console.log("Cleaners loaded:", cleaners);
  }, [cleaners]);

  const handleSearch = () => {
    setPage(0);
    fetchData();
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleRenew = async (sub: Subscription) => {
      present({
          header: 'Confirm Renewal',
          message: `Are you sure you want to renew the subscription for ${sub.vehiclePlate}? This will extend it by the plan duration.`,
          buttons: [
              'Cancel',
              {
                  text: 'Renew',
                  handler: async () => {
                      try {
                          await renewSubscription(sub.id);
                          presentToast({ message: 'Subscription renewed successfully', duration: 2000, color: 'success' });
                          fetchData();
                      } catch (e) {
                          presentToast({ message: 'Failed to renew subscription', duration: 2000, color: 'danger' });
                      }
                  }
              }
          ]
      });
  };

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const viewHistory = (sub: Subscription) => {
      setSelectedSub(sub);
      setShowHistoryModal(true);
  };

  const openPaymentModal = (sub: Subscription) => {
    setSelectedSub(sub);
    setPaymentMode('CASH');
    setOnlineType('');
    setReference('');
    setShowPaymentModal(true);
  };

  const openAssignModal = (sub: Subscription) => {
      setSelectedSub(sub);
      setSelectedCleanerId(sub.cleanerId || null);
      setShowAssignModal(true);
  };

  const handleAssignCleaner = async () => {
      if (!selectedSub) return;
      if (!selectedCleanerId) {
          presentToast({ message: 'Please select a cleaner', duration: 2000, color: 'warning' });
          return;
      }

      try {
          setAssigning(true);
          await assignCleaner(Number(selectedSub.id), selectedCleanerId); // Ensure subscription ID is number if needed, current service takes number
          setShowAssignModal(false);
          presentToast({ message: 'Cleaner assigned successfully', duration: 2000, color: 'success' });
          fetchData();
      } catch (error) {
          presentToast({ message: 'Failed to assign cleaner', duration: 2000, color: 'danger' });
      } finally {
          setAssigning(false);
      }
  };

  const submitPayment = async () => {
    if (!selectedSub) return;
    
    if (paymentMode === 'ONLINE' && !onlineType) {
         presentToast({ message: 'Please select online payment type', duration: 2000, color: 'warning' });
         return;
    }

    try {
      setProcessing(true);
      await updatePaymentStatus(selectedSub.id, 'PAID', paymentMode, onlineType, reference);
      setShowPaymentModal(false);
      presentToast({
        message: 'Payment recorded successfully',
        duration: 2000,
        color: 'success',
        icon: cash
      });
      fetchData();
    } catch (error) {
       presentToast({
        message: 'Failed to record payment',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDays = (days?: string[]) => {
      if (!days || days.length === 0) return 'N/A';
      return days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3).toLowerCase()).join(', ');
  };

  const getStatusBadge = (status: string) => {
      const isPaid = status === 'PAID' || status === 'ACTIVE';
      const isPending = status === 'PENDING';
      const isExpired = status === 'EXPIRED';
      const isCanceled = status === 'CANCELED';
      
      let colorClass = 'bg-gray-500';
      if (isPaid) colorClass = 'bg-green-500';
      else if (isPending) colorClass = 'bg-yellow-500';
      else if (isExpired) colorClass = 'bg-orange-500';
      else if (isCanceled) colorClass = 'bg-red-500';

      const label = status || 'UNKNOWN';
      
      return (
          <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`}></span>
              <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
      );
  };

  const getExpiryDisplay = (days: number | undefined) => {
      if (days === undefined) return <span className="text-muted-foreground">-</span>;
      
      let colorClass = 'text-green-600 dark:text-green-400';
      if (days < 0) colorClass = 'text-red-600 dark:text-red-400 font-bold';
      else if (days <= 5) colorClass = 'text-orange-600 dark:text-orange-400 font-bold';
      
      return (
          <span className={colorClass}>
              {days < 0 ? 'Expired' : `${days} Days`}
          </span>
      );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
         <DashboardHeader 
            title="Subscriptions"
            subtitle="Manage customer subscriptions and payments"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={() => { logout(); history.push('/login'); }}
         />
        <IonToolbar className="bg-background/50">
             <div className="flex flex-col sm:flex-row gap-3 p-3 max-w-6xl mx-auto w-full">
                 <div className="relative flex-1">
                    <IonSearchbar 
                        value={keyword} 
                        onIonInput={e => setKeyword(e.detail.value!)}
                        onIonClear={() => { setKeyword(''); setPage(0); fetchData(); }}
                        onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by vehicle, phone or name..."
                        className="custom-searchbar px-0 pb-0"
                        showClearButton="focus"
                    />
                 </div>
                 
                 <div className="flex gap-2 min-w-[200px] h-10">
                     <div className="w-full bg-card border rounded-md flex items-center px-1 overflow-hidden h-full">
                         <IonSelect 
                            value={status} 
                            placeholder="Subscription Status" 
                            onIonChange={e => { setStatus(e.detail.value); setPage(0); }}
                            interface="popover"
                            disabled={unassignedOnly}
                            className="w-full text-sm font-medium"
                            style={{ '--padding-top': '8px', '--padding-bottom': '8px', '--padding-start': '8px' }}
                         >
                             <IonSelectOption value="">All Statuses</IonSelectOption>
                             <IonSelectOption value="ACTIVE">Active</IonSelectOption>
                             <IonSelectOption value="EXPIRED">Expired</IonSelectOption>
                             <IonSelectOption value="CANCELED">Canceled</IonSelectOption>
                         </IonSelect>
                     </div>
                     <div className="flex items-center gap-2 bg-card border rounded-md px-3 h-10 whitespace-nowrap">
                        <IonToggle 
                            checked={unassignedOnly}
                            onIonChange={e => { setUnassignedOnly(e.detail.checked); setPage(0); }}
                            className="scale-75 -ml-1"
                        />
                        <IonLabel className="text-sm font-medium">Unassigned Only</IonLabel>
                     </div>
                     <Button onClick={handleSearch} className="h-10 w-12 shrink-0">
                         <IonIcon icon={search} />
                     </Button>
                 </div>
             </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-muted/5">
        <div className="max-w-7xl mx-auto space-y-6">
            
            {loading && <div className="text-center py-12"><IonSpinner name="dots" className="scale-150 text-primary"/></div>}
            
            {!loading && subscriptions.length === 0 && (
                <div className="text-center py-16 bg-card rounded-xl border border-dashed">
                    <div className="text-muted-foreground text-lg">No subscriptions found</div>
                    <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
                </div>
            )}

            {!loading && subscriptions.length > 0 && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block soft-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="!pl-10 pr-6 h-12 text-left text-sm font-medium text-muted-foreground w-[15%] align-middle">Customer & Vehicle</th>
                                        <th className="px-6 h-12 text-left text-sm font-medium text-muted-foreground w-[12%] align-middle">Plan</th>
                                        <th className="px-6 h-12 text-left text-sm font-medium text-muted-foreground w-[13%] align-middle">Duration</th>
                                        <th className="px-6 h-12 text-left text-sm font-medium text-muted-foreground w-[14%] align-middle">Schedule</th>
                                        <th className="px-6 h-12 text-left text-sm font-medium text-muted-foreground w-[12%] align-middle">Cleaner</th>
                                        <th className="px-6 h-12 text-left text-sm font-medium text-muted-foreground w-[10%] align-middle">Expiry</th>
                                        <th className="px-6 h-12 text-left text-sm font-medium text-muted-foreground w-[10%] align-middle">Status</th>
                                        <th className="pl-6 !pr-10 h-12 text-right text-sm font-medium text-muted-foreground w-[14%] align-middle">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {subscriptions.map(sub => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="!pl-10 pr-6 h-16 align-middle">
                                                <div className="font-medium text-foreground">{sub.customerName}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{sub.vehiclePlate}</div>
                                                <div className="text-xs text-muted-foreground/80">{sub.customerPhone}</div>
                                            </td>
                                            <td className="px-6 h-16 align-middle">
                                                <div className="font-medium">{sub.planName}</div>
                                                <div className="text-xs text-muted-foreground">₹{sub.effectivePrice || sub.price}</div>
                                            </td>
                                            <td className="px-6 h-16 align-middle text-muted-foreground">
                                                <div className="flex flex-col text-xs">
                                                    <span>Start: {sub.startDate}</span>
                                                    <span>End: {sub.endDate}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 h-16 align-middle">
                                                <div className="text-xs font-medium text-foreground">
                                                    {formatDays(sub.scheduledDays)}
                                                </div>
                                            </td>
                                            <td className="px-6 h-16 align-middle">
                                                <div className="text-sm font-medium">
                                                    {sub.cleanerName ? (
                                                        <span className="text-foreground">{sub.cleanerName}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-xs">Unassigned</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 h-16 align-middle">
                                                {getExpiryDisplay(sub.daysToExpiry)}
                                            </td>
                                            <td className="px-6 h-16 align-middle">
                                                {getStatusBadge(sub.status || 'ACTIVE')}
                                            </td>
                                            <td className="pl-6 !pr-10 h-16 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => viewHistory(sub)} title="Payment History">
                                                        <IonIcon icon={time} />
                                                    </Button>
                                                    {sub.paymentStatus === 'PENDING' && (
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10" onClick={() => openPaymentModal(sub)} title="Record Payment">
                                                            <IonIcon icon={cash} />
                                                        </Button>
                                                    )}
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20" onClick={() => handleRenew(sub)} title="Renew Subscription">
                                                         <IonIcon icon={refresh} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20" onClick={() => openAssignModal(sub)} title="Assign Cleaner">
                                                         <IonIcon icon={person} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden grid gap-4">
                        {subscriptions.map(sub => (
                            <IonCard key={sub.id} className="mx-0 bg-card">
                                <IonCardContent className="p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                         <div>
                                            <h3 className="font-bold text-lg text-foreground">{sub.vehiclePlate}</h3>
                                            <p className="text-sm text-muted-foreground">{sub.customerName}</p>
                                         </div>
                                         {getStatusBadge(sub.status || 'ACTIVE')}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-sm py-2 border-y border-dashed">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Plan</p>
                                            <p className="font-medium">{sub.planName}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Cleaner: <span className="text-foreground">{sub.cleanerName || 'Unassigned'}</span></p>
                                        </div>
                                        <div className="text-right">
                                             <p className="text-xs text-muted-foreground">Expires In</p>
                                             {getExpiryDisplay(sub.daysToExpiry)}
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Start Date</p>
                                            <p>{sub.startDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">End Date</p>
                                            <p>{sub.endDate}</p>
                                        </div>
                                        <div className="col-span-2 pt-2 border-t border-dashed mt-1">
                                            <p className="text-xs text-muted-foreground">Schedule</p>
                                            <p className="text-sm font-medium">{formatDays(sub.scheduledDays)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                         <Button size="sm" variant="outline" className="flex-1" onClick={() => viewHistory(sub)}>
                                            <IonIcon icon={time} className="mr-2" />
                                            History
                                         </Button>
                                         {sub.paymentStatus === 'PENDING' && (
                                            <Button size="sm" className="flex-1" onClick={() => openPaymentModal(sub)}>
                                                <IonIcon icon={cash} className="mr-2" />
                                                Pay
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRenew(sub)}>
                                            <IonIcon icon={refresh} className="mr-2" />
                                            Renew
                                        </Button>
                                        <Button size="sm" variant="ghost" className="flex-1" onClick={() => openAssignModal(sub)}>
                                            <IonIcon icon={person} />
                                        </Button>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center bg-card rounded-lg border p-3 shadow-sm sticky bottom-0 z-10">
                            <Button variant="ghost" size="sm" onClick={handlePrevPage} disabled={page === 0} className="w-24">
                                Previous
                            </Button>
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleNextPage} disabled={page >= totalPages - 1} className="w-24">
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* History Modal */}
        <IonModal isOpen={showHistoryModal} onDidDismiss={() => setShowHistoryModal(false)} className="mx-auto max-w-lg">
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'white' }}>
                    <IonTitle>Payment History</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowHistoryModal(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'white' }}>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                         <div>
                             <h3 className="font-bold">{selectedSub?.vehiclePlate}</h3>
                             <p className="text-sm text-muted-foreground">{selectedSub?.customerName}</p>
                         </div>
                         <div className="text-right">
                             <p className="text-sm font-medium">{selectedSub?.planName}</p>
                         </div>
                     </div>

                     <div className="space-y-3">
                         <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Transactions</h4>
                         {selectedSub?.payments && selectedSub.payments.length > 0 ? (
                             selectedSub.payments.map((payment) => (
                                 <div key={payment.id} className="bg-card border rounded-lg p-3 flex justify-between items-center">
                                     <div>
                                         <div className="flex items-center gap-2">
                                             <span className="font-semibold">₹{payment.amount}</span>
                                             {getStatusBadge(payment.status)}
                                         </div>
                                         <p className="text-xs text-muted-foreground mt-1">
                                             {payment.type} • {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'No Date'}
                                         </p>
                                         {payment.mode && <p className="text-xs text-muted-foreground">{payment.mode} {payment.reference ? `(${payment.reference})` : ''}</p>}
                                     </div>
                                 </div>
                             ))
                         ) : (
                             <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                 No payment history available
                             </div>
                         )}
                     </div>
                 </div>
            </IonContent>
        </IonModal>

        {/* Payment Modal */}
        <IonModal isOpen={showPaymentModal} onDidDismiss={() => setShowPaymentModal(false)} className="mx-auto max-w-md">
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'white' }}>
                    <IonTitle>Record Payment</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowPaymentModal(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'white' }}>
                <div className="space-y-6 pt-2">
                    <div className="p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount Due</p>
                        <p className="text-3xl font-bold text-primary">₹{selectedSub?.effectivePrice || selectedSub?.price}</p>
                        <p className="text-xs text-muted-foreground mt-2 font-medium bg-background/50 inline-block px-2 py-0.5 rounded">
                            {selectedSub?.vehiclePlate} • {selectedSub?.planName}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <IonLabel className="text-sm font-medium pl-1">Payment Mode</IonLabel>
                            <div className="border rounded-lg overflow-hidden">
                                <IonSelect value={paymentMode} onIonChange={e => setPaymentMode(e.detail.value)} interface="action-sheet">
                                    <IonSelectOption value="CASH">Cash</IonSelectOption>
                                    <IonSelectOption value="ONLINE">Online</IonSelectOption>
                                </IonSelect>
                            </div>
                        </div>

                        {paymentMode === 'ONLINE' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <IonLabel className="text-sm font-medium pl-1">Payment Type</IonLabel>
                                    <div className="border rounded-lg overflow-hidden">
                                        <IonSelect value={onlineType} onIonChange={e => setOnlineType(e.detail.value)} interface="action-sheet" placeholder="Select Type">
                                            <IonSelectOption value="UPI">UPI</IonSelectOption>
                                            <IonSelectOption value="CARD">Card</IonSelectOption>
                                            <IonSelectOption value="NETBANKING">Netbanking</IonSelectOption>
                                        </IonSelect>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <IonLabel className="text-sm font-medium pl-1">Reference ID</IonLabel>
                                    <IonInput 
                                        value={reference} 
                                        onIonInput={e => setReference(e.detail.value!)}
                                        placeholder="Enter Transaction ID"
                                        className="border rounded-lg px-3 py-2 --padding-start-0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button className="w-full h-11 text-base" onClick={submitPayment} disabled={processing}>
                            {processing ? <IonSpinner name="crescent" /> : 'Confirm Payment Received'}
                        </Button>
                    </div>
                </div>
            </IonContent>
        </IonModal>

        {/* Assign Cleaner Modal */}
        <IonModal isOpen={showAssignModal} onDidDismiss={() => setShowAssignModal(false)} className="mx-auto max-w-sm" style={{ '--height': 'auto' }}>
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'white' }}>
                    <IonTitle>Assign Cleaner</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowAssignModal(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            {/* Remove IonContent wrapper to allow auto-height calculation */}
            <div className="ion-padding bg-white">
                <div className="space-y-4 pt-2 pb-4">
                    <div className="p-3 rounded-lg border text-center">
                         <p className="font-medium">{selectedSub?.vehiclePlate || 'Unknown Vehicle'}</p>
                         <p className="text-xs text-muted-foreground">
                            {selectedSub?.customerName || 'Unknown Customer'} • {selectedSub?.planName || 'Unknown Plan'}
                         </p>
                    </div>

                    <div className="space-y-2">
                        <IonLabel className="text-sm font-medium pl-1">Select Cleaner</IonLabel>
                        {cleaners.length > 0 ? (
                            <div className="border rounded-lg overflow-hidden">
                                <IonSelect 
                                    value={selectedCleanerId} 
                                    onIonChange={e => setSelectedCleanerId(e.detail.value)} 
                                    interface="action-sheet" 
                                    placeholder="Select Cleaner"
                                    className="w-full"
                                >
                                    {cleaners.map(cleaner => (
                                        <IonSelectOption key={cleaner.id} value={cleaner.id}>{cleaner.name}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </div>
                        ) : (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded border border-red-100">
                                No active cleaners found in system.
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button className="w-full" onClick={handleAssignCleaner} disabled={assigning || cleaners.length === 0}>
                            {assigning ? <IonSpinner name="crescent" /> : 'Assign Cleaner'}
                        </Button>
                    </div>
                </div>
            </div>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};



export default SubscriptionManagement;
