'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from '@nextui-org/react';
import SearchIcon from './SearchIcon';

type FilterChangeProps = {
  zone: string;
  department: string;
  empShift: string;
  date: string;
  status: string;
  empId: string;
};

export default function Filter({
  onFilterChange,
}: {
  onFilterChange: (props: FilterChangeProps) => void;
}) {
  const [filterValue, setFilterValue] = useState('');
  const [zone, setZone] = useState('zone');
  const [department, setDepartment] = useState('department');
  const [empShift, setEmpShift] = useState('empShift');
  const [date, setDate] = useState('date');
  const [status, setStatus] = useState('status');
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (zone !== 'zone') newSearchParams.set('zone', zone);
    if (department !== 'department')
      newSearchParams.set('department', department);
    if (empShift !== 'empShift') newSearchParams.set('empShift', empShift);
    if (date !== 'date') newSearchParams.set('date', date);
    if (status !== 'status') newSearchParams.set('status', status);
    if (filterValue) newSearchParams.set('empId', filterValue);
    window.history.pushState({}, '', `?${  newSearchParams.toString()}`);
    onFilterChange({
      zone,
      department,
      empShift,
      date,
      status,
      empId: filterValue,
    });
  }, [zone, department, empShift, date, status, filterValue, onFilterChange]);
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
  return (
    <div>
      <div className="flex flex-row justify-around  ">
        <Input
          isClearable
          className="w-[13rem] "
          placeholder="Search by empId"
          value={filterValue}
          startContent={<SearchIcon />}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] border border-gray-700 capitalize text-white"
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
              onSelectionChange={(keys) => {
                const selectedKey = String(Array.from(keys)[0]);
                if (selectedKey === 'all') {
                  setZone('zone');
                } else {
                  setZone(selectedKey);
                }
              }}
            >
              <DropdownItem key="hq">HQ</DropdownItem>
              <DropdownItem key="az">AZ</DropdownItem>
              <DropdownItem key="all">All</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] border-gray-700 capitalize text-white"
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
              onSelectionChange={(keys) => {
                const selectedKey = String(Array.from(keys)[0]);
                if (selectedKey === 'all') {
                  setDepartment('department');
                } else {
                  setDepartment(selectedKey);
                }
              }}
            >
              <DropdownItem key="dept1">Dept1</DropdownItem>
              <DropdownItem key="dept2">Dept2</DropdownItem>
              <DropdownItem key="dept3">Dept3</DropdownItem>
              <DropdownItem key="dept4">Dept4</DropdownItem>
              <DropdownItem key="all">All</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] border-gray-700 capitalize text-white"
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
              onSelectionChange={(keys) => {
                const selectedKey = String(Array.from(keys)[0]);
                if (selectedKey === 'all') {
                  setEmpShift('empShift');
                } else {
                  setEmpShift(selectedKey);
                }
              }}
            >
              <DropdownItem key="6:30">6:30</DropdownItem>
              <DropdownItem key="7:30">7:30</DropdownItem>
              <DropdownItem key="8:30">8:30</DropdownItem>
              <DropdownItem key="all">All</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] border-gray-700 capitalize text-white"
              >
                {status}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status selection"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([status])}
              onSelectionChange={(keys) => {
                const selectedKey = String(Array.from(keys)[0]);
                if (selectedKey === 'all') {
                  setStatus('status');
                } else {
                  setStatus(selectedKey);
                }
              }}
            >
              <DropdownItem key="On time">On time</DropdownItem>
              <DropdownItem key="Late">Late</DropdownItem>
              <DropdownItem key="all">All</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="h-[2.62644rem] w-[9.9995rem] border-gray-700 capitalize text-white"
              >
                {date}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Date selection"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([date])}
              onSelectionChange={(keys) => {
                const selectedKey = String(Array.from(keys)[0]);
                if (selectedKey === 'all') {
                  setDate('date');
                } else {
                  setDate(selectedKey);
                }
              }}
            >
              <DropdownItem key="today">Today</DropdownItem>
              <DropdownItem key="last 7 days">Last 7 days</DropdownItem>
              <DropdownItem key="last 14 days">Last 14 days</DropdownItem>
              <DropdownItem key="all">All</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
