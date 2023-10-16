'use client';

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import Filter from '../components/Fiter/index';
import fakeData from './fakedata';

function renderStatusChip(status: string) {
  if (status === 'On time') {
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

  return null;
}

export default function App() {
  const [filters, setFilters] = useState({
    zone: 'zone',
    department: 'department',
    empShift: 'empShift',
    date: 'date',
    status: 'status',
    empId: '',
  });

  const filteredData = fakeData.filter((item) => {
    if (filters.zone !== 'zone' && item.Zone !== filters.zone.toUpperCase())
      return false;
    if (
      filters.department !== 'department' &&
      item.DeptId !== filters.department.toUpperCase()
    )
      return false;
    if (filters.empShift !== 'empShift' && item.EmpShift !== filters.empShift)
      return false;
    if (filters.status !== 'status' && item.Status !== filters.status)
      return false;
    if (filters.date === 'today' && !item.DateTime.includes('9/11/2023'))
      return false;
    if (filters.empId && !item.EmpId.includes(filters.empId)) return false;

    return true;
  });

  return (
    <div>
      <div className="mt-5">
        <Filter onFilterChange={setFilters} />
      </div>
      <div className="mt-9">
        <Table
          classNames={{
            wrapper:
              'w-[72.375rem] max-h-[38rem] rounded-xl  bg-[#171821] text-white',
            th: 'text-[15px] bg-opacity-20 text-white',
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
            {filteredData.map((data) => (
              <TableRow key={data.EmpId + data.DateTime}>
                <TableCell>{data.EmpId}</TableCell>
                <TableCell>{data.EmpShift}</TableCell>
                <TableCell>{data.DeptId}</TableCell>
                <TableCell>{data.Zone}</TableCell>
                <TableCell>{data.DateTime}</TableCell>
                <TableCell>{renderStatusChip(data.Status)}</TableCell>
                <TableCell>
                  {data.Contraband === 'Yes' ? (
                    <Chip color="danger" variant="shadow">
                      Yes
                    </Chip>
                  ) : (
                    <Chip>No</Chip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
