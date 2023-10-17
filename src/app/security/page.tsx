import LineChart from '@/components/Security/LineChart';
import DoughnutChart from '@/components/Security/DoughnutChart';
import { mockSecurityData } from '@/data';
import { SecurityData } from '@/types';
import ChatRoom from '@/components/ChatRoom';

export default function SecurityPage() {
  const calculateTotalContrabandCount = (s: SecurityData) => {
    const { gun, knife, laptop, scissor, electronicDevice } = s.contraband;
    return gun + knife + laptop + scissor + electronicDevice;
  };

  return (
    <div className="w-full">
      <ChatRoom />
      <div className="flex w-full justify-center gap-10 pt-10">
        <DoughnutChart />
        <LineChart />
      </div>
      <div className="text-white">
        {mockSecurityData.map((s) => (
          <div key={s.id}>
            {s.id} {s.zone} {s.departmentId} {s.shift} {s.dateTime}
            {calculateTotalContrabandCount(s)}
          </div>
        ))}
      </div>
    </div>
  );
}
