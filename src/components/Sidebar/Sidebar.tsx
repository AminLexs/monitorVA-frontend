import React from 'react';
import { accountApi } from 'thunks';

const Sidebar = () => {
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
        <a className="waves-effect">List</a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="subheader">Images</a>
      </li>
      <li>
        <a className="waves-effect" href="#!">
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
