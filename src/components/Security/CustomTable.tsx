import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import { DataRow } from '@/types';

type ContrabandChipProps = {
  contraband: 'Yes' | 'No' | string; // 其他可能的值也可以在此添加
};

function ContrabandChip({ contraband }: ContrabandChipProps) {
  if (contraband === 'Yes') {
    return (
      <Chip color="danger" variant="bordered">
        Yes
      </Chip>
    );
  }
  return (
    <Chip color="default" variant="bordered">
      No
    </Chip>
  );
}

export default function CustomTable({ data }: { data: DataRow[] }) {
  return (
    <Table
      aria-label="Table with employee security data"
      isHeaderSticky
      classNames={{
        wrapper:
          'w-full table-fixed max-h-[39.5rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
        th: 'text-base text-white bg-[#191a24]',
        td: 'border-y border-y-[#2f3037]',
      }}
    >
      <TableHeader>
        <TableColumn className="w-32">Employee</TableColumn>
        <TableColumn className="w-20">Shift</TableColumn>
        <TableColumn className="w-32">Department</TableColumn>
        <TableColumn className="w-20">Zone</TableColumn>
        <TableColumn className="w-32">Date Time</TableColumn>
        <TableColumn className="w-32">Contrabands</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.EmpId}</TableCell>
            <TableCell>{d.EmpShift}</TableCell>
            <TableCell>{d.DeptId}</TableCell>
            <TableCell>{d.Zone}</TableCell>
            <TableCell>{d.DateTime}</TableCell>
            <TableCell>
              <ContrabandChip contraband="No" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
