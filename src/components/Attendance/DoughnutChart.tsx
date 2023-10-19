import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AttendData {
  id: string;
  EmpId: string;
  EmpShift: string;
  DeptId: string;
  Zone: string;
  DateTime: string;
  status: string;
}

export default function DoughnutChart({database}: {database: any}) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
    console.log(database);
  }, [database]);

  const checkInStatus = ['On Time', 'Late', 'Absent', 'Early Check-In'];

  const checkInCount = checkInStatus.map(
    (status) =>
      attendData.filter((item) => {
        if (item.status === 'Early Check-In') {
          return status === 'Early Check-In';
        }
        if (item.status === 'Late') {
          return status === 'Late';
        }
        if (item.status === 'On Time') {
          return status === 'On Time';
        }
        return status === 'Absent';
      }).length,
  );


  const data = {
    labels: checkInStatus,
    datasets: [
      {
        label: 'Attend Count',
        data: checkInCount,
        backgroundColor: [
          '#f38ba8',
          '#f9e2af',
          '#94e2d5',
          '#74c7ec',
          '#b4befe',
        ],
        borderColor: '#171821',
        borderWidth: 5,
        borderRadius: 13,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
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
    <div className="relative w-[30%]">
      {data.datasets[0].data.reduce((a, b) => a + b, 0) && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2
            transform text-4xl font-semibold text-white"
        >
          {attendData.length}
        </div>
      )}
      <Doughnut data={data} options={options} />
    </div>
  );
}
