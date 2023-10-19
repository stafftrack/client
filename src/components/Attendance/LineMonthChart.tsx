import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

interface AttendData {
  id: string;
  EmpId: string;
  EmpShift: string;
  DeptId: string;
  Zone: string;
  DateTime: string;
  status: string;
}

export default function LineWeekChart({ database }: { database: any }) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
    console.log(database);
  }, [database]);

  const today = dayjs(database[0].DateTime, 'MM/DD/YYYY HH:mm');
  const labels = [
    today.subtract(6, 'day').format('MM/DD'),
    today.subtract(5, 'day').format('MM/DD'),
    today.subtract(4, 'day').format('MM/DD'),
    today.subtract(3, 'day').format('MM/DD'),
    today.subtract(2, 'day').format('MM/DD'),
    today.subtract(1, 'day').format('MM/DD'),
    today.format('MM/DD'),
  ];
  const countForLabel = (label: string, checkStatus?: string) =>
    attendData.filter((item) => {
      const day = dayjs(item.DateTime, 'MM/DD/YYYY HH:mm');
      const date = day.format('MM/DD');
      if (date !== label) {
        return false;
      }
      const {status} = item;
      return status === checkStatus;
    });

  const dailyCount = labels.map((label) => countForLabel(label).length);
  const delayCount = labels.map((label) => countForLabel(label, 'Late').length);
  const onTimeCount = labels.map(
    (label) => countForLabel(label, 'On Time').length,
  );
  const earlyCount = labels.map(
    (label) => countForLabel(label, 'Early').length,
  );
  console.log(dailyCount, delayCount, onTimeCount, earlyCount);
  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Total',
        borderColor: 'rgb(250,250,250)',
        borderWidth: 2,
        fill: false,
        data: dailyCount,
      },
      {
        type: 'bar' as const,
        label: 'Late',
        backgroundColor: '#F5A524',
        data: delayCount,
        borderColor: 'white',
      },
      {
        type: 'bar' as const,
        label: 'On Time',
        backgroundColor: '#187964',
        data: onTimeCount,
      },
      {
        type: 'bar' as const,
        label: 'Early',
        backgroundColor: '#0070F0',
        data: earlyCount,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 5,
        },
        stacked: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          padding: 5,
          stepSize: 1,
          maxTicksLimit: 8,
        },
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#ffffff',
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div
      className="flex w-[60%] flex-col items-center justify-center
        gap-5 rounded-xl border border-[#30303E] bg-[#191a24] p-5 align-middle"
    >
      <div className="text-2xl font-semibold text-white">
        Last Week Check-in Flow
      </div>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
