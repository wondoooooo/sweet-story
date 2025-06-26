import { ReadingHistory, Bookmark, ReadingProgress } from '../DataManager';
import { API_ENDPOINTS } from '../config/api';

// 真实的云端同步管理器（用于生产环境）
export interface CloudData {
  userId: string;
  readingHistory: ReadingHistory[];
  bookmarks: Bookmark[];
  readingProgress: { [bookId: string]: ReadingProgress };
  lastModified: number;
  version: number;
}

class RealCloudSyncManager {
  private static instance: RealCloudSyncManager;
  private authToken: string | null = null;

  static getInstance(): RealCloudSyncManager {
    if (!RealCloudSyncManager.instance) {
      RealCloudSyncManager.instance = new RealCloudSyncManager();
    }
    return RealCloudSyncManager.instance;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 上传用户数据到云端
  async uploadData(data: CloudData): Promise<boolean> {
    try {
      await this.makeRequest(API_ENDPOINTS.user.sync, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return true;
    } catch (error) {
      console.error('上传数据失败:', error);
      return false;
    }
  }

  // 从云端下载用户数据
  async downloadData(userId: string): Promise<CloudData | null> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.user.sync);
      return data;
    } catch (error) {
      console.error('下载数据失败:', error);
      return null;
    }
  }

  // 同步阅读历史
  async syncHistory(history: ReadingHistory[]): Promise<boolean> {
    try {
      await this.makeRequest(API_ENDPOINTS.user.history, {
        method: 'POST',
        body: JSON.stringify({ history }),
      });
      return true;
    } catch (error) {
      console.error('同步阅读历史失败:', error);
      return false;
    }
  }

  // 同步书签
  async syncBookmarks(bookmarks: Bookmark[]): Promise<boolean> {
    try {
      await this.makeRequest(API_ENDPOINTS.user.bookmarks, {
        method: 'POST',
        body: JSON.stringify({ bookmarks }),
      });
      return true;
    } catch (error) {
      console.error('同步书签失败:', error);
      return false;
    }
  }

  // 同步阅读进度
  async syncProgress(progress: { [bookId: string]: ReadingProgress }): Promise<boolean> {
    try {
      await this.makeRequest(API_ENDPOINTS.user.progress, {
        method: 'POST',
        body: JSON.stringify({ progress }),
      });
      return true;
    } catch (error) {
      console.error('同步阅读进度失败:', error);
      return false;
    }
  }

  // 获取书籍列表
  async getBooks(params?: { category?: string; search?: string; page?: number; limit?: number }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_ENDPOINTS.books.list}?${queryParams.toString()}`;
      return await this.makeRequest(url);
    } catch (error) {
      console.error('获取书籍列表失败:', error);
      return null;
    }
  }

  // 获取书籍详情
  async getBookDetail(bookId: string) {
    try {
      return await this.makeRequest(API_ENDPOINTS.books.detail(bookId));
    } catch (error) {
      console.error('获取书籍详情失败:', error);
      return null;
    }
  }

  // 获取章节列表
  async getChapters(bookId: string) {
    try {
      return await this.makeRequest(API_ENDPOINTS.books.chapters(bookId));
    } catch (error) {
      console.error('获取章节列表失败:', error);
      return null;
    }
  }

  // 获取章节内容
  async getChapterContent(bookId: string, chapterId: string) {
    try {
      return await this.makeRequest(API_ENDPOINTS.books.chapter(bookId, chapterId));
    } catch (error) {
      console.error('获取章节内容失败:', error);
      return null;
    }
  }
}

export const realCloudSyncManager = RealCloudSyncManager.getInstance();