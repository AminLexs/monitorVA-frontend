import React, {useEffect, useState} from 'react';
import {accountApi} from "thunks";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "api/AccountApi";
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setSidebar} from 'handlers/ui'

const AuthPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) {
            dispatch(setSidebar(true))
            navigate('/monitor');
        }
    }, [user, loading]);
  return(
      <div>
      <form className="modal-content animate">
          <div className="container">
              <label htmlFor="uname"><b>Username</b></label>
              <input type="text" placeholder="Enter Username" name="uname"
                     onChange={(event)=>{setEmail(event.target.value)}}
                     required/>
              <label htmlFor="psw"><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="psw"
                     onChange={(event)=>{setPassword(event.target.value)}}
                     required/>
              <a className="waves-effect waves-light btn" onClick={()=>{
                  accountApi.Authenticate(email, password)
              }}>Login</a>
              {error && <>{error}</>}

          </div>
      </form>
  </div>
  )
};

export default AuthPage;
