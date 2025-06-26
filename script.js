// 生成Figma资源的脚本
const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateFigmaAssets() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // 设置视口大小
  await page.setViewport({ width: 1440, height: 900 });
  
  // 访问本地开发服务器
  await page.goto('http://localhost:3000');
  
  // 截取主页
  await page.screenshot({ 
    path: 'figma-assets/homepage.png',
    fullPage: true
  });
  
  // 截取不同状态的页面
  const scenarios = [
    { name: 'homepage', path: '/' },
    { name: 'reading-page', action: async () => {
      await page.click('[data-testid="book-card"]:first-child button');
      await page.waitForSelector('[data-testid="reading-content"]');
    }},
    { name: 'user-center', action: async () => {
      await page.click('[data-testid="user-center-button"]');
      await page.waitForSelector('[data-testid="user-center"]');
    }}
  ];
  
  for (const scenario of scenarios) {
    if (scenario.action) {
      await scenario.action();
    } else {
      await page.goto(`http://localhost:3000${scenario.path}`);
    }
    
    await page.screenshot({
      path: `figma-assets/${scenario.name}.png`,
      fullPage: true
    });
  }
  
  // 截取组件库
  await generateComponentLibrary(page);
  
  await browser.close();
}

async function generateComponentLibrary(page) {
  // 创建一个展示所有组件的页面
  const componentsHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Component Library</title>
      <link rel="stylesheet" href="/styles/globals.css">
    </head>
    <body style="padding: 40px; background: white;">
      <h1>甜恬故事 - 组件库</h1>
      
      <section style="margin: 40px 0;">
        <h2>按钮组件</h2>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <button class="bg-primary text-primary-foreground px-4 py-2 rounded-lg">主要按钮</button>
          <button class="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">次要按钮</button>
          <button class="border border-border px-4 py-2 rounded-lg">边框按钮</button>
        </div>
      </section>
      
      <section style="margin: 40px 0;">
        <h2>卡片组件</h2>
        <div style="max-width: 300px; border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
          <div style="display: flex; gap: 12px;">
            <div style="width: 64px; height: 80px; background: #f0f0f0; border-radius: 8px;"></div>
            <div style="flex: 1;">
              <h3>书籍标题</h3>
              <p style="color: var(--muted-foreground); font-size: 14px;">作者名</p>
              <p style="color: var(--muted-foreground); font-size: 12px;">类别</p>
              <button style="width: 100%; margin-top: 12px; background: var(--primary); color: white; padding: 8px; border-radius: 6px; border: none;">开始阅读</button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 更多组件... -->
    </body>
    </html>
  `;
  
  await page.setContent(componentsHTML);
  await page.screenshot({
    path: 'figma-assets/component-library.png',
    fullPage: true
  });
}

// 运行脚本
generateFigmaAssets().catch(console.error);