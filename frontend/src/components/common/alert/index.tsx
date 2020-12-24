import React, { useEffect } from 'react';

export default function Alert() {
  useEffect(() => {
    console.log('bitch tits');

    return () => console.log('nigger');
  }, []);
  return <div>Alert or sth</div>;
}
