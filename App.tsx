import { useState, useMemo, useEffect } from 'react';
import { BookCard } from './components/mobile/BookCard';
import { ReadingPage } from './components/mobile/ReadingPage';
import { UserCenter } from './components/mobile/UserCenter';
import { LoginSheet } from './components/mobile/LoginSheet';
import { SyncIndicator } from './components/mobile/SyncIndicator';
import { BottomNavigation } from './components/mobile/BottomNavigation';
import { FilterPage } from './components/mobile/FilterPage';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Search, Filter } from 'lucide-react';
import { authManager, AuthStatus } from './components/AuthManager';
import { User as UserType } from './components/CloudSyncManager';

// 书籍数据类型定义
interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  readCount: string;
  status: '连载中' | '已完结';
  cover: string;
  description?: string;
}

// 模拟书籍数据
const mockBooks: Book[] = [
  // 小说类
  {
    id: '2',
    title: '修真界第一商人',
    author: '笔下生财',
    category: '小说',
    rating: 4.4,
    readCount: '8.7万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: '现代商人穿越修真世界，用商业思维在修真界掀起一场变革。'
  },
  {
    id: '6',
    title: '科技创业传奇',
    author: '硅谷梦想家',
    category: '小说',
    rating: 4.3,
    readCount: '11.4万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=300&fit=crop',
    description: '科技创业者的奋斗史，从车库起家到成为科技巨头的传奇历程。'
  },
  
  // 知识类
  {
    id: '3',
    title: '职场风云录',
    author: '白领人生',
    category: '知识',
    rating: 4.2,
    readCount: '15.6万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    description: '描述现代职场人士的奋斗历程，展现职场智慧与人情冷暖。'
  },
  {
    id: '7',
    title: '经济学原理详解',
    author: '经济学者',
    category: '知识',
    rating: 4.6,
    readCount: '7.3万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=300&fit=crop',
    description: '深入浅出地讲解经济学基本原理，适合入门学习。'
  },

  // 听书类
  {
    id: '4',
    title: '金融狼道',
    author: '华尔街老手',
    category: '听书',
    rating: 4.5,
    readCount: '9.8万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=300&fit=crop',
    description: '揭秘金融市场内幕，展现金融精英的博弈与较量。'
  },
  {
    id: '8',
    title: '商业智慧音频课',
    author: '商业导师',
    category: '听书',
    rating: 4.4,
    readCount: '12.1万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    description: '商业智慧和管理经验的音频分享，提升职场竞争力。'
  },

  // 广播剧类
  {
    id: '5',
    title: '历史的转折点',
    author: '史学家',
    category: '广播剧',
    rating: 4.7,
    readCount: '6.2万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: '以历史为背景，讲述关键时刻影响历史进程的人物故事。'
  },
  {
    id: '9',
    title: '三国风云',
    author: '历史剧团',
    category: '广播剧',
    rating: 4.8,
    readCount: '18.5万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: '经典三国故事的现代演绎，声音表演精彩纷呈。'
  },

  // 灵异类
  {
    id: '10',
    title: '午夜凶铃',
    author: '暗夜写手',
    category: '灵异',
    rating: 4.6,
    readCount: '23.4万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=200&h=300&fit=crop',
    description: '深夜传来的神秘电话，揭开一段尘封已久的恐怖往事。'
  },
  {
    id: '11',
    title: '诡异公寓',
    author: '鬼话连篇',
    category: '灵异',
    rating: 4.3,
    readCount: '19.7万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=300&fit=crop',
    description: '搬进便宜公寓后，奇怪的事情接二连三地发生...'
  },

  // 悬疑类
  {
    id: '14',
    title: '密室杀机',
    author: '推理大师',
    category: '悬疑',
    rating: 4.8,
    readCount: '42.1万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    description: '封闭的房间，离奇的死亡，究竟谁是真正的凶手？'
  },
  {
    id: '15',
    title: '消失的证人',
    author: '悬疑高手',
    category: '悬疑',
    rating: 4.5,
    readCount: '28.9万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: '关键证人神秘失踪，案件陷入迷雾，真相扑朔迷离。'
  },

  // 末世类
  {
    id: '18',
    title: '末日求生',
    author: '废土行者',
    category: '末世',
    rating: 4.7,
    readCount: '67.3万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=300&fit=crop',
    description: '丧尸病毒爆发后，普通人的生存之路充满挑战。'
  },
  {
    id: '19',
    title: '核冬之后',
    author: '废墟诗人',
    category: '末世',
    rating: 4.5,
    readCount: '45.8万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=200&h=300&fit=crop',
    description: '核战争后的世界，人类在废墟中寻找希望的光芒。'
  },

  // 脑洞类
  {
    id: '22',
    title: '意识上传',
    author: '未来想象家',
    category: '脑洞',
    rating: 4.4,
    readCount: '29.6万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    description: '人类意识可以上传到云端，但虚拟世界暗藏危机。'
  },
  {
    id: '23',
    title: '平行宇宙咖啡厅',
    author: '奇思妙想',
    category: '脑洞',
    rating: 4.2,
    readCount: '24.7万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: '神奇的咖啡厅，每扇门都通向不同的平行宇宙。'
  },

  // 追夫火葬场类
  {
    id: '26',
    title: '前夫求复合',
    author: '都市情感师',
    category: '追夫火葬场',
    rating: 4.3,
    readCount: '89.4万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=300&fit=crop',
    description: '离婚后前夫各种求复合，但女主已经重新开始新生活。'
  },
  {
    id: '27',
    title: '总裁的悔恨',
    author: '霸总专业户',
    category: '追夫火葬场',
    rating: 4.1,
    readCount: '76.2万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=200&h=300&fit=crop',
    description: '冷漠总裁错失真爱后，才发现她的珍贵，但为时已晚。'
  },

  // 言情类
  {
    id: '30',
    title: '星辰大海的你',
    author: '浪漫小说家',
    category: '言情',
    rating: 4.7,
    readCount: '125.6万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    description: '航天工程师与天体物理学家的跨越星辰的爱恋。'
  },
  {
    id: '31',
    title: '初恋这件小事',
    author: '青春记忆',
    category: '言情',
    rating: 4.5,
    readCount: '98.3万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: '校园里的青涩初恋，多年后在职场重逢的故事。'
  },

  // 惊悚类
  {
    id: '34',
    title: '血色玫瑰',
    author: '惊悚大师',
    category: '惊悚',
    rating: 4.5,
    readCount: '73.2万',
    status: '已完结',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=300&fit=crop',
    description: '连环杀手在每个案发现场都留下一朵血色玫瑰。'
  },
  {
    id: '35',
    title: '深夜访客',
    author: '恐怖作家',
    category: '惊悚',
    rating: 4.3,
    readCount: '56.7万',
    status: '连载中',
    cover: 'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=200&h=300&fit=crop',
    description: '每到深夜，总有神秘访客敲响房门，带来不祥预感。'
  }
];

