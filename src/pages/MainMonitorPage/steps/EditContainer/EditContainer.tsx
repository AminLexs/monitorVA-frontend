import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setCurrentContainerID } from 'handlers/containersManager';
import {containerApi, imageApi} from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import {searchAsyncSelectOptions} from "utils/selectUtils";
import {setContainerName, setImageName} from "handlers/createContainerForm";
import AsyncSelect from "react-select/async";


const EditContainer = () => {
  const [user] = useAuthState(auth);
  const { currentContainerID } = useSelector((state: RootState) => state.app.containersManager);
  const [setCurrentContainerInfo] = useState<any>(null);

  const { getLocalizedString } = useLocale();
  const dispatch = useDispatch();

  const getContainerData = async () => {
    const containerData = ((await containerApi.getContainerData(user, currentContainerID!)) as any).data;
    console.log(containerData);
    setCurrentContainerInfo(containerData);
  };

  const loadImagesPromise = async (inputValue: string) => {
    const images = ((await imageApi.getImages(user)) as any).data.map((image: any) => ({
      label: image.name,
      value: image.name,
    }));
    return searchAsyncSelectOptions(inputValue, images);
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
      <a className="btn-floating btn-large waves-effect waves-light blue"><i className="material-icons">arrow_back</i></a>
      <form style={{marginBottom:"20px"}} className="col s16">
      <div className="row">
      <div className="input-field col s5">
        <input
            name="cpuUsageLimit"
            id="cpuUsageLimit"
            type="text"
            onChange={(event) => dispatch(setContainerName(event.target.value))}
        />
        <label htmlFor="cpuUsageLimit">{getLocalizedString('cpuUsageLimit')}</label>
      </div>
      <div className="input-field col s5">
        <input
            name="memoryUsageLimit"
            id="memoryUsageLimit"
            type="text"
            onChange={(event) => dispatch(setContainerName(event.target.value))}
        />
        <label htmlFor="memoryUsageLimit">{getLocalizedString('memoryUsageLimit')}</label>
      </div>

      <div className="input-field col s4">
        <input
            name="countRestart"
            id="countRestart"
            type="text"
            onChange={(event) => dispatch(setContainerName(event.target.value))}
        />
        <label htmlFor="countRestart">{getLocalizedString('countRestart')}</label>
      </div>

      </div>
        <button className="btn">
          {getLocalizedString('update')}
        </button>
      </form>

    <form style={{marginBottom:"20px"}} className="col s16">
        <div className="row">
        <div className="input-field col s6">
          <input
              name="container_name"
              id="container_name"
              type="text"
              onChange={(event) => dispatch(setContainerName(event.target.value))}
          />
          <label htmlFor="container_name">{getLocalizedString('containerName')}</label>
        </div>
        </div>
        <div style={{width:"50%"}}>
        <AsyncSelect
            placeholder={getLocalizedString('chooseImageOrStartWritting')}
            onChange={(event) => {
              dispatch(setImageName(event!.value));
            }}
            cacheOptions
            defaultOptions
            loadOptions={loadImagesPromise}
        />
        </div>
        <div className="row">
          <div className="input-field col s6">
            <input
                name="hostname"
                id="hostname"
                type="text"
                onChange={(event) => dispatch(setContainerName(event.target.value))}
            />
            <label htmlFor="hostname">{getLocalizedString('hostname')}</label>
          </div>
          <div className="input-field col s6">
            <input
                name="domainname"
                id="domainname"
                type="text"
                onChange={(event) => dispatch(setContainerName(event.target.value))}
            />
            <label htmlFor="domainname">{getLocalizedString('domainname')}</label>
          </div>
        </div>
        <div className="input-field col s6">
          <input
              name="healthCheckCommand"
              id="healthCheckCommand"
              type="text"
              onChange={(event) => dispatch(setContainerName(event.target.value))}
          />
          <label htmlFor="healthCheckCommand">{getLocalizedString('healthCheckCommand')}</label>
        </div>
        <div className="row">
          <div className="input-field col s3">
            <input
                name="publicPort"
                id="publicPort"
                type="text"
                onChange={(event) => dispatch(setContainerName(event.target.value))}
            />
            <label htmlFor="publicPort">{getLocalizedString('publicPort')}</label>
          </div>
          <div className="input-field col s3">
            <input
                name="privatePort"
                id="privatePort"
                type="text"
                onChange={(event) => dispatch(setContainerName(event.target.value))}
            />
            <label htmlFor="privatePort">{getLocalizedString('privatePort')}</label>
          </div>
        </div>
        <button className="btn">
          {getLocalizedString('recreate')}
        </button>
      </form>

    </div>
  );
};

export default EditContainer;
