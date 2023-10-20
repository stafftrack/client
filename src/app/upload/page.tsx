/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useRef } from 'react';
import { Image, Input, Select, SelectItem, Button } from '@nextui-org/react';

import useUploadData from '@/hooks/useUoloadData';

export default function UploadPage() {
  const [empId, setEmpId] = useState<string>('');
  const [empshift, setEmpShift] = useState<string>();
  const [deptId, setDeptId] = useState<string>();
  const [zone, setZone] = useState<string>();
  const [datetime, setDatetime] = useState<string>();

  const [selectImage, setSelectImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, response, error, uploadData } = useUploadData();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (empId && empshift && deptId && zone && datetime && selectImage) {
      if (typeof datetime === 'string') {
        const dateParts = datetime.split(' ');

        const uploadProps = {
          empId,
          empshift,
          deptId,
          zone,
          date: dateParts[0],
          arrived_time: dateParts[1],
          image: selectImage!,
        };

        await uploadData(uploadProps);
      } else {
        console.error('Datetime is not a valid string');
      }
    } else {
      console.error('Some fields are missing');
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
        <Input
          variant="faded"
          label="EmpId"
          className="mb-4 p-2 "
          classNames={{
            inputWrapper: 'border border-[#2f3037] bg-[#191a24]',
          }}
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
        />
        <div className="flex flex-wrap">
          <div className="w-1/2 p-2">
            <Select
              label="EmpShift"
              variant="faded"
              classNames={{
                mainWrapper: 'h-full',
                trigger: 'h-full border border-[#2f3037] bg-[#191a24]',
                popover: 'border border-[#2f3037] bg-[#191a24]',
              }}
              value={empshift}
              onChange={(event) => {
                setEmpShift(event.target.value);
              }}
            >
              {EmpShiftSelect.map((shift) => (
                <SelectItem key={shift.value} value={shift.value}>
                  {shift.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-1/2 p-2">
            <Select
              label="DeptId"
              variant="faded"
              classNames={{
                mainWrapper: 'h-full',
                trigger: 'h-full border border-[#2f3037] bg-[#191a24]',
                popover: 'border border-[#2f3037] bg-[#191a24]',
              }}
              value={deptId}
              onChange={(event) => setDeptId(event.target.value)}
            >
              {DepIdSelect.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-1/2 p-2">
            <Select
              label="Zone"
              variant="faded"
              classNames={{
                mainWrapper: 'h-full',
                trigger: 'h-full border border-[#2f3037] bg-[#191a24]',
                popover: 'border border-[#2f3037] bg-[#191a24]',
              }}
              value={zone}
              onChange={(event) => setZone(event.target.value)}
            >
              {ZoneSelect.map((z) => (
                <SelectItem key={z.value} value={z.value}>
                  {z.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-1/2 p-2">
            <Select
              label="Datetime"
              variant="faded"
              classNames={{
                mainWrapper: 'h-full',
                trigger: 'h-full border border-[#2f3037] bg-[#191a24]',
                popover: 'border border-[#2f3037] bg-[#191a24]',
              }}
              value={datetime}
              onChange={(event) => setDatetime(event.target.value)}
            >
              {DatetimeSelect.map((dt) => (
                <SelectItem key={dt.value} value={dt.value}>
                  {dt.label}
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

          <Button color="default" variant="faded" onClick={handleSubmit}>
            Post
          </Button>
        </div>
        <div className="flex justify-center items-center mt-4 mb-4 h-70">
          {selectImage && (
            <div className="w-70 h-70 flex justify-center items-center ">
              <Image
                src={URL.createObjectURL(selectImage)}
                alt="Uploaded preview"
                className="h-70 w-70  rounded object-cover flex justify-center items-center"
                width={400}
                height={500}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
