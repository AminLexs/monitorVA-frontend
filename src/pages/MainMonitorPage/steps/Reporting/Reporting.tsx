import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import Document from 'components/PDF/PDF';
import {containerApi} from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import Loading from 'components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setLoading } from 'handlers/ui';
import AsyncSelect from "react-select/async";
import {searchAsyncSelectOptions} from "utils/selectUtils";

interface PdfDataProps {
  doughnutChartNowState: string;
  barChartHistoryStateStatsURL: string;
  stats: Array<any>;
}

const Reporting = () => {
  const [user] = useAuthState(auth);
  const [containersOptions, setContainersOptions] = useState<Array<any>>([])
  const [selectedContainers, setSelectedContainers] = useState<Array<any>>([])
  const [createPDF, setCreatePDF] = useState(false)
  const [pdfData, setPDFData] = useState<PdfDataProps>();
  const { getLocalizedString, locale } = useLocale();
  const { loading } = useSelector((state: RootState) => state.app.ui);
  const dispatch = useDispatch();

  const getPDFData = async (user: any, containersID: Array<string>) => {
    if (containersID.length){
      const data = ((await containerApi.getPDFsDataContainers(user, containersID, locale)) as any).data;
      console.log(data);
      setPDFData(data);
    }

    dispatch(setLoading(false));
  };
  useEffect(() => {
    if (createPDF) {
      dispatch(setLoading(true));
      getPDFData(user, selectedContainers.map(selectedContainer=>selectedContainer.value));
    }
  }, [locale,createPDF]);

  const loadImagesPromise = async (inputValue: string) => {
    const containers = ((await containerApi.getContainers(user)) as any).data.map((container: any) => ({
      label: container.name,
      value: container.Id,
    }));
    const options = [{ label: "Select All", value: "all" }, ...searchAsyncSelectOptions(inputValue, containers)];
    setContainersOptions(options)
    return options
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ display: 'flex', gap:'20px', flexDirection: 'column' }}>
          {!createPDF ? 
              (<>
                <AsyncSelect
                    isMulti
                    placeholder={getLocalizedString('chooseContainerOrStartWritting')}
                    value={selectedContainers}
                    onChange={(event) => {
                      if(event.length && event.find(option => option.value === "all")) {
                        setSelectedContainers(containersOptions.slice(1))
                      }else {
                        setSelectedContainers(event as any)
                      }
                    }}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadImagesPromise}
                />
                <div style={{display:"flex",gap:"10px"}}>
                  <label>
                    <input type="checkbox" />
                    <span>Подробная информация о контейнерах</span>
                  </label>
                  <label>
                    <input type="checkbox" />
                    <span>Диаграмма затраченных ресурсов контейнера</span>
                  </label>
                  <label>
                    <input type="checkbox" />
                    <span>Диаграмма истории состояний контейнеров</span>
                  </label>
                  <label>
                    <input type="checkbox" />
                    <span>Диаграмма текущего состояния контейнеров</span>
                  </label>
                </div>
                <button style={{width:'30%'}} onClick={()=>{setCreatePDF(true)}} className="btn">Создать</button>
              </>)
              : null}
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
