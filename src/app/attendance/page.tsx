'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import LineChart from '@/components/Attendance/LineChart';
import LineWeekChart from '@/components/Attendance/LineWeekChart';
import LineMonthChart from '@/components/Attendance/LineMonthChart';
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
import useSupabaseData from '@/hooks/useSupabaseData';

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
    values: ['All', 'Daily', 'Last Week', 'Last Month'],
    value: searchParams.Date ?? 'Today',
  });
  const [status, setStatus] = useState({
    label: 'status',
    values: ['All', 'On Time', 'Late', 'Early'],
    value: searchParams.status ?? 'All',
  });

  const data = useSupabaseData(
    supabase,
    'id,EmpId,Zone,DeptId,EmpShift,time,date,status',
    zone,
    department,
    empShift,
    date,
    inputValue,
    false,
    status,
    99,
  );

  console.log(data);

  const attendData = useSupabaseData(
    supabase,
    'EmpShift,time,date,status',
    zone,
    department,
    empShift,
    date,
    inputValue,
    false,
    status,
    null,
  );

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
        {data.length > 0 && (
          <DoughnutChart database={attendData} period={date.value} />
        )}
        {date.value === 'Daily' && data.length > 0 && (
          <LineChart database={attendData} />
        )}
        {date.value === 'Last Week' && attendData.length > 0 && (
          <LineWeekChart database={attendData} />
        )}
        {date.value === 'Last Month' && attendData.length > 0 && (
          <LineMonthChart database={attendData} />
        )}
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
                  <Chip
                    variant="bordered"
                    className="border-[#0070F0] text-[#0070F0]"
                  >
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
