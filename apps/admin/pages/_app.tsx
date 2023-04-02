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
import { SuperAdminAllow } from '../layouts/superadmin.layout';

const publicPages = ['/sign-in/[[...index]]', '/sign-up/[[...index]]'];
const isPublicPage = (path: string) => publicPages.includes(path);

function CustomApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>TrueSign - Admin</title>
      </Head>

      <main className="app">
        <ChakraProvider>
          <ClerkProvider {...pageProps}>
            {isPublicPage(pathname) ? (
              <Component {...pageProps} />
            ) : (
              <>
                <SignedIn>
                  <SuperAdminAllow>
                    <Component {...pageProps} />
                  </SuperAdminAllow>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/sign-in" />
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
