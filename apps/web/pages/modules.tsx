import { Divider } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { AddNewModule } from '../components/modules/create';
import { ViewModules } from '../components/modules/view';

const ModulesPage: NextPage = () => {
  return (
    <>
      <AddNewModule />

      <Divider my={4} />

      <ViewModules />
    </>
  );
};

export default ModulesPage;
