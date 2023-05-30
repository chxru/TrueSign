import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import { IGetModulesRes } from '@truesign/types';
import { useEffect } from 'react';
import useSWR from 'swr';

interface CardProps {
  name: string;
  id: string;
}

const Card = (props: CardProps) => {
  return (
    <Container shadow={'sm'} px={2} py={4} rounded={'xl'}>
      <Text fontSize={'xl'}>{props.name}</Text>
      <Text>{props.id}</Text>

      <HStack mt={4}>
        <Button>Generate Attendance Sheet</Button>
        <Button>Import Students</Button>
      </HStack>
    </Container>
  );
};

export const ViewModules = () => {
  const { data, isLoading, error } = useSWR<IGetModulesRes>(
    '/modules/',
    (url) => Fetcher.get(url)
  );
  const toast = useToast();

  useEffect(() => {
    if (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error occurred while fetching modules',
          description: error.message,
          status: 'error',
        });
      } else {
        toast({
          title: 'Error occurred while fetching modules',
          description: error,
          status: 'error',
        });
      }
    }
  }, [toast, error]);

  return (
    <Container>
      <Heading size={'lg'}>My Modules</Heading>

      {isLoading && <Text>Loading...</Text>}

      {data &&
        data.modules.map((module) => (
          <Card key={module.id} name={module.name} id={module.moduleId} />
        ))}
    </Container>
  );
};
