'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserSession from '@/stores/user';

const UserWrapper = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: 'admin' | 'user';
}) => {
  const router = useRouter();
  const { accessToken, user } = useUserSession((state) => ({
    accessToken: state.accessToken,
    user: state.user,
  }));


  useEffect(() => {
 
      if (!accessToken) {
        router.push('/login'); // Redirect to login if not logged in
      } else if (user && user.role !== requiredRole) {
        // Redirect if the user doesn't have the required role
        router.push('/unauthorized'); // You can redirect to an unauthorized page
      }
    
  }, [accessToken, user, requiredRole, router]);

  // Optionally, render a loading state while the check is happening
  if (!accessToken || (user && user.role !== requiredRole)) {
    return <div>Loading...</div>; // Or some other loading indicator
  }

  return <>{children}</>;
};

export default UserWrapper;
