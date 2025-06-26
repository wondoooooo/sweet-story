import { useState, useMemo, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BookCard } from './BookCard';
import { ArrowLeft, Search, X } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  readCount: string;
  status: '连载中' | '已完结';
  cover: string;
  description?: string;
}

interface SearchPageProps {
  books: Book[];
  categories: string[];
  onBack: () => void;
  onRead: (bookId: string, chapterId?: string) => void;
  onPlay?: (bookId: string) => void;
  initialQuery?: string;
}

export function SearchPage({ books, categories, onBack, onRead, onPlay, initialQuery = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('latest');

  // 当初始查询参数改变时更新搜索查询
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // 筛选和排序书籍
  const filteredBooks = useMemo(() => {
    let filtered = books;

    if (selectedCategory !== '全部') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => parseFloat(b.readCount) - parseFloat(a.readCount));
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'name':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [books, selectedCategory, sortBy, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handlePlay = (bookId: string) => {
    onPlay?.(bookId);
  };

  return (
    <div className="search-page">
      {/* 搜索页面头部 */}
      <header className="search-header">
        <div className="search-header-content">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="search-input-section">
            <div className="search-input-container">
              <Search className="search-input-icon" />
              <Input
                type="text"
                placeholder="搜索书名、作者或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
                autoFocus={!initialQuery}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="clear-search-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 搜索内容区域 */}
      <main className="search-content">
        {/* 筛选选项 */}
        <div className="search-filters">
          {/* 分类筛选 */}
          <div className="filter-section">
            <h3 className="filter-title">分类</h3>
            <div className="category-chips">
              {['全部', ...categories].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 排序选项 */}
          <div className="filter-section">
            <h3 className="filter-title">排序</h3>
            <div className="sort-buttons">
              <button
                onClick={() => setSortBy('latest')}
                className={`sort-button ${sortBy === 'latest' ? 'active' : ''}`}
              >
                最新更新
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`sort-button ${sortBy === 'popular' ? 'active' : ''}`}
              >
                最受欢迎
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`}
              >
                评分最高
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
              >
                按名称
              </button>
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="search-results">
          {searchQuery && (
            <div className="search-result-header">
              <h2 className="result-title">
                搜索结果
                <span className="result-count">({filteredBooks.length})</span>
              </h2>
              {searchQuery && (
                <p className="search-query">关键词："{searchQuery}"</p>
              )}
            </div>
          )}

          {filteredBooks.length > 0 ? (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onRead={onRead}
                  onPlay={handlePlay}
                  mobile={true}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search className="no-results-icon" />
              <h3 className="no-results-title">
                {searchQuery ? '没有找到相关书籍' : '开始搜索'}
              </h3>
              <p className="no-results-desc">
                {searchQuery 
                  ? '试试其他关键词或调整筛选条件' 
                  : '输入书名、作者名或关键词开始搜索'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}