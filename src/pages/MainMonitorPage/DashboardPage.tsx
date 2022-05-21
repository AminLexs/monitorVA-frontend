import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebar } from 'handlers/ui';
import { RootState } from 'handlers';
import { DashboardStep } from 'enums/DashboardStep';

import ContainersList from './steps/ContainersList';
import ImagesList from './steps/ImagesList';
import ContainersMonitor from './steps/ContainersMonitor';
import Reporting from './steps/Reporting';
import DetailContainer from './steps/DetailContainer/DetailContainer';
import EditContainer from "./steps/EditContainer";

const getPageByStep = (step: DashboardStep | null) => {
  switch (step) {
    case DashboardStep.ContainersList:
      return <ContainersList />;

    case DashboardStep.ImageList:
      return <ImagesList />;

    case DashboardStep.ContainersMonitoring:
      return <ContainersMonitor />;

    case DashboardStep.Reporting:
      return <Reporting />;

    case DashboardStep.DetailContainer:
      return <DetailContainer />;

    case DashboardStep.EditContainer:
      return <EditContainer />;

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
