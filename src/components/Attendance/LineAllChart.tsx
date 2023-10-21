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

  const firstDay = dayjs(database[0].date, 'MM/DD/YYYY');
  const lastDay = dayjs(database[database.length - 1].date, 'MM/DD/YYYY');
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
    (label) =>
      // const month = label.split('/')[0];
      // const year = label.split('/')[1];
      // const date = dayjs(`${month}/01/${year}`, 'MM/DD/YYYY');
      // return countForLabel(label, 'Early').length / date.daysInMonth();
      countForLabel(label, 'Early').length,
  );

  const onTimeCount = labels.map(
    (label) => countForLabel(label, 'On Time').length,
  );
  const delayCount = labels.map((label) => countForLabel(label, 'Late').length);
  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Late',
        backgroundColor: '#f38ba8',
        data: delayCount,
        fill: false,
        borderColor: '#f38ba8',
      },
      {
        type: 'line' as const,
        label: 'On Time',
        backgroundColor: '#94e2d5',
        data: onTimeCount,
        fill: false,
        borderColor: '#94e2d5',
      },
      {
        type: 'line' as const,
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
        ticks: {
          padding: 5,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          padding: 5,
          stepSize: 1,
          maxTicksLimit: 8,
        },
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
        // onClick: newLegendClickHandler,
      },
    },
  };

  return (
    <div
      className="flex w-[60%] flex-col items-center justify-center
        gap-5 rounded-xl border border-[#30303E] bg-[#191a24] p-5 align-middle"
    >
      <div className="text-2xl font-semibold text-white">All Check-in Flow</div>
      <Chart type="line" data={data} options={options} />
    </div>
  );
}
