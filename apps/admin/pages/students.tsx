import { Button } from '@chakra-ui/react';
import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const StudentsPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Button
        colorScheme={'teal'}
        onClick={() => {
          router.push('/students/new_intake');
        }}
      >
        NEW BATCH IS HERE SJHKDFNS
      </Button>
    </>
  );
};

export default StudentsPage;
