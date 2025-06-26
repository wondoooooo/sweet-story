import { ReadingHistory, Bookmark, ReadingProgress } from './DataManager';

// 用户数据结构
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  createdAt: number;
  lastSyncTime: number;
}

// 同步状态
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'conflict';

// 云端数据结构
export interface CloudData {
  userId: string;
  readingHistory: ReadingHistory[];
  bookmarks: Bookmark[];
  readingProgress: { [bookId: string]: ReadingProgress };
  lastModified: number;
  version: number;
}

// 同步冲突数据
export interface SyncConflict {
  type: 'history' | 'bookmark' | 'progress';
  local: any;
  remote: any;
  bookId?: string;
}

class CloudSyncManager {
  private static instance: CloudSyncManager;
  private syncStatus: SyncStatus = 'idle';
  private lastSyncTime: number = 0;
  private syncListeners: Array<(status: SyncStatus) => void> = [];
  private conflictListeners: Array<(conflicts: SyncConflict[]) => void> = [];

  static getInstance(): CloudSyncManager {
    if (!CloudSyncManager.instance) {
      CloudSyncManager.instance = new CloudSyncManager();
    }
    return CloudSyncManager.instance;
  }

  // 状态监听
  onSyncStatusChange(listener: (status: SyncStatus) => void) {
    this.syncListeners.push(listener);
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) {
        this.syncListeners.splice(index, 1);
      }
    };
  }

  onConflictDetected(listener: (conflicts: SyncConflict[]) => void) {
    this.conflictListeners.push(listener);
    return () => {
      const index = this.conflictListeners.indexOf(listener);
      if (index > -1) {
        this.conflictListeners.splice(index, 1);
      }
    };
  }

  private notifyStatusChange(status: SyncStatus) {
    this.syncStatus = status;
    this.syncListeners.forEach(listener => listener(status));
  }

  private notifyConflicts(conflicts: SyncConflict[]) {
    this.conflictListeners.forEach(listener => listener(conflicts));
  }

  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  // 模拟API调用 - 上传数据到云端
  async uploadData(data: CloudData): Promise<boolean> {
    try {
      this.notifyStatusChange('syncing');
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // 模拟随机失败（10%概率）
      if (Math.random() < 0.1) {
        throw new Error('网络连接失败');
      }

      // 保存到模拟的云端存储
      const cloudKey = `cloud_data_${data.userId}`;
      localStorage.setItem(cloudKey, JSON.stringify(data));
      
      this.lastSyncTime = Date.now();
      this.notifyStatusChange('success');
      
      // 2秒后重置状态
      setTimeout(() => this.notifyStatusChange('idle'), 2000);
      
      return true;
    } catch (error) {
      console.error('上传数据失败:', error);
      this.notifyStatusChange('error');
      
      // 3秒后重置状态
      setTimeout(() => this.notifyStatusChange('idle'), 3000);
      
      return false;
    }
  }

  // 模拟API调用 - 从云端下载数据
  async downloadData(userId: string): Promise<CloudData | null> {
    try {
      this.notifyStatusChange('syncing');
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      // 模拟随机失败（5%概率）
      if (Math.random() < 0.05) {
        throw new Error('网络连接失败');
      }

      const cloudKey = `cloud_data_${userId}`;
      const cloudDataStr = localStorage.getItem(cloudKey);
      
      if (!cloudDataStr) {
        this.notifyStatusChange('idle');
        return null;
      }

      const cloudData = JSON.parse(cloudDataStr) as CloudData;
      this.lastSyncTime = Date.now();
      this.notifyStatusChange('success');
      
      // 2秒后重置状态
      setTimeout(() => this.notifyStatusChange('idle'), 2000);
      
      return cloudData;
    } catch (error) {
      console.error('下载数据失败:', error);
      this.notifyStatusChange('error');
      
      // 3秒后重置状态
      setTimeout(() => this.notifyStatusChange('idle'), 3000);
      
      return null;
    }
  }

  // 检测并解决数据冲突
  detectConflicts(localData: CloudData, remoteData: CloudData): SyncConflict[] {
    const conflicts: SyncConflict[] = [];

    // 检查阅读历史冲突
    const localHistoryMap = new Map(localData.readingHistory.map(h => [h.bookId, h]));
    const remoteHistoryMap = new Map(remoteData.readingHistory.map(h => [h.bookId, h]));

    for (const [bookId, localHistory] of localHistoryMap) {
      const remoteHistory = remoteHistoryMap.get(bookId);
      if (remoteHistory && localHistory.lastReadTime !== remoteHistory.lastReadTime) {
        // 如果最后阅读时间不同，可能存在冲突
        if (Math.abs(localHistory.lastReadTime - remoteHistory.lastReadTime) > 60000) { // 1分钟差异
          conflicts.push({
            type: 'history',
            local: localHistory,
            remote: remoteHistory,
            bookId
          });
        }
      }
    }

    // 检查书签冲突
    const localBookmarks = localData.bookmarks.filter(b => 
      !remoteData.bookmarks.some(rb => rb.id === b.id)
    );
    const remoteBookmarks = remoteData.bookmarks.filter(b => 
      !localData.bookmarks.some(lb => lb.id === b.id)
    );

    if (localBookmarks.length > 0 || remoteBookmarks.length > 0) {
      // 如果有不同的书签，标记为潜在冲突
      for (const bookmark of localBookmarks) {
        const samePositionRemote = remoteData.bookmarks.find(rb => 
          rb.bookId === bookmark.bookId && 
          rb.chapterId === bookmark.chapterId &&
          Math.abs(rb.position - bookmark.position) < 0.1
        );
        if (samePositionRemote) {
          conflicts.push({
            type: 'bookmark',
            local: bookmark,
            remote: samePositionRemote
          });
        }
      }
    }

    return conflicts;
  }

  // 合并数据（自动解决简单冲突）
  mergeData(localData: CloudData, remoteData: CloudData): CloudData {
    const merged: CloudData = {
      userId: localData.userId,
      readingHistory: [],
      bookmarks: [],
      readingProgress: { ...localData.readingProgress },
      lastModified: Math.max(localData.lastModified, remoteData.lastModified),
      version: Math.max(localData.version, remoteData.version) + 1
    };

    // 合并阅读历史 - 保留最新的记录
    const historyMap = new Map<string, ReadingHistory>();
    
    [...localData.readingHistory, ...remoteData.readingHistory].forEach(history => {
      const existing = historyMap.get(history.bookId);
      if (!existing || history.lastReadTime > existing.lastReadTime) {
        historyMap.set(history.bookId, history);
      }
    });
    
    merged.readingHistory = Array.from(historyMap.values())
      .sort((a, b) => b.lastReadTime - a.lastReadTime);

    // 合并书签 - 保留所有唯一书签
    const bookmarkMap = new Map<string, Bookmark>();
    
    [...localData.bookmarks, ...remoteData.bookmarks].forEach(bookmark => {
      bookmarkMap.set(bookmark.id, bookmark);
    });
    
    merged.bookmarks = Array.from(bookmarkMap.values())
      .sort((a, b) => b.createdTime - a.createdTime);

    // 合并阅读进度 - 保留最新的进度
    Object.entries(remoteData.readingProgress).forEach(([bookId, progress]) => {
      const localProgress = merged.readingProgress[bookId];
      if (!localProgress || progress.progress > localProgress.progress) {
        merged.readingProgress[bookId] = progress;
      }
    });

    return merged;
  }

  // 强制解决冲突
  resolveConflicts(
    localData: CloudData, 
    remoteData: CloudData, 
    resolutions: { [conflictIndex: number]: 'local' | 'remote' | 'merge' }
  ): CloudData {
    const conflicts = this.detectConflicts(localData, remoteData);
    let resolved = this.mergeData(localData, remoteData);

    conflicts.forEach((conflict, index) => {
      const resolution = resolutions[index];
      if (!resolution) return;

      switch (conflict.type) {
        case 'history':
          if (resolution === 'local') {
            const historyIndex = resolved.readingHistory.findIndex(h => h.bookId === conflict.bookId);
            if (historyIndex >= 0) {
              resolved.readingHistory[historyIndex] = conflict.local;
            }
          } else if (resolution === 'remote') {
            const historyIndex = resolved.readingHistory.findIndex(h => h.bookId === conflict.bookId);
            if (historyIndex >= 0) {
              resolved.readingHistory[historyIndex] = conflict.remote;
            }
          }
          break;

        case 'bookmark':
          if (resolution === 'local') {
            resolved.bookmarks = resolved.bookmarks.filter(b => b.id !== conflict.remote.id);
            if (!resolved.bookmarks.find(b => b.id === conflict.local.id)) {
              resolved.bookmarks.push(conflict.local);
            }
          } else if (resolution === 'remote') {
            resolved.bookmarks = resolved.bookmarks.filter(b => b.id !== conflict.local.id);
            if (!resolved.bookmarks.find(b => b.id === conflict.remote.id)) {
              resolved.bookmarks.push(conflict.remote);
            }
          }
          break;
      }
    });

    resolved.version += 1;
    resolved.lastModified = Date.now();

    return resolved;
  }
}

export const cloudSyncManager = CloudSyncManager.getInstance();