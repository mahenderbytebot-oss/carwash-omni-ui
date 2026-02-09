import React from 'react';
import { IonPage, IonContent } from '@ionic/react';

const Unauthorized: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Unauthorized;
