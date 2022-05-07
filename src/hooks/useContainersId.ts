import { useEffect, useState } from 'react';
import { accountApi, containerApi } from 'thunks';

export const useContainersId = () => {
  const [containers, setContainers] = useState(null);
  const getContainers = async () => {
    const data = ((await containerApi.getContainers(accountApi.GetUser())) as any).data;
    setContainers(data.map((container: any) => container.Id));
  };
  useEffect(() => {
    getContainers();
  }, []);
  return containers;
};
