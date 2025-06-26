import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Clock } from 'lucide-react';
import { dataManager } from './DataManager';
import { useEffect, useState } from 'react';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  readCount: string;
  status: '连载中' | '已完结';
  cover: string;
  onRead: (id: string, chapterId?: string) => void;
}

export function BookCard({ 
  id, 
  title, 
  author, 
  category, 
  rating, 
  readCount, 
  status, 
  cover, 
  onRead 
}: BookCardProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [lastChapter, setLastChapter] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const history = dataManager.getReadingHistory();
    const bookHistory = history.find(h => h.bookId === id);
    
    if (bookHistory) {
      setReadingProgress(bookHistory.progress);
      setLastChapter(bookHistory.lastChapterTitle);
      setHasHistory(true);
    }
  }, [id]);

  const handleRead = () => {
    if (hasHistory) {
      const history = dataManager.getReadingHistory();
      const bookHistory = history.find(h => h.bookId === id);
      if (bookHistory) {
        onRead(id, bookHistory.lastChapterId);
        return;
      }
    }
    onRead(id);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={cover}
            alt={title}
            className="w-16 h-20 rounded object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="truncate pr-2">{title}</h3>
            <Badge variant={status === '连载中' ? 'default' : 'secondary'} className="text-xs">
              {status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-1">{author}</p>
          <p className="text-muted-foreground text-xs mb-2">{category}</p>
          
          {/* 阅读进度 */}
          {hasHistory && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  上次阅读
                </span>
                <span>{readingProgress}%</span>
              </div>
              <Progress value={readingProgress} className="h-1 mb-1" />
              {lastChapter && (
                <p className="text-xs text-muted-foreground truncate">
                  {lastChapter}
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>评分: {rating}</span>
            <span>{readCount}人阅读</span>
          </div>
          <Button 
            size="sm" 
            className="w-full"
            onClick={handleRead}
          >
            {hasHistory ? '继续阅读' : '开始阅读'}
          </Button>
        </div>
      </div>
    </div>
  );
}