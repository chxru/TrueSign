import { Flex, Image } from '@chakra-ui/react';
import { useScannerStore } from '../../store/scanner.store';

export const Footer = () => {
  const images = useScannerStore((state) => state.images);
  const selectImageById = useScannerStore((state) => state.selectImageById);

  return (
    <Flex flexDirection={'row'} flexWrap={'nowrap'} overflowX={'auto'}>
      {images.map((img) => (
        <Image
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
