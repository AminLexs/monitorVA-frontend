import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebar } from 'handlers/ui';
import { RootState } from 'handlers';
import { DashboardStep } from 'enums/DashboardStep';

import ContainersList from './steps/ContainersList';
import { accountApi } from '../../thunks';

const getPageByStep = (step: DashboardStep | null) => {
  switch (step) {
    case DashboardStep.ContainersList:
      return <ContainersList />;
    default:
      return <ContainersList />;
  }
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    dispatch(setSidebar(true));
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (!user) {
      dispatch(setSidebar(false));
      navigate('/');
    }
  }, [user, loading]);

  const currentDashboardStep = useSelector((state: RootState) => state.app.stages.currentDashboardStep);

  return getPageByStep(currentDashboardStep);
};

export default DashboardPage;
