import {
  Center,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FormEvent } from 'react';

export function Index() {
  const handleImageUpload = async (event: FormEvent) => {
    // const formData = new FormData();
    console.log(event);

    // await fetch("http://localhost:5000/upload", {method: "POST"})

    console.log('Done uploading');
  };

  return (
    <Center>
      <Box p={4}>
        <h1>Upload the attendance sheet</h1>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            handleImageUpload(evt);
          }}
        >
          <FormControl isRequired>
            <FormLabel>Module Name: </FormLabel>
            <Input type="text" />
            <FormLabel>Time/ Number of hours:</FormLabel>
            <select placeholder="Select Number of hours...">
              <option>1 hour</option>
              <option>2 hour</option>
              <option>3 hour</option>
              <option>4 hour</option>
            </select>
            <Input type="text" />
            <FormLabel>Venue: </FormLabel>
            <Input type="text" />
            <FormLabel>Select the image file to upload: </FormLabel>
            <Input id="image-upload" type="file" />
            <Button mt={4} type="submit">
              Upload
            </Button>
          </FormControl>
        </form>
      </Box>
    </Center>
  );
}

export default Index;
