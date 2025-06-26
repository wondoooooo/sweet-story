import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { List, ChevronLeft, ChevronRight } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  wordCount: number;
}

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapter: string;
  onChapterSelect: (chapterId: string) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ChapterNavigation({ 
  chapters, 
  currentChapter, 
  onChapterSelect, 
  onPrevChapter, 
  onNextChapter,
  hasPrev,
  hasNext 
}: ChapterNavigationProps) {
  const currentChapterInfo = chapters.find(ch => ch.id === currentChapter);

  return (
    <div className="flex items-center gap-2">
      {/* 上一章 */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onPrevChapter}
        disabled={!hasPrev}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* 章节列表 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="flex-1 max-w-40">
            <List className="w-4 h-4 mr-2" />
            <span className="truncate">
              {currentChapterInfo?.title || '章节列表'}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>章节目录</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full mt-4">
            <div className="space-y-1">
              {chapters.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant={currentChapter === chapter.id ? 'default' : 'ghost'}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => onChapterSelect(chapter.id)}
                >
                  <div className="text-left">
                    <div className="truncate">{chapter.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {(chapter.wordCount / 1000).toFixed(1)}k字
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* 下一章 */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onNextChapter}
        disabled={!hasNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}