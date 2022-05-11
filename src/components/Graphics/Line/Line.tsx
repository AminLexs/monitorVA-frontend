import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { containerApi } from 'thunks';

import React, { useEffect, useRef, useState } from 'react';
import { GraphicsType } from 'enums/GraphicsType';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import {
  addOneSecondRefresh,
  removeOneSecondRefresh,
  switchRunPause,
  updateFuncOnRefresh,
  updateLocaleTitles,
} from 'utils/chartUtils';
import { bytesToGigabytes, bytesToKilobytes, bytesToMegabytes, bytesToTerabytes } from 'utils/dataFormattingUtils';
import { MemoryType } from 'enums/MemoryType';
import SimpleSelect from 'components/SimpleSelect';
import { getOptionsFromArrayString, OptionType } from 'utils/selectUtils';

import styles from './Line.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  StreamingPlugin,
  zoomPlugin,
);
const optionsCPU = {
  responsive: true,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Time',
      },
      type: 'realtime',
      realtime: {
        delay: 5000,
        refresh: 3000,
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: `CPU Usage,%`,
      },
      ticks: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'CPU',
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        pinch: {
          enabled: true,
        },
        wheel: {
          enabled: true,
        },
        mode: 'x',
      },
      limits: {
        x: {
          minDelay: 0,
          maxDelay: 4000,
          minDuration: 1000,
          maxDuration: 20000,
        },
      },
    },
  },
};
const optionsMem = {
  responsive: true,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Time',
      },
      type: 'realtime',
      realtime: {
        delay: 5000,
        refresh: 3000,
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Memory usage',
      },
    },
  },

  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Memory',
    },

    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        pinch: {
          enabled: true,
        },
        wheel: {
          enabled: true,
        },
        mode: 'x',
      },
      limits: {
        x: {
          minDelay: 0,
          maxDelay: 4000,
          minDuration: 1000,
          maxDuration: 20000,
        },
      },
    },
  },
};

const colors = [
  'rgba(255,99,132,0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
];

const data = {
  datasets: [
    {
      label: 'No data',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

interface LineProps {
  containersId: Array<string>;
  graphicType: GraphicsType;
}

const LineWithType = ({ graphicType, containersId }: LineProps) => {
  const [user] = useAuthState(auth);
  const { getLocalizedString, locale } = useLocale();
  const chartRef = useRef<ChartJS>(null);
  const [chartJSData, setChartJSData] = useState({});
  const [containersNamesObserve, setContainersNamesObserve] = useState<Array<string>>([]);

  const [refreshDelay, setRefreshDelay] = useState(3);
  const [pause, setPause] = useState(false);
  const [formattingMemory, setFormattingMemory] = useState<MemoryType>(MemoryType.Byte);

  const optionsForSelectMemory = getOptionsFromArrayString(Object.values(MemoryType));

  const getFormattingFunc = (formattingMemory: MemoryType) => {
    switch (formattingMemory) {
      case MemoryType.Kilobyte:
        return bytesToKilobytes;
      case MemoryType.Megabyte:
        return bytesToMegabytes;
      case MemoryType.Gigabyte:
        return bytesToGigabytes;
      case MemoryType.Terabyte:
        return bytesToTerabytes;
      case MemoryType.Byte:
      default:
        return (memory: number) => memory;
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      updateLocaleTitles(chart, graphicType, getLocalizedString);
    }
  }, [locale]);

  const getDataWithFormatting = async () => {
    const data = ((await containerApi.monitoringContainers(user, containersId)) as any).data;
    if (graphicType === GraphicsType.Memory) {
      return data.map((elem: any) => {
        elem.mem = getFormattingFunc(formattingMemory)(+elem.mem);
        return elem;
      });
    }

    return data;
  };

  const onRefresh = async (chart: any) => {
    // @ts-ignore
    if (containersId?.length) {
      const containersData = await getDataWithFormatting();

      chart.data.datasets.forEach((dataset: any) => {
        const containerData = containersData.find((containerData: any) => containerData.name === dataset.label);
        if (containerData) {
          dataset.data.push({
            x: Date.now(),
            y: graphicType === GraphicsType.CPU ? containerData.cpu : containerData.mem,
          });
        }
      });
    }
  };

  const getContainersData = async () => {
    setContainersNamesObserve(
      ((await containerApi.monitoringContainers(user, containersId!)) as any).data.map(
        (container: any) => container.name,
      ),
    );
  };

  useEffect(() => {
    const chart = chartRef.current!;
    updateFuncOnRefresh(chart, onRefresh);
  }, [formattingMemory]);

  useEffect(() => {
    if (containersNamesObserve.length) {
      const data = {
        datasets: containersNamesObserve.map((containersName: any, index) => {
          return {
            label: containersName,
            data: [],
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length],
          };
        }),
      };
      setChartJSData(data);
      return;
    }
    if (user && containersId) {
      getContainersData();
      const chart = chartRef.current!;
      updateFuncOnRefresh(chart, onRefresh);
      return;
    }
  }, [containersId, containersNamesObserve, chartRef]);

  return (
    <div>
      {
        <Line
          // @ts-ignore
          ref={chartRef}
          // @ts-ignore
          data={chartJSData.datasets ? chartJSData : data}
          // @ts-ignore
          options={graphicType === GraphicsType.CPU ? optionsCPU : optionsMem}
        />
      }
      {chartRef.current && (
        <div className={styles.lineControl}>
          <button
            className="btn"
            onClick={() => {
              setPause((prev) => !prev);
              switchRunPause(chartRef.current);
            }}
          >
            {
              // @ts-ignore
              getLocalizedString(pause ? 'run' : 'pause')
            }
          </button>
          <div className={styles.requestDelayControl}>
            {getLocalizedString('requestFrequency')}
            <button
              className="btn"
              onClick={() => {
                setRefreshDelay((prev) => (prev < 30 ? ++prev : prev));
                addOneSecondRefresh(chartRef.current);
              }}
            >
              +
            </button>
            <div>{`${refreshDelay} ${getLocalizedString('seconds')}`}</div>
            <button
              className="btn"
              onClick={() => {
                removeOneSecondRefresh(chartRef.current);
                setRefreshDelay((prev) => (prev > 1 ? --prev : prev));
              }}
            >
              -
            </button>
          </div>
          {graphicType === GraphicsType.Memory && (
            <SimpleSelect
              options={optionsForSelectMemory}
              onChange={(event: any) => setFormattingMemory(event.value as MemoryType)}
              firstValue={{ label: getLocalizedString(MemoryType.Byte), value: MemoryType.Byte } as OptionType}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LineWithType;
