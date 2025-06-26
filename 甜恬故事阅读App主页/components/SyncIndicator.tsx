import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Wifi, 
  WifiOff,
  Settings
} from 'lucide-react';
import { cloudSyncManager, SyncStatus } from './CloudSyncManager';
import { authManager } from './AuthManager';
import { dataManager } from './DataManager';

export function SyncIndicator() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(dataManager.getAutoSyncEnabled());
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 监听同步状态
    const unsubscribeSync = cloudSyncManager.onSyncStatusChange((status) => {
      setSyncStatus(status);
      if (status === 'success') {
        setLastSyncTime(Date.now());
        setHasPendingChanges(false);
      }
    });

    // 监听认证状态
    const unsubscribeAuth = authManager.onAuthStateChange((status) => {
      setIsAuthenticated(status === 'authenticated');
    });

    // 监听网络状态
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 定期检查待同步状态
    const checkPendingInterval = setInterval(() => {
      setHasPendingChanges(dataManager.hasPendingChanges());
    }, 1000);

    return () => {
      unsubscribeSync();
      unsubscribeAuth();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(checkPendingInterval);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isAuthenticated) return;
    await dataManager.manualSync();
  };

  const handleToggleAutoSync = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    dataManager.setAutoSync(enabled);
  };

  const formatLastSyncTime = (timestamp: number) => {
    if (!timestamp) return '从未同步';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) {
      return '刚刚同步';
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours}小时前`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days}天前`;
    }
  };

  const getSyncIcon = () => {
    if (!isAuthenticated) {
      return <CloudOff className="w-4 h-4" />;
    }
    
    if (!isOnline) {
      return <WifiOff className="w-4 h-4" />;
    }

    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return hasPendingChanges ? <Cloud className="w-4 h-4" /> : <Check className="w-4 h-4" />;
    }
  };

  const getSyncColor = () => {
    if (!isAuthenticated || !isOnline) {
      return 'text-muted-foreground';
    }

    switch (syncStatus) {
      case 'syncing':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return hasPendingChanges ? 'text-orange-500' : 'text-green-500';
    }
  };

  const getSyncText = () => {
    if (!isAuthenticated) {
      return '未登录';
    }
    
    if (!isOnline) {
      return '离线';
    }

    switch (syncStatus) {
      case 'syncing':
        return '同步中...';
      case 'success':
        return '已同步';
      case 'error':
        return '同步失败';
      default:
        return hasPendingChanges ? '待同步' : '已同步';
    }
  };

  if (!isAuthenticated) {
    return null; // 未登录时不显示同步指示器
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className={getSyncColor()}>
            {getSyncIcon()}
          </span>
          <span className="text-xs">{getSyncText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <h4>云端同步</h4>
          </div>

          {/* 网络状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
              <span className="text-sm">网络状态</span>
            </div>
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? '在线' : '离线'}
            </Badge>
          </div>

          {/* 同步状态 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">同步状态</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${getSyncColor()}`}>
                  {getSyncIcon()}
                </span>
                <span className="text-sm">{getSyncText()}</span>
              </div>
            </div>
            
            {syncStatus === 'syncing' && (
              <Progress value={undefined} className="h-2" />
            )}
          </div>

          {/* 最后同步时间 */}
          <div className="flex items-center justify-between text-sm">
            <span>最后同步</span>
            <span className="text-muted-foreground">
              {formatLastSyncTime(lastSyncTime)}
            </span>
          </div>

          {/* 待同步更改 */}
          {hasPendingChanges && (
            <div className="flex items-center justify-between text-sm">
              <span>待同步更改</span>
              <Badge variant="outline" className="text-orange-600">
                有更改
              </Badge>
            </div>
          )}

          {/* 自动同步开关 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-sync" className="text-sm">
              自动同步
            </Label>
            <Switch
              id="auto-sync"
              checked={autoSyncEnabled}
              onCheckedChange={handleToggleAutoSync}
            />
          </div>

          {/* 手动同步按钮 */}
          <Button 
            className="w-full" 
            size="sm"
            onClick={handleManualSync}
            disabled={!isOnline || syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                同步中...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 mr-2" />
                立即同步
              </>
            )}
          </Button>

          {/* 提示信息 */}
          <div className="text-xs text-muted-foreground">
            {!isOnline && (
              <p>• 当前离线，数据将在恢复网络后自动同步</p>
            )}
            {autoSyncEnabled && (
              <p>• 阅读数据会自动同步到云端</p>
            )}
            {!autoSyncEnabled && (
              <p>• 自动同步已关闭，需要手动同步数据</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}