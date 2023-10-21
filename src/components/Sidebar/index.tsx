'use client';

import { usePathname } from 'next/navigation';
import Attendance from '../icons/Attendance';
import Home from '../icons/Home';
import Security from '../icons/Security';
import Tab from './Tab';
import Upload from '../icons/Upload';

export default function Sidebar({ dict }: { dict: any }) {
  const currentPage = usePathname();

  return (
    <div className="h-screen w-72 flex-shrink-0 border-r border-r-[#27282E] text-4xl font-bold text-white">
      <h1 className="mb-14 mt-5 text-center">stafftrack</h1>
      <div className="flex w-full flex-col items-center">
        <Tab link="/" isSelected={currentPage === '/'}>
          <Home />
          {dict.sidebar.home}
        </Tab>
        <Tab link="security" isSelected={currentPage === '/security'}>
          <Security />
          {dict.sidebar.security}
        </Tab>
        <Tab link="attendance" isSelected={currentPage === '/attendance'}>
          <Attendance />
          {dict.sidebar.attendance}
        </Tab>
        <Tab link="upload" isSelected={currentPage === '/upload'}>
          <Upload />
          {dict.sidebar.upload}
        </Tab>
      </div>
    </div>
  );
}
