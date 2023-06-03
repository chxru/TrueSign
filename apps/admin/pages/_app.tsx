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
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FiHome } from 'react-icons/fi';
import { GrUserWorker } from 'react-icons/gr';

const publicPages = ['/sign-in/[[...index]]', '/sign-up/[[...index]]'];
const isPublicPage = (path: string) => publicPages.includes(path);

const sidebarItems: SidebarItem[] = [
  { name: 'Home', icon: FiHome, url: '/' },
  { name: 'Invite User', icon: AiOutlineUserAdd, url: '/invite' },
  { name: 'Students', icon: GrUserWorker, url: '/students' },
];

function CustomApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>TrueSign - Admin</title>
      </Head>

      <main className="app">
        <ChakraProvider>
          <ClerkProvider
            {...pageProps}
            appearance={{
              elements: {
                footer: {
                  display: 'none',
                },
              },
            }}
          >
            {isPublicPage(pathname) ? (
              <Component {...pageProps} />
            ) : (
              <>
                <SignedIn>
                  <AuthLayout allowAdmin>
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
