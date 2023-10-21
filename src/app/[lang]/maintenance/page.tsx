import Wrapper from '@/components/Maintenance/Wrapper';
import { getDictionary } from '../dictionaries';

export default async function MaintenancePage({
  searchParams,
  params: { lang },
}: {
  searchParams: any;
  params: any;
}) {
  const dict = await getDictionary(lang);

  return <Wrapper searchParams={searchParams} dict={dict} />;
}
