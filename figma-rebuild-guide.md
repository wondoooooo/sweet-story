# Figma重建指南

## 页面结构

### 1. 主页 (Homepage)
```
Container (max-width: 1152px)
├── Header
│   ├── Logo + 标题 (BookOpen icon + "甜恬故事")
│   └── Navigation
│       ├── 同步指示器 (已登录时)
│       ├── "我的" 按钮
│       └── 用户菜单/登录按钮
├── Filter Section
│   ├── 分类标签 (Tabs)
│   ├── 排序下拉菜单
│   └── 搜索框
├── Content Area
│   └── 书籍网格 (3列)
│       └── BookCard × N
└── Login Dialog (Modal)
```

### 2. 书籍卡片组件 (BookCard)
```
Card Container (border-radius: 12px, padding: 16px)
├── Flex Container (gap: 12px)
│   ├── Book Cover (64×80px, rounded: 8px)
│   └── Content Area
│       ├── Header
│       │   ├── Title (truncate)
│       │   └── Status Badge
│       ├── Author (text-sm, muted)
│       ├── Category (text-xs, muted)
│       ├── Progress Section (if has history)
│       │   ├── Progress Label + Percentage
│       │   ├── Progress Bar
│       │   └── Last Chapter
│       ├── Stats (rating + read count)
│       └── Action Button
```

### 3. 阅读页面 (Reading Page)
```
Full Height Container
├── Sticky Header
│   ├── Back Button + Book Info
│   ├── Bookmark + Settings Button
│   └── Progress Bar
├── Main Content
│   ├── Chapter Header
│   └── Reading Content
└── Sticky Footer
    └── Chapter Navigation
```

## 设计规范

### 颜色规范
- Primary: #030213
- Background: #ffffff
- Muted: #ececf0
- Muted Foreground: #717182
- Border: rgba(0,0,0,0.1)

### 字体规范
- H1: 24px, medium (500)
- H2: 20px, medium (500)
- H3: 18px, medium (500)
- Body: 16px, normal (400)
- Small: 14px, normal (400)
- XS: 12px, normal (400)

### 间距规范
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

### 圆角规范
- SM: 4px
- MD: 8px
- LG: 12px
- XL: 16px

## 组件状态

### 按钮状态
1. Default: primary color, medium font weight
2. Hover: slightly darker
3. Pressed: darker + slight scale
4. Disabled: muted color, reduced opacity

### 卡片状态
1. Default: border + background
2. Hover: shadow elevation
3. Loading: skeleton animation

### 输入框状态
1. Default: border + background
2. Focus: ring + border color change
3. Error: red border + error message
4. Disabled: muted background

## 响应式断点
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

### 移动端适配
- 书籍网格改为单列
- 导航收缩为汉堡菜单
- 字体大小适当缩小
- 触摸友好的按钮尺寸 (最小44px)
```