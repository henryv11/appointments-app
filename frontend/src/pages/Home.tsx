import React from 'react';
import RequireAuthentication from '../higher-order-components/RequireAuthentication';
import MainLayout from '../layouts/Main';

export default function HomePage() {
    return (
        <RequireAuthentication>
            <MainLayout>hello there</MainLayout>
        </RequireAuthentication>
    );
}
