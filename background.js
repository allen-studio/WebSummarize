// 后台脚本，用于处理可能的长时间运行任务
chrome.runtime.onInstalled.addListener(() => {
  // 设置默认配置
  chrome.storage.sync.get([
    'baseUrl',
    'modelName',
    'systemPrompt'
  ], function(data) {
    if (!data.baseUrl) {
      chrome.storage.sync.set({
        baseUrl: 'https://api.openai.com',
        modelName: 'gpt-3.5-turbo',
        systemPrompt: '你是一个网页内容总结助手，请简明扼要地总结网页的主要内容。'
      });
    }
  });
});
