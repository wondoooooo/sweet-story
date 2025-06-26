// 阅读历史数据结构
export interface ReadingHistory {
  bookId: string;
  bookTitle: string;
  author: string;
  cover: string;
  lastChapterId: string;
  lastChapterTitle: string;
  progress: number; // 0-100
  lastReadTime: number; // timestamp
  totalReadTime: number; // minutes
}

// 书签数据结构
export interface Bookmark {
  id: string;
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  position: number; // 章节内的位置百分比
  note?: string;
  createdTime: number;
}

// 阅读进度数据结构
export interface ReadingProgress {
  bookId: string;
  currentChapterId: string;
  progress: number;
  totalChapters: number;
  readChapters: string[];
}

import { cloudSyncManager, CloudData } from './CloudSyncManager';
import { authManager } from './AuthManager';

class DataManager {
  private static instance: DataManager;
  private autoSyncEnabled: boolean = true;
  private pendingChanges: boolean = false;
  private lastLocalChange: number = 0;
  
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
      DataManager.instance.initAutoSync();
    }
    return DataManager.instance;
  }

  // 初始化自动同步
  private initAutoSync() {
    // 监听认证状态变化
    authManager.onAuthStateChange((status, user) => {
      if (status === 'authenticated' && user) {
        this.syncFromCloud();
      }
    });

    // 定期自动同步（每5分钟）
    setInterval(() => {
      if (this.autoSyncEnabled && authManager.isAuthenticated() && this.pendingChanges) {
        this.syncToCloud();
      }
    }, 5 * 60 * 1000);

    // 页面卸载时同步
    window.addEventListener('beforeunload', () => {
      if (this.pendingChanges) {
        // 使用同步方式尝试最后一次同步
        this.syncToCloudSync();
      }
    });
  }

  // 标记有待同步的更改
  private markPendingChanges() {
    this.pendingChanges = true;
    this.lastLocalChange = Date.now();
    
    // 如果启用自动同步且用户已登录，延迟同步
    if (this.autoSyncEnabled && authManager.isAuthenticated()) {
      this.debouncedSync();
    }
  }

  // 防抖同步
  private syncTimer: NodeJS.Timeout | null = null;
  private debouncedSync() {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
    }
    
    this.syncTimer = setTimeout(() => {
      this.syncToCloud();
    }, 3000); // 3秒后自动同步
  }

  // 获取本地数据
  private getLocalData(): CloudData | null {
    const user = authManager.getCurrentUser();
    if (!user) return null;

    return {
      userId: user.id,
      readingHistory: this.getReadingHistory(),
      bookmarks: this.getBookmarks(),
      readingProgress: this.getAllReadingProgress(),
      lastModified: this.lastLocalChange,
      version: this.getDataVersion()
    };
  }

  // 获取数据版本
  private getDataVersion(): number {
    const version = localStorage.getItem('data_version');
    return version ? parseInt(version) : 1;
  }

  // 设置数据版本
  private setDataVersion(version: number) {
    localStorage.setItem('data_version', version.toString());
  }

  // 同步到云端
  async syncToCloud(): Promise<boolean> {
    const user = authManager.getCurrentUser();
    if (!user) return false;

    const localData = this.getLocalData();
    if (!localData) return false;

    try {
      const success = await cloudSyncManager.uploadData(localData);
      if (success) {
        this.pendingChanges = false;
        this.setDataVersion(localData.version);
        
        // 更新用户的最后同步时间
        user.lastSyncTime = Date.now();
        localStorage.setItem('current_user', JSON.stringify(user));
      }
      return success;
    } catch (error) {
      console.error('同步到云端失败:', error);
      return false;
    }
  }

  // 同步方式上传（用于页面卸载时）
  private syncToCloudSync() {
    const localData = this.getLocalData();
    if (!localData) return;

    try {
      // 使用同步方式保存关键数据
      const cloudKey = `cloud_data_${localData.userId}`;
      localStorage.setItem(cloudKey, JSON.stringify(localData));
      this.pendingChanges = false;
    } catch (error) {
      console.error('同步保存失败:', error);
    }
  }

  // 从云端同步
  async syncFromCloud(): Promise<boolean> {
    const user = authManager.getCurrentUser();
    if (!user) return false;

    try {
      const remoteData = await cloudSyncManager.downloadData(user.id);
      if (!remoteData) {
        // 云端没有数据，上传本地数据
        return await this.syncToCloud();
      }

      const localData = this.getLocalData();
      if (!localData) {
        // 本地没有数据，直接使用云端数据
        this.applyCloudData(remoteData);
        return true;
      }

      // 检查数据冲突
      const conflicts = cloudSyncManager.detectConflicts(localData, remoteData);
      
      if (conflicts.length > 0) {
        // 有冲突，需要用户选择
        cloudSyncManager['notifyConflicts'](conflicts);
        return false;
      } else {
        // 无冲突，自动合并
        const mergedData = cloudSyncManager.mergeData(localData, remoteData);
        this.applyCloudData(mergedData);
        this.setDataVersion(mergedData.version);
        return true;
      }
    } catch (error) {
      console.error('从云端同步失败:', error);
      return false;
    }
  }

  // 应用云端数据到本地
  private applyCloudData(cloudData: CloudData) {
    // 保存阅读历史
    localStorage.setItem('reading-history', JSON.stringify(cloudData.readingHistory));
    
    // 保存书签
    localStorage.setItem('bookmarks', JSON.stringify(cloudData.bookmarks));
    
    // 保存阅读进度
    Object.entries(cloudData.readingProgress).forEach(([bookId, progress]) => {
      localStorage.setItem(`progress-${bookId}`, JSON.stringify(progress));
    });

    this.lastLocalChange = cloudData.lastModified;
    this.pendingChanges = false;
  }

  // 获取所有阅读进度
  private getAllReadingProgress(): { [bookId: string]: ReadingProgress } {
    const progress: { [bookId: string]: ReadingProgress } = {};
    
    // 遍历localStorage寻找progress-前缀的键
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('progress-')) {
        const bookId = key.replace('progress-', '');
        const progressData = localStorage.getItem(key);
        if (progressData) {
          try {
            progress[bookId] = JSON.parse(progressData);
          } catch (error) {
            console.error(`解析进度数据失败: ${key}`, error);
          }
        }
      }
    }
    
    return progress;
  }

  // 手动同步
  async manualSync(): Promise<boolean> {
    return await this.syncToCloud();
  }

  // 强制从云端同步
  async forceSync(): Promise<boolean> {
    return await this.syncFromCloud();
  }

  // 设置自动同步
  setAutoSync(enabled: boolean) {
    this.autoSyncEnabled = enabled;
    localStorage.setItem('auto_sync_enabled', enabled.toString());
  }

  // 获取自动同步状态
  getAutoSyncEnabled(): boolean {
    const saved = localStorage.getItem('auto_sync_enabled');
    return saved !== null ? saved === 'true' : true;
  }

  // 检查是否有待同步的更改
  hasPendingChanges(): boolean {
    return this.pendingChanges;
  }

  // 阅读历史管理
  getReadingHistory(): ReadingHistory[] {
    const history = localStorage.getItem('reading-history');
    return history ? JSON.parse(history) : [];
  }

  addToHistory(bookId: string, bookTitle: string, author: string, cover: string, chapterId: string, chapterTitle: string) {
    const history = this.getReadingHistory();
    const existingIndex = history.findIndex(h => h.bookId === bookId);
    
    const historyItem: ReadingHistory = {
      bookId,
      bookTitle,
      author,
      cover,
      lastChapterId: chapterId,
      lastChapterTitle: chapterTitle,
      progress: this.calculateProgress(bookId, chapterId),
      lastReadTime: Date.now(),
      totalReadTime: existingIndex >= 0 ? history[existingIndex].totalReadTime + 1 : 1
    };

    if (existingIndex >= 0) {
      history[existingIndex] = historyItem;
    } else {
      history.unshift(historyItem);
    }

    // 只保留最近50条记录
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem('reading-history', JSON.stringify(history));
    this.markPendingChanges();
  }

  // 书签管理
  getBookmarks(): Bookmark[] {
    const bookmarks = localStorage.getItem('bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  }

  addBookmark(bookId: string, bookTitle: string, chapterId: string, chapterTitle: string, position: number, note?: string): string {
    const bookmarks = this.getBookmarks();
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      bookId,
      bookTitle,
      chapterId,
      chapterTitle,
      position,
      note,
      createdTime: Date.now()
    };

    bookmarks.unshift(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    this.markPendingChanges();
    return bookmark.id;
  }

  removeBookmark(bookmarkId: string) {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem('bookmarks', JSON.stringify(filtered));
    this.markPendingChanges();
  }

  getBookmarksByBook(bookId: string): Bookmark[] {
    return this.getBookmarks().filter(b => b.bookId === bookId);
  }

  // 阅读进度管理
  getReadingProgress(bookId: string): ReadingProgress | null {
    const progress = localStorage.getItem(`progress-${bookId}`);
    return progress ? JSON.parse(progress) : null;
  }

  updateReadingProgress(bookId: string, chapterId: string, totalChapters: number) {
    const existing = this.getReadingProgress(bookId);
    const readChapters = existing ? existing.readChapters : [];
    
    if (!readChapters.includes(chapterId)) {
      readChapters.push(chapterId);
    }

    const progress: ReadingProgress = {
      bookId,
      currentChapterId: chapterId,
      progress: (readChapters.length / totalChapters) * 100,
      totalChapters,
      readChapters
    };

    localStorage.setItem(`progress-${bookId}`, JSON.stringify(progress));
    this.markPendingChanges();
  }

  private calculateProgress(bookId: string, chapterId: string): number {
    const progress = this.getReadingProgress(bookId);
    if (!progress) return 0;
    return Math.round(progress.progress);
  }
}

export const dataManager = DataManager.getInstance();