import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';

const ContainersList = () => {
  const [user, loading] = useAuthState(auth);
  const [containers, setContainers] = useState([]);
  const getContainers = async (user: any) => {
    const data = ((await containerApi.getContainers(user)) as any).data;
    setContainers(data);
    console.log(data);
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      getContainers(user);
    }
  }, [user, loading]);

  return (
    <div>{containers.length && <Table content={containers} headings={Object.values(ContainerTableHeaders)} />}</div>
  );
};

export default ContainersList;
