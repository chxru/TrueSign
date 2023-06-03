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
import { useFormik } from 'formik';
import { useSWRConfig } from 'swr';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const schema = z.object({
  name: z.string(),
  moduleId: z.string(),
});
const validationSchema = toFormikValidationSchema(schema);
type formType = z.infer<typeof schema>;

export const AddNewModule = () => {
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const formik = useFormik<formType>({
    initialValues: {
      name: '',
      moduleId: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        await Fetcher.post('/modules/create', {
          name: values.name,
          moduleId: values.moduleId.toLowerCase(),
        });

        mutate('/modules/');

        toast({
          title: 'Module created',
          status: 'success',
        });
        actions.resetForm();
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Error occurred while creating module',
            description: error.message,
            status: 'error',
          });
        } else {
          toast({
            title: 'Error occurred while creating module',
            description: error,
            status: 'error',
          });
        }
      }
    },
  });

  return (
    <Container>
      <Heading size={'lg'}>Create New Module</Heading>

      <Box mt={8}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            mb={4}
            isRequired
            isInvalid={!!formik.errors.moduleId && formik.touched.moduleId}
          >
            <FormLabel htmlFor={'moduleId'}>Module ID</FormLabel>
            <Input
              id="moduleId"
              name="moduleId"
              type="text"
              variant={'filled'}
              placeholder="Module ID"
              onChange={formik.handleChange}
              value={formik.values.moduleId}
            />
            <FormErrorMessage>{formik.errors.moduleId}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb={4}
            isRequired
            isInvalid={!!formik.errors.name && formik.touched.name}
          >
            <FormLabel htmlFor={'name'}>Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              variant={'filled'}
              placeholder="Module Name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme={'teal'} width={'full'}>
            Create Module
          </Button>
        </form>
      </Box>
    </Container>
  );
};
