'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SignUpModal from '@/components/SignUpModal';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, loading, loginWithGoogle, loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-gray-500">Checking session...</p>
      </div>
    );
  }

  if (user) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithEmail(email, password);
    router.push('/');
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-2">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Login with Email
          </button>
        </form>

        <div className="my-4 text-center">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{' '}
          <button
            onClick={() => setShowSignup(true)}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>

      {showSignup && <SignUpModal onClose={() => setShowSignup(false)} />}
    </div>
  );
}
