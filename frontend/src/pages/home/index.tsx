import React from 'react';
import RequireAuthentication from '../../higher-order-components/require-authentication';
import MainLayout from '../../layouts/main';
import './index.css';

export default function HomePage() {
  return (
    <RequireAuthentication>
      <MainLayout>hello there</MainLayout>
    </RequireAuthentication>
  );
}
