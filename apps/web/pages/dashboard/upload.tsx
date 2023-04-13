import './upload.module.css';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Select,
} from '@chakra-ui/react';
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
          backgroundColor: '#DF2E38',
        }}
      />
    </Draggable>
  );
};

const Toolbox = () => {
  return (
    <Flex justify={'center'} align={'center'}>
      <Box
        flexDirection={'row'}
        // boxShadow="inner"
        // bgColor={'#F6F6F6'}
        // borderColor={'#6096B4'}
        // rounded="md"
        // justifyContent={'center'}
        width={'460px'}
        height={'40px'}
        margin={'7px'}
      >
        <Button
          margin={'2px 5px 2px 60px'}
          border={'2px'}
          borderColor={'#6096B4'}
          width={'65px'}
        >
          <Image
            src="/clock.png"
            alt="add image"
            height={'30px'}
            width={'30px'}
          />
        </Button>

        <Button
          marginTop={'2px'}
          marginBottom={'2px'}
          marginRight={'5px'}
          border={'2px'}
          borderColor={'#6096B4'}
          width={'65px'}
        >
          <Image
            src="/anticlock.png"
            alt="add image"
            height={'30px'}
            width={'30px'}
          />
        </Button>

        <Button
          marginTop={'2px'}
          marginBottom={'2px'}
          marginLeft={'130px'}
          border={'2px'}
          borderColor={'#6096B4'}
        >
          <Image
            src="/save.png"
            alt="add image"
            height={'30px'}
            width={'30px'}
          />
        </Button>
      </Box>
    </Flex>
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
    <Flex justify={'center'} align={'center'}>
      <Box
        boxShadow="inner"
        bgColor={'#F6F6F6'}
        borderColor={'#6096B4'}
        rounded="md"
        justifyContent={'center'}
        ref={parentRef}
        position={'relative'}
        margin={'5px 15px 15px 15px'}
        width={'460px'}
        height={'570px'}
        // border={'1px'}
        // borderStyle={''}
      >
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
            <Image
              margin={'5px 5px 5px 5px'}
              src={image.url}
              alt={image.name}
              objectFit={'contain'}
              width={'450px'}
              height={'550px'}
            />
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

  const styles = {
    upldBtn: {
      // backgroundColor: '#f1f1f1',
      width: '180px',
    },
    footer: {},
  };

  return (
    <Flex
      direction={'column'}
      bgColor={'#F5F5F5'}
      rounded="md"
      style={styles.upldBtn}
      width={'180px'}
      height={'210px'}
      minHeight={'210px'}
      justify={'center'}
      align={'center'}
      border={'2px'}
      borderStyle={'dashed'}
      borderColor={'#6096B4'}
      color={'#6096B4'}
      px={'25px'}
      mx={'auto'}
      my={'auto'}
      cursor={'pointer'}
      onClick={() => {
        fileInput.current.click();
      }}
    >
      <Image src="/upload.png" alt="add image" height={'40px'} />
      Click to Upload
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
      margin={'10px'}
      width={'180px'}
      height={'210px'}
      minHeight={'210px'}
      justify={'center'}
      align={'center'}
      border={'2px'}
      mx={'5px'}
      backgroundImage={`url(${props.image.url})`}
      backgroundRepeat={'no-repeat'}
      backgroundSize={'cover'}
      backgroundPosition={'center'}
      position={'relative'}
      onClick={() => {
        props.onClick(props.idx);
      }}
    >
      <Image
        src="/remove.png"
        alt="add image"
        height={'20px'}
        position={'absolute'}
        right={'0px'}
        top={'0px'}
      />
    </Flex>
  );
};

const Footer = () => {
  const images = useStore((state) => state.images);
  const addImage = useStore((state) => state.addImage);
  const selectImage = useStore((state) => state.selectImage);

  return (
    <Flex
      overflowY={'scroll'}
      maxH="600px"
      margin={'10px'}
      flexDirection={'column'}
      align={'center'}
      // height={'100vh'}
    >
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

const Options = () => {
  return (
    <Center>
      <FormControl isRequired margin={'20px'}>
        <FormLabel>Module Name</FormLabel>
        <Input
          borderColor={'black'}
          type="text"
          placeholder="Enter module name"
        />

        <FormLabel>Number of Hours</FormLabel>
        <Select borderColor={'black'} placeholder="Select number of hours">
          <option value="1">1 Hour</option>
          <option value="2">2 Hour</option>
          <option value="3">3 Hour</option>
          <option value="4">4 Hour</option>
        </Select>

        <FormLabel>Venue</FormLabel>
        <Input borderColor={'black'} type="text" placeholder="Enter venue" />

        <FormLabel>Date</FormLabel>
        <Input borderColor={'black'} type="date" />

        <Button mt={4} colorScheme="#FFFFFF" bg={'#6096B4'} type="submit">
          Submit
        </Button>
      </FormControl>
    </Center>
  );
};

const Header = () => {
  return <Image src="/logo.png" alt="add image" height={'68px'} />;
};

const UploadPage = () => {
  return (
    <Grid
      templateAreas={`"header header" "nav footer" "nav main" "tool opt" `}
      h="100vh"
      templateRows="repeat(12, 1fr)"
      templateColumns="repeat(12, 1fr)"
      gap={1}
      fontWeight="bold"
      color="blackAlpha.700"
    >
      <GridItem rowSpan={1} colSpan={12} bg="#6096B4" area={'header'}>
        <Header />
      </GridItem>

      <GridItem rowSpan={11} colSpan={2} bg="#EEE9DA">
        nav
      </GridItem>

      <GridItem
        rowSpan={11}
        padding={'15px 15px 5px 5px'}
        colSpan={2}
        area={'footer'}
      >
        <Footer />
      </GridItem>

      <GridItem rowSpan={11} colSpan={5}>
        <GridItem rowSpan={1} colSpan={5} area={'tool'}>
          <Toolbox />
        </GridItem>

        <GridItem rowSpan={10} colSpan={5} area={'main'}>
          <Stage />
        </GridItem>
      </GridItem>

      <GridItem rowSpan={11} colSpan={3} area={'opt'} bg="#d5e5ed">
        <Options />
      </GridItem>
    </Grid>
  );
};

export default UploadPage;
