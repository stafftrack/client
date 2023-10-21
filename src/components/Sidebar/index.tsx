'use client';

import { usePathname } from 'next/navigation';
import Attendance from '../icons/Attendance';
import Home from '../icons/Home';
import Security from '../icons/Security';
import Tab from './Tab';
import Upload from '../icons/Upload';

export default function Sidebar({ dict, lang }: { dict: any; lang: any }) {
  const currentPage = usePathname();

  return (
    <div className="h-screen w-72 flex-shrink-0 border-r border-r-[#27282E] text-4xl font-bold text-white">
      <h1 className="mb-14 mt-5 text-center">stafftrack</h1>
      <div className="flex w-full flex-col items-center">
        <Tab link={`/${lang}`} isSelected={currentPage === `/${lang}`}>
          <Home />
          {dict.sidebar.home}
        </Tab>
        <Tab
          link={`/${lang}/security`}
          isSelected={currentPage === `/${lang}/security`}
        >
          <Security />
          {dict.sidebar.security}
        </Tab>
        <Tab
          link={`/${lang}/attendance`}
          isSelected={currentPage === `/${lang}/attendance`}
        >
          <Attendance />
          {dict.sidebar.attendance}
        </Tab>
        <Tab
          link={`/${lang}/upload`}
          isSelected={currentPage === `/${lang}/upload`}
        >
          <Upload />
          {dict.sidebar.upload}
        </Tab>
      </div>
    </div>
  );
}
