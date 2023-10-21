import Wrapper from '@/components/Attendance/Wrapper';
import { getDictionary } from '../dictionaries';

export default async function AttendancePage({
  searchParams,
  params: { lang },
}: {
  searchParams: any;
  params: any;
}) {
  const dict = await getDictionary(lang);

  return <Wrapper searchParams={searchParams} dict={dict} />;
}
