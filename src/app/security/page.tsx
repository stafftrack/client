'use client';

import LineChart from '@/components/Security/LineChart';
import DoughnutChart from '@/components/Security/DoughnutChart';
import { mockSecurityData } from '@/data';
import { SecurityData } from '@/types';
import ChatRoom from '@/components/ChatRoom';
import { Input } from '@nextui-org/react';
import SearchIcon from '@/components/Fiter/SearchIcon';
import { useCallback, useEffect, useState } from 'react';
import CustomSelect from '@/components/Security/CustomSelect';

export default function SecurityPage() {
  const calculateTotalContrabandCount = (s: SecurityData) => {
    const { gun, knife, laptop, scissor, electronicDevice } = s.contraband;
    return gun + knife + laptop + scissor + electronicDevice;
  };
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
      newSearchParams.set('All', department.value);
    if (empShift.value !== 'All')
      newSearchParams.set('empShift', empShift.value);
    if (date.value !== 'All') newSearchParams.set('date', date.value);
    if (status.value !== 'All') newSearchParams.set('status', status.value);
    if (filterValue) newSearchParams.set('empId', filterValue);
    window.history.pushState({}, '', `?${newSearchParams.toString()}`);
  }, [zone, department, empShift, date, status, filterValue]);

  return (
    <div className="w-full">
      <ChatRoom />
      <div className="mx-5 mt-5 flex h-12 gap-5">
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
      <div className="flex w-full justify-center gap-10 pt-10">
        <DoughnutChart />
        <LineChart />
      </div>
      <div className="text-white">
        {mockSecurityData.map((s) => (
          <div key={s.id}>
            {s.id} {s.zone} {s.departmentId} {s.shift} {s.dateTime}
            {calculateTotalContrabandCount(s)}
          </div>
        ))}
      </div>
    </div>
  );
}
