import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Search, Filter, X } from 'lucide-react';

interface BookFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onSearch: (query: string) => void;
  mobile?: boolean;
}

export function BookFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSortChange, 
  onSearch,
  mobile = false 
}: BookFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  if (mobile) {
    return (
      <div className="mobile-filter">
        {/* 搜索框 */}
        <div className="search-section">
          <Label htmlFor="search">搜索书籍</Label>
          <div className="search-input-container">
            <Search className="search-icon" />
            <Input
              id="search"
              type="text"
              placeholder="搜索书名或作者..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="clear-button"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 分类选择 */}
        <div className="category-section">
          <Label>分类筛选</Label>
          <div className="category-grid">
            {['全部', ...categories].map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 排序选择 */}
        <div className="sort-section">
          <Label htmlFor="sort">排序方式</Label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="sort-select">
              <SelectValue placeholder="选择排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">最新更新</SelectItem>
              <SelectItem value="popular">最多阅读</SelectItem>
              <SelectItem value="rating">最高评分</SelectItem>
              <SelectItem value="name">书名排序</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // 桌面版保持原有布局
  return (
    <div className="desktop-filter">
      {/* 原有的桌面版布局 */}
    </div>
  );
}