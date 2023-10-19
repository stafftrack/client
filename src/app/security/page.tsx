'use client';

import { useEffect, useState } from 'react';
import LineChart from '@/components/Security/LineChart';
import DoughnutChart from '@/components/Security/DoughnutChart';
import { Input } from '@nextui-org/react';
import ChatRoom from '@/components/ChatRoom';
import SearchIcon from '@/components/Fiter/SearchIcon';
import CustomSelect from '@/components/Security/CustomSelect';
import { createClient } from '@supabase/supabase-js';
import { DataRow } from '@/types';
import CustomTable from '@/components/Security/CustomTable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function SecurityPage() {
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

      if (inputValue !== '') {
        query.like('EmpId', `%${inputValue}%`);
      }

      const { data: d, error } = await query.range(0, 19);

      if (!error) {
        setData(d);
      }
    })();
  }, [zone, department, empShift, date, inputValue]);

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
          }}
          classNames={{
            inputWrapper: 'h-full border border-[#2f3037] bg-[#191a24] w-52',
          }}
        />

        <CustomSelect state={zone} onChange={setZone} />
        <CustomSelect state={department} onChange={setDepartment} />
        <CustomSelect state={empShift} onChange={setEmpShift} />
        <CustomSelect state={date} onChange={setDate} />
      </div>
      <div className="flex w-full justify-center gap-5">
        <DoughnutChart />
        <LineChart />
      </div>
      <CustomTable data={data} />
    </div>
  );
}
