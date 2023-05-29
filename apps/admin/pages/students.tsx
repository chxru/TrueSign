import React from 'react';
import type { NextPage } from 'next';
import { Divider } from '@chakra-ui/react';
import { AddNewStudent } from '../components/students/addNew';
import { ImportStudent } from '../components/students/import';

const StudentsPage: NextPage = () => {
  return (
    <>
      <AddNewStudent />

      <Divider my={4} />

      <ImportStudent />
    </>
  );
};

export default StudentsPage;
