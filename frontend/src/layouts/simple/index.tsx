import React, { PropsWithChildren } from 'react';
import './index.css';

export default function SimpleLayout({ children }: PropsWithChildren<unknown>) {
  return <main>{children}</main>;
}
