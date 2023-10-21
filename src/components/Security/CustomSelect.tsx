import { Input, Select, SelectItem } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';

export default function CustomSelect({
  state,
  onChange,
  searchParams,
}: {
  state: any;
  onChange: any;
  searchParams: any;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      label={state.label}
      key={state.label}
      variant="bordered"
      selectedKeys={[state.value]}
      onChange={(e) => {
        onChange({ ...state, value: e.target.value });
        const newSearchParams = new URLSearchParams(searchParams);
        if (e.target.value !== 'All') {
          newSearchParams.set(state.label, e.target.value);
        } else {
          newSearchParams.delete(state.label);
        }
        router.push(`${pathname}?${newSearchParams.toString()}`);
      }}
      classNames={{
        mainWrapper: 'h-full',
        trigger: 'h-full border border-[#2f3037] bg-[#191a24]',
        popover: 'border border-[#2f3037] bg-[#191a24]',
      }}
    >
      {state.values.map((value: any) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      ))}
    </Select>
  );
}
