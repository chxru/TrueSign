import { ChakraProvider } from '@chakra-ui/react';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { AuthLayout } from '@truesign/frontend';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SidebarLayout } from '../layouts/sidebar.layout';

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
                  <AuthLayout allowAdmin>
                    <SidebarLayout>
                      <Component {...pageProps} />
                    </SidebarLayout>
                  </AuthLayout>
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
