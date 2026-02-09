import React from 'react';
import { 
  IonSplitPane, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet,
  IonMenuToggle,
  IonPage
} from '@ionic/react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { list, map, time } from 'ionicons/icons';
import CleanerDashboard from '../pages/cleaner/Dashboard';

const CleanerLayout: React.FC = () => {
  const location = useLocation();

  const appPages = [
    { title: 'Tasks', url: '/cleaner/dashboard', icon: list },
    { title: 'Map', url: '/cleaner/dashboard', icon: map },
    { title: 'History', url: '/cleaner/dashboard', icon: time },
  ];

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main" type="overlay">
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {appPages.map((appPage, index) => {
                return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem 
                      className={location.pathname === appPage.url ? 'selected' : ''} 
                      routerLink={appPage.url} 
                      routerDirection="none" 
                      lines="none" 
                      detail={false}
                    >
                      <IonIcon slot="start" ios={appPage.icon} md={appPage.icon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                );
              })}
            </IonList>
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          <Route exact path="/cleaner/dashboard" component={CleanerDashboard} />
          <Redirect exact from="/cleaner" to="/cleaner/dashboard" />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default CleanerLayout;
