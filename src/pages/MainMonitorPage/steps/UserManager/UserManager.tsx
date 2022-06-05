import React from 'react';

import { useLocale } from 'utils/localeUtils';
import SimpleSelect from 'components/SimpleSelect';
import { Role } from 'enums/Role';
import { getOptionsFromArrayString } from 'utils/selectUtils';
import { searchNameFunc } from 'utils/tableUtils';

import styles from './UserManager.module.scss';

const UserManager = () => {
  const { getLocalizedString } = useLocale();
  const roles = getOptionsFromArrayString(Object.values(Role));

  return (
    <div>
      <div className={styles.registrationContainer}>
        <label className={styles.labelText}>{getLocalizedString('registration')}</label>
        <input placeholder={getLocalizedString('email')} />
        <input placeholder={getLocalizedString('password')} />
        <button style={{ width: '43%' }} className="btn">
          {getLocalizedString('save')}
        </button>
      </div>
      <div style={{ width: '50%' }} className="input-field right">
        <i className="material-icons prefix">search</i>
        <input placeholder={getLocalizedString('startTypingName')} id="searchInput" onKeyUp={() => searchNameFunc(0)} />
      </div>
      <table id="table" className={'centered'}>
        <thead>
          <tr>
            <th>{getLocalizedString('userEmail')}</th>
            <th>{getLocalizedString('changeUserRole')}</th>
            <th>{getLocalizedString('deleteUser')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>monitor.admin@mail.ru</td>
            <td>
              <SimpleSelect options={roles} onChange={() => {}} menuPlacement={'bottom'} />
            </td>
            <td>
              <button className="btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
