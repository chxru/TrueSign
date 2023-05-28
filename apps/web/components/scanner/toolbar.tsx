import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  ModalFooter,
  Button,
  Flex,
  Stack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  IScannerUploadImage,
  useScannerStore,
} from '../../store/scanner.store';

export const Toolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const borders = useScannerStore((state) => state.borders);
  const images = useScannerStore((state) => state.images);
  const addImage = useScannerStore((state) => state.addImage);
  const selectedImageId = useScannerStore((state) => state.selectedImageId);

  const [confirmPressed, setConfirmPressed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpload = (files: FileList) => {
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

  const onConfirmCorners = async () => {
    const formData = new FormData();
    const selectedImage = images.find((image) => image.id === selectedImageId);
    formData.append('image', selectedImage.file);
    formData.append(
      'borders',
      JSON.stringify(borders[selectedImageId].borders)
    );

    const canvas = document.getElementById(
      'selected-image'
    ) as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;
    formData.append('resolution', `${width}x${height}`);

    await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    setConfirmPressed(true);
  };

  const getDownloadLink = async (filter: string) => {
    const formData = new FormData();
    formData.append('filter', filter);

    const res = await fetch('http://localhost:5000/download', {
      method: 'POST',
      body: formData,
    });

    setProcessing(false);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = 'doc.pdf';

    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Select a template</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Select
              placeholder="Select filter"
              onChange={async (e) => {
                setProcessing(true);
                await getDownloadLink(e.target.value);
              }}
            >
              <option value="grayscale">Grayscale</option>
              <option value="threshold">Threshold</option>
              <option value="sharpen">Sharpen</option>
              <option value="clahe">Clahe</option>
              <option value="enhanced">Enhanced</option>
              <option value="adjusted">Adjusted</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={'teal'} isLoading={processing}>
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify={'center'}>
        <Stack direction={'row'} gap={4}>
          <input
            ref={inputRef}
            type="file"
            name="image-upload"
            multiple={true}
            style={{ display: 'none' }}
            onChange={(e) => {
              handleUpload(e.target.files);
            }}
          />

          <Button
            colorScheme="teal"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
          >
            Upload Image
          </Button>

          {images.length && (
            <>
              <Button
                colorScheme={'teal'}
                onClick={onConfirmCorners}
                isDisabled={selectedImageId === undefined}
              >
                Confirm Corners
              </Button>

              <Button
                colorScheme={'teal'}
                onClick={onOpen}
                isDisabled={!confirmPressed}
              >
                Get PDF
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </>
  );
};
