import React from 'react';
import { 
  IonSplitPane, 
  IonRouterOutlet,
  IonPage
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { list, map, time } from 'ionicons/icons';
import CleanerDashboard from '../pages/cleaner/Dashboard';
import AppMenu from '../components/ui/AppMenu';
import CleanerHistory from '../pages/cleaner/History';

const CleanerLayout: React.FC = () => {

  const appPages = [
    { title: 'Tasks', url: '/cleaner/dashboard', icon: list },
    { title: 'Map', url: '/cleaner/dashboard', icon: map },
    { title: 'History', url: '/cleaner/history', icon: time },
  ];

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <AppMenu pages={appPages} />
        <IonRouterOutlet id="main">
          <Route exact path="/cleaner/dashboard" component={CleanerDashboard} />
          <Route exact path="/cleaner/history" component={CleanerHistory} />
          <Redirect exact from="/cleaner" to="/cleaner/dashboard" />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default CleanerLayout;
