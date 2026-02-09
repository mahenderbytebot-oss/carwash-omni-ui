/**
 * Customer List Page
 * 
 * Displays a list of customers with search and add functionality.
 */

import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonRefresher, 
  IonRefresherContent,
  IonButton,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonBadge,
  IonText,
  IonNote,
  type RefresherEventDetail 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addOutline, personOutline, chevronForwardOutline } from 'ionicons/icons';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import { useAuthStore } from '../../../store/authStore';
import { getAllCustomers, type Customer } from '../../../services/customerService';

import CreateCustomerModal from '../../../components/customers/CreateCustomerModal';

const CustomerList: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers when search text changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(searchText);
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchCustomers = async (query?: string) => {
    try {
      setLoading(true);
      const data = await getAllCustomers(query);

      // No client-side filtering needed anymore, but keeping filteredCustomers structure for now
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
      // Fallback/Mock data for demonstration if API is not ready
      const mockCustomers: Customer[] = [
        { id: '1', name: 'John Doe', mobile: '555-0101', role: 'CUSTOMER', email: 'john@example.com', vehicles: [] },
        { id: '2', name: 'Jane Smith', mobile: '555-0102', role: 'CUSTOMER', email: 'jane@example.com', vehicles: [] },
      ];

      setFilteredCustomers(mockCustomers);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchCustomers();
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
            title="Customers"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={() => { logout(); history.push('/login'); }}
          />

          <div className="container mx-auto px-4 pt-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <IonText><h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Customer Management</h2></IonText>
                <IonNote>View and manage your customer base</IonNote>
              </div>
              <IonButton color="primary" onClick={() => setIsCreateModalOpen(true)}>
                <IonIcon icon={addOutline} slot="start" />
                Add Customer
              </IonButton>
            </div>

            {/* Search */}
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value || '')}
              placeholder="Search by name, mobile, or email..."
              debounce={300}
            />

            {/* Customer List */}
            <div className="space-y-4">
              {loading ? (
                <div className="ion-text-center ion-padding"><IonNote>Loading customers...</IonNote></div>
              ) : filteredCustomers.length === 0 ? (
                <IonCard>
                  <IonCardContent className="ion-text-center ion-padding">
                    <div style={{ padding: '1rem', backgroundColor: 'var(--ion-color-light)', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                      <IonIcon icon={personOutline} style={{ fontSize: '2.5rem', color: 'var(--ion-color-medium)' }} />
                    </div>
                    <IonText><h3 style={{ fontWeight: 600, margin: 0 }}>No customers found</h3></IonText>
                    <IonNote>Try adjusting your search or add a new customer to get started.</IonNote>
                  </IonCardContent>
                </IonCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCustomers.map(customer => (
                    <IonCard 
                      key={customer.id} 
                      button
                      onClick={() => history.push(`/admin/customers/${customer.id}`)}
                    >
                      <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ height: 40, width: 40, borderRadius: '50%', backgroundColor: 'var(--ion-color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ion-color-primary)', fontWeight: 600 }}>
                              {customer.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <IonText><strong>{customer.name}</strong></IonText>
                              <br />
                              <IonNote>{customer.mobile}</IonNote>
                            </div>
                          </div>
                          <IonIcon icon={chevronForwardOutline} color="medium" />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {customer.email && (
                            <IonNote style={{ display: 'block' }}>{customer.email}</IonNote>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IonBadge color="medium">
                              {customer.vehicleCount !== undefined ? customer.vehicleCount : (customer.vehicles?.length || 0)} Vehicles
                            </IonBadge>
                            {customer.address && (
                               <IonNote style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• {customer.address}</IonNote>
                            )}
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              )}
            </div>
            
            <CreateCustomerModal 
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
              onSuccess={() => fetchCustomers()}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomerList;
