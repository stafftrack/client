import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}

export default function CustomTable({ data }: { data: any[] }) {
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
        <TableColumn className="w-20">Zone</TableColumn>
        <TableColumn className="w-32">Department</TableColumn>
        <TableColumn className="w-20">Shift</TableColumn>
        <TableColumn className="w-20">Time</TableColumn>
        <TableColumn className="w-20">Date</TableColumn>
        <TableColumn className="w-32">Contrabands</TableColumn>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.EmpId}</TableCell>
              <TableCell>{d.Zone}</TableCell>
              <TableCell>{d.DeptId}</TableCell>
              <TableCell>{d.EmpShift}</TableCell>
              <TableCell>{formatTime(d.time)}</TableCell>
              <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
              <TableCell
                className="flex min-h-unit-10 cursor-pointer flex-wrap gap-2"
                onClick={() => {
                  alert('show image');
                }}
              >
                {d.contraband.electronic_device ? (
                  <Chip variant="dot" classNames={{ dot: 'bg-[#f38ba8]' }}>
                    {d.contraband?.electronic_device}
                  </Chip>
                ) : null}
                {d.contraband.laptop ? (
                  <Chip variant="dot" classNames={{ dot: 'bg-[#f9e2af]' }}>
                    {d.contraband?.laptop}
                  </Chip>
                ) : null}
                {d.contraband.scissors ? (
                  <Chip variant="dot" classNames={{ dot: 'bg-[#94e2d5]' }}>
                    {d.contraband?.scissors}
                  </Chip>
                ) : null}
                {d.contraband.knife ? (
                  <Chip variant="dot" classNames={{ dot: 'bg-[#74c7ec]' }}>
                    {d.contraband?.knife}
                  </Chip>
                ) : null}
                {d.contraband.gun ? (
                  <Chip variant="dot" classNames={{ dot: 'bg-[#b4befe]' }}>
                    {d.contraband?.gun}
                  </Chip>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
