import { Home, User, Compass, MessageCircle } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'home' | 'user' | 'discover' | 'messages';
  onNavigate: (view: 'home' | 'user' | 'discover' | 'messages') => void;
}

export function BottomNavigation({ currentView, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'home' as const,
      label: '首页',
      icon: Home,
    },
    {
      id: 'discover' as const,
      label: '发现',
      icon: Compass,
    },
    {
      id: 'messages' as const,
      label: '消息',
      icon: MessageCircle,
    },
    {
      id: 'user' as const,
      label: '我的',
      icon: User,
    },
  ];

  return (
    <nav className="bottom-navigation">
      <div className="nav-content">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-container">
                <IconComponent 
                  className={`nav-icon ${isActive ? 'active' : ''}`}
                />
                {/* 消息红点提示 */}
                {item.id === 'messages' && !isActive && (
                  <div className="message-badge">
                    <div className="badge-dot" />
                  </div>
                )}
              </div>
              <span className={`nav-label ${isActive ? 'active' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}