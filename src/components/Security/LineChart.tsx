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
import { useEffect, useState } from 'react';
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

interface Props {
  date: any;
  contrabandData: any[];
  dict: any;
}

function sortMapByKey(inputMap: Map<string, any>): Map<string, any> {
  const sortedKeys = Array.from(inputMap.keys()).sort();
  return new Map(sortedKeys.map((key) => [key, inputMap.get(key)]));
}

export default function LineChart({ date, contrabandData, dict }: Props) {
  const [labels, setLabels] = useState<any[]>([]);
  const [tmp, setTmp] = useState<any[]>([]);
  const m = new Map();

  useEffect(() => {
    if (!contrabandData) {
      return;
    }

    contrabandData.forEach((d) => {
      const total =
        d.contraband.electronic_device +
        d.contraband.laptop +
        d.contraband.scissors +
        d.contraband.knife +
        d.contraband.gun;

      if (date.value === 'Today') {
        if (m.get(d.EmpShift) === undefined) {
          m.set(d.EmpShift, total);
        } else {
          m.set(d.EmpShift, m.get(d.EmpShift) + total);
        }
      } else if (m.get(d.date) === undefined) {
        m.set(d.date, total);
      } else {
        m.set(d.date, m.get(d.date) + total);
      }
    });

    const sortedM = sortMapByKey(m);
    setLabels(Array.from(sortedM.keys()));
    setTmp(Array.from(sortedM.values()));
  }, [contrabandData]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: tmp,
        borderColor: '#ffffff',
        backgroundColor: '#ffffff',
        radius: 3,
        hoverRadius: 7,
      },
    ],
  };

  return (
    <div
      className="flex h-72 w-full flex-col items-center justify-center
        gap-5 rounded-xl border border-[#30303E] bg-[#191a24] px-10"
    >
      <div className="text-lg font-semibold text-white">
        {date.value === 'Today'
          ? dict.chart.security.title.shift
          : dict.chart.security.title.day}
      </div>
      <div className="mx-auto w-[80%]">
        <Line
          data={data}
          plugins={[plugin]}
          options={{
            scales: {
              x: {
                ticks: {
                  color: '#c0c0c0',
                },
              },
              y: {
                ticks: {
                  stepSize: 1,
                  color: '#c0c0c0',
                },
                beginAtZero: true,
              },
            },
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
