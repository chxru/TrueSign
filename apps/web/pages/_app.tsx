import { ChakraProvider } from '@chakra-ui/react';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { AuthLayout, SidebarLayout } from '@truesign/frontend';
import { SidebarItem } from '@truesign/types';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AiOutlineScan } from 'react-icons/ai';
import { BiBookOpen } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';

const publicPages = ['/sign-in/[[...index]]', '/sign-up/[[...index]]'];
const isPublicPage = (path: string) => publicPages.includes(path);

const sidebarItems: SidebarItem[] = [
  { name: 'Home', icon: FiHome, url: '/' },
  { name: 'Scan', icon: AiOutlineScan, url: '/dashboard/scan' },
  { name: 'Module', icon: BiBookOpen, url: '/modules' },
];

function CustomApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>TrueSign</title>
      </Head>

      <main className="app">
        <ChakraProvider>
          <ClerkProvider {...pageProps}>
            {isPublicPage(pathname) ? (
              <Component {...pageProps} />
            ) : (
              <>
                <SignedIn>
                  <AuthLayout allowAdmin allowStaff>
                    <SidebarLayout content={sidebarItems}>
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
