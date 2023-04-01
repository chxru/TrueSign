import { Flex } from '@chakra-ui/react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => (
  <Flex minHeight={'100vh'} justifyContent={'center'} alignItems={'center'}>
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
  </Flex>
);

export default SignUpPage;
