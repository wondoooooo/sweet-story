import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Settings, Sun, Moon, Palette } from 'lucide-react';

interface ReadingSettingsProps {
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
  onFontSizeChange: (size: number) => void;
  onThemeChange: (theme: 'light' | 'dark' | 'sepia') => void;
}

export function ReadingSettings({ fontSize, theme, onFontSizeChange, onThemeChange }: ReadingSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>阅读设置</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-4">
          {/* 字体大小 */}
          <div className="space-y-3">
            <label className="text-sm">字体大小</label>
            <div className="px-3">
              <Slider
                value={[fontSize]}
                onValueChange={(value) => onFontSizeChange(value[0])}
                max={24}
                min={14}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>A</span>
              <span>A</span>
            </div>
          </div>

          {/* 主题选择 */}
          <div className="space-y-3">
            <label className="text-sm">阅读主题</label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onThemeChange('light')}
                className="flex-1"
              >
                <Sun className="w-4 h-4 mr-2" />
                日间
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onThemeChange('dark')}
                className="flex-1"
              >
                <Moon className="w-4 h-4 mr-2" />
                夜间
              </Button>
              <Button
                variant={theme === 'sepia' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onThemeChange('sepia')}
                className="flex-1"
              >
                <Palette className="w-4 h-4 mr-2" />
                护眼
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}