import { useEffect, useState } from 'react';

export default function Predict({ supabase }: { supabase: any }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: d, error } = await supabase
        .from('RepairPrediction')
        .select('*');
      
      if (!error) {
        setData(d);
      }
    })();
  }, []);

  return (
    <div className="flex justify-center gap-10">
      {
        data && data[0] ?
        <div className="flex gap-10 font-semibold">
            <div>HQ Predicted Repair Time: {data[0].DateTime}</div>
            <div>AZ Predicted Repair Time: {data[1].DateTime}</div>
          </div>
        : null
      }
    </div>
  );
}
