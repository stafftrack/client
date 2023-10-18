'use client';

import LineChart from '@/components/Security/LineChart';
import DoughnutChart from '@/components/Security/DoughnutChart';
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
import { useCallback, useEffect, useState } from 'react';
import CustomSelect from '@/components/Security/CustomSelect';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

interface Row {
  DateTime: string | null;
  DeptId: string | null;
  EmpId: string | null;
  EmpShift: string;
  id: number;
  Img: string | null;
  ToolScanTime: number | null;
  Zone: string | null;
  Status: string;
}

type StatusChipProps = {
  Status: 'On Time' | 'Late' | string; // 其他可能的值也可以在此添加
};

function StatusChip({ Status }: StatusChipProps) {
  if (Status === 'On Time') {
    return (
      <Chip color="success" variant="bordered">
        On time
      </Chip>
    );
  }
  if (Status === 'Late') {
    return (
      <Chip color="warning" variant="bordered">
        Late
      </Chip>
    );
  }
  return null;
}

type ContrabandChipProps = {
  contraband: 'Yes' | 'No' | string; // 其他可能的值也可以在此添加
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
export default function SecurityPage() {
  const [data, setData] = useState<Row[]>([]);

  // const calculateTotalContrabandCount = (s: SecurityData) => {
  //   const { gun, knife, laptop, scissor, electronicDevice } = s.contraband;
  //   return gun + knife + laptop + scissor + electronicDevice;
  // };

  const [filterValue, setFilterValue] = useState('');
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
  }, []);

  const [zone, setZone] = useState({
    label: 'Zone',
    values: ['All', 'AZ', 'HQ'],
    value: 'All',
  });
  const [department, setDepartment] = useState({
    label: 'Department',
    values: ['All', 'DEPT1', 'DEPT2', 'DEPT3', 'DEPT4'],
    value: 'All',
  });
  const [empShift, setEmpShift] = useState({
    label: 'EmpShift',
    values: ['All', '6:30', '7:30', '8:30', '9:00', '9:30'],
    value: 'All',
  });
  const [status, setStatus] = useState({
    label: 'Status',
    values: ['All', 'On Time', 'Late'],
    value: 'All',
  });
  const [date, setDate] = useState({
    label: 'Date',
    values: ['All', 'Today', 'Last 7 days', 'Last 14 days'],
    value: 'All',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('zone'))
      setZone({ ...zone, value: searchParams.get('zone') ?? 'All' });
    if (searchParams.get('department'))
      setDepartment({
        ...department,
        value: searchParams.get('department') ?? 'All',
      });
    if (searchParams.get('empShift'))
      setEmpShift({
        ...empShift,
        value: searchParams.get('empShift') ?? 'All',
      });
    if (searchParams.get('date'))
      setDate({ ...date, value: searchParams.get('date') ?? 'All' });
    if (searchParams.get('status'))
      setStatus({ ...status, value: searchParams.get('status') ?? 'All' });
    if (searchParams.get('empId'))
      setFilterValue(searchParams.get('empId') ?? '');
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (zone.value !== 'All') newSearchParams.set('zone', zone.value);
    if (department.value !== 'All')
      newSearchParams.set('department', department.value);
    if (empShift.value !== 'All')
      newSearchParams.set('empShift', empShift.value);
    if (date.value !== 'All') newSearchParams.set('date', date.value);
    if (status.value !== 'All') newSearchParams.set('status', status.value);
    if (filterValue) newSearchParams.set('empId', filterValue);
    window.history.pushState({}, '', `?${newSearchParams.toString()}`);

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
        query.eq('Status', status.value);
      }

      if (filterValue !== '') {
        query.like('EmpId', `%${filterValue}%`);
      }

      const { data: d, error } = await query.range(0, 9);

      if (!error) {
        setData(d);
      }
    })();
  }, [zone, department, empShift, date, status, filterValue]);

  return (
    <div className="flex w-full flex-col gap-5 px-10 pt-5">
      <ChatRoom />
      <div className="flex h-12 gap-5">
        <Input
          isClearable
          variant="bordered"
          placeholder="Search by empId"
          value={filterValue}
          startContent={<SearchIcon />}
          radius="sm"
          onClear={() => onClear()}
          onValueChange={onSearchChange}
          classNames={{
            inputWrapper: 'h-full border border-[#2f3037] bg-[#191a24]',
          }}
        />

        <CustomSelect state={zone} onChange={setZone} />
        <CustomSelect state={department} onChange={setDepartment} />
        <CustomSelect state={empShift} onChange={setEmpShift} />
        <CustomSelect state={status} onChange={setStatus} />
        <CustomSelect state={date} onChange={setDate} />
      </div>
      <div className="flex w-full justify-center gap-10">
        <DoughnutChart />
        <LineChart />
      </div>
      <Table
        classNames={{
          wrapper:
            'w-full max-h-[38rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
          th: 'text-base bg-transparent text-white',
          td: 'border-t border-t-[#2f3037]',
        }}
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
            <TableRow key={d.EmpId}>
              <TableCell>{d.EmpId}</TableCell>
              <TableCell>{d.EmpShift}</TableCell>
              <TableCell>{d.DeptId}</TableCell>
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{d.DateTime}</TableCell>
              <TableCell>
                <StatusChip Status={d.Status}/>
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
