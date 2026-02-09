import React from 'react';
import { 
  IonSplitPane, 
  IonRouterOutlet,
  IonPage
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { people, car, cash, grid, documentText } from 'ionicons/icons';
import AdminDashboard from '../pages/admin/Dashboard';
import CustomerList from '../pages/admin/customers/CustomerList';
import CustomerDetails from '../pages/admin/customers/CustomerDetails';
import SubscriptionList from '../pages/admin/subscriptions/SubscriptionList';
import TeamList from '../pages/admin/team/TeamList';
import CleanerList from '../pages/admin/cleaners/CleanerList';
import CleanerDetails from '../pages/admin/cleaners/CleanerDetails';
import AppMenu from '../components/ui/AppMenu';

const AdminLayout: React.FC = () => {

  const appPages = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: grid },
    { title: 'Customers', url: '/admin/customers', icon: people },
    { title: 'Subscription Plans', url: '/admin/subscriptions', icon: documentText },
    { title: 'Team', url: '/admin/team', icon: people },
    { title: 'Partners', url: '/admin/cleaners', icon: car }, // approximating icon
    { title: 'Finance', url: '/admin/finance', icon: cash },
  ];

  return (
    <IonPage>
    <IonSplitPane contentId="main">
      <AppMenu pages={appPages} />
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
