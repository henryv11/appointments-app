import RequireAuthentication from '@/components/higher-order/require-authentication';
import MainLayout from '@/components/layouts/main';
import React from 'react';

export default function HomePage() {
  return (
    <RequireAuthentication>
      <MainLayout>hello there</MainLayout>
    </RequireAuthentication>
  );
}
