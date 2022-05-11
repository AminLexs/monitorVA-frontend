import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setCurrentContainerID } from 'handlers/containersManager';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { getShortContainersID } from 'utils/stringUtils';
import ReactConsole from '@webscopeio/react-console';

import styles from './DetailContainer.module.scss';

const DetailContainer = () => {
  const [user] = useAuthState(auth);
  const { currentContainerID } = useSelector((state: RootState) => state.app.containersManager);
  const [currentContainerInfo, setCurrentContainerInfo] = useState<any>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsData, setLogsData] = useState('');

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
      {currentContainerInfo && logsOpen && (
        <div className={styles.console}>
          <p style={{ color: 'white', whiteSpace: 'pre-wrap' }}>{logsData}</p>
        </div>
      )}
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
            console.log(str);
            return new Promise((resolve) => {
              resolve('No command found');
            });
          }}
        />
      )}
      {currentContainerInfo && !consoleOpen && !logsOpen && (
        <>
          <h3>{`${currentContainerInfo.Name}
            (ID:${getShortContainersID(currentContainerInfo.Id)},
             create date: ${currentContainerInfo.Created})`}</h3>
          <ul className="collection">
            <li className="collection-item avatar">
              <i className="material-icons circle red">play_arrow</i>
              <span className="title">State</span>
              <p>
                {' '}
                Status: {currentContainerInfo.State.Status}
                <br />
                PID: {currentContainerInfo.State.Pid}
                <br />
                Started at: {currentContainerInfo.State.StartedAt}
                <br />
                Finished at: {currentContainerInfo.State.FinishedAt}
                <br />
              </p>
              <a className="secondary-content">
                <div
                  onClick={handleOpenLogs}
                  style={{ fontSize: '30px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  Log:{' '}
                  <i style={{ fontSize: '50px' }} className="material-icons">
                    wysiwyg
                  </i>
                </div>
                <div
                  onClick={handleOpenConsole}
                  style={{ fontSize: '30px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  Console:{' '}
                  <i style={{ fontSize: '50px' }} className="material-icons">
                    terminal
                  </i>
                </div>
              </a>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle red">refresh</i>
              <span className="title">Restart policy</span>
              <p>
                {' '}
                Restart count: {currentContainerInfo.RestartCount}
                <br />
                Maximum retry count: {currentContainerInfo.HostConfig.RestartPolicy.MaximumRetryCount}
              </p>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle">folder</i>
              <span className="title">Environment</span>
              <p>
                {' '}
                Platform: {currentContainerInfo.Platform}
                <br />
                Working directory: {currentContainerInfo.Config.WorkingDir}
                <br />
                Image: {currentContainerInfo.Config.Image}
                <br />
                Volumes: {currentContainerInfo.Config.Volumes ?? 'null'}
                <br />
                Other: <br />
                {(currentContainerInfo.Config.Env as Array<any>).map((elem) => (
                  <>
                    {elem} <br />
                  </>
                ))}
              </p>
            </li>
            <li className="collection-item avatar">
              <i className="material-icons circle">wifi</i>
              <span className="title">Network</span>
              <p>
                {' '}
                Public port: {Object.keys(currentContainerInfo.NetworkSettings.Ports)[0]}
                <br />
                Private port: {(Object.values(currentContainerInfo.NetworkSettings.Ports)[0] as Array<any>)[0].HostPort}
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
