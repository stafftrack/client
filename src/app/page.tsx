'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import CustomSelect from '@/components/Security/CustomSelect';
import { createClient } from '@supabase/supabase-js';
import SearchIcon from '@/components/Fiter/SearchIcon';


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

function ContrabandChip({ contraband: has_contraband }: ContrabandChipProps) {
  if (has_contraband) {
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
function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}
export default function App({ searchParams }: { searchParams: any }) {
  const [inputValue, setInputValue] = useState(searchParams.empId ?? '');
  const [data, setData] = useState<any[]>([]);
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
    values: ['All', 'Today', 'Last Week', 'Last 2 Weeks', 'Last Month'],
    value: searchParams.Date ?? 'Today',
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
      if (status.value !== 'All') {
        query.eq('status', status.value);
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

      const { data: d, error } = await query
        .range(0, 49)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (!error) {
        setData(d);
      }
    })();
    
  }, [zone, department, empShift, date, inputValue]);


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
            'w-full table-fixed max-h-[35rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
          th: 'text-base text-white bg-[#191a24]',
          td: 'border-y border-y-[#2f3037]',
        }}
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn>EmpId</TableColumn>
          <TableColumn>EmpShift</TableColumn>
          <TableColumn>DeptId</TableColumn>
          <TableColumn>Zone</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Date</TableColumn>
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
    </div>
  );
}
