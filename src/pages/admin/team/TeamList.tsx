import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge,
  IonSpinner,
  useIonViewWillEnter,
  IonFab,
  IonFabButton,
  useIonAlert
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import { getTeamMembers, addTeamMember, removeTeamMember } from '../../../services/teamService';
import type { TeamMember, CreateTeamMemberRequest } from '../../../services/teamService';
import CreateTeamMemberModal from '../../../components/team/CreateTeamMemberModal';

const TeamList: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [presentAlert] = useIonAlert();

  // Handle logout
  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Failed to fetch team members', error);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    fetchTeam();
  });

  const handleAddMember = async (data: CreateTeamMemberRequest) => {
    await addTeamMember(data);
    fetchTeam();
  };

  const handleRemoveMember = (id: number) => {
    presentAlert({
      header: 'Remove Team Member',
      message: 'Are you sure you want to remove this team member?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            await removeTeamMember(id);
            fetchTeam();
          }
        }
      ]
    });
  };

  return (
    <IonPage>
      <DashboardHeader 
        title="Team Management" 
        userName={user?.name || 'Admin'}
        userRole={user?.role || 'ADMIN'}
        onLogout={handleLogout}
      />
      <IonContent className="ion-padding">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Members</h1>
          <IonButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} slot="start" />
            Add Member
          </IonButton>
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <IonSpinner />
          </div>
        ) : (
          <div className="grid gap-4">
             {teamMembers.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                    <p>No additional team members found.</p>
                    <p className="text-sm">Add admins to help manage your service provider account.</p>
                </div>
             ) : (
                <IonList lines="full" className="rounded-lg border">
                  {teamMembers.map(member => (
                    <IonItem key={member.id}>
                      <IonLabel>
                        <h2>{member.name}</h2>
                        <p>{member.email}</p>
                        <p className="text-sm text-muted-foreground">{member.phone}</p>
                      </IonLabel>
                      {member.active ? (
                        <IonBadge color="success" slot="end" className="mr-4">Active</IonBadge>
                      ) : (
                        <IonBadge color="medium" slot="end" className="mr-4">Inactive</IonBadge>
                      )}
                      
                      <IonButton 
                        fill="clear" 
                        color="danger" 
                        slot="end"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </IonItem>
                  ))}
                </IonList>
             )}
          </div>
        )}

        <CreateTeamMemberModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSave={handleAddMember} 
        />
        
        {/* Mobile FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="md:hidden">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default TeamList;
