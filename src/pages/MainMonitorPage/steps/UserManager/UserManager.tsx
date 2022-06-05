import React, { useEffect, useState } from 'react';

import { useLocale } from 'utils/localeUtils';
import SimpleSelect from 'components/SimpleSelect';
import { Role } from 'enums/Role';
import { getOptionFromString, getOptionsFromArrayString } from 'utils/selectUtils';
import { searchNameFunc } from 'utils/tableUtils';
import { adminApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { RootState } from 'handlers';
import { useSelector } from 'react-redux';
import Loading from 'components/Loading';
import { emailCorrect } from 'utils/stringUtils';

import styles from './UserManager.module.scss';

const UserManager = () => {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState<Array<any>>();
  const [errorPassOrEmail, setErrorPassOrEmail] = useState('');
  const { getLocalizedString } = useLocale();
  const roles = getOptionsFromArrayString(Object.values(Role));
  const { loading } = useSelector((state: RootState) => state.app.ui);

  const getUsers = async () => {
    setUsers(((await adminApi.GetUsers(user)) as any).data);
  };

  useEffect(() => {
    getUsers();
  }, []);
  console.log(users);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.registrationContainer}>
            <label className={styles.labelText}>{getLocalizedString('registration')}</label>
            <input
              onChange={() => setErrorPassOrEmail('')}
              id={'emailInput'}
              placeholder={getLocalizedString('email')}
            />
            <input
              onChange={() => setErrorPassOrEmail('')}
              id={'passwordInput'}
              placeholder={getLocalizedString('password')}
            />
            {errorPassOrEmail && <label style={{ color: 'red' }}>{getLocalizedString(errorPassOrEmail)}</label>}
            <button
              onClick={async () => {
                const email = (document.getElementById('emailInput') as HTMLInputElement).value;
                const password = (document.getElementById('passwordInput') as HTMLInputElement).value;
                if (emailCorrect(email) && password.length > 5) {
                  setErrorPassOrEmail('');
                  const result = (await adminApi.CreateUser(user, email, password)) as any;
                  if (result.error && result.error.includes('The email address is already in use'))
                    setErrorPassOrEmail('thisEmailAlreadyInUse');
                } else {
                  setErrorPassOrEmail('incorrectEmailOrPass');
                }
              }}
              style={{ width: '43%' }}
              className="btn"
            >
              {getLocalizedString('save')}
            </button>
          </div>
          <div style={{ width: '50%' }} className="input-field right">
            <i className="material-icons prefix">search</i>
            <input
              placeholder={getLocalizedString('startTypingName')}
              id="searchInput"
              onKeyUp={() => searchNameFunc(0)}
            />
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
              {users &&
                users.map((systemUser) => {
                  return (
                    <tr>
                      <td>{systemUser.mail}</td>
                      <td>
                        <SimpleSelect
                          firstValue={getOptionFromString(systemUser.role)}
                          options={roles}
                          onChange={(selectedOption) => {
                            adminApi.ChangeUserRole(user, systemUser.id, selectedOption!.value as Role);
                          }}
                          menuPlacement={'bottom'}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            adminApi.DeleteUser(user, systemUser.id).then(() => {
                              getUsers();
                            });
                          }}
                          className="btn"
                        >
                          {getLocalizedString('delete')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserManager;
