import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { BookmarkPlus } from 'lucide-react';
import { dataManager } from './DataManager';

interface AddBookmarkDialogProps {
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  onBookmarkAdded: () => void;
}

export function AddBookmarkDialog({ 
  bookId, 
  bookTitle, 
  chapterId, 
  chapterTitle, 
  onBookmarkAdded 
}: AddBookmarkDialogProps) {
  const [note, setNote] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddBookmark = () => {
    dataManager.addBookmark(bookId, bookTitle, chapterId, chapterTitle, 0, note);
    setNote('');
    setOpen(false);
    onBookmarkAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <BookmarkPlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加书签</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm">
            <p><span className="text-muted-foreground">书籍:</span> {bookTitle}</p>
            <p><span className="text-muted-foreground">章节:</span> {chapterTitle}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">备注 (可选)</Label>
            <Textarea
              id="note"
              placeholder="添加一些备注信息..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddBookmark}>
              添加书签
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}