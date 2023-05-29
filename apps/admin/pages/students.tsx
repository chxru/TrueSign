import React from 'react';
import type { NextPage } from 'next';
import { Divider } from '@chakra-ui/react';
import { AddNewStudent } from '../components/students/addNew';

const StudentsPage: NextPage = () => {
  return (
    <>
      <AddNewStudent />

      <Divider my={4} />
    </>
  );
};

export default StudentsPage;
