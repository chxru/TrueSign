import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import Head from 'next/head';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().max(20),
  lastName: z.string().max(20),
  role: z.enum(['student', 'staff']),
});
const validationSchema = toFormikValidationSchema(schema);
type formType = z.infer<typeof schema>;

const InvitePage = () => {
  const formik = useFormik<formType>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'student',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <Head>
        <title>Invite User</title>
      </Head>

      <Container>
        <Heading size="lg">Invite User</Heading>

        <Box mt={8}>
          <form onSubmit={formik.handleSubmit}>
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
              isInvalid={
                formik.touched.firstName && formik.errors.firstName !== ''
              }
            >
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
              <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl
              mb={4}
              isRequired
              isInvalid={
                formik.touched.lastName && formik.errors.lastName !== ''
              }
            >
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
              <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
            </FormControl>

            <FormControl as={'fieldset'} mb={8} isRequired>
              <FormLabel as={'legend'} htmlFor={null}>
                User Role
              </FormLabel>

              <RadioGroup
                defaultValue={formik.initialValues.role}
                onChange={formik.handleChange}
              >
                <HStack spacing="24px">
                  <Radio value="staff">Staff</Radio>
                  <Radio value="student">Student</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <Button type="submit" colorScheme={'teal'} width="full">
              Invite User
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default InvitePage;
