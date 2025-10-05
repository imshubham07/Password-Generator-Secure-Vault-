'use client';

import React, { useState, useEffect } from 'react';
import { generatePassword, calculatePasswordStrength, DEFAULT_PASSWORD_OPTIONS, PasswordOptions } from '@/utils/passwordGenerator';
import { copyToClipboard } from '@/utils/clipboard';

interface PasswordGeneratorProps {
  onPasswordSelect?: (password: string) => void;
  className?: string;
}

export default function PasswordGenerator({ onPasswordSelect, className = '' }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    generateNewPassword();
  }, [options]);

  const generateNewPassword = () => {
    try {
      const password = generatePassword(options);
      setGeneratedPassword(password);
    } catch (error) {
      console.error('Password generation error:', error);
      setGeneratedPassword('');
    }
  };

  const handleCopyPassword = async () => {
    if (generatedPassword) {
      const success = await copyToClipboard(generatedPassword, 15000);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleSelectPassword = () => {
    if (onPasswordSelect && generatedPassword) {
      onPasswordSelect(generatedPassword);
    }
  };

  const updateOptions = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const strengthInfo = generatedPassword ? calculatePasswordStrength(generatedPassword) : null;

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Password Generator</h2>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={generatedPassword}
            readOnly
            className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-white"
            placeholder="Generated password will appear here..."
          />
          <button
            onClick={handleCopyPassword}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            title="Copy to clipboard"
          >
            {copySuccess ? '✓' : '📋'}
          </button>
          <button
            onClick={generateNewPassword}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            title="Generate new password"
          >
            🔄
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {strengthInfo && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Strength:</span>
            <span className={`text-sm font-medium ${
              strengthInfo.color === 'green' ? 'text-green-600' :
              strengthInfo.color === 'yellow' ? 'text-yellow-600' :
              strengthInfo.color === 'orange' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {strengthInfo.label}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strengthInfo.color === 'green' ? 'bg-green-500' :
                  strengthInfo.color === 'yellow' ? 'bg-yellow-500' :
                  strengthInfo.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${(strengthInfo.score / 8) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {copySuccess && (
          <p className="text-sm text-green-600 mt-2">✓ Copied! Will clear in 15 seconds</p>
        )}
      </div>

      {/* Length Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {options.length}
        </label>
        <input
          type="range"
          min="4"
          max="64"
          value={options.length}
          onChange={(e) => updateOptions('length', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>4</span>
          <span>64</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeUppercase}
            onChange={(e) => updateOptions('includeUppercase', e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Uppercase letters (A-Z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeLowercase}
            onChange={(e) => updateOptions('includeLowercase', e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Lowercase letters (a-z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeNumbers}
            onChange={(e) => updateOptions('includeNumbers', e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeSymbols}
            onChange={(e) => updateOptions('includeSymbols', e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$%^&*)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) => updateOptions('excludeSimilar', e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Exclude similar characters (il1Lo0O)</span>
        </label>
      </div>

      {/* Action Buttons */}
      {onPasswordSelect && (
        <div className="flex gap-2">
          <button
            onClick={handleSelectPassword}
            disabled={!generatedPassword}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
          >
            Use This Password
          </button>
        </div>
      )}
    </div>
  );
}
