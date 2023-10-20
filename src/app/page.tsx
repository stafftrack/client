'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { useAsyncList } from '@react-stately/data';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Spinner,
} from '@nextui-org/react';
import CustomSelect from '@/components/Security/CustomSelect';
import { createClient } from '@supabase/supabase-js';
import SearchIcon from '@/components/Fiter/SearchIcon';
import { DataRow } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

type ContrabandChipProps = {
  contraband: 'Yes' | 'No' | string;
};
type StatusChipProps = {
  status: 'On Time' | 'Late' | 'Early' | string;
};
type ListOptions = {
  signal: AbortSignal;
  cursor?: string;
};

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

export default function App({ searchParams }: { searchParams: any }) {
  const [data, setData] = useState<DataRow[]>([]);
  const [inputValue, setInputValue] = useState(searchParams.empId ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const [filtersChanged, setFiltersChanged] = useState(false);
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setFiltersChanged(true);
  };
  const [hasMore, setHasMore] = useState(true);
  const [zone, setZone] = useState({
    label: 'Zone',
    values: ['All', 'AZ', 'HQ'],
    value: searchParams.Zone ?? 'All',
  });
  const [department, setDepartment] = useState({
    label: 'Department',
    values: ['All', 'DEPT1', 'DEPT2', 'DEPT3', 'DEPT4'],
    value: searchParams.Department ?? 'All',
  });
  const [empShift, setEmpShift] = useState({
    label: 'EmpShift',
    values: ['All', '6:30', '7:30', '8:30', '9:00', '9:30'],
    value: searchParams.Shift ?? 'All',
  });
  const [status, setStatus] = useState({
    label: 'Status',
    values: ['All', 'On Time', 'Early', 'Late'],
    value: searchParams.status ?? 'All',
  });
  const [date, setDate] = useState({
    label: 'Date',
    values: ['All', 'Today', 'Last 7 days', 'Last 14 days'],
    value: searchParams.Date ?? 'All',
  });

  useEffect(() => {
    const searchZone = searchParams.zone;
    if (searchZone) {
      setZone({ ...zone, value: searchZone });
    }

    const searchDepartment = searchParams.department;
    if (searchDepartment) {
      setDepartment({ ...department, value: searchDepartment });
    }

    const searchEmpShift = searchParams.EmpShift;
    if (searchEmpShift) {
      setEmpShift({ ...empShift, value: searchEmpShift });
    }

    const searchDate = searchParams.date;
    if (searchDate) {
      setDate({ ...date, value: searchDate });
    }

    const searchStatus = searchParams.Status;
    if (searchStatus) {
      setStatus({ ...status, value: searchStatus });
    }

    const searchEmpId = searchParams.empId;
    if (searchEmpId) {
      setInputValue(searchEmpId);
    }
  }, []);

  const list = useAsyncList<DataRow[]>({
    async load({ signal, cursor }: ListOptions) {
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
        throw error;
      }
      setData((prevData) => [...prevData, ...d]);
      const hasMoreData = !(d.length < 50);

      setHasMore(hasMoreData);
      console.log('Cursor:', start, 'Has More:', hasMoreData);

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
  const fetchData = () => {
    list.reload();
    setData([]);
  };
  useEffect(() => {
    fetchData();
}, [inputValue, zone.value, department.value, empShift.value, status.value, date.value]);

  return (
    <div className="flex w-full flex-col gap-5 px-10 pt-10">
      <div className="flex h-12 gap-5">
        <Input
          aria-label="Employee ID input"
          isClearable
          variant="bordered"
          placeholder="Search Employee ID"
          value={inputValue}
          startContent={<SearchIcon />}
          radius="sm"
          onClear={() => {
            setInputValue('');
          }}
          onValueChange={(value) => {
            setInputValue(value);
            fetchData();
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
            'w-full table-fixed max-h-[35rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
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
          <TableColumn>EmpId</TableColumn>
          <TableColumn>EmpShift</TableColumn>
          <TableColumn>DeptId</TableColumn>
          <TableColumn>Zone</TableColumn>
          <TableColumn>DateTime</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Contraband</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.EmpId}</TableCell>
              <TableCell>{d.EmpShift}</TableCell>
              <TableCell>{d.DeptId}</TableCell>
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{d.DateTime}</TableCell>
              <TableCell>
                <StatusChip status={d.status} />
              </TableCell>
              <TableCell>
                <ContrabandChip contraband="No" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
