import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { useStudentImportStore } from 'apps/admin/store/studentImport.store';
import { FunctionComponent } from 'react';

const ImportTable: FunctionComponent = () => {
  const store = useStudentImportStore();

  return (
    <TableContainer my={8}>
      <Table variant="simple">
        <TableCaption>Imported Students</TableCaption>
        <Thead>
          <Tr>
            <Th>Registration Number</Th>
            <Th>Name</Th>
            <Th isNumeric>Email</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>

        {store.students.map((student) => (
          <Tbody key={student.studentId}>
            <Tr>
              <Td>{student.studentId}</Td>
              <Td>{student.name}</Td>
              <Td isNumeric>{student.email}</Td>
              <Td>{student.status}</Td>
            </Tr>
          </Tbody>
        ))}
      </Table>
    </TableContainer>
  );
};

export default ImportTable;
