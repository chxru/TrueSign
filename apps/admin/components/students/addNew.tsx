import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import { ICreateStudentRes } from '@truesign/types';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const schema = z.object({
  studentId: z.string(),
  name: z.string(),
  email: z.string().email(),
});
const validationSchema = toFormikValidationSchema(schema);
type formType = z.infer<typeof schema>;

export const AddNewStudent = () => {
  const formik = useFormik<formType>({
    initialValues: {
      email: '',
      name: '',
      studentId: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        const res = await Fetcher.post<ICreateStudentRes>('/students/create', {
          students: [{ ...values, studentId: values.studentId.toLowerCase() }],
        });

        if (typeof res === 'object') {
          console.warn(res.message, res.data);
        }

        actions.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Container>
      <Heading size={'lg'}>Add New</Heading>

      <Box mt={8}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            mb={4}
            isRequired
            isInvalid={
              formik.touched.studentId && formik.errors.studentId !== ''
            }
          >
            <FormLabel htmlFor="studentId">Student ID</FormLabel>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.studentId}
            />
            <FormErrorMessage>{formik.errors.studentId}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb={4}
            isRequired
            isInvalid={formik.touched.email && formik.errors.email !== ''}
          >
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb={4}
            isRequired
            isInvalid={formik.touched.name && formik.errors.name !== ''}
          >
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme={'teal'} width={'full'}>
            Add Student
          </Button>
        </form>
      </Box>
    </Container>
  );
};
