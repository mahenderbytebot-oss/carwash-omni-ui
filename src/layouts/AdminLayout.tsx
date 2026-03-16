import React, { useState } from 'react';
import { 
  IonPage, 
  IonRouterOutlet,
  IonMenu, 
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { people, car, cash, grid, documentText, checkmarkCircle } from 'ionicons/icons';
import AdminDashboard from '../pages/admin/Dashboard';
import CustomerList from '../pages/admin/customers/CustomerList';
import CustomerDetails from '../pages/admin/customers/CustomerDetails';
import SubscriptionList from '../pages/admin/subscriptions/SubscriptionList';
import SubscriptionManagement from '../pages/admin/subscriptions/SubscriptionManagement';
import DailyWashes from '../pages/admin/DailyWashes';
import TeamList from '../pages/admin/team/TeamList';
import CleanerList from '../pages/admin/cleaners/CleanerList';
import CleanerDetails from '../pages/admin/cleaners/CleanerDetails';
import AppMenu from '../components/ui/AppMenu';

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const appPages = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: grid },
    { title: 'Customers', url: '/admin/customers', icon: people },
    { title: 'Subscription Plans', url: '/admin/subscriptions', icon: documentText },
    { title: 'Subscriptions', url: '/admin/subscription-management', icon: checkmarkCircle },
    { title: 'Team', url: '/admin/team', icon: people },
    { title: 'Partners', url: '/admin/cleaners', icon: car }, 
    { title: 'Finance', url: '/admin/finance', icon: cash },
  ];

  return (
    <IonPage>
      {/* Mobile Menu - Hidden on desktop, visible on mobile via IonMenuButton */}
      <IonMenu contentId="main-admin-content" type="overlay">
        <AppMenu 
           pages={appPages} 
           isCollapsed={false} 
           onToggleCollapse={() => {}} 
        />
      </IonMenu>

      <div id="main-admin-content" className="flex h-full w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block h-full shrink-0 transition-all duration-300 relative z-20">
           <AppMenu 
              pages={appPages} 
              isCollapsed={isCollapsed} 
              onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
              enableMenuToggle={false} 
           />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 h-full relative z-10 bg-muted/5 overflow-hidden">
          <IonRouterOutlet>
            <Route exact path="/admin/dashboard" component={AdminDashboard} />
            <Route exact path="/admin/customers" component={CustomerList} />
            <Route exact path="/admin/customers/:id" component={CustomerDetails} />
            <Route exact path="/admin/subscriptions" component={SubscriptionList} />
            <Route exact path="/admin/subscription-management" component={SubscriptionManagement} />
            <Route exact path="/admin/daily-washes" component={DailyWashes} />
            <Route exact path="/admin/team" component={TeamList} />
            <Route exact path="/admin/cleaners" component={CleanerList} />
            <Route exact path="/admin/cleaners/:id" component={CleanerDetails} />
            <Redirect exact from="/admin" to="/admin/dashboard" />
          </IonRouterOutlet>
        </div>
      </div>
    </IonPage>
  );
};

export default AdminLayout;
