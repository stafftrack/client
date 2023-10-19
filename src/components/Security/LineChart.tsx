'use client';

import useSecurityData from '@/hooks/useSecurityData';
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

export default function BarChart() {
  const securityData = useSecurityData();

  const labels = Array.from(
    new Set(
      securityData.map((item) => {
        const date = new Date(item.dateTime);
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      }),
    ),
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: [1, 3, 1, 2, 5, 1, 2],
        borderColor: '#ffffff',
        backgroundColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="relative h-max rounded-xl border border-[#30303E] p-5">
      <div className="w-[20rem]">
        <Line data={data} />
      </div>
    </div>
  );
}
