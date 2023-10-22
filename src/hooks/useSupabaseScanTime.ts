import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function useSupabaseData(
  supabase: SupabaseClient<any, 'public', any>,
  select: string,
  zone: any,
  date: any,
  inputValue: any,
  end: number | null,
) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const query = supabase.from('ToolScan').select(select);

      if (zone.value !== 'All') {
        query.eq('Zone', zone.value);
      }

      if (date.value !== 'All') {
        const today = dayjs(inputValue, 'YYYY-MM-DD', true).isValid()
          ? dayjs(inputValue)
          : dayjs('2023-09-01');
        const queryStartDate = today.format('YYYY-MM-DD');
        if (date.value === 'Today') {
          query.like('DateTime', `${queryStartDate}%`);
        } else if (date.value === 'Last Week') {
          const lastWeek = today.subtract(1, 'week');
          const queryLastWeek = lastWeek.format('YYYY-MM-DD');
          query.gte('DateTime', queryLastWeek);
          query.lte('DateTime', queryStartDate);
        } else if (date.value === 'Last 2 Weeks') {
          const lastWeek = today.subtract(2, 'week');
          const queryLastWeek = lastWeek.format('YYYY-MM-DD');
          query.gte('DateTime', queryLastWeek);
          query.lte('DateTime', queryStartDate);
        } else if (date.value === 'Last Month') {
          const lastMonth = today.subtract(1, 'month');
          const queryLastMonth = lastMonth.format('YYYY-MM-DD');
          query.gte('DateTime', queryLastMonth);
          query.lte('DateTime', queryStartDate);
        }
      }

      if (
        inputValue !== '' &&
        dayjs(inputValue, 'YYYY-MM-DD', true).isValid()
      ) {
        const queryDate = dayjs(inputValue).format('YYYY-MM-DD');
        query.like('DateTime', `%${queryDate}%`);
      }

      if (end !== null) {
        query.range(0, end);
      }

      const { data: d, error } = await query.order('DateTime', {
        ascending: false,
      });

      if (!error && d) {
        console.log(d);
        const processedData = d.map((item: any) => {
          const scanDate = dayjs(item.DateTime).format('YYYY-MM-DD');
          const time = dayjs(item.DateTime).format('HH:mm:ss');
          return { ...item, date: scanDate, time };
        });

        setData(processedData);
      }
    })();
  }, [zone, date, inputValue, supabase, select, end]);

  return data;
}
