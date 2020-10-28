import React, { PropsWithChildren } from 'react';
import './styles.scss';

export default function SimpleLayout({ children }: PropsWithChildren<unknown>) {
  return <main>{children}</main>;
}
