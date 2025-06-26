import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { authManager } from '../AuthManager';

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginSheet({ open, onOpenChange, onSuccess }: LoginSheetProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const success = await authManager.login(formData.email, formData.password);
        if (success) {
          onSuccess?.();
        } else {
          setError('邮箱或密码错误');
        }
      } else {
        const success = await authManager.register(formData.email, formData.password, formData.nickname);
        if (success) {
          onSuccess?.();
        } else {
          setError('注册失败，请重试');
        }
      }
    } catch (err) {
      setError('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      const success = await authManager.login('test@example.com', '123456');
      if (success) {
        onSuccess?.();
      }
    } catch (err) {
      setError('快速登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="login-sheet">
        <SheetHeader>
          <SheetTitle className="text-center">
            {isLogin ? '登录账户' : '创建账户'}
          </SheetTitle>
          <SheetDescription className="text-center">
            {isLogin 
              ? '登录你的甜恜故事账户，享受个性化阅读体验和云端同步功能'
              : '创建新的甜恜故事账户，开始你的精彩阅读之旅'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            {/* 邮箱输入 */}
            <div className="form-group">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="input-container">
                <Mail className="input-icon" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* 昵称输入（注册时显示） */}
            {!isLogin && (
              <div className="form-group">
                <Label htmlFor="nickname">昵称</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="请输入昵称"
                  value={formData.nickname}
                  onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  required
                  className="mobile-input"
                />
              </div>
            )}

            {/* 密码输入 */}
            <div className="form-group">
              <Label htmlFor="password">密码</Label>
              <div className="input-container">
                <Lock className="input-icon" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="input-with-icon"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="error-alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>
          </form>

          {/* 快速登录 */}
          <div className="quick-actions">
            <Button
              variant="outline"
              className="quick-login-button"
              onClick={handleQuickLogin}
              disabled={loading}
            >
              体验账户快速登录
            </Button>
          </div>

          {/* 切换登录/注册 */}
          <div className="auth-switch">
            <span className="switch-text">
              {isLogin ? '还没有账户？' : '已有账户？'}
            </span>
            <Button
              variant="ghost"
              className="switch-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setFormData({ email: '', password: '', nickname: '' });
              }}
            >
              {isLogin ? '立即注册' : '立即登录'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}