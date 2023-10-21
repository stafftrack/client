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
  EmpShift: string;
  time: string;
  date: string;
  status: string;
}

export default function LineChart({ database }: { database: any }) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
  }, [database]);

  const labels = ['6:30', '7:30', '8:30', '9:30'];
  // const today = database[0]?.date || null;
  const countForLabel = (label: string, status?: string) =>
    attendData.filter((item) => {
      const dateObj = dayjs(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
      const shiftHour = parseInt(label.split(':')[0], 10);
      const shiftMinute = parseInt(label.split(':')[1], 10);
      const onTime = dateObj.hour(shiftHour).minute(shiftMinute);
      const diffMinutes = dateObj.diff(onTime, 'minute');

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
        backgroundColor: '#f38ba8',
        data: delayCount,
        borderColor: 'white',
      },
      {
        type: 'bar' as const,
        label: 'On Time',
        backgroundColor: '#94e2d5',
        data: onTimeCount,
      },
      {
        type: 'bar' as const,
        label: 'Early',
        backgroundColor: '#74c7ec',
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
        stacked: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          maxTicksLimit: 8,
        },
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      className="flex h-72 w-full flex-col items-center justify-center
        gap-5 rounded-xl border border-[#30303E] bg-[#191a24] p-5 px-10 align-middle"
    >
      <div className="text-lg font-semibold text-white">Check-in Flow Per Shifts</div>
      <div className="mx-auto w-[80%]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