// 内容分类
const contentTypes = ['推荐', '小说', '知识', '听书', '广播剧'];

export default function App() {
  // 状态管理
  const [selectedContentType, setSelectedContentType] = useState('推荐');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('推荐');
  const [currentView, setCurrentView] = useState<'home' | 'reading' | 'user' | 'discover' | 'messages' | 'filter'>('home');
  const [currentBook, setCurrentBook] = useState<{id: string, title: string, author: string} | null>(null);
  const [initialChapterId, setInitialChapterId] = useState<string | undefined>(undefined);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // 认证状态监听
  useEffect(() => {
    const unsubscribe = authManager.onAuthStateChange((status, user) => {
      setAuthStatus(status);
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // 创建测试用户
  useEffect(() => {
    const usersData = localStorage.getItem('mock_users_db');
    const users = usersData ? JSON.parse(usersData) : [];
    
    if (!users.some((u: UserType) => u.email === 'test@example.com')) {
      const testUser: UserType = {
        id: 'test_user_001',
        email: 'test@example.com',
        nickname: '测试用户',
        createdAt: Date.now(),
        lastSyncTime: Date.now()
      };
      
      users.push(testUser);
      localStorage.setItem('mock_users_db', JSON.stringify(users));
      localStorage.setItem('user_password_test_user_001', '123456');
    }
  }, []);

  // 书籍筛选逻辑
  const filteredBooks = useMemo(() => {
    let filtered = mockBooks;

    if (selectedFilterCategory !== '推荐') {
      filtered = filtered.filter(book => book.category === selectedFilterCategory);
    } else if (selectedContentType !== '推荐') {
      filtered = filtered.filter(book => book.category === selectedContentType);
    }

    if (headerSearchQuery.trim()) {
      const query = headerSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedContentType, selectedFilterCategory, headerSearchQuery]);

  // 事件处理函数
  const handleRead = (bookId: string, chapterId?: string) => {
    const book = mockBooks.find(b => b.id === bookId);
    if (book) {
      setCurrentBook({ id: book.id, title: book.title, author: book.author });
      setInitialChapterId(chapterId);
      setCurrentView('reading');
    }
  };

  const handlePlay = (bookId: string) => {
    console.log('Playing audio for book:', bookId);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentBook(null);
    setInitialChapterId(undefined);
  };

  const handleNavigation = (view: 'home' | 'user' | 'discover' | 'messages') => {
    setCurrentView(view);
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterCategorySelect = (category: string) => {
    setSelectedFilterCategory(category);
    if (contentTypes.includes(category)) {
      setSelectedContentType(category);
    } else {
      setSelectedContentType('推荐');
    }
  };

  const handleTabSelect = (type: string) => {
    setSelectedContentType(type);
    setSelectedFilterCategory(type);
  };

  const handleFilterButtonClick = () => {
    setCurrentView('filter');
  };

  const handleFilterPageBack = () => {
    setCurrentView('home');
  };

  const getCurrentCategoryName = () => {
    if (selectedFilterCategory !== '推荐') {
      return selectedFilterCategory;
    }
    if (selectedContentType !== '推荐') {
      return selectedContentType;
    }
    return '为你推荐';
  };

  // 阅读页面
  if (currentView === 'reading' && currentBook) {
    return (
      <div className="ios-app">
        <ReadingPage 
          book={currentBook} 
          initialChapterId={initialChapterId}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

  // 筛选页面
  if (currentView === 'filter') {
    return (
      <div className="ios-app">
        <FilterPage
          onBack={handleFilterPageBack}
          onCategorySelect={handleFilterCategorySelect}
          selectedCategory={selectedFilterCategory}
        />
      </div>
    );
  }

  // 主应用界面
  return (
    <div className="ios-app">
      <div className="app-content">
        {/* 顶部导航栏 */}
        <header className="app-header">
          <div className="header-content">            
            <div className="header-search">
              <form onSubmit={handleHeaderSearchSubmit} className="search-form">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <Input
                    type="text"
                    placeholder="搜索书籍、作者..."
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    className="header-search-input"
                  />
                </div>
              </form>
            </div>

            <div className="header-actions">
              <Button 
                variant="ghost" 
                size="icon" 
                className="category-selector-btn"
                onClick={handleFilterButtonClick}
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className="main-content">
          {currentView === 'home' && (
            <div className="home-view">
              {/* 内容类型标签 */}
              <div className="content-type-tabs">
                <div className="type-tabs-container">
                  {contentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTabSelect(type)}
                      className={`type-tab ${selectedContentType === type ? 'active' : ''}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 书籍列表 */}
              <div className="books-section">
                <div className="section-header">
                  <h2>
                    {getCurrentCategoryName()}
                    <span className="book-count">({filteredBooks.length})</span>
                  </h2>
                </div>

                {filteredBooks.length > 0 ? (
                  <div className="books-grid">
                    {filteredBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        {...book}
                        onRead={handleRead}
                        onPlay={handlePlay}
                        mobile={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Search className="empty-icon" />
                    <p>暂无{selectedFilterCategory === '推荐' ? selectedContentType : selectedFilterCategory}内容</p>
                    <p className="empty-desc">试试其他分类或搜索</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'user' && (
            <UserCenter 
              onBack={() => {}}
              onReadBook={handleRead}
              onLogin={() => setShowLoginSheet(true)}
              mobile={true}
            />
          )}

          {currentView === 'discover' && (
            <div className="discover-view">
              <div className="discover-header">
                <h2>发现</h2>
              </div>
              <div className="discover-content">
                <p className="text-muted-foreground text-center mt-8">
                  发现更多精彩内容
                </p>
              </div>
            </div>
          )}

          {currentView === 'messages' && (
            <div className="messages-view">
              <div className="messages-header">
                <h2>消息</h2>
              </div>
              <div className="messages-content">
                <div className="message-list">
                  <div className="message-item">
                    <div className="message-avatar">
                      <div className="avatar-placeholder">系</div>
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <h3 className="message-sender">系统消息</h3>
                        <span className="message-time">刚刚</span>
                      </div>
                      <p className="message-text">欢迎使用甜恬故事！开始你的阅读之旅吧。</p>
                    </div>
                  </div>
                  
                  <div className="message-item">
                    <div className="message-avatar">
                      <div className="avatar-placeholder">更</div>
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <h3 className="message-sender">更新提醒</h3>
                        <span className="message-time">1小时前</span>
                      </div>
                      <p className="message-text">《修真界第一商人》有新章节更新，快去阅读吧！</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 底部导航 */}
        <BottomNavigation 
          currentView={currentView}
          onNavigate={handleNavigation}
        />
      </div>

      {/* 登录Sheet */}
      <LoginSheet
        open={showLoginSheet}
        onOpenChange={setShowLoginSheet}
        onSuccess={() => setShowLoginSheet(false)}
      />

      {/* 同步状态指示器 */}
      {authStatus === 'authenticated' && <SyncIndicator mobile={true} />}
    </div>
  );
}