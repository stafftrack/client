import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAsyncList } from 'react-stately';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';

export default function useInfiniteSupabaseData(
  supabase: SupabaseClient<any, 'public', any>,
  select: string,
  zone: any,
  department: any,
  empShift: any,
  date: any,
  inputValue: any,
  filterNoContraband: boolean,
  status: any | null,
  // end: number | null,
) {
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [resetScroll, setResetScroll] = useState(false);

  const list = useAsyncList<any[]>({
    async load({ cursor }): Promise<any> {
      const start = cursor ? parseInt(cursor, 10) : 0; // Convert string cursor to number
      const end = start + 50;
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

        const queryStartDate = today.format('YYYY-MM-DD');
        if (date.value === 'Today') {
          query.eq('date', queryStartDate);
        } else if (date.value === 'Last Week') {
          const lastWeek = today.subtract(1, 'week');
          const queryLastWeek = lastWeek.format('YYYY-MM-DD');
          query.gt('date', queryLastWeek);
          query.lte('date', queryStartDate);
        } else if (date.value === 'Last 2 Weeks') {
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
      if (status !== null && status.value !== 'All') {
        query.eq('status', status.value);
      }

      if (
        inputValue !== '' &&
        dayjs(inputValue, 'YYYY-MM-DD', true).isValid() === false
      ) {
        query.like('EmpId', `%${inputValue}%`);
      }

      if (end !== null) {
        query.range(0, end);
      }

      const { data: d, error } = await query
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw error;
      }
      if (!cursor) {
        // if it's a fresh load, reset the data
        setData(d);
      } else {
        setData((prevData: any) => [...prevData, ...d]);
      }
      const hasMoreData = !(d.length < 50);

      setHasMore(hasMoreData);

      return {
        items: d,
        cursor: hasMoreData ? (end + 1).toString() : undefined,
      };
    },
  });

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });

  const fetchData = async () => {
    setResetScroll(true);
    try {
      list.reload();
      setData([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchDataAndScroll = async () => {
      await fetchData();
      if (resetScroll && scrollerRef && scrollerRef.current) {
        scrollerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchDataAndScroll();
  }, [
    inputValue,
    zone.value,
    department.value,
    empShift.value,
    status?.value,
    date.value,
  ]);

  // useEffect(() => {
  //   (async () => {
  //     const query = supabase.from('Entry Data').select(select);
  //
  //     if (filterNoContraband) {
  //       query.not('contraband', 'is', null);
  //     }
  //
  //     if (zone.value !== 'All') {
  //       query.eq('Zone', zone.value);
  //     }
  //
  //     if (department.value !== 'All') {
  //       query.eq('DeptId', department.value);
  //     }
  //
  //     if (empShift.value !== 'All') {
  //       query.eq('EmpShift', empShift.value);
  //     }
  //
  //     if (date.value !== 'All') {
  //       const today = dayjs(inputValue, 'YYYY-MM-DD', true).isValid()
  //         ? dayjs(inputValue)
  //         : dayjs('2023-09-22');
  //
  //       const queryStartDate = today.format('YYYY-MM-DD');
  //       if (date.value === 'Today') {
  //         query.eq('date', queryStartDate);
  //       } else if (date.value === 'Last Week') {
  //         const lastWeek = today.subtract(1, 'week');
  //         const queryLastWeek = lastWeek.format('YYYY-MM-DD');
  //         query.gt('date', queryLastWeek);
  //         query.lte('date', queryStartDate);
  //       } else if (date.value === 'Last 2 Weeks') {
  //         const lastWeek = today.subtract(2, 'week');
  //         const queryLastWeek = lastWeek.format('YYYY-MM-DD');
  //         query.gt('date', queryLastWeek);
  //         query.lte('date', queryStartDate);
  //       } else if (date.value === 'Last Month') {
  //         const lastMonth = today.subtract(1, 'month');
  //         const queryLastMonth = lastMonth.format('YYYY-MM-DD');
  //         query.gt('date', queryLastMonth);
  //         query.lte('date', queryStartDate);
  //       }
  //     }
  //     if (status !== null && status.value !== 'All' ) {
  //       query.eq('status', status.value);
  //     }
  //
  //     if (inputValue !== '' && dayjs(inputValue, 'YYYY-MM-DD', true).isValid() === false) {
  //       query.like('EmpId', `%${inputValue}%`);
  //     }
  //
  //     if (end !== null) {
  //       query.range(0, end);
  //     }
  //
  //     const { data: d, error } = await query
  //       .order('date', { ascending: false })
  //       .order('time', { ascending: false });
  //
  //     if (!error && d) {
  //       setData(d);
  //     }
  //   })();
  // }, [
  //   zone,
  //   department,
  //   empShift,
  //   date,
  //   inputValue,
  //   supabase,
  //   select,
  //   end,
  //   status,
  //   filterNoContraband,
  // ]);

  return {
    data,
    hasMore,
    scrollerRef,
    loaderRef,
  };
}
