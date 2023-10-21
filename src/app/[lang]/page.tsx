'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import FilterBar from '@/components/Home/FilterBar';
import CustomTable from '@/components/Home/CustomTable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function App({
  searchParams,
  params: { lang },
}: {
  searchParams: any;
  params: any;
}) {
  const [data, setData] = useState<any[]>([]);
  return (
    <div className="flex w-full flex-col gap-5 px-10 pt-10">
      <FilterBar
        searchParams={searchParams}
        supabase={supabase}
        setData={setData}
      />
      <CustomTable data={data} />
    </div>
  );
}
