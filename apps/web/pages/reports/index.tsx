import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import { IMyModulesAttendanceRes } from '@truesign/types';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import useSWR from 'swr';

const ReportsPage: FunctionComponent = () => {
  const router = useRouter();
  const { data, isLoading } = useSWR<IMyModulesAttendanceRes>(
    '/attendance/my',
    (url) => Fetcher.get(url)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Received data is empty</div>;
  }

  return (
    <Accordion>
      {data.data.map((module) => (
        <AccordionItem key={module._id}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {module.moduleId} {module.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>

          <AccordionPanel>
            {module.attendances.length === 0 && (
              <Box>No attendance records found</Box>
            )}

            <TableContainer>
              <Table>
                {module.attendances.length !== 0 && (
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                )}

                <Tbody>
                  {module.attendances.map((attendance) => (
                    <Tr key={attendance._id}>
                      <Th>{new Date(attendance.date).toDateString()}</Th>
                      <Th>
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => {
                            router.push(`/reports/${attendance._id}`);
                          }}
                        >
                          View
                        </Button>
                      </Th>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ReportsPage;
