import { formatDateString } from '@/lib/date';
import { useInterval } from '@/lib/react/hooks/interval';
import React, { useState } from 'react';

export default function Clock() {
  const [dateString, setDateString] = useState(formatDateString(new Date()));
  useInterval(() => {
    setDateString(formatDateString(new Date()));
  }, 1000);
  return <span>{dateString}</span>;
}
