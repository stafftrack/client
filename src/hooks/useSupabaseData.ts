import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function useSupabaseData(
  supabase: SupabaseClient<any, 'public', any>,
  select: string,
  zone: any,
  department: any,
  empShift: any,
  date: any,
  inputValue: any,
  end: number | null,
) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const query = supabase.from('Entry Data').select(select);

      query.not("contraband", "is", null);

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
        if (date.value === 'Today') {
          query.eq('date', '2023-09-22');
        } else if (date.value === 'Last 7 days') {
          query.gt('date', '2023-09-15');
          query.lte('date', '2023-09-22');
        } else if (date.value === 'Last 14 days') {
          query.gt('date', '2023-09-08');
          query.lte('date', '2023-09-22');
        }
      }

      if (inputValue !== '') {
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
  }, [zone, department, empShift, date, inputValue, supabase, select, end]);

  return data;
}
