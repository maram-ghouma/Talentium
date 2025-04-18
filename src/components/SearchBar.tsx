import React from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isDarkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isDarkMode }) => {
  return (
    <div className="search-container">
      <div className="d-flex align-items-center flex-grow-1">
        <Search size={18} className={isDarkMode ? 'text-powder' : 'text-navy-primary'} />
        <input
          type="text"
          placeholder="Search missions..."
          className="search-input"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2">
        <button className="search-button">
          <Filter size={18} />
          <span>Filter</span>
        </button>
        <button className="search-button">
          <SortDesc size={18} />
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
};