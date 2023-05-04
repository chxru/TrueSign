import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image as ChakraImage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import cv from 'opencv-ts';
import { useState, useEffect, useRef } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { detectCorners } from '../../services/opencv';
import { useScannerStore } from '../../store/scanner.store';
import { coordinates, IUploadFile } from '../../types';

interface PointProps {
  position: coordinates;
  onDragEnd: (x: number, y: number) => void;
}

const Pointer = ({ position, onDragEnd }: PointProps) => {
  const onDrag = (data: DraggableData) => {
    const x = data.x;
    const y = data.y;

    onDragEnd(x, y);
  };

  return (
    <Draggable
      bounds="parent"
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: position.x, y: position.y }}
      onStop={(e, data) => {
        onDrag(data);
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: '#DF2E38',
        }}
      />
    </Draggable>
  );
};

const Stage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const images = useScannerStore((state) => state.images);
  const borders = useScannerStore((state) => state.borders);
  const selectedImageId = useScannerStore((state) => state.selectedImageId);
  const updateBorders = useScannerStore((state) => state.updateBorders);

  useEffect(() => {
    if (selectedImageId !== undefined) {
      const selectedImage = images.find(
        (image) => image.id === selectedImageId
      );
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = new Image();
      img.src = selectedImage.url;
      img.onload = () => {
        ctx?.drawImage(
          img,
          0,
          0,
          containerRef.current?.offsetWidth - 25,
          containerRef.current?.offsetHeight - 25
        );

        if (!selectedImage.processed) {
          const borders = detectCorners();
          updateBorders(selectedImageId, borders);
        }
      };
    }
  }, [selectedImageId, updateBorders, images]);

  return (
    <Flex
      ref={containerRef}
      justify={'center'}
      align={'center'}
      minHeight={'100%'}
    >
      <Box
        ref={parentRef}
        as={'span'}
        display={'inline'}
        rounded="md"
        justifyContent={'center'}
        position={'relative'}
      >
        {selectedImageId !== undefined && (
          <>
            <Pointer
              position={borders[selectedImageId].borders.topLeft}
              onDragEnd={(x, y) => {
                const { id, borders: b } = borders[selectedImageId];
                updateBorders(id, {
                  ...b,
                  topLeft: {
                    x,
                    y,
                  },
                });
              }}
            />
            <Pointer
              position={borders[selectedImageId].borders.topRight}
              onDragEnd={(x, y) => {
                const { id, borders: b } = borders[selectedImageId];
                updateBorders(id, {
                  ...b,
                  topRight: {
                    x,
                    y,
                  },
                });
              }}
            />
            <Pointer
              position={borders[selectedImageId].borders.bottomLeft}
              onDragEnd={(x, y) => {
                const { id, borders: b } = borders[selectedImageId];
                updateBorders(id, {
                  ...b,
                  bottomLeft: {
                    x,
                    y,
                  },
                });
              }}
            />
            <Pointer
              position={borders[selectedImageId].borders.bottomRight}
              onDragEnd={(x, y) => {
                const { id, borders: b } = borders[selectedImageId];
                updateBorders(id, {
                  ...b,
                  bottomRight: {
                    x,
                    y,
                  },
                });
              }}
            />
            <canvas
              ref={canvasRef}
              id="selected-image"
              width={containerRef.current?.offsetWidth - 25}
              height={containerRef.current?.offsetHeight - 25}
            />
          </>
        )}
      </Box>
    </Flex>
  );
};

const Toolbar = () => {
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
      const data: Omit<IUploadFile, 'border'> = {
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

const Footer = () => {
  const images = useScannerStore((state) => state.images);
  const selectImageById = useScannerStore((state) => state.selectImageById);

  return (
    <Flex flexDirection={'row'} flexWrap={'nowrap'} overflowX={'auto'}>
      {images.map((img) => (
        <ChakraImage
          key={img.id}
          src={img.url}
          alt={img.name}
          width={'250px'}
          height={'150px'}
          onClick={() => {
            selectImageById(img.id);
          }}
        />
      ))}
    </Flex>
  );
};

const UploadPage = () => {
  const [cvLoaded, setCvLoaded] = useState(false);
  cv.onRuntimeInitialized = () => {
    setCvLoaded(true);
  };

  if (!cvLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Grid templateRows={'5fr 50px 1fr'} height={'100vh'}>
      <GridItem>
        <Stage />
      </GridItem>
      <GridItem>
        <Toolbar />
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default UploadPage;
