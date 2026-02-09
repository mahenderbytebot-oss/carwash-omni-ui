import React from 'react';

import { IonIcon, IonButtons, IonMenuButton, IonButton } from '@ionic/react';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/Button'; // Removed custom Button import

export interface DashboardHeaderProps {
  title: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  userName,
  userRole,
  onLogout,
  className = ''
}) => {
  const formattedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <h1 className="ion-text-xl ion-font-bold ion-tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="ion-text-sm ion-font-medium ion-leading-tight">{userName}</span>
              <span className="ion-text-xs text-muted-foreground">{formattedRole}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
               <IonIcon icon={personCircleOutline} className="text-xl text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex sm:hidden items-center gap-2">
             <span className="ion-text-sm ion-font-medium">{userName.split(' ')[0]}</span>
          </div>

          <IonButton fill="clear" size="small" onClick={onLogout} aria-label="Logout">
            <IonIcon icon={logOutOutline} slot="icon-only" className="h-5 w-5" />
          </IonButton>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
