import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';

type ContrabandChipProps = {
  contraband: 'Yes' | 'No' | string;
};
type StatusChipProps = {
  status: 'On Time' | 'Late' | 'Early' | string;
};

function ContrabandChip({ contraband: has_contraband }: ContrabandChipProps) {
  if (has_contraband) {
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

function StatusChip({ status }: StatusChipProps) {
  if (status === 'On Time') {
    return (
      <Chip color="success" variant="bordered">
        On time
      </Chip>
    );
  }
  if (status === 'Late') {
    return (
      <Chip color="warning" variant="bordered">
        Late
      </Chip>
    );
  }
  if (status === 'Early') {
    return (
      <Chip className="border-[#0070F0] text-[#0070F0]" variant="bordered">
        Early
      </Chip>
    );
  }
  return (
    <Chip color="default" variant="bordered">
      Unknown
    </Chip>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}

export default function CustomTable({ data }: { data: any[] }) {
  return (
    <Table
      classNames={{
        wrapper:
          'w-full table-fixed max-h-[35rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
        th: 'text-base text-white bg-[#191a24]',
        td: 'border-y border-y-[#2f3037]',
      }}
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn>EmpId</TableColumn>
        <TableColumn>EmpShift</TableColumn>
        <TableColumn>DeptId</TableColumn>
        <TableColumn>Zone</TableColumn>
        <TableColumn>Time</TableColumn>
        <TableColumn>Date</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Contraband</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.EmpId}</TableCell>
            <TableCell>{d.EmpShift}</TableCell>
            <TableCell>{d.DeptId}</TableCell>
            <TableCell>{d.Zone}</TableCell>
            <TableCell>{formatTime(d.time)}</TableCell>
            <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <StatusChip status={d.status} />
            </TableCell>
            <TableCell>
              <ContrabandChip contraband={d.has_contraband} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
