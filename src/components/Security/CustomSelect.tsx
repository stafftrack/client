import { Select, SelectItem } from '@nextui-org/react';

export default function CustomSelect({
  state,
  onChange,
}: {
  state: any;
  onChange: any;
}) {
  return (
    <Select
      label={state.label}
      key={state.label}
      variant="bordered"
      selectedKeys={[state.value]}
      onChange={(e) => {
        onChange({ ...state, value: e.target.value });
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
