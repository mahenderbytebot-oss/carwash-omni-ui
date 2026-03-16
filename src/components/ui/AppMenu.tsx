import React from 'react';
import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonMenuToggle
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import logo from '../../assets/logo.svg';

interface AppPage {
  title: string;
  url: string;
  icon: string;
}

interface AppMenuProps {
  pages: AppPage[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  enableMenuToggle?: boolean;
}

const AppMenu: React.FC<AppMenuProps> = ({ 
  pages, 
  isCollapsed, 
  onToggleCollapse, 
  enableMenuToggle = true 
}) => {
  const location = useLocation();

  return (
    <div className={`h-full flex flex-col bg-background border-r transition-all duration-300 ${isCollapsed ? 'w-[70px]' : 'w-[280px]'}`}>
      {/* Header / Logo Area */}
      <div className={`flex items-center h-16 px-4 border-b ${isCollapsed ? 'justify-center' : ''}`}>
        <img src={logo} alt="Glossly Logo" className="h-8 w-8 rounded-lg" />
        {!isCollapsed && (
          <span className="ml-3 font-bold text-xl tracking-tight">Glossly</span>
        )}
      </div>

      {/* Menu Items */}
      <IonContent className="flex-1 --background: transparent;">
        <IonList className="py-2 bg-transparent">
          {pages.map((appPage, index) => {
            const isActive = location.pathname.startsWith(appPage.url);
            
            const MenuItem = (
              <div className="px-3 mb-1">
                  <div 
                    className={`
                      relative flex items-center h-10 rounded-md cursor-pointer transition-colors duration-200 group
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                      ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                    `}
                  >
                     <IonItem 
                        routerLink={appPage.url} 
                        routerDirection="none" 
                        lines="none" 
                        detail={false}
                        className="w-full --background: transparent --padding-start: 0 --inner-padding-end: 0"
                        style={{ '--min-height': '0' }}
                     >
                       <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                          <IonIcon 
                            icon={appPage.icon} 
                            className={`
                              ${isCollapsed ? 'mr-0 w-6 h-6' : 'mr-3 w-5 h-5'}
                              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                            `} 
                          />
                          {!isCollapsed && (
                            <IonLabel className={`font-medium text-sm ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                              {appPage.title}
                            </IonLabel>
                          )}
                       </div>
                    </IonItem>
                  </div>
                </div>
            );

            return (
              <React.Fragment key={index}>
                {enableMenuToggle ? (
                  <IonMenuToggle autoHide={false}>
                    {MenuItem}
                  </IonMenuToggle>
                ) : (
                  MenuItem
                )}
              </React.Fragment>
            );
          })}
        </IonList>
      </IonContent>

      {/* Footer / Collapse Toggle */}
      <div className="p-3 border-t">
         <button 
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-full h-10 rounded-md hover:bg-muted text-muted-foreground transition-colors"
         >
            <IonIcon icon={isCollapsed ? chevronForwardOutline : chevronBackOutline} className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

export default AppMenu;
