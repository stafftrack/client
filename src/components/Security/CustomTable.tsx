import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalBody,
  Image,
  ModalFooter,
} from '@nextui-org/react';
import { useState } from 'react';
import ContrabandChips from './ContrabandChips';

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  return `${parseInt(hours, 10)}:${minutes}`;
}

export default function CustomTable({
  data,
  onClickRow,
  dict,
}: {
  data: any[];
  onClickRow: any;
  dict: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState('');
  const [contraband, setContraband] = useState();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        backdrop="blur"
        className="bg-primary"
      >
        <ModalContent>
          <ModalHeader className="mx-auto">{dict.preview.header}{/* Image */}</ModalHeader>
          <ModalBody className="min-h-unit-20">
            <Image
              alt="x ray image"
              src={`http://127.0.0.1:3000/${image}`}
            />
          </ModalBody>
          <ModalFooter className="flex flex-wrap justify-center gap-3">
            <ContrabandChips displayText contraband={contraband} />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Table
        aria-label="Table with employee security data"
        isHeaderSticky
        classNames={{
          wrapper:
            'w-full table-fixed max-h-[39.5rem] border border-[#2f3037] rounded-md p-0 mb-5 bg-[#191a24] text-white',
          th: 'text-base text-white bg-[#191a24]',
          td: 'border-y border-y-[#2f3037]',
          tr: 'hover:bg-[#1f212d] transition-all',
        }}
      >
        <TableHeader>
          <TableColumn className="w-32">{dict.common.empid}</TableColumn>
          <TableColumn className="w-20">{dict.common.zone}</TableColumn>
          <TableColumn className="w-32">{dict.common.department}</TableColumn>
          <TableColumn className="w-20">{dict.common.shift}</TableColumn>
          <TableColumn className="w-20">{dict.common.time}</TableColumn>
          <TableColumn className="w-20">{dict.common.date}</TableColumn>
          <TableColumn className="w-32">{dict.common.contraband}</TableColumn>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((d) => (
              <TableRow key={d.id}>
                <TableCell onClick={()=>onClickRow(d.EmpId)} className='cursor-pointer'>{d.EmpId}</TableCell>
                <TableCell>{d.Zone}</TableCell>
                <TableCell>{d.DeptId}</TableCell>
                <TableCell>{d.EmpShift}</TableCell>
                <TableCell>{formatTime(d.time)}</TableCell>
                <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
                <TableCell
                  className="flex min-h-unit-10 cursor-pointer flex-wrap gap-2"
                  onClick={() => {
                    onOpen();
                    setImage(d.Img);
                    setContraband(d.contraband);
                  }}
                >
                  {d.contraband ? (
                    <ContrabandChips
                      displayText={false}
                      contraband={d.contraband}
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
