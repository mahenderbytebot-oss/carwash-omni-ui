import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';
import { clsx } from 'clsx';

export type StatCardVariant = 'default' | 'healthy' | 'offline' | 'outdated' | 'lost' | 'total';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
  secondaryText?: React.ReactNode;
  variant?: StatCardVariant;
  onClick?: () => void;
}

const variantStyles: Record<StatCardVariant, string> = {
  default: 'bg-card text-card-foreground',
  healthy: 'bg-[var(--color-smart-healthy)] text-[var(--color-smart-healthy-foreground)]',
  offline: 'bg-[var(--color-smart-offline)] text-[var(--color-smart-offline-foreground)]',
  outdated: 'bg-[var(--color-smart-outdated)] text-[var(--color-smart-outdated-foreground)]',
  lost: 'bg-[var(--color-smart-lost)] text-[var(--color-smart-lost-foreground)]',
  total: 'bg-[var(--color-smart-total)] text-[var(--color-smart-total-foreground)]',
};

/**
 * StatCard Component
 * 
 * Styled to match "Smart Support" dashboard cards:
 * - Central large number
 * - Label below number
 * - Specific background/text color themes
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  secondaryText,
  className = '',
  variant = 'default',
  onClick
}) => {
  return (
    <IonCard 
      className={clsx(
        "transition-all duration-200 hover:shadow-md m-0 border-none shadow-none", // Removed default border/shadow for colored cards
        variantStyles[variant],
        onClick && "cursor-pointer hover:opacity-90",
        className
      )}
      onClick={onClick}
    >
      <IonCardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[100px]">
        <div className="text-3xl font-bold mb-1 tracking-tight">
          {value}
        </div>
        
        <div className="text-sm font-medium opacity-90 uppercase tracking-wide">
          {title}
        </div>

        {secondaryText && (
          <div className="mt-1 text-xs opacity-80 font-medium">
            {secondaryText}
          </div>
        )}

        {/* Icon (Optional/Subtle if needed, or hidden to match screenshot strictly) */}

        {/* Icon (Optional/Subtle if needed, or hidden to match screenshot strictly) */}
        {/* Screenshot does not show icons in cards, so we hide them or make them very subtle background elements if requested. 
            For now, let's omit the icon from the main view to match the "clean number + text" look. 
        */}
      </IonCardContent>
    </IonCard>
  );
};

export default StatCard;
