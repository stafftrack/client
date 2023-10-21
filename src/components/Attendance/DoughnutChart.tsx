import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chip } from '@nextui-org/react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AttendData {
  status: string;
}

export default function DoughnutChart({
  database,
  // period,
  dict,
}: {
  database: any;
  // period: any;
  dict: any;
}) {
  const [attendData, setAttendData] = useState<AttendData[]>([]);
  useEffect(() => {
    // if(database.length === 0) return;
    setAttendData(database);
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

  const labels = [
    {
      name: dict.status.ontime,
      style: 'bg-[#94e2d5]',
    },
    {
      name: dict.status.late,
      style: 'bg-[#f38ba8]',
    },
    {
      name: dict.status.early,
      style: 'bg-[#74c7ec]',
    },
  ];

  const data = {
    labels: checkInStatus,
    datasets: [
      {
        label: 'Attend Count',
        data: checkInCount,
        backgroundColor: ['#94e2d5', '#f38ba8', '#74c7ec'],
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
        display: false,
      },
    },
  };

  return (
    <div className="relative flex h-72 rounded-xl border border-[#30303E] bg-[#191a24] p-5">
      <div className="absolute left-[8.7rem] top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center text-4xl font-semibold text-white">
        {attendData.length}
        <div className="text-medium text-white">{dict.chart.total}</div>
      </div>
      <div className="w-[15rem]">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        {labels.map((label) => (
          <Chip
            key={label.name}
            variant="dot"
            classNames={{
              dot: label.style,
            }}
          >
            {label.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
