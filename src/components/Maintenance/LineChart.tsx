import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Chip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
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
  scanData: any[];
  dict: any;
}

export default function LineChart({ date, scanData, dict }: Props) {
  const [displayDate, setDisplayDate] = useState<any[]>([]);
  const [HQscan, setHQScan] = useState<any[]>([]);
  const [AZScan, setAZScan] = useState<any[]>([]);

  useEffect(() => {
    if (!scanData) {
      return;
    }
    const AZarr: { x: any; y: any }[] = [];
    const HQarr: { x: any; y: any }[] = [];
    scanData.forEach((d) => {
      if (d.Zone === 'HQ') {
        HQarr.push({ x: d.DateTime, y: d.ToolScanTime });
      }
      if (d.Zone === 'AZ') {
        AZarr.push({ x: d.DateTime, y: d.ToolScanTime });
      }
    });
    if (date.value === 'Today') {
      setDisplayDate(['hour', 'HH:mm']);
    }
    if (date.value === 'Last Week' || date.value === 'Last 2 Weeks') {
      setDisplayDate(['day', 'MM/DD']);
    }
    if (date.value === 'Last Month' || date.value === 'All') {
      setDisplayDate(['month', 'MM/YYYY']);
    }
    console.log(HQarr);
    console.log(AZarr);
    setHQScan(HQarr);
    setAZScan(AZarr);
  }, [scanData]);

  const data = {
    datasets: [
      {
        label: 'HQ',
        data: HQscan,
        borderColor: '#f38ba8',
        backgroundColor: '#f38ba8',
        borderWidth: 1,
        radius: 1,
        hoverRadius: 3,
      },
      {
        label: 'AZ',
        data: AZScan,
        borderColor: '#94e2d5',
        backgroundColor: '#94e2d5',
        borderWidth: 1,
        radius: 1,
        hoverRadius: 3,
      },
    ],
  };

  return (
    <div
      className="flex h-[30rem] w-full flex-col items-center justify-center
          gap-5 rounded-xl border border-[#30303E] bg-[#191a24] px-10"
    >
      <div className="text-lg font-semibold text-white">
        {dict.chart.scan.title}
      </div>
      <div className="flex w-full justify-center gap-5">
        <div className="mx-auto w-[80%]">
          <Line
            data={data}
            plugins={[plugin]}
            options={{
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: displayDate[0],
                    displayFormats: {
                      day: displayDate[1],
                    },
                  },
                  ticks: {
                    color: '#c0c0c0',
                  },
                },
                y: {
                  ticks: {
                    stepSize: 0.5,
                    color: '#c0c0c0',
                  },
                  beginAtZero: HQscan.length > 0 && AZScan.length > 0,
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
        <div className="flex flex-col items-center justify-center gap-3">
          {HQscan.length > 0 && (
            <Chip
              key="HQ"
              variant="dot"
              classNames={{
                dot: 'bg-[#f38ba8]',
              }}
            >
              HQ
            </Chip>
          )}
          {AZScan.length > 0 && (
            <Chip
              key="AZ"
              variant="dot"
              classNames={{
                dot: 'bg-[#94e2d5]',
              }}
            >
              AZ
            </Chip>
          )}
        </div>
      </div>
    </div>
  );
}
