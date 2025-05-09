
import AuthForm from '@/components/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Behind Your Label',
  description: 'Login or create an account to manage your scans.',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] py-8">
      <AuthForm />
    </div>
  );
}

