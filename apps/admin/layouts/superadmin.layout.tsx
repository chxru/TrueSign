import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface SuperAdminAllowProps {
  children: JSX.Element;
}

const allowedOrganizations = ['superadmin'];

export const SuperAdminAllow = (props: SuperAdminAllowProps) => {
  const { user } = useUser();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    let allowed = false;

    for (const org of user.organizationMemberships) {
      if (allowedOrganizations.includes(org.organization.name)) {
        allowed = true;
        break;
      }
    }

    setIsSuperAdmin(allowed);
  }, [user]);

  if (!isSuperAdmin) {
    return <h1>Sussy Baka</h1>;
  }

  return props.children;
};
