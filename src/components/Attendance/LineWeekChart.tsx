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
  date: string;
  status: string;
}

export default function LineWeekChart({
  database,
  period,
}: {
  database: any;
  period: any;
}) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
  }, [database]);

  const today = dayjs(database[0]?.date, 'MM/DD/YYYY');

  const periodDays = period === 'Last Week' ? 7 : 14;

  const labels = [];
  for (let i = periodDays; i > 0; i -= 1) {
    const day = today.subtract(i - 1, 'day');
    const label = `${day.format('MM/DD')} - ${day.format('ddd')}`;
    labels.push(label);
  }

  const countForLabel = (label: string, checkStatus?: string) =>
    attendData.filter((item) => {
      const day = dayjs(item.date, 'MM/DD/YYYY');
      const date = day.format('MM/DD');
      if (date !== label.split(' - ')[0]) {
        return false;
      }
      const { status } = item;
      return status === checkStatus;
    });

  const delayCount = labels.map((label) => countForLabel(label, 'Late').length);
  const onTimeCount = labels.map(
    (label) => countForLabel(label, 'On Time').length,
  );
  const earlyCount = labels.map(
    (label) => countForLabel(label, 'Early').length,
  );
  const dailyCount = delayCount.map(
    (item, index) => item + onTimeCount[index] + earlyCount[index],
  );
  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Total',
        borderColor: 'rgb(250,250,250)',
        radius: 3,
        hoverRadius: 7,
        data: dailyCount,
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
      className="flex w-[60%] flex-col items-center justify-center
        gap-5 rounded-xl border border-[#30303E] bg-[#191a24] p-5 align-middle"
    >
      <div className="text-lg font-semibold text-white">
        Check-in Flow Per Day
      </div>
      <div className="mx-auto w-[80%]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
