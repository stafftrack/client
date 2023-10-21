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

export default function LineChart({
  database,
  dict,
}: {
  database: any;
  dict: any;
}) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
  }, [database]);

  const today = database[0]?.date;
  let minTime = dayjs(`${today} ${attendData[0]?.time}`, 'YYYY-MM-DD HH:mm:ss');
  let maxTime = dayjs(`${today} ${attendData[0]?.time}`, 'YYYY-MM-DD HH:mm:ss');

  attendData.forEach((item) => {
    const currentTime = dayjs(`${today} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
    if (currentTime.isBefore(minTime)) {
      minTime = currentTime;
    }
    if (currentTime.isAfter(maxTime)) {
      maxTime = currentTime;
    }
  });

  const roundedMinTime = minTime
    .startOf('minute')
    .subtract(minTime.minute() % 10, 'minute');
  const roundedMaxTime = maxTime
    .endOf('minute')
    .add(10 - (maxTime.minute() % 10), 'minute');

  const labels = [];
  const startTime = dayjs(roundedMinTime);
  const endTime = dayjs(roundedMaxTime);

  if (database.length > 0) {
    for (
      let i = startTime;
      i.isBefore(endTime);
      i = i.add(10, 'minute').startOf('minute')
    ) {
      const label = i.format('H:mm');
      labels.push(label);
    }
  }
  const countForLabel = (label: string, status?: string) =>
    attendData.filter((item) => {
      if (item.EmpShift !== label) {
        return false;
      }
      return item.status === status;
    });
  console.log(labels)
  const hourCountForLabel = (label: string) =>
    attendData.filter((item) => {
      const dateObj = dayjs(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
      const shiftHour = parseInt(label.split(':')[0], 10);
      const shiftMinute = parseInt(label.split(':')[1], 10);
      const onTime = dateObj.hour(shiftHour).minute(shiftMinute);
      const diffMinutes = dateObj.diff(onTime, 'minute');
      return diffMinutes >= 0 && diffMinutes > 10;
    });

  const hourCount = labels.map((label) => hourCountForLabel(label).length);
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
        radius: 3,
        hoverRadius: 7,
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
      <div className="text-lg font-semibold text-white">
        {dict.chart.attendance.title.shift}
      </div>
      <div className="mx-auto w-[80%]">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
