import React, { useEffect, useRef, useState } from 'react';
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
import { accountApi, containerApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, StreamingPlugin);
const options = {
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
        text: 'CPU usage,%',
      },
      ticks: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
};

const colors = [
  'rgba(255,99,132,0.6)',
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
  // labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const useContainers = () => {
  const [containers, setContainers] = useState(null);
  const getContainers = async () => {
    const data = ((await containerApi.getContainers(accountApi.GetUser())) as any).data;
    setContainers(data.map((container: any) => container.Id));
  };
  useEffect(() => {
    getContainers();
  }, []);
  return containers;
};

const ContainersMonitor = () => {
  const [user, loading] = useAuthState(auth);
  const containers = useContainers();
  const [containersNamesObserve, setContainersNamesObserve] = useState([]);
  //const [containersData, setContainersData] = useState([])
  const [chartJSData, setChartJSData] = useState({});
  const getContainersData = async () => {
    setContainersNamesObserve(
      ((await containerApi.monitoringContainers(user, containers!)) as any).data.map(
        (container: any) => container.name,
      ),
    );
  };
  const chartRef = useRef<ChartJS>(null);
  const onRefresh = async (chart: any) => {
    // @ts-ignore
    if (containers?.length) {
      const containersData = ((await containerApi.monitoringContainers(user, containers!)) as any).data;
      chart.data.datasets.forEach((dataset: any) => {
        const containerData = containersData.find((containerData: any) => containerData.name === dataset.label);
        if (containerData) {
          dataset.data.push({
            x: Date.now(),
            y: containerData.cpu,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }

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
    if (user && containers) {
      getContainersData();
      const chart = chartRef.current!;
      // @ts-ignore
      const realtimeOpts = chart.options?.scales?.x?.realtime;
      realtimeOpts.onRefresh = onRefresh;
      chart.update('none');
      return;
    }
  }, [containers, containersNamesObserve, chartRef]);

  return (
    <div>
      {
        // @ts-ignore
        <Line ref={chartRef} data={chartJSData.datasets ? chartJSData : data} options={options} />
      }
    </div>
  );
};

export default ContainersMonitor;
