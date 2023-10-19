import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import userAttendanceData from '../../app/attendance/attendance.json';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const checkInStatus = ['On Time', 'Late', 'Absent', 'Early Check-In'];

  const checkInCount = checkInStatus.map(
    (status) =>
      attendData.filter((item) => {
        if (!item.dateTime || item.shift === '') {
          return status === 'Absent';
        }
        const date = dayjs(item.dateTime, 'MM/DD/YYYY HH:mm');
        const shiftHour = parseInt(item.shift.split(':')[0], 10);
        const shiftMinute = parseInt(item.shift.split(':')[1], 10);
        const onTime = date.hour(shiftHour).minute(shiftMinute);
        const diffMinutes = date.diff(onTime, 'minute');
        console.log(item.dateTime, diffMinutes);
        if (diffMinutes > 30) {
          return status === 'Late';
        }
        if (diffMinutes < -30) {
          return status === 'Early Check-In';
        }
        return status === 'On Time';
      }).length,
  );

  console.log(checkInCount);

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
          {data.datasets[0].data.reduce((a, b) => a + b, 0)}
        </div>
      )}
      <Doughnut data={data} options={options} />
    </div>
  );
}
