'use client';

import React, { useState, useEffect } from 'react';
import { VaultItem, vaultApi } from '@/utils/api';
import { VaultItemData, decryptData } from '@/utils/encryption';
import { copyToClipboard } from '@/utils/clipboard';
import { useAuth } from '@/contexts/AuthContext';

interface VaultListProps {
  onEditItem: (item: VaultItem, decryptedData: VaultItemData) => void;
  onAddNew: () => void;
  refreshTrigger?: number;
  searchQuery?: string;
  className?: string;
}

export default function VaultList({
  onEditItem,
  onAddNew,
  refreshTrigger = 0,
  searchQuery = '',
  className = ''
}: VaultListProps) {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const { masterKey } = useAuth();

  useEffect(() => {
    fetchVaultItems();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchVaultItems(searchQuery);
    } else {
      fetchVaultItems();
    }
  }, [searchQuery]);

  const fetchVaultItems = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await vaultApi.getAll();
      setVaultItems(response.vaultItems);
    } catch (error: any) {
      setError(error.message || 'Failed to load vault items');
    } finally {
      setIsLoading(false);
    }
  };

  const searchVaultItems = async (query: string) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await vaultApi.getAll(query);
      setVaultItems(response.vaultItems);
    } catch (error: any) {
      setError(error.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await vaultApi.delete(id);
      setVaultItems(items => items.filter(item => item._id !== id));
    } catch (error: any) {
      alert('Failed to delete item: ' + error.message);
    }
  };

  const handleCopyPassword = async (item: VaultItem) => {
    if (!masterKey) {
      alert('Master key not available. Please log in again.');
      return;
    }

    try {
      const decryptedData = decryptData(item.encryptedData, masterKey);
      if (!decryptedData) {
        alert('Failed to decrypt password. Please check your master key.');
        return;
      }

      const success = await copyToClipboard(decryptedData.password, 15000);
      if (success) {
        setCopyStates(prev => ({ ...prev, [item._id]: true }));
        setTimeout(() => {
          setCopyStates(prev => ({ ...prev, [item._id]: false }));
        }, 2000);
      }
    } catch (error) {
      alert('Failed to copy password');
    }
  };

  const handleCopyUsername = async (item: VaultItem) => {
    if (!masterKey) {
      alert('Master key not available. Please log in again.');
      return;
    }

    try {
      const decryptedData = decryptData(item.encryptedData, masterKey);
      if (!decryptedData) {
        alert('Failed to decrypt username.');
        return;
      }

      const success = await copyToClipboard(decryptedData.username, 15000);
      if (success) {
        setCopyStates(prev => ({ ...prev, [`${item._id}_username`]: true }));
        setTimeout(() => {
          setCopyStates(prev => ({ ...prev, [`${item._id}_username`]: false }));
        }, 2000);
      }
    } catch (error) {
      alert('Failed to copy username');
    }
  };

  const handleEditItem = (item: VaultItem) => {
    if (!masterKey) {
      alert('Master key not available. Please log in again.');
      return;
    }

    const decryptedData = decryptData(item.encryptedData, masterKey);
    if (!decryptedData) {
      alert('Failed to decrypt item data. Please check your master key.');
      return;
    }

    onEditItem(item, decryptedData);
  };

  const openUrl = (url: string) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      window.open(`https://${url}`, '_blank');
    } else if (url) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">Loading vault items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchVaultItems}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (vaultItems.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchQuery ? 'No items found matching your search.' : 'Your vault is empty. Add your first password!'}
        </div>
        {!searchQuery && (
          <button
            onClick={onAddNew}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Add First Item
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {vaultItems.map((item) => (
        <div
          key={item._id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              {item.url && (
                <button
                  onClick={() => openUrl(item.url!)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Open website"
                >
                  {item.url}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyUsername(item)}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                title="Copy username"
              >
                {copyStates[`${item._id}_username`] ? '✓' : '👤'}
              </button>
              <button
                onClick={() => handleCopyPassword(item)}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                title="Copy password"
              >
                {copyStates[item._id] ? '✓' : '🔑'}
              </button>
              <button
                onClick={() => handleEditItem(item)}
                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                title="Edit item"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteItem(item._id, item.title)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                title="Delete item"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Updated {new Date(item.updatedAt).toLocaleDateString()}
            {copyStates[item._id] && (
              <span className="ml-2 text-green-600">Password copied! Will clear in 15s</span>
            )}
            {copyStates[`${item._id}_username`] && (
              <span className="ml-2 text-green-600">Username copied!</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
