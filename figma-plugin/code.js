// Figma插件代码，用于导入设计系统
figma.showUI(__html__, { width: 400, height: 600 });

// 创建设计系统组件
async function createDesignSystem() {
  const designTokens = await fetch('./design-tokens.json').then(r => r.json());
  
  // 创建颜色样式
  Object.entries(designTokens.colors).forEach(([colorName, colorValues]) => {
    Object.entries(colorValues).forEach(([shade, value]) => {
      const paintStyle = figma.createPaintStyle();
      paintStyle.name = `${colorName}/${shade}`;
      paintStyle.paints = [{
        type: 'SOLID',
        color: hexToRgb(value)
      }];
    });
  });
  
  // 创建文本样式
  Object.entries(designTokens.typography.fontSize).forEach(([sizeName, size]) => {
    const textStyle = figma.createTextStyle();
    textStyle.name = `Body/${sizeName}`;
    textStyle.fontSize = parseInt(size);
    textStyle.fontName = { family: "Inter", style: "Regular" };
  });
  
  // 创建组件
  await createButtonComponent();
  await createCardComponent();
  await createHeaderComponent();
}

async function createButtonComponent() {
  const frame = figma.createFrame();
  frame.name = "Button/Primary";
  frame.resize(120, 40);
  frame.fills = [{
    type: 'SOLID',
    color: { r: 0.01, g: 0.01, b: 0.07 } // #030213
  }];
  frame.cornerRadius = 8;
  
  const text = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  text.characters = "按钮文字";
  text.fontSize = 14;
  text.fills = [{
    type: 'SOLID',
    color: { r: 1, g: 1, b: 1 }
  }];
  
  // 居中文本
  text.x = (frame.width - text.width) / 2;
  text.y = (frame.height - text.height) / 2;
  
  frame.appendChild(text);
  
  // 创建为组件
  const component = figma.createComponent();
  component.appendChild(frame);
  component.name = "Button/Primary";
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

figma.ui.onmessage = msg => {
  if (msg.type === 'create-design-system') {
    createDesignSystem();
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};