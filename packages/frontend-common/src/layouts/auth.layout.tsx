import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useState } from 'react';
import { Fetcher } from '../axios';

interface AuthLayoutProps {
  children: JSX.Element;
  allowStaff?: boolean;
  allowAdmin?: boolean;
  allowStudent?: boolean;
}

enum AuthState {
  ALLOWED,
  DENIED,
  LOADING,
}

export const AuthLayout = (props: AuthLayoutProps) => {
  const { user } = useUser();
  const { session } = useClerk();
  const [state, setState] = useState<AuthState>(AuthState.LOADING);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  const generateToken = async () => {
    const token = await session?.getToken({ template: 'default' });
    Fetcher.setToken(token || null);
    setTokenLoaded(true);

    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = Buffer.from(payload, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);

        const exp = parsed['exp'] as number;
        const now = new Date().getTime() / 1000;
        const wait = (exp - now) * 1000;
        generateJWTPeriodically(wait);
      } catch (error) {
        console.error('Failed to parse token');
        console.error(error);
      }
    }
  };

  const generateJWTPeriodically = (wait: number) => {
    return setTimeout(async () => {
      await generateToken();
    }, wait);
  };

  useEffect(() => {
    if (!user) return;

    const isStaff = !!user.publicMetadata['isStaff'];
    const isAdmin = !!user.publicMetadata['isSuperAdmin'];
    const isStudent = !!user.publicMetadata['isStudent'];

    /**
     * Kick off the token generation process immediately here
     * and then periodically, based on expire time after that.
     */
    const timer = generateJWTPeriodically(0);

    if (props.allowStaff && isStaff) {
      setState(AuthState.ALLOWED);
      return;
    }

    if (props.allowAdmin && isAdmin) {
      setState(AuthState.ALLOWED);
      return;
    }

    if (props.allowStudent && isStudent) {
      setState(AuthState.ALLOWED);
      return;
    }

    setState(AuthState.DENIED);

    return () => {
      clearTimeout(timer);
    };
  }, [user]);

  if (state === AuthState.LOADING || !tokenLoaded) {
    return <h1>Loading...</h1>;
  }

  if (state === AuthState.DENIED) {
    return <h1>Access Denied</h1>;
  }

  return props.children;
};
