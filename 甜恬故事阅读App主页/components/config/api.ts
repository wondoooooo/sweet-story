// API配置文件
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  environment: import.meta.env.VITE_ENV || 'development',
  isDevelopment: import.meta.env.VITE_ENV === 'development',
  isProduction: import.meta.env.VITE_ENV === 'production',
};

// API端点
export const API_ENDPOINTS = {
  // 用户认证
  auth: {
    login: `${config.apiUrl}/api/auth/login`,
    register: `${config.apiUrl}/api/auth/register`,
    logout: `${config.apiUrl}/api/auth/logout`,
    refresh: `${config.apiUrl}/api/auth/refresh`,
    profile: `${config.apiUrl}/api/auth/profile`,
  },
  
  // 书籍相关
  books: {
    list: `${config.apiUrl}/api/books`,
    detail: (id: string) => `${config.apiUrl}/api/books/${id}`,
    chapters: (id: string) => `${config.apiUrl}/api/books/${id}/chapters`,
    chapter: (bookId: string, chapterId: string) => 
      `${config.apiUrl}/api/books/${bookId}/chapters/${chapterId}`,
  },
  
  // 用户数据
  user: {
    history: `${config.apiUrl}/api/user/history`,
    bookmarks: `${config.apiUrl}/api/user/bookmarks`,
    progress: `${config.apiUrl}/api/user/progress`,
    sync: `${config.apiUrl}/api/user/sync`,
  }
};

export default config;