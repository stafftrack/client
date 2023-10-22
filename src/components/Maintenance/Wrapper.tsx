'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from '@nextui-org/react';
import ChatRoom from '@/components/ChatRoom';
import SearchIcon from '@/components/Fiter/SearchIcon';
import CustomSelect from '@/components/Security/CustomSelect';
import LineChart from '@/components/Maintenance/LineChart';
import { createClient } from '@supabase/supabase-js';
import useSupabaseScanTime from '@/hooks/useSupabaseScanTime';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}

export default function Wrapper({
  searchParams,
  dict,
}: {
  searchParams: any;
  dict: any;
}) {
  const [inputValue, setInputValue] = useState(searchParams.DateTime ?? '');
  const router = useRouter();
  const pathname = usePathname();

  const [zone, setZone] = useState({
    label: 'Zone',
    displayLabel: dict.common.zone,
    values: ['All', 'AZ', 'HQ'],
    value: searchParams.Zone ?? 'All',
  });

  const [date, setDate] = useState({
    label: 'Date',
    displayLabel: dict.common.date,
    values: ['All', 'Today', 'Last Week', 'Last 2 Weeks', 'Last Month'],
    value: searchParams.Date ?? 'All',
  });

  const data = useSupabaseScanTime(
    supabase,
    'DateTime,ToolScanTime,Zone',
    zone,
    date,
    inputValue,
    49,
  );

  const scanData = useSupabaseScanTime(
    supabase,
    'DateTime,ToolScanTime,Zone',
    zone,
    date,
    inputValue,
    null,
  )

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
              newSearchParams.set('DateTime', value);
            } else {
              newSearchParams.delete('DateTime');
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
          state={date}
          onChange={setDate}
          searchParams={searchParams}
        />
      </div>
      <div className="flex w-full justify-center gap-5">
      <div className="flex w-full justify-center gap-5">
        <LineChart date={date} scanData={scanData} dict={dict} />
      </div>
      </div>
      <Table
        aria-label="Table with employee security data"
        selectionMode="single"
        classNames={{
          wrapper:
'w-full table-fixed max-h-[39.5rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
    th : 'text-base bg-transparent text-white',
         td : 'border-t border-t-[#2f3037]',
        }}
        onRowAction={(row) => {
          const queryEmpId = row.toString().split('-')[1];
          console.log(queryEmpId);
          setInputValue(queryEmpId);
        }}
      >
        <TableHeader>
          <TableColumn className="w-20">{dict.common.zone}</TableColumn>
          <TableColumn className="w-20">{dict.common.time}</TableColumn>
          <TableColumn className="w-20">{dict.common.date}</TableColumn>
          <TableColumn className="w-32">{dict.common.tool_scan_time}</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow
              key={`${d.date}_${d.time}_${d.Zone}_${d.ToolScanTime}`}
              textValue={d.empId}
              className="cursor-pointer"
            >
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{formatTime(d.time)}</TableCell>
              <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
              <TableCell>{d.ToolScanTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
