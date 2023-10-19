'use client';

import { useEffect, useState } from 'react';
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
import { DataRow } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

type ContrabandChipProps = {
  contraband: 'Yes' | 'No' | string;
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

export default function App() {
  const [data, setData] = useState<DataRow[]>([]);

  // const calculateTotalContrabandCount = (s: SecurityData) => {
  //   const { gun, knife, laptop, scissor, electronicDevice } = s.contraband;
  //   return gun + knife + laptop + scissor + electronicDevice;
  // };

  const [inputValue, setInputValue] = useState('');
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

    const searchZone = searchParams.get('zone');
    if (searchZone) {
      setZone({ ...zone, value: searchZone });
    }

    const searchDepartment = searchParams.get('department');
    if (searchDepartment) {
      setDepartment({ ...department, value: searchDepartment });
    }

    const searchEmpShift = searchParams.get('empShift');
    if (searchEmpShift) {
      setEmpShift({ ...empShift, value: searchEmpShift });
    }

    const searchDate = searchParams.get('date');
    if (searchDate) {
      setDate({ ...date, value: searchDate });
    }

    const searchStatus = searchParams.get('status');
    if (searchStatus) {
      setStatus({ ...status, value: searchStatus });
    }

    const searchEmpId = searchParams.get('empId');
    if (searchEmpId) {
      setInputValue(searchEmpId);
    }
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
    if (inputValue) newSearchParams.set('empId', inputValue);
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

      if (inputValue !== '') {
        query.like('EmpId', `%${inputValue}%`);
      }

      const { data: d, error } = await query.range(0, 9);

      if (!error) {
        setData(d);
      }
    })();
  }, [zone, department, empShift, date, status, inputValue]);

  return (
    <div className="mx-auto flex w-[65rem] flex-col gap-4 pt-10">
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
          }}
          classNames={{
            inputWrapper: 'h-full border border-[#2f3037] bg-[#191a24] w-52',
          }}
        />

        <CustomSelect state={zone} onChange={setZone} />
        <CustomSelect state={department} onChange={setDepartment} />
        <CustomSelect state={empShift} onChange={setEmpShift} />
        <CustomSelect state={status} onChange={setStatus} />
        <CustomSelect state={date} onChange={setDate} />
      </div>
      <Table
        classNames={{
          wrapper:
            'w-full max-h-[38rem] border border-[#2f3037] rounded-md p-0 bg-[#191a24] text-white',
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
            <TableRow key={d.id}>
              <TableCell>{d.EmpId}</TableCell>
              <TableCell>{d.EmpShift}</TableCell>
              <TableCell>{d.DeptId}</TableCell>
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{d.DateTime}</TableCell>
              <TableCell>
                <Chip
                  variant="bordered"
                  color={d.Status === 'On Time' ? 'success' : 'warning'}
                >
                  {d.Status}
                </Chip>
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
