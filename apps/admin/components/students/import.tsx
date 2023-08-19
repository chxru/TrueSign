import { Box, Button, Container, Heading, useToast } from '@chakra-ui/react';
import { FunctionComponent, useRef } from 'react';
import { parse } from 'papaparse';
import { Fetcher } from '@truesign/frontend';
import { ICreateStudentRes, IStudent } from '@truesign/types';
import { useStudentImportStore } from 'apps/admin/store/studentImport.store';

interface ImportStudentsProp {
  heading?: string;
}

export const ImportStudent: FunctionComponent<ImportStudentsProp> = ({
  heading,
}) => {
  const inputRef = useRef<HTMLInputElement>();
  const toast = useToast();
  const store = useStudentImportStore();

  const handleInput = (files: FileList) => {
    const file = files[0];
    parse<IStudent>(file, {
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

        store.importStudents(
          results.data.map((r) => ({
            ...r,
            studentId: r.studentId.toLowerCase(),
            status: 'imported',
          }))
        );

        return;

        try {
          const res = await Fetcher.post<ICreateStudentRes>(
            '/students/create',
            {
              students: results.data.map((r) => ({
                ...r,
                studentId: r.studentId.toLowerCase(),
              })),
            }
          );

          if (typeof res === 'object') {
            toast({
              title: 'Few imports failed',
              description:
                res.data.reduce((a, b) => `${a}, ${b}`) +
                ' failed to import due to duplicate student ids',
              status: 'warning',
            });
          } else {
            toast({
              title: 'Students created',
              status: 'success',
              isClosable: true,
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            toast({
              title: 'Error occurred while creating student',
              description: error.message,
              status: 'error',
            });
          } else {
            toast({
              title: 'Unknown error occurred while creating students',
              description: 'Check console or contact admin',
              status: 'error',
            });
          }
        }
      },
    });
  };

  return (
    <Container>
      <Heading size={'lg'}>{heading || 'Import CSV'}</Heading>

      <Box mt={8}>
        <input
          ref={inputRef}
          type="file"
          name="csv"
          id="csv"
          accept=".csv"
          style={{
            display: 'none',
          }}
          onChange={(e) => {
            handleInput(e.target.files);
          }}
        />

        <Button
          colorScheme={'teal'}
          onClick={() => {
            inputRef.current.click();
          }}
        >
          Upload File
        </Button>
      </Box>
    </Container>
  );
};
