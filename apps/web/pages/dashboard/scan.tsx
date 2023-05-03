import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image as ChakraImage,
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
  const addImage = useScannerStore((state) => state.addImage);

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const data: Omit<IUploadFile, 'border'> = {
        url: URL.createObjectURL(file),
        name: file.name,
        processed: false,
      };

      addImage(data);
    });
  };

  return (
    <>
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
        colorScheme="blue"
        variant="outline"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        Upload Image
      </Button>
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
