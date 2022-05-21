import React from 'react';
import { useContainersId } from 'hooks/useContainersId';
import LineWithType from 'components/Graphics/Line';
import { GraphicsType } from 'enums/GraphicsType';

import styles from './ContainersMonitor.module.scss'

const ContainersMonitor = () => {
  const containersId = useContainersId();

  return (
    <div className={styles.container}>
      <LineWithType key={GraphicsType.CPU} containersId={containersId!} graphicType={GraphicsType.CPU} />
      <LineWithType key={GraphicsType.Memory} containersId={containersId!} graphicType={GraphicsType.Memory} />
    </div>
  );
};

export default ContainersMonitor;
