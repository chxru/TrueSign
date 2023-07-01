import { Box, Flex } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';

import { Pointer } from './pointer';
import { detectCorners } from '../../services/opencv';
import { useScannerStore } from '../../store/scanner.store';

export const Stage = () => {
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
      grow={1}
    >
      <Box
        ref={parentRef}
        as={'span'}
        display={'inline'}
        rounded="md"
        justifyContent={'center'}
        position={'relative'}
      >
        {selectedImageId !== undefined ? (
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
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>Upload an image</p>
          </div>
        )}
      </Box>
    </Flex>
  );
};
