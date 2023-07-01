import { Box, Flex, Image } from '@chakra-ui/react';
import { useScannerStore } from '../../store/scanner.store';

interface IFooterProps {
  openFileInput: () => void;
}

export const Footer = (props: IFooterProps) => {
  const images = useScannerStore((state) => state.images);
  const selectImageById = useScannerStore((state) => state.selectImageById);

  return (
    <Flex flexDirection={'row'} flexWrap={'nowrap'} overflowX={'auto'} pb={4}>
      <Box
        borderColor={'teal'}
        borderWidth={'2px'}
        height={'150px'}
        minWidth={'150px'}
        textAlign={'center'}
        lineHeight={'150px'}
        cursor={'pointer'}
        onClick={props.openFileInput}
      >
        Add Image
      </Box>

      {images.map((img) => (
        <Image
          key={img.id}
          src={img.url}
          alt={img.name}
          width={'250px'}
          height={'150px'}
          objectFit={'cover'}
          cursor={'pointer'}
          px={2}
          onClick={() => {
            selectImageById(img.id);
          }}
        />
      ))}
    </Flex>
  );
};
