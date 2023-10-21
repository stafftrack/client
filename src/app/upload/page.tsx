/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useRef } from 'react';
import { Image, Input, Select, SelectItem, Button } from '@nextui-org/react';

import useUploadData from '@/hooks/useUoloadData';

export default function UploadPage() {
  const [empId, setEmpId] = useState<string>('');
  const [shift, setShift] = useState<string>();
  const [deptId, setDeptId] = useState<string>();
  const [zone, setZone] = useState<string>();
  const [datetime, setDatetime] = useState<string>();
  const [toolscantime, setToolscantime] = useState<string>('');
  const [selectImage, setSelectImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, response, error, uploadData } = useUploadData();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (
      empId &&
      shift &&
      deptId &&
      zone &&
      datetime &&
      toolscantime &&
      selectImage
    ) {
      if (typeof datetime === 'string') {
        const dateParts = datetime.split(' ');

        const uploadProps = {
          empId,
          shift,
          empshift: shift, // This might be redundant if "shift" is what you actually need
          deptId,
          zone,
          date: dateParts[0],
          arrived_time: dateParts[1],
          image: selectImage!,
          ToolScanTime: parseFloat(toolscantime),
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
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex h-[260px] w-[500px] flex-col  items-center justify-center   border border-[#30303E]">
        <div className="flex flex-wrap">
          <div className="w-1/2 p-2">
            <Input
              variant="faded"
              label="EmpId"
              classNames={{
                inputWrapper: 'border border-[#2f3037] bg-[#191a24] h-full',
              }}
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
            />
          </div>
          <div className="w-1/2 p-2">
            <Input
              variant="faded"
              label="ToolScanTime"
              classNames={{
                inputWrapper: 'border border-[#2f3037] bg-[#191a24] h-full',
              }}
              value={toolscantime}
              onChange={(e) => setToolscantime(e.target.value)}
            />
          </div>
          <div className="w-1/2 p-2">
            <Select
              label="EmpShift"
              variant="faded"
              classNames={{
                mainWrapper: 'h-full',
                trigger: 'h-full border border-[#2f3037] bg-[#191a24]',
                popover: 'border border-[#2f3037] bg-[#191a24]',
              }}
              value={shift}
              onChange={(event) => {
                setShift(event.target.value);
              }}
            >
              {EmpShiftSelect.map((empshift) => (
                <SelectItem key={empshift.value} value={empshift.value}>
                  {empshift.label}
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
        <div className="w-full flex justify-between p-2">
          <div >
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
          </div>

          <Button color="default" variant="faded" onClick={handleSubmit} >
            Post
          </Button>
        </div>
      </div>
      <div className="h-70 mb-4 ml-6 mt-4 flex items-center justify-center">
        {selectImage && (
          <div className="flex h-[260px] items-center justify-center  overflow-hidden bg-[#15151e]">
            {selectImage && (
              <Image
                src={URL.createObjectURL(selectImage)}
                alt="Uploaded preview"
                className=" w-70  object-fit: contain flex items-center justify-center rounded"
                width={300}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
