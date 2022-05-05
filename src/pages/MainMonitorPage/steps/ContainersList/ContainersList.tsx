import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';
import { useSelector } from 'react-redux';
import { RootState } from 'handlers';
import SimplePopup from 'components/SimplePopup';

import './Popup.css';

const ContainersList = () => {
  const [user, loading] = useAuthState(auth);
  const [containers, setContainers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const closeModal = () => setOpenPopup(false);

  const getContainers = async (user: any) => {
    const data = ((await containerApi.getContainers(user)) as any).data;
    setContainers(data);
    console.log(data);
  };
  const { selectedContainers } = useSelector((state: RootState) => state.app.containersManager);

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      getContainers(user);
    }
  }, [user, loading]);

  const handleStartContainers = () => {
    containerApi.startContainers(
      user,
      selectedContainers.map((id) => id.slice(0, 12)),
    );
  };

  const handleStopContainers = () => {
    containerApi.stopContainers(
      user,
      selectedContainers.map((id) => id.slice(0, 12)),
    );
  };

  return (
    <div>
      {containers.length && (
        <div>
          <button className="btn" onClick={handleStartContainers}>
            Start container
          </button>
          <button className="btn red lighten-2" onClick={handleStopContainers}>
            Stop container
          </button>
          <button className="btn blue darken-1" onClick={() => setOpenPopup((o) => !o)}>
            Add container
          </button>
          <button className="btn red darken-1">Delete container</button>
          <Table content={containers} headings={Object.values(ContainerTableHeaders)} />
          <SimplePopup openPopup={openPopup} onClosePopup={closeModal}></SimplePopup>
        </div>
      )}
    </div>
  );
};

export default ContainersList;
