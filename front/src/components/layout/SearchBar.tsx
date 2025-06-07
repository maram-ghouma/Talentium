import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, SortDesc, ChevronDown } from 'lucide-react';
import '../../Styles/searchBar.css';
import { useLocation } from 'react-router-dom';

interface FilterOptions {
  status: string;
  //priority: string;
  dateRange: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: (filters: FilterOptions) => void;
  onSort?: (sortOption: string) => void;
  isDarkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilter,
  onSort,
  isDarkMode,
}) => {
  const location=useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    //priority: 'all',
    dateRange: 'all'
  });
  
  const [sortOption, setSortOption] = useState('newest');
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFilter?.(filterOptions);
    setIsFilterOpen(false);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    onSort?.(option);
    setIsSortOpen(false);
  };
  
  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
    if (isSortOpen) setIsSortOpen(false);
  };
  
  const toggleSort = () => {
    setIsSortOpen(prev => !prev);
    if (isFilterOpen) setIsFilterOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container" data-dark-mode={isDarkMode ? "true" : "false"}>
      <div className="search-input-container">
        <Search size={18} className={isDarkMode ? 'icon-dark' : 'icon-light'} />
        <input
          type="text"
          placeholder="Search missions..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="action-buttons">
        {/* Filter Dropdown */}
        <div className="dropdown" ref={filterRef}>
          <button 
            className={`action-button ${isFilterOpen ? 'active' : ''}`}
            onClick={toggleFilter}
            type="button"
          >
            <Filter size={16} />
            <span>Filter</span>
            <ChevronDown size={14} className={`dropdown-arrow ${isFilterOpen ? 'open' : ''}`} />
          </button>
          
          {isFilterOpen && (
            <div className="dropdown-content filter-dropdown">
              <div className="filter-section">
                <label>{(location.pathname === "/client/interviews" || location.pathname === "/freelancer/interviews") ? "Time" : "Status"}</label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All</option>
                    {(location.pathname === "/client/interviews" || location.pathname === "/freelancer/interviews") ? (
                      <>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                      </>
                    ) : (
                      <>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="not_assigned">Not Assigned</option>
                      </>
                    )}
                  </select>
              </div>
              {/*
              <div className="filter-section">
                <label>Priority</label>
                <select
                  value={filterOptions.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              */}
              <div className="filter-section">
                <label>Date Range</label>
                <select
                  value={filterOptions.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <button className="apply-button" onClick={handleApplyFilters}>
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="dropdown" ref={sortRef}>
          <button 
            className={`action-button ${isSortOpen ? 'active' : ''}`}
            onClick={toggleSort}
            type="button"
          >
            <SortDesc size={16} />
            <span>Sort</span>
            <ChevronDown size={14} className={`dropdown-arrow ${isSortOpen ? 'open' : ''}`} />
          </button>
          
          {isSortOpen && (
            <div className="dropdown-content sort-dropdown">
              <div className="sort-option">
                <input
                  type="radio"
                  id="newest"
                  name="sort"
                  checked={sortOption === 'newest'}
                  onChange={() => handleSortChange('newest')}
                />
                <label htmlFor="newest">Closest First</label>
              </div>
              <div className="sort-option">
                <input
                  type="radio"
                  id="oldest"
                  name="sort"
                  checked={sortOption === 'oldest'}
                  onChange={() => handleSortChange('oldest')}
                />
                <label htmlFor="oldest">Farthest First</label>
              </div>
              {/*
              <div className="sort-option">
                <input
                  type="radio"
                  id="priority"
                  name="sort"
                  checked={sortOption === 'priority'}
                  onChange={() => handleSortChange('priority')}
                />
                <label htmlFor="priority">Priority (High-Low)</label>
              </div>
              */}
              <div className="sort-option">
                <input
                  type="radio"
                  id="alpha"
                  name="sort"
                  checked={sortOption === 'alpha'}
                  onChange={() => handleSortChange('alpha')}
                />
                <label htmlFor="alpha">Alphabetical (A-Z)</label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};