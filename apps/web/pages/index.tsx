import {
  Center,
  Button,
  FormControl,
  FormLabel,
  Input,
  Card,
  CardHeader,
  Heading,
  CardBody,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useDropzone } from 'react-dropzone';

interface IForm {
  moduleName: string;
  hours: number;
}

export function Index() {
  const initialValues: IForm = {
    moduleName: '',
    hours: 1,
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const handleImageUpload = async (
    form: IForm,
    actions: FormikHelpers<IForm>
  ) => {
    if (acceptedFiles.length === 0) {
      actions.setSubmitting(false);

      // TODO: show error message
      return;
    }

    const formData = new FormData();
    formData.append('image', acceptedFiles[0]);
    formData.append('moduleName', form.moduleName);
    formData.append('hours', form.hours.toString());

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      actions.setStatus({ success: true });
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      actions.setSubmitting(false);
    }
  };

  return (
    <Center height={'100vh'}>
      <Card direction={'column'}>
        <CardHeader>
          <Heading size="md">Upload the attendance sheet</Heading>
        </CardHeader>

        <CardBody>
          <Formik initialValues={initialValues} onSubmit={handleImageUpload}>
            {(props) => (
              <Form>
                <Field name="moduleName">
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Module Name</FormLabel>
                      <Input {...field} type="text" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="hours">
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Number of hours</FormLabel>
                      <Input {...field} type="number" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <FormControl>
                  <FormLabel>Upload sign sheets</FormLabel>
                  <Center
                    height={'150px'}
                    paddingX={'50px'}
                    cursor={'pointer'}
                    {...getRootProps({ className: 'dropzone' })}
                  >
                    <input {...getInputProps()} />
                    {acceptedFiles.length ? (
                      acceptedFiles[0].name
                    ) : (
                      <p>Drag and drop images, or click to select files</p>
                    )}
                  </Center>
                </FormControl>

                <Center>
                  <Button
                    mt={4}
                    colorScheme={'teal'}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Upload
                  </Button>
                </Center>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Center>
  );
}

export default Index;
