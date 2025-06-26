import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Clock, Bookmark as BookmarkIcon, Trash2, BookOpen } from 'lucide-react';
import { ReadingHistory, Bookmark, dataManager } from './DataManager';

interface UserCenterProps {
  onBack: () => void;
  onReadBook: (bookId: string, chapterId?: string) => void;
}

export function UserCenter({ onBack, onReadBook }: UserCenterProps) {
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>(dataManager.getReadingHistory());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(dataManager.getBookmarks());

  const handleContinueReading = (bookId: string, chapterId: string) => {
    onReadBook(bookId, chapterId);
  };

  const handleBookmarkRead = (bookmark: Bookmark) => {
    onReadBook(bookmark.bookId, bookmark.chapterId);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    dataManager.removeBookmark(bookmarkId);
    setBookmarks(dataManager.getBookmarks());
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 30) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatReadTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}小时${minutes % 60}分钟`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1>个人中心</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">阅读历史</TabsTrigger>
            <TabsTrigger value="bookmarks">我的书签</TabsTrigger>
          </TabsList>

          {/* 阅读历史 */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>阅读历史</h2>
              <span className="text-sm text-muted-foreground">
                共{readingHistory.length}本书
              </span>
            </div>

            {readingHistory.length > 0 ? (
              <div className="space-y-4">
                {readingHistory.map((item) => (
                  <Card key={item.bookId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <ImageWithFallback
                            src={item.cover}
                            alt={item.bookTitle}
                            className="w-16 h-20 rounded object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="truncate">{item.bookTitle}</h3>
                              <p className="text-sm text-muted-foreground">{item.author}</p>
                            </div>
                            <Badge variant="secondary">
                              {item.progress}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>上次阅读: {item.lastChapterTitle}</p>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(item.lastReadTime)}
                              </span>
                              <span>累计阅读 {formatReadTime(item.totalReadTime)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Button 
                              size="sm" 
                              onClick={() => handleContinueReading(item.bookId, item.lastChapterId)}
                            >
                              继续阅读
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无阅读历史</p>
                <p className="text-sm mt-2">开始阅读一本书吧！</p>
              </div>
            )}
          </TabsContent>

          {/* 书签 */}
          <TabsContent value="bookmarks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>我的书签</h2>
              <span className="text-sm text-muted-foreground">
                共{bookmarks.length}个书签
              </span>
            </div>

            {bookmarks.length > 0 ? (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="truncate">{bookmark.bookTitle}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {bookmark.chapterTitle}
                          </p>
                          {bookmark.note && (
                            <p className="text-sm bg-muted p-2 rounded mt-2">
                              {bookmark.note}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmarkRead(bookmark)}
                          >
                            <BookmarkIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBookmark(bookmark.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        添加时间: {formatTime(bookmark.createdTime)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookmarkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无书签</p>
                <p className="text-sm mt-2">在阅读时添加书签，方便快速定位</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}