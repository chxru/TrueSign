import { Grid, GridItem } from '@chakra-ui/react';
import cv from 'opencv-ts';
import { useEffect, useState } from 'react';
import { Footer, Stage, Toolbar } from '../../components/scanner/';

const UploadPage = () => {
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
