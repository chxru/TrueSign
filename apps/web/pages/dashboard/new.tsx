import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface IForm {
  moduleCode: string;
  date: Date;
  hours: number;
}

interface IDroppedFile {
  url: string;
  name: string;
}

const SideBar = () => {
  const initialValues: IForm = {
    moduleCode: '',
    date: new Date(),
    hours: 1,
  };

  const handleImageUpload = async (
    form: IForm,
    actions: FormikHelpers<IForm>
  ) => {
    console.log(form);
  };

  return (
    <Flex
      direction={'column'}
      justifyContent={'space-between'}
      w={'35%'}
      backgroundColor={'blue.700'}
      color={'white'}
      px={4}
      py={8}
    >
      <Text as="b" fontSize={'2xl'}>
        New Upload
      </Text>

      <Container>
        <Formik initialValues={initialValues} onSubmit={handleImageUpload}>
          {(props) => (
            <Form>
              <Field name="moduleCode">
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

              <Field name="date">
                {({
                  field: { value },
                  form: { setFieldValue, errors, touched },
                }) => (
                  <FormControl
                    isRequired
                    isInvalid={errors.name && touched.name}
                  >
                    <FormLabel>Date</FormLabel>

                    <Container color={'black'} px={0}>
                      <Calendar
                        value={value}
                        onChange={(value) => setFieldValue('date', value)}
                      />
                    </Container>
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

              <Button
                mt={4}
                colorScheme={'teal'}
                isLoading={props.isSubmitting}
                type="submit"
              >
                Upload
              </Button>
            </Form>
          )}
        </Formik>
      </Container>

      <Text>TrueSign</Text>
    </Flex>
  );
};

const ImageCanvas = () => {
  const [images, setImages] = useState<IDroppedFile[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    noClick: true,
    onDropAccepted(files) {
      const arr: IDroppedFile[] = [];

      for (const file of files) {
        const url = URL.createObjectURL(file);
        arr.push({ url, name: file.name });
      }

      setImages((prev) => [...prev, ...arr]);
      console.log(images);
    },
  });

  return (
    <Flex w={'65%'} direction={'column'}>
      <Container
        position={'absolute'}
        height={'100%'}
        zIndex={10}
        {...getRootProps({ className: 'dropzone' })}
      >
        <input {...getInputProps()} />
      </Container>

      <Container height={'100%'}>Canvas</Container>

      <Flex
        direction={'row'}
        wrap={'nowrap'}
        overflowY={'auto'}
        height={'250px'}
      >
        {images.map((img) => (
          <Box key={img.url} border={'2px'} my={'4px'} mx={'2px'}>
            <Image src={img.url} alt={img.name} height={'200px'} />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

const NewUploadPage = () => {
  return (
    <Flex w={'100%'} h={'100vh'}>
      <SideBar />
      <ImageCanvas />
    </Flex>
  );
};

export default NewUploadPage;
