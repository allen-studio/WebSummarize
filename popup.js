document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      // Update active tab button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabName).classList.add('active');
    });
  });

  // Load saved settings
  chrome.storage.sync.get([
    'baseUrl',
    'modelName',
    'apiKey',
    'systemPrompt',
    'notionToken',
    'databaseId'
  ], function(data) {
    document.getElementById('base-url').value = data.baseUrl || '';
    document.getElementById('model-name').value = data.modelName || '';
    document.getElementById('api-key').value = data.apiKey || '';
    document.getElementById('system-prompt').value = data.systemPrompt || '';
    document.getElementById('notion-token').value = data.notionToken || '';
    document.getElementById('database-id').value = data.databaseId || '';
  });

  // Save settings
  document.getElementById('save-settings').addEventListener('click', function() {
    const settings = {
      baseUrl: document.getElementById('base-url').value,
      modelName: document.getElementById('model-name').value,
      apiKey: document.getElementById('api-key').value,
      systemPrompt: document.getElementById('system-prompt').value,
      notionToken: document.getElementById('notion-token').value,
      databaseId: document.getElementById('database-id').value
    };

    chrome.storage.sync.set(settings, function() {
      alert('设置已保存');
    });
  });

  // Summarize button
  document.getElementById('summarize').addEventListener('click', async function() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getPageContent
    }, async function(results) {
      const content = results[0].result;
      const settings = await chrome.storage.sync.get([
        'baseUrl',
        'modelName',
        'apiKey',
        'systemPrompt'
      ]);

      try {
        const summary = await summarizeContent(content, settings);
        document.getElementById('summary-content').value = summary;
      } catch (error) {
        alert('总结失败：' + error.message);
      }
    });
  });

  // Save to Notion button
  document.getElementById('save-notion').addEventListener('click', async function() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const summary = document.getElementById('summary-content').value;
    
    if (!summary) {
      alert('请先生成总结内容');
      return;
    }

    const settings = await chrome.storage.sync.get(['notionToken', 'databaseId']);
    
    try {
      await saveToNotion({
        title: tab.title,
        url: tab.url,
        summary: summary
      }, settings);
      alert('保存成功');
    } catch (error) {
      alert('保存失败：' + error.message);
    }
  });
});

// Get page content
function getPageContent() {
  // 获取主要内容（这里可以根据需要优化提取逻辑）
  const article = document.querySelector('article') || document.body;
  return article.innerText;
}

// Summarize content using ChatGPT
async function summarizeContent(content, settings) {
  const response = await fetch(`${settings.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.modelName,
      messages: [
        {
          role: 'system',
          content: settings.systemPrompt || '你是一个网页内容总结助手，请简明扼要地总结网页的主要内容。'
        },
        {
          role: 'user',
          content: content
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Save to Notion
async function saveToNotion(data, settings) {
  const response = await fetch(`https://api.notion.com/v1/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${settings.notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { database_id: settings.databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.title
              }
            }
          ]
        },
        URL: {
          url: data.url
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: data.summary
              }
            }
          ]
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error('Notion API 请求失败');
  }
}
