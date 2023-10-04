'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';

// 假資料
const fakeData = [
  { name: "Tony Reichert", position: "CEO", status: "Active", contraband: "None", checkIn: "09:00 AM" },
  { name: "Zoey Lang", position: "Technical Lead", status: "Paused", contraband: "Laptop", checkIn: "08:45 AM" },
  { name: "Jane Fisher", position: "Senior Developer", status: "Active", contraband: "None", checkIn: "09:15 AM" },
  { name: "William Howard", position: "Community Manager", status: "Vacation", contraband: "Phone", checkIn: "Not Checked In" },
  { name: "John Doe", position: "Designer", status: "Active", contraband: "Tablet", checkIn: "09:20 AM" },
  { name: "Emma Smith", position: "HR", status: "On Leave", contraband: "None", checkIn: "Not Checked In" },
];

export default function App() {
  return (
    <Table
      classNames={{
        wrapper: 'w-[72.375rem] max-h-[40rem] rounded-xl  bg-opacity-10 text-white ',
        th : 'w-[65rem] h-[5.3rem ]  bg-opacity-20 text-white'
      }}
    >
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>DEPARTMENT</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>CONTRABAND</TableColumn>
        <TableColumn>CHECK IN TIME</TableColumn>
      </TableHeader>
      <TableBody>
        {fakeData.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.position}</TableCell>
            <TableCell>{data.status}</TableCell>
            <TableCell>{data.contraband}</TableCell>
            <TableCell>{data.checkIn}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
