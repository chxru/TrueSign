import {
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Divider,
  Box,
  Stepper,
} from '@chakra-ui/react';
import { useStudentImportStore } from 'apps/admin/store/studentImport.store';
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';

export const steps = [
  { title: 'First', description: 'Student Details' },
  { title: 'Second', description: 'Download Template' },
  { title: 'Third', description: 'Reference Signatures' },
  { title: 'Fourth', description: 'Done' },
];

interface StepperProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const IntakeStepper: FunctionComponent<StepperProps> = ({
  activeStep,
  setActiveStep,
}) => {
  const store = useStudentImportStore();

  useEffect(() => {
    if (store.students.length) {
      if (activeStep == 1) {
        setActiveStep(2);
      }
    }
  }, [activeStep, setActiveStep, store.students]);

  return (
    <>
      <Stepper index={activeStep} my={8} px={16}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Divider mb={8} />
    </>
  );
};

export default IntakeStepper;
