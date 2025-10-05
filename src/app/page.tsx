'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import VaultList from '@/components/VaultList';
import VaultItemForm from '@/components/VaultItemForm';
import PasswordGenerator from '@/components/PasswordGenerator';
import { VaultItem, vaultApi } from '@/utils/api';
import { VaultItemData, encryptData } from '@/utils/encryption';

type ViewMode = 'vault' | 'add' | 'edit' | 'generator';

export default function Home() {
  const { isAuthenticated, isLoading, user, logout, masterKey } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('vault');
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [editingData, setEditingData] = useState<VaultItemData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark mode class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🔐 SecureVault</h1>
            <p className="text-gray-600 dark:text-gray-400">Your privacy-first password manager</p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  const handleAddItem = async (data: { title: string; url: string; vaultData: VaultItemData }) => {
    if (!masterKey) {
      alert('Master key not available. Please log in again.');
      return;
    }

    try {
      setIsFormLoading(true);
      const encryptedData = encryptData(data.vaultData, masterKey);
      await vaultApi.create({
        title: data.title,
        url: data.url,
        encryptedData,
      });
      setViewMode('vault');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      alert('Failed to add item: ' + error.message);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditItem = async (data: { title: string; url: string; vaultData: VaultItemData }) => {
    if (!masterKey || !editingItem) {
      alert('Master key or item not available.');
      return;
    }

    try {
      setIsFormLoading(true);
      const encryptedData = encryptData(data.vaultData, masterKey);
      await vaultApi.update(editingItem._id, {
        title: data.title,
        url: data.url,
        encryptedData,
      });
      setViewMode('vault');
      setEditingItem(null);
      setEditingData(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      alert('Failed to update item: ' + error.message);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditClick = (item: VaultItem, decryptedData: VaultItemData) => {
    setEditingItem(item);
    setEditingData(decryptedData);
    setViewMode('edit');
  };

  const handleCancelEdit = () => {
    setViewMode('vault');
    setEditingItem(null);
    setEditingData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">🔐 SecureVault</h1>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                title="Toggle dark mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'vault' && (
          <>
            {/* Search and Action Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search vault items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('generator')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  🔄 Generator
                </button>
                <button
                  onClick={() => setViewMode('add')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  ➕ Add Item
                </button>
              </div>
            </div>

            {/* Vault List */}
            <VaultList
              onEditItem={handleEditClick}
              onAddNew={() => setViewMode('add')}
              refreshTrigger={refreshTrigger}
              searchQuery={searchQuery}
            />
          </>
        )}

        {viewMode === 'add' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setViewMode('vault')}
              className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Vault
            </button>
            <VaultItemForm
              onSave={handleAddItem}
              onCancel={handleCancelEdit}
              isLoading={isFormLoading}
            />
          </div>
        )}

        {viewMode === 'edit' && editingItem && editingData && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setViewMode('vault')}
              className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Vault
            </button>
            <VaultItemForm
              initialData={{
                title: editingItem.title,
                url: editingItem.url,
                username: editingData.username,
                password: editingData.password,
                notes: editingData.notes,
              }}
              onSave={handleEditItem}
              onCancel={handleCancelEdit}
              isLoading={isFormLoading}
            />
          </div>
        )}

        {viewMode === 'generator' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setViewMode('vault')}
              className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Vault
            </button>
            <PasswordGenerator />
          </div>
        )}
      </main>
    </div>
  );
}
