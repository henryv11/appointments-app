import React from 'react';

export default function Alert({ title, message }: AlertProps) {
  return (
    <div>
      <div>{title}</div>
      <div>{message}</div>
      <div>
        <button>OK</button>
        <button>Cancel</button>
      </div>
    </div>
  );
}

export interface AlertProps {
  title?: string;
  message?: string;
}
