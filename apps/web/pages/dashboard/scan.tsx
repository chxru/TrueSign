import { Grid, GridItem } from '@chakra-ui/react';
import cv from 'opencv-ts';
import { useState } from 'react';
import { Footer, Stage, Toolbar } from '../../components/scanner/';

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
