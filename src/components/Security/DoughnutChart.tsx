import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Chip } from '@nextui-org/react';

ChartJS.register(ArcElement, Tooltip, Legend);

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

interface Props {
  contrabandData: any[];
  dict: any;
}

export default function DoughnutChart({ contrabandData, dict }: Props) {
  const [electronicDeviceCount, setElectronicDeviceCount] = useState(0);
  const [laptopCount, setLaptopCount] = useState(0);
  const [scissorsCount, setScissorsCount] = useState(0);
  const [knifeCount, setKnifeCount] = useState(0);
  const [gunCount, setGunCount] = useState(0);

  useEffect(() => {
    if (!contrabandData) {
      return;
    }

    let newElectronicDeviceCount = 0;
    let newLaptopCount = 0;
    let newScissorsCount = 0;
    let newKnifeCount = 0;
    let newGunCount = 0;

    contrabandData.forEach((d) => {
      if (d.contraband) {
        newElectronicDeviceCount += d.contraband.electronic_device;
        newLaptopCount += d.contraband.laptop;
        newScissorsCount += d.contraband.scissors;
        newKnifeCount += d.contraband.knife;
        newGunCount += d.contraband.gun;
      }
    });

    setElectronicDeviceCount(newElectronicDeviceCount);
    setLaptopCount(newLaptopCount);
    setScissorsCount(newScissorsCount);
    setKnifeCount(newKnifeCount);
    setGunCount(newGunCount);
  }, [contrabandData]);

  const labels = [
    {
      name: dict.contrabands.electronic_device,
      style: 'bg-[#f38ba8]',
    },
    {
      name: dict.contrabands.laptop,
      style: 'bg-[#f9e2af]',
    },
    {
      name: dict.contrabands.scissor,
      style: 'bg-[#94e2d5]',
    },
    {
      name: dict.contrabands.knife,
      style: 'bg-[#74c7ec]',
    },
    {
      name: dict.contrabands.gun,
      style: 'bg-[#b4befe]',
    },
  ];

  const data = {
    labels: [
      dict.contrabands.electronic_device,
      dict.contrabands.laptop,
      dict.contrabands.scissor,
      dict.contrabands.knife,
      dict.contrabands.gun,
    ],
    datasets: [
      {
        label: 'counts',
        data: [
          electronicDeviceCount,
          laptopCount,
          scissorsCount,
          knifeCount,
          gunCount,
        ],
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
    <div className="relative flex h-72 rounded-xl border border-[#30303E] bg-[#191a24] p-5">
      <div className="absolute left-[8.7rem] top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center text-4xl font-semibold text-white">
        {data.datasets[0].data.reduce((a, b) => a + b, 0)}
        <div className="text-medium text-white">{dict.chart.total}</div>
      </div>
      <div className="w-[15rem]">
        <Doughnut
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
