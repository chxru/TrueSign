import 'react-calendar/dist/Calendar.css';
import { Button, Container, useToast, VStack } from '@chakra-ui/react';
import { Fetcher } from '@truesign/frontend';
import { useRef } from 'react';
import { IScannerUploadImage, useScannerStore } from './store';
import { useStudentImportStore } from 'apps/admin/store/studentImport.store';

export const ScannerSidebar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const students = useStudentImportStore((state) => state.students);

  const toast = useToast();

  const addImage = useScannerStore((state) => state.addImage);
  const borders = useScannerStore((state) => state.borders);
  const images = useScannerStore((state) => state.images);

  const handleAddImage = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const data: Omit<IScannerUploadImage, 'id'> = {
        url: URL.createObjectURL(file),
        name: file.name,
        processed: false,
        file: file,
      };

      addImage(data);
    });
  };

  /**
   * Upload images to server
   */
  const uploadImages = async () => {
    try {
      const formData = new FormData();

      for (const image of images) {
        const docBorders = borders[image.id].borders;

        formData.append('images[]', image.file);
        formData.append('borders[]', JSON.stringify(docBorders));
        formData.append('pageNo[]', image.id.toString());

        for (const student of students) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { status, ...rest } = student;
          formData.append('students[]', JSON.stringify(rest));
        }
      }

      await Fetcher.post(`/students/upload`, formData);

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

  return (
    <Container py={2}>
      <VStack align={'stretch'} mt={4}>
        <Button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          Add more images
        </Button>
        <Button
          colorScheme={'teal'}
          disabled={images.length === 0}
          onClick={uploadImages}
        >
          Submit
        </Button>

        <input
          ref={inputRef}
          type="file"
          name="image-upload"
          multiple={true}
          style={{ display: 'none' }}
          onChange={(e) => {
            handleAddImage(e.target.files);
          }}
        />
      </VStack>
    </Container>
  );
};
