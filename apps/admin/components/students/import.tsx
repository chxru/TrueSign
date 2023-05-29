import { Box, Button, Container, Heading } from '@chakra-ui/react';
import { useRef } from 'react';
import { parse } from 'papaparse';
import { Fetcher } from '@truesign/frontend';
import { ICreateStudentRes } from '@truesign/types';

export const ImportStudent = () => {
  const inputRef = useRef<HTMLInputElement>();

  const handleInput = (files: FileList) => {
    const file = files[0];
    parse(file, {
      skipEmptyLines: true,
      header: true,
      complete: async (results) => {
        if (results.errors.length) {
          console.warn(results.errors);
          return;
        }

        try {
          const res = await Fetcher.post<ICreateStudentRes>(
            '/students/create',
            {
              students: results.data,
            }
          );

          if (typeof res === 'object') {
            console.warn(res.message, res.data);
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <Container>
      <Heading size={'lg'}>Import CSV</Heading>

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
