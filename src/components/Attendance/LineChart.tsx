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

export default function LineChart({ database }: { database: any }) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
    console.log(database);
  }, [database]);

  const labels = ['6:30', '7:30', '8:30', '9:30'];
  const countForLabel = (label: string, status?: string) =>
    attendData.filter((item) => {
      const date = dayjs(item.DateTime, 'MM/DD/YYYY HH:mm');
      const shiftHour = parseInt(label.split(':')[0], 10);
      const shiftMinute = parseInt(label.split(':')[1], 10);
      const onTime = date.hour(shiftHour).minute(shiftMinute);
      const diffMinutes = date.diff(onTime, 'minute');
      if (status) {
        return (
          diffMinutes <= 30 && diffMinutes >= -30 && item.status === status
        );
      }
      return diffMinutes <= 30 && diffMinutes >= -30;
    });

  const hourCount = labels.map((label) => countForLabel(label).length);
  const delayCount = labels.map((label) => countForLabel(label, 'Late').length);
  const onTimeCount = labels.map(
    (label) => countForLabel(label, 'On Time').length,
  );
  const earlyCount = labels.map(
    (label) => countForLabel(label, 'Early').length,
  );
  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Total',
        borderColor: 'rgb(250,250,250)',
        borderWidth: 2,
        fill: false,
        data: hourCount,
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
          padding: 20,
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
        Today Check-in Flow
      </div>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
