'use client';
import React from 'react';
import { LinkData, Navbar } from '@/components/NavBar';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const linkData: { links: LinkData[] } = {
    links: [
      { href: '/', label: 'Home' },
      { href: '/chat', label: 'Chat' },
      { href: '/travel', label: 'Travel Planner' },
      { href: '/recipe', label: 'Recipes' },
    ],
  };
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <Navbar links={linkData.links} />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
