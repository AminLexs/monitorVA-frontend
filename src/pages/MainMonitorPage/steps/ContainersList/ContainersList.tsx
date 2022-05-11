import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import { containerApi, imageApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import SimplePopup from 'components/SimplePopup';
import AsyncSelect from 'react-select/async';
import { searchAsyncSelectOptions } from 'utils/selectUtils';
import { setImageName, setContainerName, setPublicPort, setPrivatePort } from 'handlers/createContainerForm';
import { getShortContainersID } from 'utils/stringUtils';
import { setSelectedContainers } from 'handlers/containersManager';
import { useLocale } from 'utils/localeUtils';
import { setLoading } from 'handlers/ui';
import Loading from 'components/Loading';

import './Popup.css';

const ContainersList = () => {
  const [user] = useAuthState(auth);
  const [containers, setContainers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const { imageName, containerName, publicPort, privatePort } = useSelector(
    (state: RootState) => state.app.createContainerForm,
  );
  const { getLocalizedString } = useLocale();
  const { loading } = useSelector((state: RootState) => state.app.ui);

  const dispatch = useDispatch();

  const closeModal = () => setOpenPopup(false);

  const getContainers = async (user: any) => {
    const data = ((await containerApi.getContainers(user)) as any).data;
    setContainers(data);
  };
  const { selectedContainers } = useSelector((state: RootState) => state.app.containersManager);

  useEffect(() => {
    if (user) {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    }
  }, [user]);

  const handleStartContainers = () => {
    containerApi.startContainers(user, selectedContainers.map(getShortContainersID)).then(() => {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    });
  };

  const handleStopContainers = () => {
    containerApi.stopContainers(user, selectedContainers.map(getShortContainersID)).then(() => {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    });
  };

  const handleDeleteContainers = () => {
    containerApi.deleteContainers(user, selectedContainers.map(getShortContainersID)).then(() => {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    });
  };

  const handleRestartContainers = () => {
    containerApi.restartContainers(user, selectedContainers.map(getShortContainersID)).then(() => {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    });
  };

  const handlePauseContainers = () => {
    containerApi.pauseContainers(user, selectedContainers.map(getShortContainersID)).then(() => {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    });
  };

  const handleUnpauseContainers = () => {
    containerApi.unpauseContainers(user, selectedContainers.map(getShortContainersID)).then(() => {
      dispatch(setLoading(true));
      getContainers(user).then(() => dispatch(setLoading(false)));
    });
  };

  const loadImagesPromise = async (inputValue: string) => {
    const images = ((await imageApi.getImages(user)) as any).data.map((image: any) => ({
      label: image.name,
      value: image.name,
    }));
    return searchAsyncSelectOptions(inputValue, images);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <button className="btn" onClick={handleStartContainers}>
            {getLocalizedString('startContainer')}
          </button>
          <button className="btn red lighten-2" onClick={handleStopContainers}>
            {getLocalizedString('stopContainer')}
          </button>
          <button className="btn blue lighten-2" onClick={handleRestartContainers}>
            {getLocalizedString('restartContainer')}
          </button>
          <button className="btn blue lighten-2" onClick={handlePauseContainers}>
            {getLocalizedString('pauseContainer')}
          </button>

          <button className="btn blue lighten-2" onClick={handleUnpauseContainers}>
            {getLocalizedString('unpauseContainer')}
          </button>
          <button className="btn blue darken-1" onClick={() => setOpenPopup((o) => !o)}>
            {getLocalizedString('addContainer')}
          </button>
          <button className="btn red darken-1" onClick={handleDeleteContainers}>
            {getLocalizedString('deleteContainer')}
          </button>
          <Table
            content={containers}
            headings={Object.values(ContainerTableHeaders)}
            onChange={(selectedItems) => {
              dispatch(setSelectedContainers(selectedItems));
            }}
          />
          <SimplePopup openPopup={openPopup} onClosePopup={closeModal}>
            <div className="input-field inline">
              <input
                id="container_name"
                type="text"
                onChange={(event) => dispatch(setContainerName(event.target.value))}
              />
              <label htmlFor="email_inline">{getLocalizedString('containerName')}</label>
            </div>
            <AsyncSelect
              placeholder={getLocalizedString('chooseImageOrStartWritting')}
              onChange={(event) => {
                dispatch(setImageName(event!.value));
              }}
              cacheOptions
              defaultOptions
              loadOptions={loadImagesPromise}
            />
            <div className="input-field inline">
              <input id="public_port" type="number" onChange={(event) => dispatch(setPublicPort(event.target.value))} />
              <label htmlFor="email_inline">{getLocalizedString('publicPort')}</label>
            </div>
            <div className="input-field inline">
              <input
                id="private_port"
                type="number"
                onChange={(event) => dispatch(setPrivatePort(event.target.value))}
              />
              <label htmlFor="email_inline">{getLocalizedString('privatePort')}</label>
            </div>
            <button
              className="btn"
              disabled={!imageName}
              onClick={() => {
                containerApi
                  .createContainer(user, {
                    imageName: imageName,
                    containerName: containerName,
                    publicPort: publicPort,
                    privatePort: privatePort,
                  })
                  .then(() => {
                    getContainers(user);
                    closeModal();
                  });
              }}
            >
              {getLocalizedString('create')}
            </button>
          </SimplePopup>
        </div>
      )}
    </div>
  );
};

export default ContainersList;
