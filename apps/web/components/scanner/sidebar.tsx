import 'react-calendar/dist/Calendar.css';
import {
  Button,
  Container,
  Heading,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import { IBorders } from '@truesign/types';
import {
  IGetModulesRes,
  IInitiateAttendanceReq,
  IInitiateAttendanceRes,
} from '@truesign/types';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import useSWR from 'swr';
import {
  IScannerUploadImage,
  useScannerStore,
} from '../../store/scanner.store';

const initiateUpload = async (data: IInitiateAttendanceReq) => {
  const res = await Fetcher.post<IInitiateAttendanceRes>(
    '/attendance/start',
    data
  );
  return res.sessionId;
};

const uploadSingleImage = async (
  sessionId: string,
  image: IScannerUploadImage,
  borders: IBorders,
  pageNo: number
) => {
  const formData = new FormData();
  formData.append('image', image.file);
  formData.append('borders', JSON.stringify(borders));
  formData.append('pageNo', pageNo.toString());

  await Fetcher.post(`/attendance/${sessionId}/upload`, formData);
};

interface IScannerSidebarProps {
  openFileInput: () => void;
}

export const ScannerSidebar = (props: IScannerSidebarProps) => {
  const [moduleId, setModuleId] = useState('');
  const [date, setDate] = useState(new Date());

  const toast = useToast();
  const { data, isLoading, error } = useSWR<IGetModulesRes>(
    '/modules/',
    (url) => Fetcher.get(url)
  );

  // set default module id
  useEffect(() => {
    if (data) {
      setModuleId(data.modules[0].moduleId);
    }
  }, [data]);

  const borders = useScannerStore((state) => state.borders);
  const images = useScannerStore((state) => state.images);

  /**
   * Upload images to server
   */
  const uploadImages = async () => {
    if (moduleId === '') {
      toast({
        title: 'Please select a module',
        status: 'error',
      });
      return;
    }

    try {
      const session = await initiateUpload({
        moduleId,
        date: new Date(date).getTime(),
      });

      const promises = [];

      for (const image of images) {
        const docBorders = borders[image.id].borders;

        // assumes page no === counter
        promises.push(uploadSingleImage(session, image, docBorders, image.id));
      }

      await Promise.all(promises);

      toast({
        title: 'Upload successful',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error occurred while initiating upload',
        description: error.message,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    if (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error occurred while fetching modules',
          description: error.message,
          status: 'error',
        });
      } else {
        toast({
          title: 'Error occurred while fetching modules',
          description: error,
          status: 'error',
        });
      }
    }
  }, [toast, error]);

  return (
    <Container py={2} maxWidth={'sm'}>
      <Heading size={'md'}>Select module</Heading>

      <Select
        disabled={isLoading}
        mt={4}
        onChange={(evt) => setModuleId(evt.target.value)}
      >
        <option value={''} disabled>
          Select module
        </option>
        {data &&
          data.modules.map((module) => (
            <option key={module.id} value={module.moduleId}>
              {module.moduleId} {module.name}
            </option>
          ))}
      </Select>

      <Heading size={'md'} my={4}>
        Date
      </Heading>

      <Calendar
        onChange={(value) => setDate(value as unknown as Date)}
        value={date}
        maxDate={new Date()}
      />

      <VStack align={'stretch'} mt={4}>
        <Button onClick={props.openFileInput}>Add more images</Button>
        <Button
          colorScheme={'teal'}
          disabled={images.length === 0}
          onClick={uploadImages}
        >
          Submit
        </Button>
      </VStack>
    </Container>
  );
};
