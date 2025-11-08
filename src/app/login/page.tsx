"use client";
import React from 'react';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Sign in to SecureVault</h1>
          <p className="text-gray-400 mt-2">Access your encrypted vault securely.</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
