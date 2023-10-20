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

export default function DoughnutChart({
  database,
  period,
}: {
  database: any;
  period: any;
}) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    setAttendData(database);
    console.log(database);
  }, [database]);

  const checkInStatus = ['On Time', 'Late', 'Early'];

  const checkInCount = checkInStatus.map(
    (status) =>
      attendData.filter((item) => {
        if (item.status === 'Early') {
          return status === 'Early';
        }
        if (item.status === 'Late') {
          return status === 'Late';
        }
        return status === 'On Time';
      }).length,
  );

  const data = {
    labels: checkInStatus,
    datasets: [
      {
        label: 'Attend Count',
        data: checkInCount,
        backgroundColor: ['#187964', '#F5A524', '#0070F0'],
        borderColor: '#171821',
        borderWidth: 5,
        borderRadius: 13,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          color: '#fff',
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="relative flex w-[40%] flex-col items-center gap-2 rounded-xl border border-[#30303E] bg-[#191a24] p-5 ">
      <div className="text-center text-2xl font-semibold text-white">
        {`${period} Attendance Status`}
      </div>

      <div className="relative flex flex-grow items-center justify-center">
        {attendData.length > 0 && (
          <div
            className="top-2/5 absolute left-1/2 -translate-x-1/2 -translate-y-1/2
            transform text-4xl font-semibold text-white"
          >
            {attendData.length}
          </div>
        )}
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
