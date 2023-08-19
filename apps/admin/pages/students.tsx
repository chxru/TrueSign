import { Button, Divider } from '@chakra-ui/react';
import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AddNewStudent } from '../components/students/addNew';
import { ImportStudent } from '../components/students/import';

const StudentsPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <AddNewStudent />

      <Divider my={4} />

      <ImportStudent />

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
