'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignUpModal({ onClose }: { onClose: () => void }) {
  const { signupWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signupWithEmail(email, password);
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
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
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
