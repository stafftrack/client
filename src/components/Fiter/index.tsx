'use client';

import React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';

export default function Filter() {
  const [zone, setZone] = React.useState('zone');
  const [department, setDepartment] = React.useState('department');
  const [empShift, setEmpShift] = React.useState('empShift');
  const [date, setDate] = React.useState('date');

  return (
    <div >
      <div className="flex flex-row justify-around  ">
        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] capitalize text-white border border-gray-700"
              >
                {zone.replace('_', ' ')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Zone selection"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([zone])}
              onSelectionChange={(keys) => setZone(Array.from(keys)[0])}
            >
              <DropdownItem key="hq">HQ</DropdownItem>
              <DropdownItem key="az">AZ</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] capitalize text-white border-gray-700"
              >
                {department.replace('_', ' ')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Department selection"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([department])}
              onSelectionChange={(keys) => setDepartment(Array.from(keys)[0])}
            >
              <DropdownItem key="dept1">Dept1</DropdownItem>
              <DropdownItem key="dept2">Dept2</DropdownItem>
              <DropdownItem key="dept3">Dept3</DropdownItem>
              <DropdownItem key="dept4">Dept4</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] capitalize text-white border-gray-700"
              >
                {empShift}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="EmpShift selection"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([empShift])}
              onSelectionChange={(keys) => setEmpShift(Array.from(keys)[0])}
            >
              <DropdownItem key="06:30">06:30</DropdownItem>
              <DropdownItem key="07:00">07:00</DropdownItem>
              <DropdownItem key="07:30">07:30</DropdownItem>
              <DropdownItem key="08:00">08:00</DropdownItem>
              <DropdownItem key="08:30">08:30</DropdownItem>
              <DropdownItem key="09:00">09:00</DropdownItem>
              <DropdownItem key="09:30">09:30</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] capitalize text-white border-gray-700"
              >
                {date}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([date])}
              onSelectionChange={(keys) => setDate(Array.from(keys)[0])}
            >
              <DropdownItem key="today">Today</DropdownItem>
              <DropdownItem key="last 7 days">Last 7 days</DropdownItem>
              <DropdownItem key="last 14 days">Last 14 days</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
