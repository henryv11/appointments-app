import React, { PropsWithChildren } from 'react';

export default function SimpleLayout({ children }: PropsWithChildren<unknown>) {
  return <main>{children}</main>;
}
