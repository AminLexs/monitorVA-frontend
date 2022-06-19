import React, { useEffect, useState } from 'react';
import { BlobProvider, PDFViewer } from '@react-pdf/renderer';

import Document from 'components/PDF/PDF';
import { containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import Loading from 'components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setLoading } from 'handlers/ui';
import AsyncSelect from 'react-select/async';
import { searchAsyncSelectOptions } from 'utils/selectUtils';
import EmailPicker from 'components/EmailPicker';

interface PdfDataProps {
  containersInfo: Array<any>;
  doughnutChartNowState: string;
  barChartHistoryStateStatsURL: string;
  stats: Array<any>;
}

export interface PDFParams {
  detailContainersInfo: boolean;
  chartsUsedResourceContainers: boolean;
  chartHistoryStateContainers: boolean;
  chartCurrentStateContainers: boolean;
}

const Reporting = () => {
  const [user] = useAuthState(auth);
  const [containersOptions, setContainersOptions] = useState<Array<any>>([]);
  const [selectedContainers, setSelectedContainers] = useState<Array<any>>([]);
  const [createPDF, setCreatePDF] = useState(false);
  const [pdfData, setPDFData] = useState<PdfDataProps>();
  const [pdfParams, setPDFParams] = useState<PDFParams>();
  const [errorSelected, setErrorSelected] = useState(false);
  const { getLocalizedString, locale } = useLocale();
  const { loading } = useSelector((state: RootState) => state.app.ui);
  const [selectedEmailForSend, setSelectedEmailForSend] = useState<Array<string>>([]);
  const [blobPDF, setBlobPDF] = useState<Blob>();
  const [messageSend, setMessageSend] = useState('');
  const dispatch = useDispatch();

  const getPDFData = async (user: any, containersID: Array<string>) => {
    if (containersID.length) {
      const data = ((await containerApi.getPDFsDataContainers(user, containersID, pdfParams!, locale)) as any).data;
      console.log(data);
      setPDFData(data);
    }

    dispatch(setLoading(false));
  };
  useEffect(() => {
    if (createPDF) {
      dispatch(setLoading(true));
      getPDFData(
        user,
        selectedContainers.map((selectedContainer) => selectedContainer.value),
      );
    }
  }, [locale, createPDF]);

  const loadImagesPromise = async (inputValue: string) => {
    const containers = ((await containerApi.getContainers(user)) as any).data.map((container: any) => ({
      label: container.name,
      value: container.Id,
    }));
    const options = [
      { label: getLocalizedString('selectAll'), value: 'all' },
      ...searchAsyncSelectOptions(inputValue, containers),
    ];
    setContainersOptions(options);
    return options;
  };

  const handleSendReport = async () => {
    if (blobPDF && selectedEmailForSend.length !== 0) {
      const formData = new FormData();
      formData.append('pdf', blobPDF);
      const result = await containerApi.sendReport(user, formData, selectedEmailForSend);
      if (result.data === 'sent') {
        setMessageSend(getLocalizedString('successfullySent'));
      } else {
        setMessageSend(getLocalizedString('sendError'));
      }
      setTimeout(() => {
        setMessageSend('');
      }, 5000);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          {!createPDF ? (
            <>
              <AsyncSelect
                isMulti
                placeholder={getLocalizedString('chooseContainerOrStartWritting')}
                value={selectedContainers}
                onChange={(event) => {
                  setErrorSelected(false);
                  if (event.length && event.find((option) => option.value === 'all')) {
                    setSelectedContainers(containersOptions.slice(1));
                  } else {
                    setSelectedContainers(event as any);
                  }
                }}
                cacheOptions
                defaultOptions
                loadOptions={loadImagesPromise}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <label>
                  <input onChange={() => setErrorSelected(false)} id={'detailContainersInfo'} type="checkbox" />
                  <span>{getLocalizedString('detailContainersInfo')}</span>
                </label>
                <label>
                  <input onChange={() => setErrorSelected(false)} id={'chartsUsedResourceContainers'} type="checkbox" />
                  <span>{getLocalizedString('chartsUsedResourceContainers')}</span>
                </label>
                <label>
                  <input onChange={() => setErrorSelected(false)} id={'chartHistoryStateContainers'} type="checkbox" />
                  <span>{getLocalizedString('chartHistoryStateContainers')}</span>
                </label>
                <label>
                  <input onChange={() => setErrorSelected(false)} id={'chartCurrentStateContainers'} type="checkbox" />
                  <span>{getLocalizedString('chartCurrentStateContainers')}</span>
                </label>
              </div>
              {errorSelected && (
                <label style={{ color: 'red' }}>{getLocalizedString('notSelectedContainersOrParams')}</label>
              )}
              <button
                style={{ width: '30%' }}
                onClick={() => {
                  const params = {
                    chartCurrentStateContainers: (
                      document.getElementById('chartCurrentStateContainers') as HTMLInputElement
                    ).checked,
                    chartHistoryStateContainers: (
                      document.getElementById('chartHistoryStateContainers') as HTMLInputElement
                    ).checked,
                    chartsUsedResourceContainers: (
                      document.getElementById('chartsUsedResourceContainers') as HTMLInputElement
                    ).checked,
                    detailContainersInfo: (document.getElementById('detailContainersInfo') as HTMLInputElement).checked,
                  };
                  setPDFParams(params);
                  if (
                    !Object.values(params).reduce((acc, elem) => {
                      return acc || elem;
                    }, false) ||
                    selectedContainers.length === 0
                  ) {
                    setErrorSelected(true);
                  } else {
                    setCreatePDF(true);
                  }
                }}
                className="btn"
              >
                {getLocalizedString('create')}
              </button>
            </>
          ) : null}
          {pdfData ? (
            <>
              <PDFViewer height={'700px'}>
                <Document
                  containersInfo={pdfData.containersInfo}
                  doughnutChartNowStateURL={pdfData.doughnutChartNowState}
                  barChartHistoryStateStatsURL={pdfData.barChartHistoryStateStatsURL}
                  getLocalizedString={getLocalizedString}
                  stats={pdfData.stats}
                />
              </PDFViewer>
              <BlobProvider
                document={
                  <Document
                    containersInfo={pdfData.containersInfo}
                    doughnutChartNowStateURL={pdfData.doughnutChartNowState}
                    barChartHistoryStateStatsURL={pdfData.barChartHistoryStateStatsURL}
                    getLocalizedString={getLocalizedString}
                    stats={pdfData.stats}
                  />
                }
              >
                {({ blob, error }) => {
                  if (blob) {
                    setBlobPDF(blob);
                  }

                  return <div>{error}</div>;
                }}
              </BlobProvider>
              {blobPDF && (
                <>
                  <EmailPicker
                    items={selectedEmailForSend}
                    setItems={setSelectedEmailForSend}
                    getLocalizedString={getLocalizedString}
                    onChange={(items) => {
                      setSelectedEmailForSend(items);
                    }}
                  />
                  {messageSend && <label style={{ color: 'green' }}>{messageSend}</label>}
                  <button onClick={handleSendReport} style={{ width: '50%' }} className={'btn'}>
                    {getLocalizedString('send')}
                  </button>
                </>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Reporting;
