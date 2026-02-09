import React from 'react';
import { 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonMenuToggle
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';

interface AppPage {
  title: string;
  url: string;
  icon: string;
}

interface AppMenuProps {
  pages: AppPage[];
}

const AppMenu: React.FC<AppMenuProps> = ({ pages }) => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <div className="flex items-center pl-5">
            <img src={logo} alt="Glossly Logo" className="h-8 w-8 mr-2 rounded-full" />
            <IonTitle className="pl-0">Glossly</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem 
                  className={location.pathname === appPage.url ? 'selected' : ''} 
                  routerLink={appPage.url} 
                  routerDirection="none" 
                  lines="none" 
                  detail={false}
                >
                  <IonIcon slot="start" ios={appPage.icon} md={appPage.icon} className="mr-4" />
                  <IonLabel className="text-sm font-medium">{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default AppMenu;
