import { useState, useEffect } from 'react';
import { cloudSyncManager } from '../CloudSyncManager';
import { authManager } from '../AuthManager';
import { Cloud, CloudOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncIndicatorProps {
  mobile?: boolean;
}

export function SyncIndicator({ mobile = false }: SyncIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // 监听网络状态
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // 监听同步状态变化
    const unsubscribe = cloudSyncManager.onSyncStatusChange((status) => {
      setSyncStatus(status === 'conflict' ? 'error' : status);
      if (status === 'success') {
        setLastSyncTime(cloudSyncManager.getLastSyncTime());
      }
    });

    return unsubscribe;
  }, []);

  const getStatusIcon = () => {
    if (!isOnline) {
      return <CloudOff className="w-4 h-4 text-muted-foreground" />;
    }

    switch (syncStatus) {
      case 'syncing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Cloud className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) {
      return '离线';
    }

    switch (syncStatus) {
      case 'syncing':
        return '同步中...';
      case 'success':
        return lastSyncTime ? formatSyncTime(lastSyncTime) : '已同步';
      case 'error':
        return '同步失败';
      default:
        return '等待同步';
    }
  };

  const formatSyncTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚同步';
    } else if (diff < 3600000) { // 1小时内
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    } else if (diff < 86400000) { // 24小时内
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }
  };

  const handleSyncClick = async () => {
    if (syncStatus === 'syncing' || !isOnline) return;
    
    try {
      // 触发手动同步
      const dataManager = await import('../DataManager').then(m => m.dataManager);
      await dataManager.manualSync();
    } catch (error) {
      console.error('手动同步失败:', error);
    }
  };

  if (mobile) {
    return (
      <div className="mobile-sync-indicator">
        <button 
          onClick={handleSyncClick}
          disabled={syncStatus === 'syncing' || !isOnline}
          className="sync-button"
        >
          {getStatusIcon()}
          <span className="sync-text">{getStatusText()}</span>
        </button>
      </div>
    );
  }

  // 桌面版保持原有设计
  return (
    <div className="desktop-sync-indicator">
      {/* 原有的桌面版布局 */}
    </div>
  );
}