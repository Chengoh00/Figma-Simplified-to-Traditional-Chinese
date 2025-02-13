import chineseConv from 'chinese-conv';

figma.showUI(__html__, { 
  themeColors: true,
})

figma.ui.onmessage = async msg => {
  if (msg.type === 'convert') {
    console.log('开始转换过程');
    console.log('chineseConv 对象:', chineseConv);

    // 使用 sify 函数进行简体到繁体的转换
    const simplifiedToTraditional = chineseConv.tify;

    if (typeof simplifiedToTraditional !== 'function') {
      console.error('无法找到 sify 函数');
      figma.notify('插件出错：无法找到转换函数');
      return;
    }

    const textNodes = figma.currentPage.findAllWithCriteria({types: ['TEXT']});
    console.log(`找到 ${textNodes.length} 个文本节点`);

    let convertedCount = 0;
    let errorCount = 0;

    for (const node of textNodes) {
      try {
        console.log(`转换节点，原文本:`, node.characters);

        // 加载字体
        await figma.loadFontAsync(node.fontName);

        // 转换文本
        const traditionalText = simplifiedToTraditional(node.characters);
        console.log(`转换后文本:`, traditionalText);

        // 设置转换后的文本
        node.characters = traditionalText;
        convertedCount++;
      } catch (error) {
        console.error(`转换节点时出错:`, error);
        errorCount++;
      }
    }

    console.log(`转换完成。成功: ${convertedCount}, 失败: ${errorCount}`);
    figma.notify(`转换完成！成功: ${convertedCount}, 失败: ${errorCount}`);
  }
};
