import { useState } from 'react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  User, 
  Settings, 
  LogOut,
  LogIn,
  Eye,
  Trash2
} from 'lucide-react';
import { authManager } from '../AuthManager';
import { dataManager } from '../DataManager';
import { User as UserType } from '../CloudSyncManager';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface UserCenterProps {
  onBack: () => void;
  onReadBook: (bookId: string, chapterId?: string) => void;
  onLogin: () => void;
  mobile?: boolean;
}

export function UserCenter({ onBack, onReadBook, onLogin, mobile = false }: UserCenterProps) {
  const [currentUser, setCurrentUser] = useState<UserType | null>(authManager.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authManager.isAuthenticated());

  // 监听认证状态变化
  useState(() => {
    const unsubscribe = authManager.onAuthStateChange((status, user) => {
      setIsAuthenticated(status === 'authenticated');
      setCurrentUser(user);
    });

    return unsubscribe;
  });

  const readingHistory = dataManager.getReadingHistory();
  const bookmarks = dataManager.getBookmarks();

  const handleLogout = async () => {
    await authManager.logout();
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    dataManager.removeBookmark(bookmarkId);
    // 强制重新渲染
    window.location.reload();
  };

  if (mobile) {
    return (
      <div className="mobile-user-center">
        {/* 用户信息卡片 */}
        <div className="user-info-card">
          {isAuthenticated && currentUser ? (
            <>
              <Avatar className="user-avatar">
                <AvatarFallback>
                  {currentUser.nickname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="user-details">
                <h2>{currentUser.nickname}</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{readingHistory.length}</div>
                    <div className="stat-label">已读书籍</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{bookmarks.length}</div>
                    <div className="stat-label">书签收藏</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {Math.floor(readingHistory.reduce((total, h) => total + h.totalReadTime, 0) / 60)}
                    </div>
                    <div className="stat-label">阅读小时</div>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="settings-button">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    账户设置
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="guest-user-card">
              <div className="guest-avatar">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="guest-details">
                <h2>未登录</h2>
                <p className="guest-desc">登录后可同步阅读记录和书签</p>
              </div>
              <Button 
                onClick={onLogin}
                className="login-icon-button"
                size="lg"
              >
                <LogIn className="w-6 h-6 mr-2" />
                登录
              </Button>
            </div>
          )}
        </div>

        {/* 用户数据标签页 */}
        <div className="user-tabs">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">
                <Clock className="w-4 h-4 mr-2" />
                阅读历史
              </TabsTrigger>
              <TabsTrigger value="bookmarks">
                <Bookmark className="w-4 h-4 mr-2" />
                我的书签
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="history-content">
              {readingHistory.length > 0 ? (
                <div className="history-list">
                  {readingHistory.map((item) => (
                    <div key={`${item.bookId}-${item.lastReadTime}`} className="history-card">
                      <div className="history-item p-4">
                        <div className="book-cover-small">
                          <ImageWithFallback
                            src={item.cover}
                            alt={item.bookTitle}
                            className="cover-image"
                          />
                        </div>
                        <div className="book-details">
                          <div className="book-header">
                            <h3 className="book-title">{item.bookTitle}</h3>
                            <Badge variant="secondary" className="progress-badge">
                              {item.progress}%
                            </Badge>
                          </div>
                          <p className="book-author">{item.author}</p>
                          <p className="last-chapter">上次阅读：{item.lastChapterTitle}</p>
                          <div className="book-meta">
                            <div className="read-time">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(item.lastReadTime).toLocaleDateString()}</span>
                            </div>
                            <div className="total-time">
                              <Eye className="w-3 h-3" />
                              <span>{item.totalReadTime}分钟</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => onReadBook(item.bookId, item.lastChapterId)}
                            size="sm"
                            className="continue-btn"
                          >
                            继续阅读
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Clock className="empty-icon" />
                  <p>还没有阅读记录</p>
                  <p className="empty-desc">开始阅读一本书吧</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookmarks" className="bookmarks-content">
              {bookmarks.length > 0 ? (
                <div className="bookmarks-list">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="bookmark-card">
                      <div className="bookmark-item p-4">
                        <div className="bookmark-info">
                          <h3 className="bookmark-book">{bookmark.bookTitle}</h3>
                          <p className="bookmark-chapter">{bookmark.chapterTitle}</p>
                          {bookmark.note && (
                            <div className="bookmark-note">{bookmark.note}</div>
                          )}
                          <p className="bookmark-time">
                            {new Date(bookmark.createdTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bookmark-actions">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onReadBook(bookmark.bookId, bookmark.chapterId)}
                            className="bookmark-read-btn"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveBookmark(bookmark.id)}
                            className="bookmark-delete-btn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Bookmark className="empty-icon" />
                  <p>还没有书签</p>
                  <p className="empty-desc">在阅读时添加书签</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // 桌面版保持原有设计
  return (
    <div className="user-center">
      {/* 原有桌面版代码 */}
    </div>
  );
}