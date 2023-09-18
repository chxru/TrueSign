import { Button, Container, Heading, Stack, useSteps } from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import { ImportStudent } from 'apps/admin/components/students/import';
import IntakeStepper, {
  steps,
} from 'apps/admin/components/students/newIntake/stepper.students';
import ImportTable from 'apps/admin/components/students/newIntake/table.students';
import { useStudentImportStore } from 'apps/admin/store/studentImport.store';
import Head from 'next/head';
import { GenerateAttendanceSheet } from 'apps/admin/services/pdf';
import RefSignSheetScanner from 'apps/admin/components/students/newIntake/scanner.students';

const NewIntakePage: FunctionComponent = () => {
  const [downloadBtnClicked, setDownloadBtnClicked] = useState(false);

  const store = useStudentImportStore();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const handleReferenceSheetGen = async () => {
    await GenerateAttendanceSheet(
      'Sign Sheet',
      'Reference',
      store.students
        .map((s) => s.studentId)
        .sort()
        .flatMap((s) => [s, s]) // repeat each cell five times
    );

    setDownloadBtnClicked(true);
  };

  return (
    <>
      <Head>
        <title>New Intake Wizard</title>
      </Head>

      <Container>
        <Heading size="lg">New Intake Wizard</Heading>
      </Container>

      <IntakeStepper activeStep={activeStep} setActiveStep={setActiveStep} />

      {activeStep == 1 && (
        <ImportStudent heading="Upload student data CSV" skipUpload />
      )}

      {activeStep == 2 && (
        <Container>
          <Stack direction={'column'}>
            <Button
              onClick={handleReferenceSheetGen}
              colorScheme={'teal'}
              size={'lg'}
            >
              Download Signature Sheets
            </Button>

            {downloadBtnClicked && (
              <Button onClick={() => setActiveStep(3)}>Next</Button>
            )}
          </Stack>
        </Container>
      )}

      {activeStep == 3 && <RefSignSheetScanner />}

      {store.students.length > 0 && <ImportTable />}
    </>
  );
};

export default NewIntakePage;
