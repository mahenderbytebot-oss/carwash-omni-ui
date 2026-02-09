import React from 'react';
import { 
  IonSplitPane, 
  IonRouterOutlet,
  IonPage
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, car } from 'ionicons/icons';
import CustomerDashboard from '../pages/customer/Dashboard';
import MyCars from '../pages/customer/MyCars';
import AppMenu from '../components/ui/AppMenu';

const CustomerLayout: React.FC = () => {

  const appPages = [
    { title: 'Home', url: '/customer/dashboard', icon: home },
    { title: 'My Cars', url: '/customer/vehicles', icon: car },
  ];

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <AppMenu pages={appPages} />
        <IonRouterOutlet id="main">
          <Route exact path="/customer/dashboard" component={CustomerDashboard} />
          <Route exact path="/customer/vehicles" component={MyCars} />
          {/* Add more customer routes here */}
          <Redirect exact from="/customer" to="/customer/dashboard" />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default CustomerLayout;
