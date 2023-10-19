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

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#191a24';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

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
    <div className="flex h-72 w-full flex-col items-center justify-center gap-5 rounded-xl border border-[#30303E] bg-[#191a24] px-10">
      <div className="text-lg font-semibold text-white">
        Contrabands Per Day
      </div>
      <div className="mx-auto w-[80%]">
        <Line
          data={data}
          plugins={[plugin]}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
