import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import {
  IAddStudentsToModuleRes,
  IGetModulesRes,
  IStudent,
} from '@truesign/types';
import { parse } from 'papaparse';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

interface CardProps {
  name: string;
  id: string;
}

const Card = (props: CardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleInput = (files: FileList) => {
    const file = files[0];
    parse<Pick<IStudent, 'studentId'>>(file, {
      skipEmptyLines: true,
      header: true,
      complete: async (results) => {
        if (results.errors.length) {
          toast({
            title: 'Cannot parse CSV',
            status: 'error',
          });

          console.warn(results.errors);
          return;
        }

        const ids = results.data.map((r) => r.studentId.toLowerCase());

        try {
          const res = await Fetcher.post<IAddStudentsToModuleRes>(
            `/modules/${props.id}/students`,
            {
              students: ids,
            }
          );

          if (typeof res === 'object') {
            toast({
              title: 'Few imports failed',
              description:
                res.data.reduce((a, b) => `${a}, ${b}`) +
                ' failed to import because they are not imported as students',
              status: 'warning',
            });
          } else {
            toast({
              title: 'Students added',
              status: 'success',
              isClosable: true,
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            toast({
              title: 'Error occurred while adding',
              description: error.message,
              status: 'error',
            });
          } else {
            toast({
              title: 'Unknown error occurred while adding students',
              description: 'Check console or contact admin',
              status: 'error',
            });
          }
        }
      },
    });
  };

  return (
    <Container shadow={'sm'} px={2} py={4} rounded={'xl'}>
      <Text fontSize={'xl'}>{props.name}</Text>
      <Text>{props.id}</Text>

      <HStack mt={4}>
        <Button>Generate Attendance Sheet</Button>
        <Button onClick={() => inputRef.current.click()}>
          Import Students
        </Button>
        <input
          ref={inputRef}
          type="file"
          name={props.id + 'csv'}
          id={props.id + 'csv'}
          onChange={(e) => {
            handleInput(e.target.files);
          }}
          style={{ display: 'none' }}
        />
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
