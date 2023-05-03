import { Box, Button, Flex, Grid, GridItem, Image } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type coordinates = {
  x: number;
  y: number;
};

interface IUploadFile {
  url: string;
  name: string;
  border: {
    topLeft: coordinates;
    topRight: coordinates;
    bottomLeft: coordinates;
    bottomRight: coordinates;
  };
}

interface DashboardState {
  images: IUploadFile[];
  selectedImage: IUploadFile | undefined;
  addImage: (img: IUploadFile) => void;
  removeImage: (idx: number) => void;
  selectImage: (idx: number) => void;
}

const useStore = create<DashboardState>()(
  devtools(
    (set) => ({
      images: [],
      selectedImage: undefined,
      addImage: (img: IUploadFile) => {
        set((state) => ({
          images: [...state.images, img],
        }));
      },
      removeImage: (idx: number) => {
        set((state) => ({
          images: state.images.filter((_, i) => i !== idx),
        }));
      },
      selectImage: (idx: number) => {
        set((state) => ({
          selectedImage: state.images[idx],
        }));
      },
    }),
    {
      name: 'dashboard-state',
    }
  )
);

interface PointProps {
  position: coordinates;
  parentSize: {
    width: number;
    height: number;
  };
}

const Pointer = ({ position, parentSize }: PointProps) => {
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    setXPos(parentSize.width * position.x);
    setYPos(parentSize.height * position.y);
  }, [parentSize, position]);

  const onDrag = (data: DraggableData) => {
    setXPos((prev) => prev + data.deltaX);
    setYPos((prev) => prev + data.deltaY);
  };

  return (
    <Draggable
      bounds="parent"
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: xPos, y: yPos }}
      onDrag={(e, data) => {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState({
    width: 0,
    height: 0,
  });
  const selectedImage = useStore((state) => state.selectedImage);

  useEffect(() => {
    if (parentRef.current) {
      setParentSize({
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    }
  }, [parentRef, selectedImage]);

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
        {selectedImage && (
          <>
            <Pointer
              position={selectedImage.border.topLeft}
              parentSize={parentSize}
            />
            <Pointer
              position={selectedImage.border.topRight}
              parentSize={parentSize}
            />
            <Pointer
              position={selectedImage.border.bottomLeft}
              parentSize={parentSize}
            />
            <Pointer
              position={selectedImage.border.bottomRight}
              parentSize={parentSize}
            />
            <Image
              src={selectedImage.url}
              alt={selectedImage.name}
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
  const addImage = useStore((state) => state.addImage);

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const data: IUploadFile = {
        url: URL.createObjectURL(file),
        name: file.name,
        border: {
          topLeft: { x: 0, y: 0 },
          topRight: { x: 1, y: 0 },
          bottomLeft: { x: 0, y: 1 },
          bottomRight: { x: 1, y: 1 },
        },
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
  const images = useStore((state) => state.images);
  const selectImage = useStore((state) => state.selectImage);

  return (
    <Flex flexDirection={'row'} flexWrap={'nowrap'} overflowX={'auto'}>
      {images.map((img, idx) => (
        <Image
          key={img.url}
          src={img.url}
          alt={img.name}
          width={'250px'}
          height={'150px'}
          onClick={() => {
            selectImage(idx);
          }}
        />
      ))}
    </Flex>
  );
};

const UploadPage = () => {
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
