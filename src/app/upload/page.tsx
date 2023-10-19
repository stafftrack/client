'use client';

import React, { useState, useRef } from 'react';
import { Input, Select, SelectItem, Button } from '@nextui-org/react';

export default function UploadPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectImage, setSelectImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectImage(event.target.files[0]);
    }
  };

  const EmpShiftSelect = [
    { label: '6:30', value: '6:30' },
    { label: '7:30', value: '7:30' },
    { label: '8:30', value: '8:30' },
    { label: '9:00', value: '9:00' },
    { label: '9:30', value: '9:30' },
  ];

  const DepIdSelect = [
    { label: 'Dept1', value: 'Dept1' },
    { label: 'Dept2', value: 'Dept2' },
    { label: 'Dept3', value: 'Dept3' },
    { label: 'Dept4', value: 'Dept4' },
  ];

  const ZoneSelect = [
    { label: 'AZ', value: 'AZ' },
    { label: 'HQ', value: 'HQ' },
  ];

  const DatetimeSelect = [
    { label: '10/21/2023 7:25', value: '10/21/2023 7:25' },
    { label: '10/21/2023 7:35', value: '10/21/2023 7:35' },
  ];

  return (
    <div className="flex min-h-screen w-full items-center">
      <div className="mx-auto flex   w-[500px] flex-col   border border-[#30303E]">
        <Input variant="faded" label="EmpId" className="mb-4 p-2" />
        <div className="flex flex-wrap">
          <div className="w-1/2 p-2">
            <Select label="EmpShift" variant="faded" className="mb-4">
              {EmpShiftSelect.map((shift) => (
                <SelectItem key={shift.value} value={shift.value}>
                  {shift.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-1/2 p-2">
            <Select label="DeptId" variant="faded" className="mb-4">
              {DepIdSelect.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-1/2 p-2">
            <Select label="Zone" variant="faded" className="mb-4">
              {ZoneSelect.map((zone) => (
                <SelectItem key={zone.value} value={zone.value}>
                  {zone.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-1/2 p-2">
            <Select label="Datetime" variant="faded" className="mb-4">
              {DatetimeSelect.map((datetime) => (
                <SelectItem key={datetime.value} value={datetime.value}>
                  {datetime.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex justify-between p-2">
          <Button
            color="default"
            variant="faded"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            Upload Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button color="default" variant="faded">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
