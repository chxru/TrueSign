import { Box, Flex, Grid, GridItem, Image } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
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
      onStop={(e, data) => {
        console.log(data);
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
        }}
      />
    </Draggable>
  );
};

const Stage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState({
    width: 0,
    height: 0,
  });
  const image = useStore((state) => state.selectedImage);
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
    <Flex height={'100%'} justify={'center'} align={'center'}>
      <Box ref={parentRef} position={'relative'}>
        {image && (
          <>
            <Pointer position={image.border.topLeft} parentSize={parentSize} />
            <Pointer position={image.border.topRight} parentSize={parentSize} />
            <Pointer
              position={image.border.bottomLeft}
              parentSize={parentSize}
            />
            <Pointer
              position={image.border.bottomRight}
              parentSize={parentSize}
            />

            <Image src={image.url} alt={image.name} objectFit={'contain'} />
          </>
        )}
      </Box>
    </Flex>
  );
};

interface UploadBtnProps {
  onUpload: (data: IUploadFile) => void;
}

const UploadBtn = (props: UploadBtnProps) => {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <Flex
      width={'200px'}
      height={'190px'}
      justify={'center'}
      align={'center'}
      border={'2px'}
      px={'25px'}
      mx={'5px'}
      cursor={'pointer'}
      onClick={() => {
        fileInput.current.click();
      }}
    >
      Upload Image
      <input
        ref={fileInput}
        type={'file'}
        accept={'image/*'}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          Array.from(e.target.files).forEach((file) => {
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

            props.onUpload(data);
          });
        }}
      />
    </Flex>
  );
};

interface UploadThumbnailProps {
  idx: number;
  image: IUploadFile;
  onClick: (idx: number) => void;
}

const UploadThumbnail = (props: UploadThumbnailProps) => {
  return (
    <Flex
      height={'190px'}
      width={'200px'}
      justify={'center'}
      align={'center'}
      border={'2px'}
      mx={'5px'}
      backgroundImage={`url(${props.image.url})`}
      backgroundRepeat={'no-repeat'}
      backgroundSize={'cover'}
      backgroundPosition={'center'}
      onClick={() => {
        props.onClick(props.idx);
      }}
    />
  );
};

const Footer = () => {
  const images = useStore((state) => state.images);
  const addImage = useStore((state) => state.addImage);
  const selectImage = useStore((state) => state.selectImage);

  return (
    <Flex overflowX={'auto'} align={'center'} height={'100%'}>
      <UploadBtn onUpload={addImage} />

      {images.map((img, idx) => (
        <UploadThumbnail
          key={idx}
          idx={idx}
          image={img}
          onClick={selectImage}
        />
      ))}
    </Flex>
  );
};

const UploadPage = () => {
  return (
    <Grid
      templateAreas={`"nav main" "nav footer"`}
      gridTemplateRows={'1fr 200px'}
      gridTemplateColumns={'250px 1fr'}
      h="100vh"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" bg="pink.300" area={'nav'}>
        Nav
      </GridItem>
      <GridItem area={'main'} px={'10px'}>
        <Stage />
      </GridItem>
      <GridItem area={'footer'}>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default UploadPage;
