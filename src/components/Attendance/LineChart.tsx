import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import userAttendanceData from '../../app/attendance/attendance.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface AttendData {
  id: string;
  shift: string;
  departmentId: string;
  zone: string;
  dateTime: string;
  hasContraband: boolean;
}

export default function LineChart() {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(userAttendanceData);
  }, []);

  const labels = Array.from(
    new Set(
      attendData.map((item) => {
        const date = dayjs(item.dateTime, 'MM/DD/YYYY HH:mm');
        const hour = date.format('HH');
        return `${hour}:00`;
      }),
    ),
  );

  labels.sort((a, b) => {
    const [hourA] = a.split(':');
    const [hourB] = b.split(':');
    return Number(hourA) - Number(hourB);
  });

  const hourCount = labels.map((label) => {
    const [hour] = label.split(':');
    return attendData.filter((item) => {
      const date = dayjs(item.dateTime, 'MM/DD/YYYY HH:mm');
      return date.format('HH') === hour;
    }).length;
  });

  console.log(hourCount);
  const data = {
    labels,
    datasets: [
      {
        label: 'Attend Count',
        data: hourCount,
        borderColor: '#ffffff',
        backgroundColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          padding: 20,
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
        },
      },
    },
  };
  
  

  return (
    <div className="relative w-[60%]">
      <Line data={data} options={options} />
    </div>
  );
}
