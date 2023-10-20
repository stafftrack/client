import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function useSupabaseData(
  supabase: SupabaseClient<any, 'public', any>,
  select: string,
  zone: any,
  department: any,
  empShift: any,
  date: any,
  inputValue: any,
  filterNoContraband: boolean,
  status: any | null,
  end: number | null,
) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const query = supabase.from('Entry Data').select(select);

      if (filterNoContraband) {
        query.not('contraband', 'is', null);
      }

      if (zone.value !== 'All') {
        query.eq('Zone', zone.value);
      }

      if (department.value !== 'All') {
        query.eq('DeptId', department.value);
      }

      if (empShift.value !== 'All') {
        query.eq('EmpShift', empShift.value);
      }

      if (date.value !== 'All') {
        const today = dayjs(inputValue, 'YYYY-MM-DD', true).isValid()
          ? dayjs(inputValue)
          : dayjs('2023-09-22');
          console.log(today);
        const queryStartDate = today.format('YYYY-MM-DD');
        if (date.value === 'Today' || date.value === 'Daily') {
          query.eq('date', queryStartDate);
        } else if (date.value === 'Last Week' || date.value === 'Last 7 Days') {
          const lastWeek = today.subtract(1, 'week');
          const queryLastWeek = lastWeek.format('YYYY-MM-DD');
          query.gt('date', queryLastWeek);
          query.lte('date', queryStartDate);
        } else if (date.value === 'Last 14 Days') {
          const lastWeek = today.subtract(2, 'week');
          const queryLastWeek = lastWeek.format('YYYY-MM-DD');
          query.gt('date', queryLastWeek);
          query.lte('date', queryStartDate);
        } else if (date.value === 'Last Month') {
          const lastMonth = today.subtract(1, 'month');
          const queryLastMonth = lastMonth.format('YYYY-MM-DD');
          query.gt('date', queryLastMonth);
          query.lte('date', queryStartDate);
        }
      }
      if (status !== null && status.value !== 'All' ) {
        query.eq('status', status.value);
      }

      if (inputValue !== '' && dayjs(inputValue, 'YYYY-MM-DD', true).isValid() === false) {
        query.like('EmpId', `%${inputValue}%`);
      }

      if (end !== null) {
        query.range(0, end);
      }

      const { data: d, error } = await query
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (!error && d) {
        setData(d);
      }
    })();
  }, [
    zone,
    department,
    empShift,
    date,
    inputValue,
    supabase,
    select,
    end,
    status,
    filterNoContraband,
  ]);

  return data;
}
