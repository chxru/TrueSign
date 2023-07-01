import { Flex } from '@chakra-ui/react';
import cv from 'opencv-ts';
import { useEffect, useRef, useState } from 'react';
import { Footer, ScannerSidebar, Stage } from '../../components/scanner/';
import {
  IScannerUploadImage,
  useScannerStore,
} from '../../store/scanner.store';

const UploadPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const addImage = useScannerStore((state) => state.addImage);

  const [cvLoaded, setCvLoaded] = useState(false);
  cv.onRuntimeInitialized = () => {
    setCvLoaded(true);
  };

  /**
   * Open file input when the user clicks on the add image button.
   */
  const openFileInput = () => {
    inputRef.current?.click();
  };

  /**
   * Add image to the store.
   * @param files
   */
  const handleAddImage = (files: FileList) => {
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

  useEffect(() => {
    /**
     * In some cases, the cv.onRuntimeInitialized is not called but the cv is loaded.
     * Therefore, running a timer to check if the cv is loaded.
     */
    if (cvLoaded) return;

    const timer = setInterval(() => {
      if (cv) {
        clearInterval(timer);
        setCvLoaded(true);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [cvLoaded]);

  if (!cvLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction={'column'} grow={1}>
      <Flex direction={['column-reverse', 'column-reverse', 'row']} grow={1}>
        <Stage />
        <ScannerSidebar openFileInput={openFileInput} />
      </Flex>

      <Footer openFileInput={openFileInput} />

      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        name="image-upload"
        multiple={true}
        style={{ display: 'none' }}
        onChange={(e) => {
          handleAddImage(e.target.files);
        }}
      />
    </Flex>
  );
};

export default UploadPage;
