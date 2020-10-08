import React from 'react';
import LoginForm from '../components/forms/Login';
import MainLayout from '../layouts/Main';

export default function LoginPage() {
  return <MainLayout Content={() => <LoginForm />}></MainLayout>;
}
