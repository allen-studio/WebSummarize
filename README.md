# WebSummarize Chrome Extension

一个强大的 Chrome 扩展，可以自动总结网页内容并保存到 Notion。

## 功能特点

- 🚀 自动总结当前网页内容
- 💾 一键保存到 Notion 数据库
- ⚙️ 支持自定义 ChatGPT API 配置
- 🔐 安全的 API 密钥管理

## 安装说明

1. 克隆仓库：
```bash
git clone https://github.com/allen-studio/WebSummarize.git
```

2. 在 Chrome 浏览器中加载扩展：
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 WebSummarize 目录

## 使用配置

### ChatGPT API 配置
在扩展的设置页面中配置以下信息：
- Base URL
- Model Name
- API Key
- System Prompt

### Notion API 配置
在扩展的设置页面中配置以下信息：
- Notion API Token
- Notion Database ID

## 使用方法

1. 点击扩展图标打开操作面板
2. 在想要总结的网页上点击"总结"按钮
3. 等待内容总结完成
4. 点击"存储到Notion"按钮保存内容

## 技术栈

- Chrome Extension API
- ChatGPT API
- Notion API
- JavaScript
- HTML/CSS

## 贡献指南

欢迎提交 Pull Request 或创建 Issue！

## 许可证

本项目采用 MIT 许可证。
