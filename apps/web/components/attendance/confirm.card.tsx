/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';

interface SignatureConfirmCardProps {
  index: string;
  img1: string;
  img2: string;
}

const SignatureConfirmCard: FunctionComponent<SignatureConfirmCardProps> = (
  props
) => {
  return (
    <Card>
      <CardBody>
        <Heading size="xs" textTransform="uppercase">
          {props.index}
        </Heading>

        <Flex justify={'space-around'}>
          <Box h={'28'}>
            <img
              src={'/signs/' + props.img1}
              alt="signature1"
              style={{
                height: '100%',
              }}
            />
            <Text align={'center'}>Reference Image</Text>
          </Box>
          <Box h={'28'}>
            <img
              src={'/signs/' + props.img2}
              alt="signature2"
              style={{
                height: '100%',
              }}
            />
            <Text align={'center'}>Received Image</Text>
          </Box>
        </Flex>
      </CardBody>

      <CardFooter>
        <ButtonGroup mx={'auto'}>
          <Button colorScheme={'teal'}>Verify</Button>
          <Button colorScheme={'yellow'}>Absent</Button>
          <Button colorScheme={'red'}>Forged</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default SignatureConfirmCard;
