import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import MainLayout from '../layouts/MainLayout';

export default function LoginPage() {
  return <MainLayout Content={() => <LoginForm />}></MainLayout>;
}
