import React, { useEffect, useState } from 'react';
import { accountApi, adminApi } from 'thunks';
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardStep } from 'handlers/stages';
import { DashboardStep } from 'enums/DashboardStep';
import { RootState } from 'handlers';
import { Locale } from 'enums/Locale';
import { setLocale } from 'handlers/ui';
import { useLocale } from 'utils/localeUtils';
import { Role } from '../../enums/Role';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/AccountApi';

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState<Role>();
  const { locale } = useSelector((state: RootState) => state.app.ui);
  const dispatch = useDispatch();
  const { getLocalizedString } = useLocale();

  const getRole = async () => {
    const role = ((await adminApi.GetRole(user)) as any).data;
    console.log(role);
    setRole(role);
  };
  useEffect(() => {
    if (user) {
      getRole();
    }
  }, [user]);

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
          {getLocalizedString('report')}
        </a>
      </li>
      <li>
        <div className="divider" />
      </li>

      {role === Role.Admin && (
        <>
          <li>
            <a className="subheader">{getLocalizedString('users')}</a>
          </li>
          <li>
            <a
              className="waves-effect"
              onClick={() => {
                dispatch(setDashboardStep(DashboardStep.UserManager));
              }}
            >
              {getLocalizedString('management')}
            </a>
          </li>
          <li>
            <div className="divider" />
          </li>
        </>
      )}

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
        <a
          className="waves-effect red darken-3 btn"
          onClick={() => {
            dispatch(setDashboardStep(null));
            accountApi.LogOut();
          }}
        >
          {getLocalizedString('logOut')}
        </a>
      </li>
    </ul>
  );
};

export default Sidebar;
