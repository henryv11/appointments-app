import Container from '@material-ui/core/Container';
import React from 'react';
import AppBarImpl from '../components/app-bar';
import DrawerImpl from '../components/drawer';

export default function MainLayout({
  TopBar = AppBarImpl,
  Drawer = DrawerImpl,
  Content,
}: {
  TopBar?: React.ComponentType;
  Drawer?: React.ComponentType;
  Content: React.ComponentType;
}) {
  return (
    <Container maxWidth={false}>
      <TopBar />
      <Drawer />
      <Content />
    </Container>
  );
}
