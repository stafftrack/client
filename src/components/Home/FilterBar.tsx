import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CustomSelect from '@/components/Security/CustomSelect';
import SearchIcon from '@/components/Fiter/SearchIcon';
import { Input } from '@nextui-org/input';

export default function FilterBar({
  searchParams,
  supabase,
  setData,
}: {
  searchParams: any;
  supabase: any;
  setData: any;
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
  );
}
