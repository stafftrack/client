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

  const today = dayjs(database[0].date, 'MM/DD/YYYY');

  const periodDays = period === 'Last Week' ? 7 : 14;

  const labels = [];
  for (let i = periodDays; i > 0; i-=1) {
    const day = today.subtract(i-1, 'day');
    const label = `${day.format('MM/DD')} - ${day.format('ddd')}`;
    labels.push(label);
  }

  console.log(labels);

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
        borderWidth: 2,
        fill: false,
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
        {`${period} Check-in Flow`}
      </div>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
