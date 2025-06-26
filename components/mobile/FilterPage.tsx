import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Search } from 'lucide-react';

interface FilterPageProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

// 主分类数据
const mainCategories = [
  { id: 'hot', name: '热门标签', isActive: true },
  { id: 'mystery', name: '悬疑' },
  { id: 'urban', name: '都市' },
  { id: 'history', name: '历史' },
  { id: 'fantasy', name: '玄幻' },
  { id: 'derivative', name: '衍生' }
];

// 子分类标签数据 - 根据主分类展示不同内容
const subCategories = {
  hot: [
    '全部', '无脑爽', '悬疑', '重生', '扮猪吃虎', '摘牌轻松',
    '盗墓', '穿越', '校花', '都市', '多女主', '火影',
    '末日求生', '历史', '九叔', '玄幻', '武侠', '末世',
    '乡村', '黑道', '女帝', '大小姐', '轻小说', '海贼王',
    '特种兵', '男频衍生', '克苏鲁', '二次元', '体育', '第一人称',
    '系统', '职场', '网游', '无限流', '都市异能', '大佬',
    '漫威', '神豪', '黑化', '打脸', '娱乐圈', '斩神',
    '聊天群', '游戏动漫', '封神'
  ],
  mystery: [
    '全部', '推理', '悬疑', '刑侦', '探案', '心理',
    '密室', '社会派', '本格派', '硬汉派', '冷硬派', '警察',
    '私家侦探', '法医', '犯罪', '惊悚', '恐怖', '灵异'
  ],
  urban: [
    '全部', '都市生活', '都市异能', '商战', '职场', '医生',
    '律师', '教师', '军人', '警察', '创业', '重生',
    '系统', '签到', '神豪', '装逼打脸', '娱乐圈', '体育'
  ],
  history: [
    '全部', '秦汉', '唐宋', '明清', '民国', '抗战',
    '架空历史', '历史传记', '宫廷', '争霸', '变法', '名臣',
    '皇帝', '将军', '商贾', '文人', '侠客', '刺客'
  ],
  fantasy: [
    '全部', '东方玄幻', '西方奇幻', '修真', '仙侠', '武侠',
    '洪荒', '封神', '西游', '异界', '穿越', '重生',
    '系统', '签到', '无敌', '废材', '天才', '炼丹'
  ],
  derivative: [
    '全部', '火影', '海贼王', '死神', '龙珠', '漫威',
    'DC', '哈利波特', '权游', '魔戒', '星战', '变形金刚',
    '综漫', '动漫同人', '影视同人', '游戏同人', '小说同人', '真人同人'
  ]
};

// 顶部分类标签
const topCategories = ['男生', '女生', '听书', '出版', '短剧'];

export function FilterPage({ onBack, onCategorySelect, selectedCategory }: FilterPageProps) {
  const [selectedMainCategory, setSelectedMainCategory] = useState('hot');
  const [selectedTopCategory, setSelectedTopCategory] = useState('男生');

  const handleMainCategorySelect = (categoryId: string) => {
    setSelectedMainCategory(categoryId);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    // 根据子分类映射到我们系统的分类
    const categoryMapping: { [key: string]: string } = {
      '全部': '推荐',
      '悬疑': '悬疑',
      '都市': '小说',
      '历史': '知识',
      '末世': '末世',
      '玄幻': '小说',
      '武侠': '小说',
      '无脑爽': '脑洞',
      '重生': '言情',
      '灵异': '灵异',
      '惊悚': '惊悚',
      '听书': '听书',
      '广播剧': '广播剧',
      '追夫火葬场': '追夫火葬场',
      '言情': '言情'
    };
    
    const mappedCategory = categoryMapping[subCategory] || subCategory;
    onCategorySelect(mappedCategory);
    onBack();
  };

  const currentSubCategories = subCategories[selectedMainCategory as keyof typeof subCategories] || subCategories.hot;

  return (
    <div className="filter-page">
      {/* 顶部导航栏 */}
      <header className="filter-header">
        <div className="filter-header-content">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {/* 顶部分类标签 */}
          <div className="top-categories">
            {topCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedTopCategory(category)}
                className={`top-category-tab ${selectedTopCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="search-button"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="filter-content">
        {/* 左侧主分类 */}
        <div className="main-categories">
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleMainCategorySelect(category.id)}
              className={`main-category-item ${selectedMainCategory === category.id ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 右侧子分类网格 */}
        <div className="sub-categories">
          <div className="sub-categories-grid">
            {currentSubCategories.map((subCategory, index) => (
              <button
                key={index}
                onClick={() => handleSubCategorySelect(subCategory)}
                className={`sub-category-item ${selectedCategory === subCategory ? 'active' : ''}`}
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}