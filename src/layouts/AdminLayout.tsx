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
import { people, car, cash, grid, documentText } from 'ionicons/icons';
import AdminDashboard from '../pages/admin/Dashboard';
import CustomerList from '../pages/admin/customers/CustomerList';
import CustomerDetails from '../pages/admin/customers/CustomerDetails';
import SubscriptionList from '../pages/admin/subscriptions/SubscriptionList';
import TeamList from '../pages/admin/team/TeamList';
import CleanerList from '../pages/admin/cleaners/CleanerList';
import CleanerDetails from '../pages/admin/cleaners/CleanerDetails';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const appPages = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: grid },
    { title: 'Customers', url: '/admin/customers', icon: people },
    { title: 'Subscription Plans', url: '/admin/subscriptions', icon: documentText },
    { title: 'Team', url: '/admin/team', icon: people },
    { title: 'Cleaners', url: '/admin/cleaners', icon: car }, // approximating icon
    { title: 'Finance', url: '/admin/finance', icon: cash },
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
        <Route exact path="/admin/dashboard" component={AdminDashboard} />
        <Route exact path="/admin/customers" component={CustomerList} />
        <Route exact path="/admin/customers/:id" component={CustomerDetails} />
        <Route exact path="/admin/subscriptions" component={SubscriptionList} />
        <Route exact path="/admin/team" component={TeamList} />
        <Route exact path="/admin/cleaners" component={CleanerList} />
        <Route exact path="/admin/cleaners/:id" component={CleanerDetails} />
        <Redirect exact from="/admin" to="/admin/dashboard" />
      </IonRouterOutlet>
    </IonSplitPane>
    </IonPage>
  );
};

export default AdminLayout;
