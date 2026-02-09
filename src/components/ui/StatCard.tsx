import React from 'react';
import { IonIcon, IonCard, IonCardContent } from '@ionic/react';
import { clsx } from 'clsx';
import { arrowUp, arrowDown } from 'ionicons/icons';
// import { Card, CardContent } from './Card'; // Removed custom card import

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
  // keeping color prop but ignoring it for minimalist design or using it for icon color only
  color?: string;
  onClick?: () => void;
}

/**
 * StatCard Component
 * 
 * A minimalist card for displaying key metrics and statistics.
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
  onClick
}) => {
  return (
    <IonCard 
      className={clsx(
        "transition-all duration-200 hover:shadow-md m-0", 
        onClick && "cursor-pointer hover:bg-accent/5",
        className
      )}
      onClick={onClick}
    >
      <IonCardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="ion-text-sm ion-font-medium text-muted-foreground">
            {title}
          </p>
          <IonIcon 
            icon={icon} 
            className="text-muted-foreground h-4 w-4"
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="ion-text-2xl ion-font-bold">{value}</div>
          {trend && (
            <div className={clsx(
              "ion-text-xs ion-font-medium flex items-center",
              trend.direction === 'up' ? "text-green-500" : "text-red-500"
            )}>
              <IonIcon icon={trend.direction === 'up' ? arrowUp : arrowDown} className="mr-1 h-3 w-3" />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default StatCard;
