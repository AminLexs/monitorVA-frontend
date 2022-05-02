import React, {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "api/AccountApi";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setSidebar} from 'handlers/ui'

const MainMonitorPage = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        dispatch(setSidebar(true))
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (!user){
            dispatch(setSidebar(false))
            navigate('/');
        }

    }, [user, loading]);
    return(
        <div>

        </div>
    )
}

export default MainMonitorPage;