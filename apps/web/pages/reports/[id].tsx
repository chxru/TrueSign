import {
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
  Container,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { Pie } from 'react-chartjs-2';

import SignatureConfirmCard from '../../components/attendance/confirm.card';

ChartJS.register(ArcElement, Tooltip, Legend);

const attendance = {
  verified: 29,
  pending: 4,
  absent: 8,
  forged: 9,
  total: 50,
};

const data = {
  labels: ['Verified', 'Pending', 'Forged', 'Absent'],
  datasets: [
    {
      label: '# of Students',
      data: [
        attendance.verified,
        attendance.pending,
        attendance.forged,
        attendance.absent,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const AttendanceReportPage: FunctionComponent = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Container maxW={'6xl'}>
      <Flex justify={'space-around'}>
        <Flex justify={'center'} align={'center'}>
          <Pie data={data} />
        </Flex>

        <Flex direction={'column'}>
          <Heading size={'lg'}>EE4204 GUI Programming</Heading>
          <Heading size={'md'}>Attendance Report</Heading>

          <Text mt={4}>Report {id}</Text>

          <TableContainer mt={8}>
            <Table variant={'simple'}>
              <Thead>
                <Tr>
                  <Th>Attendance Status</Th>
                  <Th>Number of Students</Th>
                  <Th>Percentage</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Verified</Td>
                  <Td>{attendance.verified}</Td>
                  <Td>
                    {Math.round((attendance.verified / attendance.total) * 100)}
                    %
                  </Td>
                </Tr>
                <Tr>
                  <Td>Pending</Td>
                  <Td>{attendance.pending}</Td>
                  <Td>
                    {Math.round((attendance.pending / attendance.total) * 100)}%
                  </Td>
                </Tr>
                <Tr>
                  <Td>Absent</Td>
                  <Td>{attendance.absent}</Td>
                  <Td>
                    {Math.round((attendance.absent / attendance.total) * 100)}%
                  </Td>
                </Tr>
                <Tr>
                  <Td>Forged</Td>
                  <Td>{attendance.forged}</Td>
                  <Td>
                    {Math.round((attendance.forged / attendance.total) * 100)}%
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>

      <Accordion mt={12}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Pending Signatures ({attendance.pending})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SignatureConfirmCard
              index="eg/2018/3448"
              img1="eg_1023_6736.png"
              img2="eg_1688_8771.png"
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Forged Signatures ({attendance.forged})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SignatureConfirmCard
              index="eg/2018/3448"
              img1="eg_1023_6736.png"
              img2="eg_1688_8771.png"
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Absent Signatures ({attendance.absent})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SignatureConfirmCard
              index="eg/2018/3448"
              img1="eg_1023_6736.png"
              img2="eg_1688_8771.png"
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Verified Signatures ({attendance.verified})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SignatureConfirmCard
              index="eg/2018/3448"
              img1="eg_1023_6736.png"
              img2="eg_1688_8771.png"
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
};

export default AttendanceReportPage;
