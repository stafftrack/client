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
  EmpId: string;
  EmpShift: string;
  DeptId: string;
  Zone: string;
  DateTime: string;
  Status: string;
}

export default function LineChart({database}: {database: any}) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
    console.log(database);
  }, [database]);


  const labels = Array.from(
    new Set(
      attendData.map((item) => {
        const date = dayjs(item.DateTime, 'MM/DD/YYYY HH:mm');
        const hour = date.format('HH');
        return `${hour}:00`;
      }),
    ),
  );

  if (labels.length === 1) {
    labels.push(`${Number(labels[0].split(':')[0]) + 1}:00`);
  } 

  labels.sort((a, b) => {
    const [hourA] = a.split(':');
    const [hourB] = b.split(':');
    return Number(hourA) - Number(hourB);
  });

  const hourCount = labels.map((label) => {
    const [hour] = label.split(':');
    return attendData.filter((item) => {
      const date = dayjs(item.DateTime, 'MM/DD/YYYY HH:mm');
      const hourInData = date.format('HH');
      return hourInData === hour;
    }).length;
  });
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
