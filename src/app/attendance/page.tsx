'use client';

import React from 'react';

import { Select, SelectItem } from '@nextui-org/react';

import LineChart from '@/components/Attendance/lineChart';
import DoughnutChart from '@/components/Attendance/DoughnutChart';

export default function App() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap gap-4 p-4 md:flex-nowrap">
        <Select
          label="Period"
          defaultSelectedKeys={['day']}
          // variant="bordered"
          className="max-w-xs"
          // color='primary'
        >
          <SelectItem key="month" value="month">
            monthly
          </SelectItem>
          <SelectItem key="day" value="day">
            day
          </SelectItem>
        </Select>
      </div>
      <div className="flex w-full justify-center gap-10 pt-10">
        <DoughnutChart />
        <LineChart />
      </div>
    </div>
  );
}
