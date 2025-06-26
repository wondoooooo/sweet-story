import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ReadingSettings } from './ReadingSettings';
import { ChapterNavigation } from './ChapterNavigation';
import { AddBookmarkDialog } from './AddBookmarkDialog';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { dataManager } from './DataManager';

interface Book {
  id: string;
  title: string;
  author: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

interface ReadingPageProps {
  book: Book;
  initialChapterId?: string;
  onBack: () => void;
}

// 模拟章节数据
const mockChapters: Chapter[] = [
  {
    id: '1',
    title: '第一章：重生归来',
    wordCount: 3200,
    content: `
      林峰睁开眼睛，发现自己竟然回到了十年前。

      这是他大学宿舍的床铺，熟悉的味道，熟悉的环境。墙上贴着的海报，桌上摆着的书本，一切都和记忆中的一模一样。

      "难道我真的重生了？"林峰喃喃自语，心中涌起一阵难以名状的激动。

      十年前的今天，正是他人生的转折点。那时的他只是一个普通的大学生，对未来充满迷茫。但现在不同了，他拥有十年后的记忆，知道哪些股票会涨，哪些行业会兴起，哪些机会不能错过。

      "这一次，我一定要抓住机会，创造属于自己的商业帝国！"

      林峰坐起身来，脑海中快速梳理着重生后的计划。首先，他要利用自己对未来的了解，在股市上赚取第一桶金。然后，他要投资那些即将崛起的科技公司，最后建立自己的商业版图。

      正当他沉浸在对未来的憧憬中时，室友张伟推门而入。

      "林峰，你怎么了？看起来好像不太一样。"张伟奇怪地看着他。

      林峰笑了笑："没事，只是突然想明白了一些事情。对了，你还记得今天的日期吗？"

      "2014年9月15日啊，怎么了？"

      听到这个日期，林峰的心跳加速。果然，他真的回到了十年前！而就在明天，阿里巴巴就要在纽交所上市了。这将是他重生后的第一个机会...
    `
  },
  {
    id: '2',
    title: '第二章：第一桶金',
    wordCount: 2800,
    content: `
      第二天一早，林峰就来到了证券公司。

      作为一个重生者，他清楚地记得阿里巴巴上市后的惊人涨幅。虽然现在手头只有一万块钱的生活费，但这就足够了。

      "您好，我想开个美股账户。"林峰对柜台人员说道。

      办理完手续后，林峰毫不犹豫地将所有资金投入了阿里巴巴的股票。周围的投资者看着这个年轻人的大胆举动，都摇头叹息。

      "年轻人就是冲动，居然全仓买一只股票。"

      "阿里巴巴虽然是大公司，但风险还是很高的。"

      面对这些议论，林峰只是淡然一笑。他知道，用不了多久，这些人就会对自己刮目相看。

      果然，随着交易的开始，阿里巴巴的股价开始疯狂上涨。林峰看着屏幕上不断跳动的数字，心中既激动又平静。激动的是计划成功了，平静的是这一切都在他的预料之中。

      一个月后，当林峰卖出所有股票时，他的一万块钱已经变成了五万块钱。这对于一个大学生来说，已经是一笔不小的财富了。

      但林峰知道，这只是开始...
    `
  },
  {
    id: '3',
    title: '第三章：布局未来',
    wordCount: 3500,
    content: `
      有了第一桶金，林峰开始了他的下一步计划。

      他清楚地记得，在2015年，会有一家叫做"滴滴"的公司崛起，彻底改变了出行行业。而现在，这家公司还只是一个小小的创业团队。

      林峰找到了滴滴的创始人程维，表达了投资意向。

      "你一个大学生，有什么资格投资我们？"程维显然对这个年轻人不太看好。

      "我有五万块钱，而且我相信你们的模式一定会成功。"林峰诚恳地说道。

      经过一番谈判，林峰成功获得了滴滴0.1%的股份。虽然比例很小，但林峰知道，这将是他财富自由的关键一步。

      与此同时，他还投资了其他几家初创公司，包括美团、小米等等。这些公司在十年后都成为了行业巨头，而林峰作为早期投资者，将获得丰厚的回报。

      大学室友们都以为林峰疯了，一个大学生居然天天研究投资。但林峰知道，时间会证明一切...
    `
  }
];

export function ReadingPage({ book, initialChapterId, onBack }: ReadingPageProps) {
  const [currentChapterId, setCurrentChapterId] = useState(initialChapterId || '1');
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bookmarks, setBookmarks] = useState(dataManager.getBookmarksByBook(book.id));

  const currentChapter = mockChapters.find(ch => ch.id === currentChapterId);
  const currentIndex = mockChapters.findIndex(ch => ch.id === currentChapterId);

  // 记录阅读历史和进度
  useEffect(() => {
    if (currentChapter) {
      dataManager.addToHistory(
        book.id,
        book.title,
        book.author,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop',
        currentChapter.id,
        currentChapter.title
      );
      
      dataManager.updateReadingProgress(book.id, currentChapter.id, mockChapters.length);
    }
  }, [currentChapterId, book, currentChapter]);

  // 处理滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChapterSelect = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    window.scrollTo(0, 0);
  };

  const handlePrevChapter = () => {
    if (currentIndex > 0) {
      setCurrentChapterId(mockChapters[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleNextChapter = () => {
    if (currentIndex < mockChapters.length - 1) {
      setCurrentChapterId(mockChapters[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleBookmarkAdded = () => {
    setBookmarks(dataManager.getBookmarksByBook(book.id));
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-background text-foreground';
    }
  };

  const chapterBookmarks = bookmarks.filter(b => b.chapterId === currentChapterId);

  return (
    <div className={`min-h-screen transition-colors ${getThemeClasses()}`}>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="truncate">{book.title}</h1>
              <p className="text-sm text-muted-foreground truncate">{book.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddBookmarkDialog
              bookId={book.id}
              bookTitle={book.title}
              chapterId={currentChapterId}
              chapterTitle={currentChapter?.title || ''}
              onBookmarkAdded={handleBookmarkAdded}
            />
            <ReadingSettings
              fontSize={fontSize}
              theme={theme}
              onFontSizeChange={setFontSize}
              onThemeChange={setTheme}
            />
          </div>
        </div>
        
        {/* 阅读进度条 */}
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </header>

      {/* 阅读内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentChapter && (
          <article className="space-y-6">
            <header className="text-center border-b pb-6">
              <h2 className="mb-2">{currentChapter.title}</h2>
              <p className="text-sm text-muted-foreground">
                {(currentChapter.wordCount / 1000).toFixed(1)}k字 · 预计阅读时间 {Math.ceil(currentChapter.wordCount / 300)}分钟
              </p>
              {chapterBookmarks.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    本章有 {chapterBookmarks.length} 个书签
                  </span>
                </div>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none leading-relaxed"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              {currentChapter.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-justify">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </article>
        )}
      </main>

      {/* 底部章节导航 */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border p-4">
        <ChapterNavigation
          chapters={mockChapters}
          currentChapter={currentChapterId}
          onChapterSelect={handleChapterSelect}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < mockChapters.length - 1}
        />
      </footer>
    </div>
  );
}