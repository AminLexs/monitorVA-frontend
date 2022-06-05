import React, { useEffect, useState } from 'react';
import { accountApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSidebar } from 'handlers/ui';
import { setUser } from 'handlers/auth';
import { emailCorrect } from 'utils/stringUtils';

const passwordCorrect = (password: string) => {
  return password.length > 5;
};

const formIsRight = (email: string, password: string) => {
  return emailCorrect(email) && passwordCorrect(password);
};

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [isSubmit, setSubmit] = useState(false);

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      dispatch(setUser(user));
      dispatch(setSidebar(true));
      navigate('/monitor');
    }
  }, [user, loading]);
  return (
    <div>
      <form className="modal-content animate">
        <div className="container">
          <div>
            <label htmlFor="uname">
              <b>Электронная почта</b>
            </label>
            <input
              type="text"
              placeholder="Введите электронную почту"
              name="uname"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
            />
            {isSubmit && !emailCorrect(email) && (
              <label style={{ color: 'red' }}>Введите корректную электронную почту</label>
            )}
          </div>
          <div>
            <label htmlFor="psw">
              <b>Пароль</b>
            </label>
            <input
              type="password"
              placeholder="Введите пароль"
              name="psw"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />
            {isSubmit && !passwordCorrect(password) && (
              <label style={{ color: 'red' }}>Пароль должен быть больше 5 символов</label>
            )}
          </div>
          <a
            className="waves-effect waves-light btn"
            onClick={() => {
              setSubmit(true);
              if (formIsRight(email, password)) accountApi.Authenticate(email, password);
            }}
          >
            Войти
          </a>
          {error && <>{error}</>}
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
