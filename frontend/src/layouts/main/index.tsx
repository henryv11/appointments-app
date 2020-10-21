import React, { PropsWithChildren } from 'react';
import AppBar from '../../components/app-bar';
import Drawer from '../../components/drawer';
import './index.css';

export default function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div>
      <AppBar />
      <Drawer />
      <main>{children}</main>
    </div>
  );
}
