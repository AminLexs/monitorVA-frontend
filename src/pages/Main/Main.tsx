import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { RootState } from 'handlers';
import Sidebar from 'components/Sidebar';

// @ts-ignore
import styles from './Main.module.scss';

const Main = ({ children }: React.PropsWithChildren<{}>) => {
  const { sidebar } = useSelector((state: RootState) => state.app.ui);
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Helmet>
      <div className={styles.header}></div>
      {sidebar && <Sidebar />}
      <div className={styles.main}>{children}</div>
      <div className={styles.footer}></div>
    </>
  );
};

export default Main;
