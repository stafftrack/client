'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import LineChart from '@/components/Security/LineChart';
import DoughnutChart from '@/components/Security/DoughnutChart';
import { Input } from '@nextui-org/react';
import ChatRoom from '@/components/ChatRoom';
import SearchIcon from '@/components/Fiter/SearchIcon';
import CustomSelect from '@/components/Security/CustomSelect';
import CustomTable from '@/components/Security/CustomTable';
import useSupabaseData from '@/hooks/useSupabaseData';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function Wrapper({ searchParams, dict }: { searchParams: any, dict: any }) {
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
  const [date, setDate] = useState({
    label: 'Date',
    displayLabel: dict.common.date,
    values: ['All', 'Today', 'Last Week', 'Last 2 Weeks', 'Last Month'],
    value: searchParams.Date ?? 'Today',
  });

  const data = useSupabaseData(
    supabase,
    'id,EmpId,Zone,DeptId,EmpShift,time,date,contraband,Img',
    zone,
    department,
    empShift,
    date,
    inputValue,
    true,
    null,
    49,
  );

  const contrabandData = useSupabaseData(
    supabase,
    'date,EmpShift,contraband',
    zone,
    department,
    empShift,
    date,
    inputValue,
    true,
    null,
    null,
  );

  return (
    <div className="flex w-full flex-col gap-5 px-10 pt-10">
      <ChatRoom data={data} />
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
          state={date}
          onChange={setDate}
          searchParams={searchParams}
        />
      </div>
      <div className="flex w-full justify-center gap-5">
        <DoughnutChart contrabandData={contrabandData} dict={dict} />
        <LineChart date={date} contrabandData={contrabandData} dict={dict} />
      </div>
      <CustomTable data={data} dict={dict} />
    </div>
  );
}
