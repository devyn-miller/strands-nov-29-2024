import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ThemeSearchProps {
  onSearch: (keyword: string) => Promise<void>;
  isLoading: boolean;
}

export function ThemeSearch({ onSearch, isLoading }: ThemeSearchProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      await onSearch(keyword.trim());
      setKeyword('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a theme (e.g., 'ocean', 'space')"
          className="w-full px-4 py-2 pr-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md
            ${isLoading || !keyword.trim() 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-500 hover:bg-blue-50'
            }`}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}