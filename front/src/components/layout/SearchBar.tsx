import React, { useState } from 'react';
import { Search, Filter, SortDesc, ChevronDown } from 'lucide-react';
import '../../Styles/searchBar.css';
interface SearchBarProps {
  onSearch: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode?: () => void; // Made optional with the ? operator
  profileImageUrl?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isDarkMode, 
  toggleDarkMode = () => {}, // Default empty function
  //profileImageUrl = "/api/placeholder/32/32" 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    priority: 'all',
    dateRange: 'all'
  });
  
  const [sortOption, setSortOption] = useState('newest');
  
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isSortOpen) setIsSortOpen(false);
  };
  
  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    if (isFilterOpen) setIsFilterOpen(false);
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className={isDarkMode ? 'text-powder' : 'text-navy-primary'} />
          <input
            type="text"
            placeholder="Search missions by title, description or keywords..."
            className="search-input"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="search-actions">
          <div className="dropdown-container">
            <button className="search-button" onClick={handleFilterToggle}>
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={14} className={`dropdown-icon ${isFilterOpen ? 'open' : ''}`} />
            </button>
            
            {isFilterOpen && (
              <div className="dropdown-menu filter-dropdown">
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select 
                    className="filter-select"
                    value={filterOptions.status}
                    onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Priority</label>
                  <select 
                    className="filter-select"
                    value={filterOptions.priority}
                    onChange={(e) => setFilterOptions({...filterOptions, priority: e.target.value})}
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Date Range</label>
                  <select 
                    className="filter-select"
                    value={filterOptions.dateRange}
                    onChange={(e) => setFilterOptions({...filterOptions, dateRange: e.target.value})}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                
                <button className="filter-apply-button">Apply Filters</button>
              </div>
            )}
          </div>
          
          <div className="dropdown-container">
            <button className="search-button" onClick={handleSortToggle}>
              <SortDesc size={16} />
              <span>Sort</span>
              <ChevronDown size={14} className={`dropdown-icon ${isSortOpen ? 'open' : ''}`} />
            </button>
            
            {isSortOpen && (
              <div className="dropdown-menu sort-dropdown">
                <div className="sort-option">
                  <input 
                    type="radio" 
                    id="newest" 
                    name="sort" 
                    value="newest"
                    checked={sortOption === 'newest'}
                    onChange={() => setSortOption('newest')}
                  />
                  <label htmlFor="newest">Newest First</label>
                </div>
                <div className="sort-option">
                  <input 
                    type="radio" 
                    id="oldest" 
                    name="sort" 
                    value="oldest"
                    checked={sortOption === 'oldest'}
                    onChange={() => setSortOption('oldest')}
                  />
                  <label htmlFor="oldest">Oldest First</label>
                </div>
                <div className="sort-option">
                  <input 
                    type="radio" 
                    id="priority" 
                    name="sort" 
                    value="priority"
                    checked={sortOption === 'priority'}
                    onChange={() => setSortOption('priority')}
                  />
                  <label htmlFor="priority">Priority (High-Low)</label>
                </div>
                <div className="sort-option">
                  <input 
                    type="radio" 
                    id="alpha" 
                    name="sort" 
                    value="alpha"
                    checked={sortOption === 'alpha'}
                    onChange={() => setSortOption('alpha')}
                  />
                  <label htmlFor="alpha">Alphabetical (A-Z)</label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> 
    </div>

  );
};