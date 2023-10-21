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

export default function LineWeekChart({ database }: { database: any }) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
  }, [database]);
  const firstDay = dayjs(database[0]?.date, 'MM/DD/YYYY');
  const lastDay = dayjs(database[database.length - 1]?.date, 'MM/DD/YYYY');
  const labels = [];

  const monthsDiff = firstDay.diff(lastDay, 'month');
  console.log(monthsDiff);
  for (let i = 0; i <= monthsDiff + 1; i += 1) {
    const currentLabel = lastDay.add(i, 'month').format('MM/YYYY');
    labels.push(currentLabel);
  }

  const countForLabel = (label: string, checkStatus?: string) =>
    attendData.filter((item) => {
      const month = dayjs(item.date, 'MM/DD/YYYY');
      const monthLabel = month.format('MM/YYYY');
      if (monthLabel !== label) {
        return false;
      }
      if (checkStatus) {
        return item.status === checkStatus;
      }
      return true;
    });

  const earlyCount = labels.map(
    (label) => countForLabel(label, 'Early').length,
  );

  const onTimeCount = labels.map(
    (label) => countForLabel(label, 'On Time').length,
  );
  const delayCount = labels.map((label) => countForLabel(label, 'Late').length);
  const totalCount: number[] = [];
  earlyCount.forEach((value, index) => {
    totalCount.push(value + onTimeCount[index] + delayCount[index]);
  });
  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Total',
        backgroundColor: 'rgb(250,250,250)',
        data: totalCount,
        fill: false,
        borderColor: 'rgb(250,250,250)',
      },
      {
        type: 'bar' as const,
        label: 'Late',
        backgroundColor: '#f38ba8',
        data: delayCount,
        fill: false,
        borderColor: '#f38ba8',
      },
      {
        type: 'bar' as const,
        label: 'On Time',
        backgroundColor: '#94e2d5',
        data: onTimeCount,
        fill: false,
        borderColor: '#94e2d5',
      },
      {
        type: 'bar' as const,
        label: 'Early',
        backgroundColor: '#74c7ec',
        data: earlyCount,
        fill: false,
        borderColor: '#74c7ec',
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
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      mode: 'index' as const,
    },
  };

  return (
    <div
      className="flex w-[60%] flex-col items-center justify-center
        gap-5 rounded-xl border border-[#30303E] bg-[#191a24] p-5 align-middle"
    >
      <div className="text-lg font-semibold text-white">
        Check-in Flow Per Month
      </div>
      <div className="mx-auto w-[80%]">
        <Chart type="bar" data={data} options={options} onClick={() => {console.log("sss");}} />
      </div>
    </div>
  );
}
