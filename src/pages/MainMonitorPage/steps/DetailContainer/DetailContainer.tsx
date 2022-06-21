import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardStep } from 'handlers/stages';
import { DashboardStep } from 'enums/DashboardStep';
import { RootState } from 'handlers';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { getDateFromString, getShortContainersID } from 'utils/stringUtils';
import ReactConsole from '@webscopeio/react-console';
import { useLocale } from 'utils/localeUtils';
import EmailPicker from 'components/EmailPicker';
import { ObserverOptions } from 'api/ContainerApi';
import moment from 'moment';
import 'moment-duration-format';

import styles from './DetailContainer.module.scss';

const DetailContainer = () => {
  const [user] = useAuthState(auth);
  const { currentContainerID } = useSelector((state: RootState) => state.app.containersManager);
  const [currentContainerInfo, setCurrentContainerInfo] = useState<any>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsData, setLogsData] = useState('');
  const [selectedEmailForObserve, setSelectedEmailForObserve] = useState<Array<string>>([]);

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
    // return () => {
    //   dispatch(setCurrentContainerID(null));
    // };
  }, [currentContainerID]);
  const handleOpenConsole = () => {
    setConsoleOpen(true);
  };

  const handleOpenLogs = async () => {
    setLogsOpen(true);
    setLogsData(((await containerApi.getContainerLogs(user, currentContainerID!)) as any).data);
  };

  const handleEditClick = () => {
    dispatch(setDashboardStep(DashboardStep.EditContainer));
  };

  const handleUpdateObserver = async () => {
    const isOn = (document.getElementById('observerOnSwitch') as HTMLInputElement).checked;
    const eventDestroy = (document.getElementById('eventDestroy') as HTMLInputElement).checked;
    const eventDie = (document.getElementById('eventDie') as HTMLInputElement).checked;
    const eventKill = (document.getElementById('eventKill') as HTMLInputElement).checked;
    const eventStart = (document.getElementById('eventStart') as HTMLInputElement).checked;
    const eventStop = (document.getElementById('eventStop') as HTMLInputElement).checked;
    const eventRestart = (document.getElementById('eventRestart') as HTMLInputElement).checked;
    const observerOptions: ObserverOptions = {
      emails: selectedEmailForObserve,
      onDestroy: eventDestroy,
      onDie: eventDie,
      onKill: eventKill,
      onStart: eventStart,
      onStop: eventStop,
      onRestart: eventRestart,
      isOn: isOn,
    };

    await containerApi.updateObserverSettings(user, currentContainerInfo.Id, observerOptions);
  };

  const handleRefreshSettingsObserver = async () => {
    const observeSettings = ((await containerApi.getObserverSettings(user, currentContainerInfo.Id)) as any).data;
    if (observeSettings) {
      setSelectedEmailForObserve(observeSettings.emails);
      (document.getElementById('eventDestroy') as HTMLInputElement).checked = observeSettings.onDestroy;
      (document.getElementById('eventDie') as HTMLInputElement).checked = observeSettings.onDie;
      (document.getElementById('eventKill') as HTMLInputElement).checked = observeSettings.onKill;
      (document.getElementById('eventStart') as HTMLInputElement).checked = observeSettings.onStart;
      (document.getElementById('eventStop') as HTMLInputElement).checked = observeSettings.onStop;
      (document.getElementById('eventRestart') as HTMLInputElement).checked = observeSettings.onRestart;
      (document.getElementById('observerOnSwitch') as HTMLInputElement).checked = observeSettings.isOn;
    }
  };

  return (
    <div>
      {currentContainerInfo && logsOpen && <textarea readOnly value={logsData} className={styles.console} />}
      {currentContainerInfo && consoleOpen && (
        <ReactConsole
          autoFocus
          welcomeMessage="Добро пожаловать в консоль контейнера"
          commands={{
            test: {
              description: 'Test',
              fn: () => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve('Hello world \n\n hello \n');
                  }, 2000);
                });
              },
            },
          }}
          noCommandFound={(str) => {
            return new Promise(async (resolve) => {
              const dataFromServer = await containerApi.executeCommandContainer(user, currentContainerID!, str);
              const data = (dataFromServer as any).data;
              resolve(data);
            });
          }}
        />
      )}
      {currentContainerInfo && !consoleOpen && !logsOpen && (
        <>
          <h3>{`${currentContainerInfo.Name}
            (ID:${getShortContainersID(currentContainerInfo.Id)},
             ${getLocalizedString('createDate')}${getDateFromString(currentContainerInfo.Created)})`}</h3>
          <ul className="collection">
            <li className="collection-item avatar">
              <i className="material-icons circle red">play_arrow</i>
              <span className="title">{getLocalizedString('state')}</span>
              <p>
                {' '}
                {getLocalizedString('statusWithTwoDots')}
                {getLocalizedString(currentContainerInfo.State.Status)}
                <br />
                PID: {currentContainerInfo.State.Pid}
                <br />
                {getLocalizedString('startedAt')}
                {getDateFromString(currentContainerInfo.State.StartedAt)}
                <br />
                {currentContainerInfo.State.Status === 'running' && (
                  <>
                    {getLocalizedString('timeOfWork') +
                      moment
                        .duration(moment(new Date()).diff(moment(new Date(currentContainerInfo.State.StartedAt))))
                        .format('hh:mm:ss')}
                    <br />
                  </>
                )}
                {getLocalizedString('finishedAt')}
                {getDateFromString(currentContainerInfo.State.FinishedAt)}
                <br />
              </p>
              <a className="secondary-content">
                <div
                  onClick={handleOpenLogs}
                  style={{ fontSize: '30px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  {getLocalizedString('log')}{' '}
                  <i style={{ fontSize: '50px' }} className="material-icons">
                    wysiwyg
                  </i>
                </div>
                {currentContainerInfo.State.Status === 'running' && (
                  <div
                    onClick={handleOpenConsole}
                    style={{ fontSize: '30px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    {getLocalizedString('console')}{' '}
                    <i style={{ fontSize: '50px' }} className="material-icons">
                      terminal
                    </i>
                  </div>
                )}
              </a>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle red">refresh</i>
              <span className="title">{getLocalizedString('restartPolicy')}</span>
              <p>
                {' '}
                {getLocalizedString('restartCount')}
                {currentContainerInfo.RestartCount}
                <br />
                {getLocalizedString('maximumRetryCount')}
                {currentContainerInfo.HostConfig.RestartPolicy.MaximumRetryCount}
              </p>
              <button onClick={handleEditClick} className="btn">
                {getLocalizedString('edit')}
              </button>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle">folder</i>
              <span className="title">{getLocalizedString('environment')}</span>
              <p>
                {' '}
                {getLocalizedString('platform')}
                {currentContainerInfo.Platform}
                <br />
                {getLocalizedString('workingDirectory')}
                {currentContainerInfo.Config.WorkingDir}
                <br />
                {getLocalizedString('image')}: {currentContainerInfo.Config.Image}
                <br />
                {getLocalizedString('volumes')}
                {currentContainerInfo.Config.Volumes ?? getLocalizedString('empty')}
                <br />
                {getLocalizedString('other')}
                <br />
                {(currentContainerInfo.Config.Env as Array<any>).map((elem) => (
                  <Fragment key={elem}>
                    {elem} <br />
                  </Fragment>
                ))}
              </p>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle">wifi</i>
              <span className="title">{getLocalizedString('network')}</span>
              <p>
                {' '}
                {getLocalizedString('publicPort')}
                {': '}
                {(Object.values(currentContainerInfo.HostConfig.PortBindings)[0] as Array<any>)[0].HostPort}
                {/*{Object.keys(currentContainerInfo.NetworkSettings.Ports)[0]}*/}
                <br />
                {getLocalizedString('privatePort')}
                {': '}
                {Object.keys(currentContainerInfo.HostConfig.PortBindings)[0].split('/')[0]}
                {/*{(Object.values(currentContainerInfo.NetworkSettings.Ports)[0] as Array<any>)[0].HostPort*/}
                <br />
              </p>
            </li>
            <li style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="collection-item avatar">
              <i className="material-icons circle green">email</i>
              <span className="title">{getLocalizedString('notification')}</span>
              <p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <EmailPicker
                    items={selectedEmailForObserve}
                    setItems={setSelectedEmailForObserve}
                    getLocalizedString={getLocalizedString}
                    onChange={(items) => {
                      setSelectedEmailForObserve(items);
                    }}
                  />
                  <button onClick={handleRefreshSettingsObserver} style={{ width: '20%' }} className="btn">
                    {getLocalizedString('refresh')}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label>
                    <input id="eventDestroy" type="checkbox" />
                    <span>{getLocalizedString('eventDestroy')}</span>
                  </label>
                  <label>
                    <input id="eventDie" type="checkbox" />
                    <span>{getLocalizedString('eventDie')}</span>
                  </label>
                  <label>
                    <input id="eventKill" type="checkbox" />
                    <span>{getLocalizedString('eventKill')}</span>
                  </label>
                  <label>
                    <input id="eventStart" type="checkbox" />
                    <span>{getLocalizedString('eventStart')}</span>
                  </label>
                  <label>
                    <input id="eventStop" type="checkbox" />
                    <span>{getLocalizedString('eventStop')}</span>
                  </label>
                  <label>
                    <input id="eventRestart" type="checkbox" />
                    <span>{getLocalizedString('eventRestart')}</span>
                  </label>
                </div>
              </p>
              <div className="switch">
                <label>
                  {getLocalizedString('off')}
                  <input id="observerOnSwitch" type="checkbox" />
                  <span className="lever" />
                  {getLocalizedString('on')}
                </label>
              </div>
              <button onClick={handleUpdateObserver} style={{ width: '40%' }} className="btn">
                {getLocalizedString('save')}
              </button>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle green">create</i>
              <span onClick={handleEditClick} className="title">
                <button className="btn">{getLocalizedString('edit')}</button>
              </span>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default DetailContainer;
