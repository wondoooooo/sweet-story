import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Sun,
  Moon
} from 'lucide-react';
import { dataManager } from '../DataManager';
import { ReadingSettings } from '../ReadingSettings';
import { AddBookmarkDialog } from '../AddBookmarkDialog';

interface ReadingPageProps {
  book: {
    id: string;
    title: string;
    author: string;
  };
  initialChapterId?: string;
  onBack: () => void;
}

// 模拟章节数据
const generateChapters = (bookId: string) => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `${bookId}_chapter_${i + 1}`,
    title: `第${i + 1}章 ${['商海风云', '金融风暴', '职场较量', '重生契机', '帝国崛起'][Math.floor(Math.random() * 5)]}`,
    content: `这是第${i + 1}章的内容。在这一章中，主人公面临着新的挑战和机遇。通过智慧和勇气，他将如何应对这些挑战，实现自己的目标？\n\n故事内容会在这里展开，描述精彩的情节发展和人物内心的变化。每一章都会有新的转折和惊喜，让读者沉浸在故事的世界中。\n\n（这是模拟的章节内容，实际应用中会从后端API获取真实的小说内容）\n\n随着情节的发展，主人公不断成长，面对各种困难和挑战。他的决策和行动将影响整个故事的走向，也将决定他最终能否实现自己的梦想。\n\n在这个充满变数的世界里，唯有保持初心，坚持不懈，才能在激烈的竞争中脱颖而出，成就一番事业。`,
    wordCount: 2500 + Math.floor(Math.random() * 1000)
  }));
};

export function ReadingPage({ book, initialChapterId, onBack }: ReadingPageProps) {
  const [chapters] = useState(() => generateChapters(book.id));
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    if (initialChapterId) {
      const index = chapters.findIndex(c => c.id === initialChapterId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  
  const [showHeader, setShowHeader] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [backgroundColor, setBackgroundColor] = useState('bg-background');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const currentChapter = chapters[currentChapterIndex];

  // 检查当前章节是否已收藏
  useEffect(() => {
    const bookmarks = dataManager.getBookmarks();
    const bookmark = bookmarks.find(b => 
      b.bookId === book.id && b.chapterId === currentChapter.id
    );
    setIsBookmarked(!!bookmark);
  }, [book.id, currentChapter.id]);

  // 保存阅读进度
  useEffect(() => {
    const progress = (currentChapterIndex + 1) / chapters.length;
    setReadingProgress(progress);
    
    // 添加到阅读历史
    dataManager.addToHistory(
      book.id,
      book.title,
      book.author,
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop', // 默认封面
      currentChapter.id,
      currentChapter.title
    );

    // 更新阅读进度
    dataManager.updateReadingProgress(book.id, currentChapter.id, chapters.length);
  }, [book, currentChapter, currentChapterIndex, chapters.length]);

  // 点击内容区域切换工具栏显示
  const handleContentClick = () => {
    setShowHeader(!showHeader);
  };

  // 上一章
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  // 下一章
  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  // 切换收藏状态
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      const bookmarks = dataManager.getBookmarks();
      const filteredBookmarks = bookmarks.filter(b => 
        !(b.bookId === book.id && b.chapterId === currentChapter.id)
      );
      dataManager.setBookmarks(filteredBookmarks);
      setIsBookmarked(false);
    } else {
      setShowBookmarkDialog(true);
    }
  };

  // 添加书签成功
  const handleBookmarkAdded = () => {
    setIsBookmarked(true);
    setShowBookmarkDialog(false);
  };

  return (
    <div className={`reading-page ${isDarkMode ? 'dark' : ''}`}>
      {/* 顶部工具栏 */}
      <header className={`reading-header ${showHeader ? 'visible' : 'hidden'}`}>
        <div className="header-content">
          <div className="header-left">
            <Button variant="ghost" size="icon" onClick={onBack} className="back-button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="header-center">
            <div className="book-info">
              <h1 className="book-title">{book.title}</h1>
              <p className="chapter-title">{currentChapter.title}</p>
            </div>
          </div>
          
          <div className="header-right">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleBookmark}
              className="bookmark-button"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
            
            <Sheet open={showSettings} onOpenChange={setShowSettings}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="settings-button">
                  <Settings className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="reading-settings-sheet">
                <ReadingSettings
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  backgroundColor={backgroundColor}
                  onBackgroundColorChange={setBackgroundColor}
                  isDarkMode={isDarkMode}
                  onDarkModeChange={setIsDarkMode}
                  mobile={true}
                />
              </SheetContent>
            </Sheet>
            
            <Button variant="ghost" size="icon" className="more-button">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* 阅读进度条 */}
        <div className="progress-container">
          <Progress value={readingProgress * 100} className="reading-progress" />
          <div className="progress-info">
            <span className="chapter-progress">
              {currentChapterIndex + 1} / {chapters.length}
            </span>
            <span className="reading-percentage">
              {Math.round(readingProgress * 100)}%
            </span>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main 
        className={`reading-content ${backgroundColor}`}
        onClick={handleContentClick}
        ref={contentRef}
      >
        <div className="chapter-content" style={{ fontSize: `${fontSize}px` }}>
          <h2 className="chapter-title">{currentChapter.title}</h2>
          <div className="chapter-text">
            {currentChapter.content.split('\n').map((paragraph, index) => (
              <p key={index} className="paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>

      {/* 底部导航 */}
      <footer className={`reading-footer ${showHeader ? 'visible' : 'hidden'}`}>
        <div className="chapter-navigation">
          <Button
            variant="ghost"
            className="nav-button prev-button"
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
            上一章
          </Button>
          
          <div className="chapter-selector">
            <span className="current-chapter">
              {currentChapter.title}
            </span>
          </div>
          
          <Button
            variant="ghost"
            className="nav-button next-button"
            onClick={handleNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
          >
            下一章
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </footer>

      {/* 添加书签对话框 */}
      <AddBookmarkDialog
        open={showBookmarkDialog}
        onOpenChange={setShowBookmarkDialog}
        book={book}
        chapter={currentChapter}
        onSuccess={handleBookmarkAdded}
      />
    </div>
  );
}