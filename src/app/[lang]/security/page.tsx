import Wrapper from '@/components/Security/Wrapper';
import { getDictionary } from '../dictionaries';

export default async function SecurityPage({
  searchParams,
  params: { lang },
}: {
  searchParams: any;
  params: any;
}) {
  const dict = await getDictionary(lang);

  return <Wrapper searchParams={searchParams} dict={dict} />;
}
