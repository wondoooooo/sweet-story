import { User } from './CloudSyncManager';

// 认证状态
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// 登录凭据
export interface LoginCredentials {
  email: string;
  password: string;
}

// 注册信息
export interface RegisterInfo {
  email: string;
  password: string;
  nickname: string;
}

class AuthManager {
  private static instance: AuthManager;
  private currentUser: User | null = null;
  private authStatus: AuthStatus = 'loading';
  private authListeners: Array<(status: AuthStatus, user: User | null) => void> = [];

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
      AuthManager.instance.initAuth();
    }
    return AuthManager.instance;
  }

  // 初始化认证状态
  private async initAuth() {
    try {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.authStatus = 'authenticated';
      } else {
        this.authStatus = 'unauthenticated';
      }
    } catch (error) {
      console.error('初始化认证失败:', error);
      this.authStatus = 'unauthenticated';
    }
    
    this.notifyAuthChange();
  }

  // 监听认证状态变化
  onAuthStateChange(listener: (status: AuthStatus, user: User | null) => void) {
    this.authListeners.push(listener);
    // 立即调用一次，提供当前状态
    listener(this.authStatus, this.currentUser);
    
    return () => {
      const index = this.authListeners.indexOf(listener);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthChange() {
    this.authListeners.forEach(listener => listener(this.authStatus, this.currentUser));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAuthStatus(): AuthStatus {
    return this.authStatus;
  }

  isAuthenticated(): boolean {
    return this.authStatus === 'authenticated' && this.currentUser !== null;
  }

  // 模拟登录API
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // 模拟用户数据库查询
      const usersKey = 'mock_users_db';
      const usersData = localStorage.getItem(usersKey);
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      const user = users.find(u => u.email === credentials.email);

      // 简单的模拟认证（实际应用中需要安全的密码验证）
      if (!user) {
        return { success: false, message: '用户不存在' };
      }

      // 模拟密码验证（实际应用中应该验证哈希密码）
      const savedPassword = localStorage.getItem(`user_password_${user.id}`);
      if (savedPassword !== credentials.password) {
        return { success: false, message: '密码错误' };
      }

      // 登录成功
      user.lastSyncTime = Date.now();
      this.currentUser = user;
      this.authStatus = 'authenticated';
      
      localStorage.setItem('current_user', JSON.stringify(user));
      this.notifyAuthChange();

      return { success: true, user };
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: '登录失败，请稍后重试' };
    }
  }

  // 模拟注册API
  async register(info: RegisterInfo): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

      // 检查邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(info.email)) {
        return { success: false, message: '邮箱格式不正确' };
      }

      // 检查密码强度
      if (info.password.length < 6) {
        return { success: false, message: '密码至少需要6位' };
      }

      // 检查昵称
      if (info.nickname.trim().length < 2) {
        return { success: false, message: '昵称至少需要2个字符' };
      }

      // 模拟用户数据库
      const usersKey = 'mock_users_db';
      const usersData = localStorage.getItem(usersKey);
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      // 检查邮箱是否已存在
      if (users.some(u => u.email === info.email)) {
        return { success: false, message: '邮箱已被注册' };
      }

      // 创建新用户
      const newUser: User = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email: info.email,
        nickname: info.nickname.trim(),
        createdAt: Date.now(),
        lastSyncTime: Date.now()
      };

      // 保存用户
      users.push(newUser);
      localStorage.setItem(usersKey, JSON.stringify(users));
      localStorage.setItem(`user_password_${newUser.id}`, info.password);

      // 自动登录
      this.currentUser = newUser;
      this.authStatus = 'authenticated';
      localStorage.setItem('current_user', JSON.stringify(newUser));
      this.notifyAuthChange();

      return { success: true, user: newUser };
    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, message: '注册失败，请稍后重试' };
    }
  }

  // 登出
  async logout(): Promise<void> {
    this.currentUser = null;
    this.authStatus = 'unauthenticated';
    localStorage.removeItem('current_user');
    this.notifyAuthChange();
  }

  // 更新用户信息
  async updateUser(updates: Partial<Pick<User, 'nickname' | 'avatar'>>): Promise<{ success: boolean; message?: string }> {
    if (!this.currentUser) {
      return { success: false, message: '用户未登录' };
    }

    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新用户信息
      const updatedUser = { ...this.currentUser, ...updates };
      
      // 更新数据库
      const usersKey = 'mock_users_db';
      const usersData = localStorage.getItem(usersKey);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      const userIndex = users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        localStorage.setItem(usersKey, JSON.stringify(users));
      }

      // 更新当前用户
      this.currentUser = updatedUser;
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      this.notifyAuthChange();

      return { success: true };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, message: '更新失败，请稍后重试' };
    }
  }
}

export const authManager = AuthManager.getInstance();