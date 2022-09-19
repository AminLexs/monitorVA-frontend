import React, { useEffect, useState } from 'react';
import LineWithType from 'components/Graphics/Line';
import { GraphicsType } from 'enums/GraphicsType';

import { containerApi } from 'thunks';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';

import styles from './ContainersMonitor.module.scss';

const ContainersMonitor = () => {
  const [user] = useAuthState(auth);
  const [containersId, setContainersId] = useState(null);

  useEffect(() => {
    const getContainers = async () => {
      const data = ((await containerApi.getContainers(user)) as any).data;
      setContainersId(data.map((container: any) => container.Id));
    };

    getContainers();
  }, []);

  return (
    <div className={styles.container}>
      <LineWithType key={GraphicsType.CPU} containersId={containersId!} graphicType={GraphicsType.CPU} />
      <LineWithType key={GraphicsType.Memory} containersId={containersId!} graphicType={GraphicsType.Memory} />
    </div>
  );
};

export default ContainersMonitor;
