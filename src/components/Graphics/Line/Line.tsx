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
import { Line } from 'react-chartjs-2';
import { containerApi } from 'thunks';

import React, { useEffect, useRef, useState } from 'react';
import { GraphicsType } from 'enums/GraphicsType';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { useLocale } from 'utils/localeUtils';
import { updateLocaleTitles } from 'utils/chartUtils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, StreamingPlugin);
const optionsCPU = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'CPU',
    },
  },
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
};
const optionsMem = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Memory',
    },
  },
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

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      updateLocaleTitles(chart, graphicType, getLocalizedString);
    }
  }, [locale]);

  const onRefresh = async (chart: any) => {
    // @ts-ignore
    if (containersId?.length) {
      const containersData = ((await containerApi.monitoringContainers(user, containersId)) as any).data;
      console.log(containersData);
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
      // @ts-ignore
      const realtimeOpts = chart.options?.scales?.x?.realtime;
      realtimeOpts.onRefresh = onRefresh;
      chart.update('none');
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
    </div>
  );
};

export default LineWithType;
