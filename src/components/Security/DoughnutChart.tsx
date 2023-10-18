'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Contraband } from '@/types';
import useSecurityData from '@/hooks/useSecurityData';

ChartJS.register(ArcElement, Tooltip, Legend);

const contrabandKeys: (keyof Contraband)[] = [
  'electronicDevice',
  'laptop',
  'scissor',
  'knife',
  'gun',
];

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

export default function DoughnutChart() {
  const securityData = useSecurityData();
  const contrabandCounts: number[] = contrabandKeys.map((key) =>
    securityData.reduce((total, entry) => total + entry.contraband[key], 0),
  );

  const data = {
    labels: ['Electronic Device', 'Laptop', 'Scissor', 'Knife', 'Gun'],
    datasets: [
      {
        label: 'counts',
        data: contrabandCounts,
        backgroundColor: [
          '#f38ba8',
          '#f9e2af',
          '#94e2d5',
          '#74c7ec',
          '#b4befe',
        ],
        borderColor: '#191a24',
        borderWidth: 5,
        borderRadius: 13,
      },
    ],
  };

  return (
    <div className="relative h-max rounded-xl border border-[#30303E] bg-[#191a24] p-5">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2
            transform text-4xl font-semibold text-white"
      >
        {data.datasets[0].data.reduce((a, b) => a + b, 0)}
      </div>
      <div className="w-[20rem]">
        <Doughnut data={data} plugins={[plugin]} />
      </div>
    </div>
  );
}
