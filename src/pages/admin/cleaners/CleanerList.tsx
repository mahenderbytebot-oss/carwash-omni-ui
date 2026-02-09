/**
 * Cleaner List Page
 * 
 * Displays a list of cleaners with search and add functionality.
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
import { getAllCleaners, type Cleaner } from '../../../services/cleanerService';

import CreateCleanerModal from '../../../components/cleaners/CreateCleanerModal';

const CleanerList: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCleaners, setFilteredCleaners] = useState<Cleaner[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchCleaners();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCleaners(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchCleaners = async (query?: string) => {
    try {
      setLoading(true);
      const data = await getAllCleaners(query);
      setFilteredCleaners(data);
    } catch (error) {
      console.error('Failed to fetch cleaners', error);
      setFilteredCleaners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchCleaners();
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
            title="Cleaners"
            userName={user?.name || 'Admin'}
            userRole={user?.role || 'ADMIN'}
            onLogout={() => { logout(); history.push('/login'); }}
          />

          <div className="container mx-auto px-4 pt-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <IonText><h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Cleaner Management</h2></IonText>
                <IonNote>View and manage your team of cleaners</IonNote>
              </div>
              <IonButton color="primary" onClick={() => setIsCreateModalOpen(true)}>
                <IonIcon icon={addOutline} slot="start" />
                Add Cleaner
              </IonButton>
            </div>

            {/* Search */}
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value || '')}
              placeholder="Search by name..."
              debounce={300}
            />

            {/* Cleaner List */}
            <div className="space-y-4">
              {loading ? (
                <div className="ion-text-center ion-padding"><IonNote>Loading cleaners...</IonNote></div>
              ) : filteredCleaners.length === 0 ? (
                <IonCard>
                  <IonCardContent className="ion-text-center ion-padding">
                    <div style={{ padding: '1rem', backgroundColor: 'var(--ion-color-light)', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                      <IonIcon icon={personOutline} style={{ fontSize: '2.5rem', color: 'var(--ion-color-medium)' }} />
                    </div>
                    <IonText><h3 style={{ fontWeight: 600, margin: 0 }}>No cleaners found</h3></IonText>
                    <IonNote>Try adjusting your search or add a new cleaner to get started.</IonNote>
                  </IonCardContent>
                </IonCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCleaners.map(cleaner => (
                    <IonCard 
                      key={cleaner.id} 
                      button
                      onClick={() => history.push(`/admin/cleaners/${cleaner.id}`)}
                    >
                      <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ height: 40, width: 40, borderRadius: '50%', backgroundColor: 'var(--ion-color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ion-color-primary)', fontWeight: 600 }}>
                              {cleaner.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <IonText><strong>{cleaner.name}</strong></IonText>
                              <br />
                              <IonNote>{cleaner.phone}</IonNote>
                            </div>
                          </div>
                          <IonIcon icon={chevronForwardOutline} color="medium" />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {cleaner.email && (
                            <IonNote style={{ display: 'block' }}>{cleaner.email}</IonNote>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IonBadge color={cleaner.active ? 'success' : 'medium'}>
                              {cleaner.active ? 'Active' : 'Inactive'}
                            </IonBadge>
                            <IonBadge color="primary">
                              {cleaner.assignedSubscriptionsCount} Subscriptions
                            </IonBadge>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              )}
            </div>
            
            <CreateCleanerModal 
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
              onSuccess={() => fetchCleaners()}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CleanerList;
