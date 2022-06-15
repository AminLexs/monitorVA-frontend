import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { containerApi, imageApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import { OptionType, searchAsyncSelectOptions } from 'utils/selectUtils';
import AsyncSelect from 'react-select/async';
import { setDashboardStep } from 'handlers/stages';
import { DashboardStep } from 'enums/DashboardStep';
import { UpdateParams } from 'api/ContainerApi';
import { setLoading } from 'handlers/ui';

import Loading from 'components/Loading';

const getUsefullInfo = (currentContainerInfo: any) => {
  const containerInfo = {
    Name: currentContainerInfo.Name ? currentContainerInfo.Name.slice(1) : undefined,
    Domainname: currentContainerInfo.Config.Domainname,
    Hostname: currentContainerInfo.Config.Hostname,
    Image: currentContainerInfo.Config.Image,
    CpuShares: currentContainerInfo.HostConfig.CpuShares,
    Memory: currentContainerInfo.HostConfig.Memory,
    MaximumRetryCount: currentContainerInfo.HostConfig.RestartPolicy.MaximumRetryCount,
    PublicPort: (Object.values(currentContainerInfo.HostConfig.PortBindings)[0] as Array<any>)[0].HostPort,
    PrivatePort: Object.keys(currentContainerInfo.HostConfig.PortBindings)[0].split('/')[0],
    healthCheckCommand: currentContainerInfo.Config.Healthcheck?.Test?.join(', ') || '',
  };
  (document.getElementById('cpuUsageLimit') as HTMLInputElement).defaultValue = containerInfo.CpuShares;
  (document.getElementById('memoryUsageLimit') as HTMLInputElement).defaultValue = containerInfo.Memory;
  (document.getElementById('countRestart') as HTMLInputElement).defaultValue = containerInfo.MaximumRetryCount;
  (document.getElementById('container_name') as HTMLInputElement).defaultValue = containerInfo.Name;
  (document.getElementById('hostname') as HTMLInputElement).defaultValue = containerInfo.Hostname;
  (document.getElementById('domainname') as HTMLInputElement).defaultValue = containerInfo.Domainname;
  (document.getElementById('publicPort') as HTMLInputElement).defaultValue = containerInfo.PublicPort;
  (document.getElementById('privatePort') as HTMLInputElement).defaultValue = containerInfo.PrivatePort;
  (document.getElementById('healthCheckCommand') as HTMLInputElement).defaultValue = containerInfo.healthCheckCommand;
};

const getInfoFromFields = (imageName: string) => {
  return {
    cpuUsageLimit: (document.getElementById('cpuUsageLimit') as HTMLInputElement).value,
    memoryUsageLimit: (document.getElementById('memoryUsageLimit') as HTMLInputElement).value,
    countRestart: (document.getElementById('countRestart') as HTMLInputElement).value,
    containerName: (document.getElementById('container_name') as HTMLInputElement).value,
    image: imageName,
    hostname: (document.getElementById('hostname') as HTMLInputElement).value,
    domainname: (document.getElementById('domainname') as HTMLInputElement).value,
    command: (document.getElementById('healthCheckCommand') as HTMLInputElement).value,
    publicPort: (document.getElementById('publicPort') as HTMLInputElement).value,
    privatePort: (document.getElementById('privatePort') as HTMLInputElement).value,
  };
};

const getStringifySettings = (currentContainerInfo: any) => {
  return JSON.stringify({
    Name: currentContainerInfo.Name.slice(1),
    settings: {
      ...currentContainerInfo.Config,
      HostConfig: currentContainerInfo.HostConfig,
    },
  });
};

const EditContainer = () => {
  const [user] = useAuthState(auth);
  const { currentContainerID } = useSelector((state: RootState) => state.app.containersManager);
  const [currentContainerInfo, setCurrentContainerInfo] = useState<any>(null);
  const [errorCreateContainerWithJSON, setErrorCreateContainerWithJSON] = useState('');
  const { loading } = useSelector((state: RootState) => state.app.ui);
  const [imageName, setImageName] = useState<OptionType>();

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
  }, [currentContainerID]);

  useEffect(() => {
    if (currentContainerInfo) {
      getUsefullInfo(currentContainerInfo);
      setImageName({ label: currentContainerInfo.Config.Image, value: currentContainerInfo.Config.Image });
    }
  }, [currentContainerInfo]);

  const handleUpdateContainer = async () => {
    dispatch(setLoading(true));
    const updateParams: UpdateParams = {
      CpuShares: +(document.getElementById('cpuUsageLimit') as HTMLInputElement).value,
      Memory: +(document.getElementById('memoryUsageLimit') as HTMLInputElement).value,
      MemorySwap: -1,
      RestartPolicy: {
        Name: 'on-failure',
        MaximumRetryCount: +(document.getElementById('countRestart') as HTMLInputElement).value,
      },
    };
    await containerApi.updateContainer(user, currentContainerID!, updateParams);
    dispatch(setLoading(false));
    dispatch(setDashboardStep(DashboardStep.DetailContainer));
  };

  const handleRenameContainer = async () => {
    const newContainer = (document.getElementById('container_name') as HTMLInputElement).value;
    dispatch(setLoading(true));
    await containerApi.renameContainer(user, currentContainerID!, newContainer);
    dispatch(setLoading(false));
    dispatch(setDashboardStep(DashboardStep.DetailContainer));
  };

  const handleRecreateContainer = async () => {
    const settings = getInfoFromFields(imageName?.value!);
    //dispatch(setLoading(true))
    const oldSettings = getStringifySettings(currentContainerInfo);
    await containerApi.recreateContainer(user, currentContainerID!, settings, oldSettings);
    //dispatch(setLoading(false))
    dispatch(setDashboardStep(DashboardStep.ContainersList));
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <a
            style={{ position: 'absolute', left: '350px', marginBottom: '10px' }}
            onClick={() => dispatch(setDashboardStep(DashboardStep.DetailContainer))}
            className="btn-floating btn-large waves-effect waves-light blue"
          >
            <i className="material-icons">arrow_back</i>
          </a>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid lightgrey' }} className="col s16">
            <div className="row">
              <div className="input-field col s5">
                <input
                  name="cpuUsageLimit"
                  id="cpuUsageLimit"
                  type="number"
                  min={0}
                  onInput={(event) => {
                    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(
                      /\D/g,
                      '',
                    );
                  }}
                  onChange={(event) => {
                    if (+event.target.value < 0) event.target.value = '0';
                  }}
                />
                <label className="active" htmlFor="cpuUsageLimit">
                  {getLocalizedString('cpuUsageLimit')}
                </label>
              </div>
              <div className="input-field col s5">
                <input
                  name="memoryUsageLimit"
                  id="memoryUsageLimit"
                  type="number"
                  min={0}
                  onInput={(event) => {
                    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(
                      /\D/g,
                      '',
                    );
                  }}
                  onChange={(event) => {
                    if (+event.target.value < 0) event.target.value = '0';
                  }}
                />
                <label className="active" htmlFor="memoryUsageLimit">
                  {getLocalizedString('memoryUsageLimit')}
                </label>
              </div>

              <div className="input-field col s4">
                <input
                  name="countRestart"
                  id="countRestart"
                  type="number"
                  min={0}
                  onInput={(event) => {
                    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(
                      /\D/g,
                      '',
                    );
                  }}
                  onChange={(event) => {
                    if (+event.target.value < 0) event.target.value = '0';
                  }}
                />
                <label className="active" htmlFor="countRestart">
                  {getLocalizedString('countRestart')}
                </label>
                <button onClick={handleUpdateContainer} className="btn">
                  {getLocalizedString('update')}
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }} className="col s16">
            <div className="row">
              <div className="input-field col s6">
                <input name="container_name" id="container_name" type="text" />
                <label className="active" htmlFor="container_name">
                  {getLocalizedString('containerName')}
                </label>
              </div>
              <button onClick={handleRenameContainer} className={'btn'}>
                {getLocalizedString('rename')}
              </button>
            </div>
            <div style={{ width: '50%' }}>
              <AsyncSelect
                value={imageName}
                placeholder={getLocalizedString('chooseImageOrStartWritting')}
                onChange={(event) => {
                  setImageName(event!);
                }}
                cacheOptions
                defaultOptions
                loadOptions={loadImagesPromise}
              />
            </div>
            <div style={{ marginTop: '10px' }} className="row">
              <div className="input-field col s6">
                <input name="hostname" id="hostname" type="text" />
                <label className="active" htmlFor="hostname">
                  {getLocalizedString('hostname')}
                </label>
              </div>
              <div className="input-field col s6">
                <input name="domainname" id="domainname" type="text" />
                <label className="active" htmlFor="domainname">
                  {getLocalizedString('domainname')}
                </label>
              </div>
            </div>
            <div className="input-field col s6">
              <input name="healthCheckCommand" id="healthCheckCommand" type="text" />
              <label className="active" htmlFor="healthCheckCommand">
                {getLocalizedString('healthCheckCommand')}
              </label>
            </div>
            <div className="row">
              <div className="input-field col s3">
                <input
                  name="publicPort"
                  id="publicPort"
                  type="number"
                  min={0}
                  max={65535}
                  onInput={(event) => {
                    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(
                      /\D/g,
                      '',
                    );
                  }}
                  onChange={(event) => {
                    if (+event.target.value < 0) event.target.value = '0';
                    if (+event.target.value > 65535) event.target.value = '65535';
                  }}
                />
                <label className="active" htmlFor="publicPort">
                  {getLocalizedString('publicPort')}
                </label>
              </div>
              <div className="input-field col s3">
                <input
                  name="privatePort"
                  id="privatePort"
                  type="number"
                  min={0}
                  max={65535}
                  onInput={(event) => {
                    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(
                      /\D/g,
                      '',
                    );
                  }}
                  onChange={(event) => {
                    if (+event.target.value < 0) event.target.value = '0';
                    if (+event.target.value > 65535) event.target.value = '65535';
                  }}
                />
                <label className="active" htmlFor="privatePort">
                  {getLocalizedString('privatePort')}
                </label>
              </div>
              <button onClick={handleRecreateContainer} className="btn">
                {getLocalizedString('recreate')}
              </button>
            </div>
            {errorCreateContainerWithJSON && <label style={{ color: 'red' }}>{errorCreateContainerWithJSON}</label>}
            {currentContainerInfo && (
              <div style={{ display: 'flex', gap: '20px', padding: '5px', borderTop: '1px solid lightgrey' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label>{getLocalizedString('loadJsonSettings')}</label>
                  <input
                    accept={'.json'}
                    name={'archiveImage'}
                    onChange={async (event) => {
                      const files = event.target.files!;
                      const formData = new FormData();
                      formData.append('settings', files[0]);
                      const result = (await containerApi.createContainerFromFile(user, formData)) as any;

                      if (result.error) {
                        if (result.error.includes('Unexpected token') || result.error.includes('code 400')) {
                          setErrorCreateContainerWithJSON(getLocalizedString('invDataCheckJSON'));
                        }
                      } else {
                        setErrorCreateContainerWithJSON(getLocalizedString(''));
                        dispatch(setDashboardStep(DashboardStep.ContainersList));
                      }
                    }}
                    type={'file'}
                    className="waves-effect waves-light btn"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label>{getLocalizedString('saveJsonSettings')}</label>
                  <a
                    className={'btn'}
                    href={`data:application/xml;charset=utf-8,${getStringifySettings(currentContainerInfo)}`}
                    download={`container_settings_${currentContainerInfo.Name}.json`}
                  >
                    {getLocalizedString('save')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditContainer;
