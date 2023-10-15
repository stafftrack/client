'use client';

import React from 'react';
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

// 假資料
const fakeData = [
  {
    EmpId: 'EMP017',
    EmpShift: '7:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 7:14',
    Status: 'On time',   
    Contraband: 'No',  
  },
  {
    EmpId: 'EMP030',
    EmpShift: '7:30',
    DeptId: 'DEPT3',
    Zone: 'HQ',
    DateTime: '9/11/2023 7:21',
    Status: 'On time',   
    Contraband: 'No',       
  },
  {
    EmpId: 'EMP038',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:42',
    Status: 'Late',     
    Contraband: 'Yes',    
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'On time',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP038',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:42',
    Status: 'Late',     
    Contraband: 'Yes',    
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'On time',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP038',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:42',
    Status: 'Late',     
    Contraband: 'Yes',    
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'On time',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP038',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:42',
    Status: 'Late',     
    Contraband: 'Yes',    
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'Late',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP038',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:42',
    Status: 'On time',     
    Contraband: 'Yes',    
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'Late',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'Late',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'On time',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP038',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:42',
    Status: 'Late',     
    Contraband: 'Yes',    
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'On time',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'Late',     
    Contraband: 'No',      
  },
  {
    EmpId: 'EMP087',
    EmpShift: '8:30',
    DeptId: 'DEPT4',
    Zone: 'HQ',
    DateTime: '9/11/2023 8:38',
    Status: 'On time',     
    Contraband: 'No',      
  },
];


export default function App() {
  return (
    <div>
      <div className="mt-5">
        <Filter />
      </div>
      <div className="mt-9">
      <Table
        classNames={{
          wrapper:
            'w-[72.375rem] max-h-[40rem] rounded-xl  bg-[#171821] text-white ',
          th: 'w-[75rem] h-[5.3rem ]  bg-opacity-20 text-white',
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
          {fakeData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.EmpId}</TableCell>
              <TableCell>{data.EmpShift}</TableCell>
              <TableCell>{data.DeptId}</TableCell>
              <TableCell>{data.Zone}</TableCell>
              <TableCell>{data.DateTime}</TableCell>
              <TableCell>
                {data.Status === "On time" ? (
                  <Chip color="success" variant="shadow">On time</Chip>
                ) : data.Status === "Late" ? (
                  <Chip color="danger" variant="shadow">Late</Chip>
                ) : null}
              </TableCell>
              <TableCell>{data.Contraband}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

