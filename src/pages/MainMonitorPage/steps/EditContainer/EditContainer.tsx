import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardStep } from 'handlers/stages';
import { DashboardStep } from 'enums/DashboardStep';
import { RootState } from 'handlers';
import { setCurrentContainerID } from 'handlers/containersManager';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { getShortContainersID } from 'utils/stringUtils';
import ReactConsole from '@webscopeio/react-console';
import { useLocale } from 'utils/localeUtils';

import styles from './EditContainer.scss';
import {setContainerName} from "../../../../handlers/createContainerForm";
import SimplePopup from "../../../../components/SimplePopup";

const EditContainer = () => {
  const [user] = useAuthState(auth);
  const { currentContainerID } = useSelector((state: RootState) => state.app.containersManager);
  const [currentContainerInfo, setCurrentContainerInfo] = useState<any>(null);

  const { getLocalizedString } = useLocale();
  const dispatch = useDispatch();

  const getContainerData = async () => {
    const containerData = ((await containerApi.getContainerData(user, currentContainerID!)) as any).data;
    console.log(containerData);
    setCurrentContainerInfo(containerData);
  };

  useEffect(() => {
    if (currentContainerID) {
      getContainerData();
    }
    return () => {
      dispatch(setCurrentContainerID(null));
    };
  }, [currentContainerID]);

  return (
    <div>
      <div className="input-field inline">
        <input
            id="container_name"
            type="text"
            onChange={(event) => dispatch(setContainerName(event.target.value))}
        />
        <label htmlFor="email_inline">{getLocalizedString('containerName')}</label>
      </div>
    </div>
  );
};

export default EditContainer;
