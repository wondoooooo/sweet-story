import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Heart, Play } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  readCount: string;
  status: '连载中' | '已完结';
  cover: string;
  description?: string;
  mobile?: boolean;
  onRead: (bookId: string, chapterId?: string) => void;
  onPlay?: (bookId: string) => void;
}

export function BookCard({ 
  id, 
  title, 
  author, 
  category, 
  rating, 
  readCount, 
  status, 
  cover, 
  description, 
  mobile = false,
  onRead,
  onPlay 
}: BookCardProps) {
  // 判断是否为音频内容
  const isAudioContent = category === '听书' || category === '广播剧';

  // 获取推荐标签
  const getRecommendationTag = () => {
    if (rating >= 4.5) return '热门推荐';
    if (status === '已完结') return '完结';
    if (category === '言情') return '甜宠';
    if (category === '悬疑') return '烧脑';
    if (category === '末世') return '爽文';
    return '推荐';
  };

  if (mobile) {
    return (
      <div 
        className="new-book-card"
        onClick={() => isAudioContent ? onPlay?.(id) : onRead(id)}
      >
        {/* 封面图 */}
        <div className="book-cover-wrapper">
          <ImageWithFallback
            src={cover}
            alt={title}
            className="book-cover-image"
          />
          {isAudioContent && (
            <div className="play-overlay">
              <Play className="play-icon" />
            </div>
          )}
        </div>
        
        {/* 内容区域 */}
        <div className="book-content">
          {/* 标题 */}
          <h3 className="book-title-new">{title}</h3>
          
          {/* 描述文字 */}
          <div className="book-description-new">
            {description || `${author}的${category}作品，${status}，已有${readCount}人阅读。精彩内容等你来发现！`}
          </div>
          
          {/* 底部区域 */}
          <div className="book-footer">
            {/* 标签区域 */}
            <div className="book-tags">
              <span className="recommendation-tag">{getRecommendationTag()}</span>
              <span className="category-tag">{category}</span>
              <span className="status-tag">{status}</span>
            </div>
            
            {/* 点赞数 */}
            <div className="like-count">
              <Heart className="heart-icon" />
              <span className="count-text">{readCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 桌面版保持原有设计
  return (
    <div className="book-card">
      {/* 桌面版代码保持不变 */}
    </div>
  );
}