import React from 'react';
import { accountApi } from 'thunks';
import { useDispatch } from 'react-redux';
import { setDashboardStep } from 'handlers/stages';
import { DashboardStep } from 'enums/DashboardStep';

const Sidebar = () => {
  const dispatch = useDispatch();
  return (
    <ul id="slide-out" className="sidenav sidenav-fixed">
      <li>
        <a>
          <i className="material-icons">cloud</i>MonitorVA
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="subheader">Containers</a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.ContainersList));
          }}
        >
          List
        </a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.ContainersMonitoring));
          }}
        >
          Monitoring
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="subheader">Images</a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.ImageList));
          }}
        >
          List
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="waves-effect red darken-3 btn" onClick={accountApi.LogOut}>
          Log out
        </a>
      </li>
    </ul>
  );
};

export default Sidebar;
