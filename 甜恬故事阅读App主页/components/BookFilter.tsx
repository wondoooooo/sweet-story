import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface BookFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onSearch: (query: string) => void;
}

export function BookFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSortChange, 
  onSearch 
}: BookFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="搜索书名、作者..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </form>

      {/* 分类标签 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button 
          variant={selectedCategory === '全部' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('全部')}
          className="whitespace-nowrap"
        >
          全部
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 筛选排序 */}
      <div className="flex gap-2 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">最新更新</SelectItem>
            <SelectItem value="popular">最多阅读</SelectItem>
            <SelectItem value="rating">评分最高</SelectItem>
            <SelectItem value="name">书名排序</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}