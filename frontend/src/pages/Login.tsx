import React from 'react';
import { useAuthContext } from '../contexts/Auth';
import MainLayout from '../layouts/Main';

export default function HomePage() {
    const [state, dispatch] = useAuthContext();

    console.log({ state, dispatch });

    return <MainLayout content={<div>helllo</div>} />;
}
