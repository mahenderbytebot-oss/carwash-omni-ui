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
import { home, calendar, car } from 'ionicons/icons';
import CustomerDashboard from '../pages/customer/Dashboard';

const CustomerLayout: React.FC = () => {
  const location = useLocation();

  const appPages = [
    { title: 'Home', url: '/customer/dashboard', icon: home },
    { title: 'Schedule', url: '/customer/dashboard', icon: calendar },
    { title: 'My Cars', url: '/customer/dashboard', icon: car },
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
          <Route exact path="/customer/dashboard" component={CustomerDashboard} />
          {/* Add more customer routes here */}
          <Redirect exact from="/customer" to="/customer/dashboard" />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default CustomerLayout;
