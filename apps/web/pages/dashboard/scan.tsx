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
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type coordinates = {
  x: number;
  y: number;
};

interface IBorders {
  topLeft: coordinates;
  topRight: coordinates;
  bottomLeft: coordinates;
  bottomRight: coordinates;
}

interface IUploadFile {
  id?: number;
  url: string;
  name: string;
  border: IBorders;
  processed: boolean;
}

interface DashboardState {
  counter: number;
  images: Omit<IUploadFile, 'border'>[];
  borders: {
    id: number;
    borders: IBorders;
  }[];
  selectedImageId: number | null;
  addImage: (img: Omit<IUploadFile, 'border'>) => void;
  updateBorders: (id: number, borders: IBorders) => void;
  selectImageById: (id: number) => void;
}

const useStore = create<DashboardState>()(
  devtools(
    (set) => ({
      counter: 0,
      images: [],
      borders: [],
      selectedImageId: undefined,
      addImage: (img: Omit<IUploadFile, 'border'>) => {
        set((state) => ({
          images: [...state.images, { ...img, id: state.counter }],
          counter: state.counter + 1,
          borders: [
            ...state.borders,
            {
              id: state.counter,
              borders: {
                topLeft: {
                  x: 0,
                  y: 0,
                },
                topRight: {
                  x: 0,
                  y: 0,
                },
                bottomLeft: {
                  x: 0,
                  y: 0,
                },
                bottomRight: {
                  x: 0,
                  y: 0,
                },
              },
            },
          ],
        }));
      },
      updateBorders: (id: number, borders: IBorders) => {
        set((state) => ({
          borders: state.borders.map((border) => {
            if (border.id === id) {
              return {
                id,
                borders,
              };
            }
            return border;
          }),
          images: state.images.map((image) => {
            if (image.id === id) {
              return {
                ...image,
                processed: true,
              };
            }
            return image;
          }),
        }));
      },
      selectImageById: (id: number) => {
        set(() => ({
          selectedImageId: id,
        }));
      },
    }),
    {
      name: 'dashboard-state',
      trace: true,
    }
  )
);

const DetectCorners = (): IBorders => {
  const src = cv.imread('selected-image');
  const dst = new cv.Mat();

  // resize image
  const rescaleSize = 500;
  const dSize = new cv.Size(rescaleSize, rescaleSize);
  cv.resize(src, dst, dSize, 0, 0, cv.INTER_AREA);

  // convert to grayscale
  cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);

  // gaussian blur
  const kSize = new cv.Size(5, 5);
  cv.GaussianBlur(src, dst, kSize, 0, 0, cv.BORDER_DEFAULT);

  // canny edge detection
  cv.Canny(src, dst, 50, 100);

  // dilate
  const M = new cv.Mat.ones(5, 5, cv.CV_8U);
  const anchor = new cv.Point(-1, -1);
  cv.dilate(
    dst,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  // erode
  cv.erode(
    dst,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  // find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    dst,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  // get max area contour
  let maxArea = 0;
  let maxAreaIdx = 0;
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const area = cv.contourArea(cnt, false);
    if (area > maxArea) {
      maxArea = area;
      maxAreaIdx = i;
    }
  }

  // get corners of the max area contour
  const cnt = contours.get(maxAreaIdx);
  const approx = new cv.Mat();
  cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);

  // skip if not rectangle
  if (approx.rows !== 4) {
    src.delete();
    dst.delete();
    M.delete();
    contours.delete();
    hierarchy.delete();
    approx.delete();

    return {
      topLeft: {
        x: 0,
        y: 0,
      },
      topRight: {
        x: 0,
        y: 0,
      },
      bottomLeft: {
        x: 0,
        y: 0,
      },
      bottomRight: {
        x: 0,
        y: 0,
      },
    };
  }

  // draw points on src image
  const color = new cv.Scalar(0, 255, 0);
  for (let i = 0; i < approx.rows; i++) {
    const x = approx.data32S[i * 2];
    const y = approx.data32S[i * 2 + 1];
    cv.circle(src, new cv.Point(x, y), 3, color, 2);
  }

  const borders: IBorders = {
    topLeft: {
      x: approx.data32S[0],
      y: approx.data32S[1],
    },
    topRight: {
      x: approx.data32S[2],
      y: approx.data32S[3],
    },
    bottomLeft: {
      x: approx.data32S[4],
      y: approx.data32S[5],
    },
    bottomRight: {
      x: approx.data32S[6],
      y: approx.data32S[7],
    },
  };

  cv.imshow('selected-image', src);

  src.delete();
  dst.delete();
  M.delete();
  hierarchy.delete();
  contours.delete();
  approx.delete();
  // approxScaled.delete();

  return borders;
};

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

  const images = useStore((state) => state.images);
  const borders = useStore((state) => state.borders);
  const selectedImageId = useStore((state) => state.selectedImageId);
  const updateBorders = useStore((state) => state.updateBorders);

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
          const borders = DetectCorners();
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
  const addImage = useStore((state) => state.addImage);

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
  const images = useStore((state) => state.images);
  const selectImageById = useStore((state) => state.selectImageById);

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
