import { Flex } from '@chakra-ui/react';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => (
  <Flex minHeight={'100vh'} justifyContent={'center'} alignItems={'center'}>
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </Flex>
);

export default SignInPage;
