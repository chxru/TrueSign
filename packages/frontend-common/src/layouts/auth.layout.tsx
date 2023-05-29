import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useState } from 'react';

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
  const [state, setState] = useState<AuthState>(AuthState.LOADING);

  useEffect(() => {
    if (!user) return;

    const isStaff = !!user.publicMetadata['isStaff'];
    const isAdmin = !!user.publicMetadata['isSuperAdmin'];
    const isStudent = !!user.publicMetadata['isStudent'];

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
  }, [user]);

  if (state === AuthState.LOADING) {
    return <h1>Loading...</h1>;
  }

  if (state === AuthState.DENIED) {
    return <h1>Access Denied</h1>;
  }

  return props.children;
};
