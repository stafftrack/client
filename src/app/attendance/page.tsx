'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LineChart from '@/components/Attendance/LineChart';
import DoughnutChart from '@/components/Attendance/DoughnutChart';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
} from '@nextui-org/react';
import ChatRoom from '@/components/ChatRoom';
import SearchIcon from '@/components/Fiter/SearchIcon';
import CustomSelect from '@/components/Security/CustomSelect';
import { createClient } from '@supabase/supabase-js';
import { DataRow } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}

export default function AttendancePage({
  searchParams,
}: {
  searchParams: any;
}) {
  const [data, setData] = useState<DataRow[]>([]);
  const [inputValue, setInputValue] = useState(searchParams.empId ?? '');
  const router = useRouter();
  const pathname = usePathname();

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
    label: 'Shift',
    values: ['All', '6:30', '7:30', '8:30', '9:00', '9:30'],
    value: searchParams.Shift ?? 'All',
  });
  const [date, setDate] = useState({
    label: 'Date',
    values: ['All', 'Today', 'Last 7 days', 'Last 14 days'],
    value: searchParams.Date ?? 'All',
  });
  const [status, setStatus] = useState({
    label: 'status',
    values: ['All', 'On Time', 'Late', 'Early'],
    value: searchParams.status ?? 'All',
  });

  useEffect(() => {
    (async () => {
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

      if (status.value !== 'All') {
        console.log(status.value);
        query.eq('status', status.value);
      }

      if (inputValue !== '') {
        query.like('EmpId', `%${inputValue}%`);
      }

      const { data: d, error } = await query
        .range(0, 49)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (!error) {
        setData(d);
      }
    })();
  }, [zone, department, empShift, date, status, inputValue]);
  return (
    <div className="flex w-full flex-col gap-5 px-10 pt-5">
      <ChatRoom />
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
      <div className="flex w-full justify-center gap-5">
        {data.length > 0 && <DoughnutChart database={data} />}
        {data.length > 0 && <LineChart database={data} />}
      </div>
      <Table
        aria-label="Table with employee security data"
        classNames={{
          wrapper:
            'w-full table-fixed max-h-[38rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
          th: 'text-base bg-transparent text-white',
          td: 'border-t border-t-[#2f3037]',
        }}
      >
        <TableHeader>
          <TableColumn className="w-32">Employee</TableColumn>
          <TableColumn className="w-20">Zone</TableColumn>
          <TableColumn className="w-32">Department</TableColumn>
          <TableColumn className="w-20">Shift</TableColumn>
          <TableColumn className="w-20">Time</TableColumn>
          <TableColumn className="w-20">Date</TableColumn>
          <TableColumn className="w-32">Status</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.EmpId}</TableCell>
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{d.DeptId}</TableCell>
              <TableCell>{d.EmpShift}</TableCell>
              <TableCell>{formatTime(d.time)}</TableCell>
              <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {d.status === 'Early' ? (
                  <Chip variant="bordered" className="text-[#0070F0] border-[#0070F0]">
                    {d.status}
                  </Chip>
                ) : (
                  <Chip
                    variant="bordered"
                    color={d.status === 'On Time' ? 'success' : 'warning'}
                  >
                    {d.status}
                  </Chip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
