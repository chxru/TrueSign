import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import { ICreateInviteRes } from '@truesign/types';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useState } from 'react';
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
  const [requestInProgress, setRequestInProgress] = useState(false);
  const toast = useToast();

  const formik = useFormik<formType>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'staff',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      setRequestInProgress(true);

      try {
        await Fetcher.post<ICreateInviteRes>('/invites/create', values);
        actions.resetForm();

        toast({
          title: 'Invite sent',
          description: `An invite has been sent to ${values.email}`,
          status: 'success',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
        });
      } finally {
        setRequestInProgress(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Invite Staff</title>
      </Head>

      <Container>
        <Heading size="lg">Invite Staff</Heading>

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

            <Button
              type="submit"
              colorScheme={'teal'}
              width="full"
              isLoading={requestInProgress}
            >
              Invite
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default InvitePage;
