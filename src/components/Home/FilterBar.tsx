import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAsyncList } from '@react-stately/data';
import CustomSelect from '@/components/Security/CustomSelect';
import SearchIcon from '@/components/Fiter/SearchIcon';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  Chip,
} from '@nextui-org/react';

type ContrabandChipProps = {
  contraband: 'Yes' | 'No' | string;
};
type StatusChipProps = {
  status: 'On Time' | 'Late' | 'Early' | string;
};

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}

function ContrabandChip({ contraband }: ContrabandChipProps) {
  if (contraband === 'Yes') {
    return (
      <Chip color="danger" variant="bordered">
        Yes
      </Chip>
    );
  }
  return (
    <Chip color="default" variant="bordered">
      No
    </Chip>
  );
}

function StatusChip({ status }: StatusChipProps) {
  if (status === 'On Time') {
    return (
      <Chip color="success" variant="bordered">
        On time
      </Chip>
    );
  }
  if (status === 'Late') {
    return (
      <Chip color="warning" variant="bordered">
        Late
      </Chip>
    );
  }
  if (status === 'Early') {
    return (
      <Chip className="border-[#0070F0] text-[#0070F0]" variant="bordered">
        Early
      </Chip>
    );
  }
  return (
    <Chip color="default" variant="bordered">
      Unknown
    </Chip>
  );
}
export default function FilterBar({
  searchParams,
  supabase,
  setData,
  data,
  dict,
}: {
  searchParams: any;
  supabase: any;
  setData: any;
  data: any;
  dict: any;
}) {
  const [inputValue, setInputValue] = useState(searchParams.empId ?? '');
  const router = useRouter();
  const pathname = usePathname();

  const [zone, setZone] = useState({
    label: 'Zone',
    displayLabel: dict.common.zone,
    values: ['All', 'AZ', 'HQ'],
    value: searchParams.Zone ?? 'All',
  });
  const [department, setDepartment] = useState({
    label: 'Department',
    displayLabel: dict.common.department,
    values: ['All', 'DEPT1', 'DEPT2', 'DEPT3', 'DEPT4'],
    value: searchParams.Department ?? 'All',
  });
  const [empShift, setEmpShift] = useState({
    label: 'Shift',
    displayLabel: dict.common.shift,
    values: ['All', '6:30', '7:30', '8:30', '9:00', '9:30'],
    value: searchParams.Shift ?? 'All',
  });
  const [status, setStatus] = useState({
    label: 'Status',
    displayLabel: dict.common.status,
    values: ['All', 'On Time', 'Early', 'Late'],
    value: searchParams.status ?? 'All',
  });
  const [date, setDate] = useState({
    label: 'Date',
    displayLabel: dict.common.date,
    values: ['All', 'Today', 'Last Week', 'Last 2 Weeks', 'Last Month'],
    value: searchParams.Date ?? 'Today',
  });

  const [hasMore, setHasMore] = useState(true);
  const [resetScroll, setResetScroll] = useState(false);

  const list = useAsyncList<any[]>({
    async load({ cursor }) {
      const start = cursor ? parseInt(cursor, 10) : 0; // Convert string cursor to number
      const end = start + 50;
      const query = supabase.from('Entry Data').select('*');
      if (zone.value !== 'All') {
        query.eq('Zone', zone.value);
      }

      if (department.value !== 'All') {
        query.eq('DeptId', department.value);
      }

      if (empShift.value !== 'All') {
        query.eq('EmpShift', empShift.value);
      }

      if (status.value !== 'All') {
        query.eq('status', status.value);
      }

      if (inputValue !== '') {
        query.like('EmpId', `%${inputValue}%`);
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

      query
        .range(start, end)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      const { data: d, error } = await query;

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
    status.value,
    date.value,
  ]);

  return (
    <>
      <div className="flex h-12 gap-5">
        <Input
          aria-label="Employee ID input"
          isClearable
          variant="bordered"
          placeholder={dict.filterbar.input}
          value={inputValue}
          startContent={<SearchIcon />}
          radius="sm"
          onClear={() => {
            setInputValue('');
          }}
          onValueChange={(value) => {
            setInputValue(value);
            const newSearchParams = new URLSearchParams(searchParams);
            if (value !== '') {
              newSearchParams.set('empId', value);
            } else {
              newSearchParams.delete('empId');
            }
            router.push(`${pathname}?${newSearchParams.toString()}`);
          }}
          classNames={{
            inputWrapper: 'h-full border border-[#2f3037] bg-[#191a24] w-52',
          }}
        />

        <CustomSelect
          state={zone}
          onChange={setZone}
          searchParams={searchParams}
        />
        <CustomSelect
          state={department}
          onChange={setDepartment}
          searchParams={searchParams}
        />
        <CustomSelect
          state={empShift}
          onChange={setEmpShift}
          searchParams={searchParams}
        />
        <CustomSelect
          state={status}
          onChange={setStatus}
          searchParams={searchParams}
        />
        <CustomSelect
          state={date}
          onChange={setDate}
          searchParams={searchParams}
        />
      </div>
      <Table
        classNames={{
          wrapper:
            'w-full table-fixed max-h-[35rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white ',
          th: 'text-base text-white bg-[#191a24]',
          td: 'border-y border-y-[#2f3037]',
        }}
        isHeaderSticky
        baseRef={scrollerRef}
        bottomContent={
          hasMore ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="white" />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>{dict.common.empid}</TableColumn>
          <TableColumn>{dict.common.shift}</TableColumn>
          <TableColumn>{dict.common.department}</TableColumn>
          <TableColumn>{dict.common.zone}</TableColumn>
          <TableColumn>{dict.common.time}</TableColumn>
          <TableColumn>{dict.common.date}</TableColumn>
          <TableColumn>{dict.common.status}</TableColumn>
          <TableColumn>{dict.common.has_contraband}</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((d: any) => (
            <TableRow key={d.id}>
              <TableCell>{d.EmpId}</TableCell>
              <TableCell>{d.EmpShift}</TableCell>
              <TableCell>{d.DeptId}</TableCell>
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{formatTime(d.time)}</TableCell>
              <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <StatusChip status={d.status} />
              </TableCell>
              <TableCell>
                <ContrabandChip contraband={d.has_contraband} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
