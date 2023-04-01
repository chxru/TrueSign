import { ChakraProvider } from '@chakra-ui/react';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

const publicPages: string[] = ['/sign-in', '/sign-up'];

function CustomApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>

      <main className="app">
        <ChakraProvider>
          <ClerkProvider {...pageProps}>
            {!publicPages.includes(pathname) ? (
              <Component {...pageProps} />
            ) : (
              <>
                <SignedIn>
                  <Component {...pageProps} />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            )}
          </ClerkProvider>
        </ChakraProvider>
      </main>
    </>
  );
}

export default CustomApp;
