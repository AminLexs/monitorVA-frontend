import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import Document from 'components/PDF/PDF';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import Loading from 'components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setLoading } from 'handlers/ui';

interface PdfDataProps {
  doughnutChartNowState: string;
  barChartHistoryStateStatsURL: string;
  stats: Array<any>;
}

const Reporting = () => {
  const [user] = useAuthState(auth);
  const [pdfData, setPDFData] = useState<PdfDataProps>();
  const [containersID, setContainersID] = useState([]);
  const { getLocalizedString, locale } = useLocale();
  const { loading } = useSelector((state: RootState) => state.app.ui);
  const dispatch = useDispatch();

  const getContainers = async (user: any) => {
    const data = ((await containerApi.getContainers(user)) as any).data;
    console.log(data);
    setContainersID(data.map((container: { Id: any }) => container.Id));
  };

  const getPDFData = async (user: any, containersID: Array<string>) => {
    const data = ((await containerApi.getPDFsDataContainers(user, containersID, locale)) as any).data;
    console.log(data);
    setPDFData(data);
    dispatch(setLoading(false));
  };
  useEffect(() => {
    dispatch(setLoading(true));
    getContainers(user);
  }, [locale]);
  useEffect(() => {
    if (containersID.length) getPDFData(user, containersID);
  }, [containersID]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {pdfData ? (
            <PDFViewer height={'700px'}>
              <Document
                chartURLs={[pdfData.doughnutChartNowState, pdfData.barChartHistoryStateStatsURL]}
                getLocalizedString={getLocalizedString}
                stats={pdfData.stats}
              />
            </PDFViewer>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Reporting;
