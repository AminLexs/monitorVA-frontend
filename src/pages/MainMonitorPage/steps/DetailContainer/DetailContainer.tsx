import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setCurrentContainerID } from 'handlers/containersManager';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { getShortContainersID } from 'utils/stringUtils';
import ReactConsole from '@webscopeio/react-console';
import { useLocale } from 'utils/localeUtils';

import styles from './DetailContainer.module.scss';

const DetailContainer = () => {
  const [user] = useAuthState(auth);
  const { currentContainerID } = useSelector((state: RootState) => state.app.containersManager);
  const [currentContainerInfo, setCurrentContainerInfo] = useState<any>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsData, setLogsData] = useState('');

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
  const handleOpenConsole = () => {
    setConsoleOpen(true);
  };

  const handleOpenLogs = async () => {
    setLogsOpen(true);
    setLogsData(((await containerApi.getContainerLogs(user, currentContainerID!)) as any).data);
  };

  return (
    <div>
      {currentContainerInfo && logsOpen && <textarea readOnly value={logsData} className={styles.console} />}
      {currentContainerInfo && consoleOpen && (
        <ReactConsole
          autoFocus
          welcomeMessage="Welcome"
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
             ${getLocalizedString('createDate')}${currentContainerInfo.Created})`}</h3>
          <ul className="collection">
            <li className="collection-item avatar">
              <i className="material-icons circle red">play_arrow</i>
              <span className="title">{getLocalizedString('state')}</span>
              <p>
                {' '}
                {getLocalizedString('statusWithTwoDots')}
                {currentContainerInfo.State.Status}
                <br />
                PID: {currentContainerInfo.State.Pid}
                <br />
                {getLocalizedString('startedAt')}
                {currentContainerInfo.State.StartedAt}
                <br />
                {getLocalizedString('finishedAt')}
                {currentContainerInfo.State.FinishedAt}
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
                {currentContainerInfo.Config.Volumes ?? 'null'}
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
                {Object.keys(currentContainerInfo.HostConfig.PortBindings)[0]}
                {/*{Object.keys(currentContainerInfo.NetworkSettings.Ports)[0]}*/}
                <br />
                {getLocalizedString('privatePort')}
                {': '}
                {(Object.values(currentContainerInfo.HostConfig.PortBindings)[0] as Array<any>)[0].HostPort}
                {/*{(Object.values(currentContainerInfo.NetworkSettings.Ports)[0] as Array<any>)[0].HostPort*/}
                <br />
              </p>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle green">insert_chart</i>
              <span className="title">Title</span>
              <p>
                First Line <br />
                Second Line
              </p>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default DetailContainer;
