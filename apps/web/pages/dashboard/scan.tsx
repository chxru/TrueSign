import { Grid, GridItem } from '@chakra-ui/react';
import cv from 'opencv-ts';
import { useEffect, useRef, useState } from 'react';
import { Footer, ScannerSidebar, Stage } from '../../components/scanner/';

const UploadPage = () => {
  const subGridRef = useRef<HTMLDivElement>();
  const [cvLoaded, setCvLoaded] = useState(false);
  cv.onRuntimeInitialized = () => {
    setCvLoaded(true);
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
    <Grid templateRows={'5fr 1fr'} height={'calc(100vh - 80px)'}>
      <GridItem>
        <Grid ref={subGridRef} templateColumns={'3fr 1fr'} height={'100%'}>
          <GridItem>
            <Stage />
          </GridItem>
          <GridItem height={'100%'}>
            <ScannerSidebar />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default UploadPage;
