'use client';

import React, { useState, useEffect } from 'react';
import { VaultItemData } from '@/utils/encryption';
import PasswordGenerator from './PasswordGenerator';

interface VaultItemFormProps {
  initialData?: {
    title: string;
    url?: string;
    username: string;
    password: string;
    notes: string;
  };
  onSave: (data: { title: string; url: string; vaultData: VaultItemData }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function VaultItemForm({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  className = ''
}: VaultItemFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title for this item');
      return;
    }

    const vaultData: VaultItemData = {
      username: username.trim(),
      password: password.trim(),
      notes: notes.trim(),
    };

    onSave({
      title: title.trim(),
      url: url.trim(),
      vaultData,
    });
  };

  const handlePasswordSelect = (generatedPassword: string) => {
    setPassword(generatedPassword);
    setShowPasswordGenerator(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg ${className}`}>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        {initialData ? 'Edit Item' : 'Add New Item'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Facebook, Work Email, Bank Account"
            required
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Website URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username / Email
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="username or email@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Generate password"
            >
              🔄
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showPasswordGenerator ? 'Hide Generator' : 'Generate Strong Password'}
          </button>
        </div>

        {showPasswordGenerator && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <PasswordGenerator onPasswordSelect={handlePasswordSelect} />
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Additional notes or information..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Item' : 'Add Item')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
