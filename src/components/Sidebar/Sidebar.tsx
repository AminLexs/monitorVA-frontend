import React from 'react';
import { accountApi } from 'thunks';
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardStep } from 'handlers/stages';
import { DashboardStep } from 'enums/DashboardStep';
import { RootState } from 'handlers';
import { Locale } from 'enums/Locale';
import { setLocale } from 'handlers/ui';
import { useLocale } from 'utils/localeUtils';

const Sidebar = () => {
  const { locale } = useSelector((state: RootState) => state.app.ui);
  const { getLocalizedString } = useLocale();
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
        <a className="subheader">{getLocalizedString('containers')}</a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.ContainersList));
          }}
        >
          {getLocalizedString('list')}
        </a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.ContainersMonitoring));
          }}
        >
          {getLocalizedString('monitoring')}
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="subheader"> {getLocalizedString('images')}</a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.ImageList));
          }}
        >
          {getLocalizedString('list')}
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="subheader">{getLocalizedString('reporting')}</a>
      </li>
      <li>
        <a
          className="waves-effect"
          onClick={() => {
            dispatch(setDashboardStep(DashboardStep.Reporting));
          }}
        >
          {getLocalizedString('reporting')}
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a>
          <i style={{ marginRight: '16px' }} className={'material-icons'}>
            language
          </i>
          <button
            disabled={locale === Locale.Ru}
            onClick={() => {
              dispatch(setLocale(Locale.Ru));
            }}
            className="btn"
          >
            RU
          </button>
          <button
            disabled={locale === Locale.En}
            onClick={() => {
              dispatch(setLocale(Locale.En));
            }}
            className="btn"
          >
            EN
          </button>
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>
      <li>
        <a className="waves-effect red darken-3 btn" onClick={accountApi.LogOut}>
          {getLocalizedString('logOut')}
        </a>
      </li>
    </ul>
  );
};

export default Sidebar;
