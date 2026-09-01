# 聊天记录导出工具

本项目把“导出聊天记录”和“分析聊天记录”拆成两个步骤：

1. 先使用对应平台的官方/开源导出工具，把记录导出为 JSON 或 TXT；
2. 再打开上一级目录的 `index.html`，把导出文件拖入“把聊天记录放进来”。

## 文件夹结构

```text
导出工具/
├─ README.md
├─ 微信/
│  ├─ WeChat-Chat-Export-for-LLM.exe
│  ├─ 使用说明.md
│  └─ 打开 wechat-chat-export 官方说明.url
└─ QQ/
   ├─ QQChatExporter-Installer-v6.2.8.exe
   ├─ 使用说明.md
   └─ 下载 QQ Chat Exporter.url
```

## 选择哪条路径

### 微信

请使用你指定的 [wechat-chat-export](https://github.com/zhuzhangxue/wechat-chat-export) Windows EXE。它针对 Windows 微信 4.1.12+，可以导出 TXT、Markdown 和 JSON；本文件夹已经附上官方 v1.3.0 单文件 EXE。

具体步骤见 [微信/使用说明.md](微信/使用说明.md)。

### QQ

本文件夹已附上 QQ Chat Exporter 官方 Windows x64 一键安装包。也可以从 [QQ Chat Exporter 官方 Releases](https://github.com/shuakami/qq-chat-exporter/releases/latest) 获取更新版本，使用它完成导出后，再把 JSON / TXT 文件交给本项目分析。

具体步骤见 [QQ/使用说明.md](QQ/使用说明.md)。

## 文件与来源

- 微信工具：`微信/WeChat-Chat-Export-for-LLM.exe`，来自 [wechat-chat-export v1.3.0 官方 Release](https://github.com/zhuzhangxue/wechat-chat-export/releases/tag/v1.3.0)，文件未修改；
- QQ 工具：`QQ/QQChatExporter-Installer-v6.2.8.exe`，来自 [QQ Chat Exporter v6.2.8 官方 Release](https://github.com/shuakami/qq-chat-exporter/releases/tag/v6.2.8)，文件未修改；
- 两个工具都由各自项目维护，版本更新、系统兼容性和运行结果以官方页面为准；
- 微信项目采用 Apache-2.0，QQ Chat Exporter 采用 GPL-3.0；本包仅原样提供官方安装文件和来源链接，不修改、不单独再许可；
- 本项目不接触 QQ / 微信账号，也不读取或解密客户端数据库。

### SHA-256 校验值

```text
WeChat-Chat-Export-for-LLM.exe
390752D403D756DD22F45DF802CED9869312E41E499B2402404D7A089A83B0B4

QQChatExporter-Installer-v6.2.8.exe
5079204EA4D411FD18BE61847E7FD9B5B4A2EB8B008A1AB1C162DB96AB2D47E1
```

Windows PowerShell 校验命令：

```powershell
Get-FileHash .\微信\WeChat-Chat-Export-for-LLM.exe -Algorithm SHA256
Get-FileHash .\QQ\QQChatExporter-Installer-v6.2.8.exe -Algorithm SHA256
```

## 导入前检查

- 导出的文件确实是 JSON / TXT / MD，而不是工具的日志文件；
- 文件里包含时间、发送者和消息正文；
- 如果导出文件没有 `sender: "me" / "them"`，请在导入区填写“我的昵称 / ID”，必要时再填写“TA 的昵称 / ID”；
- 每次换一份聊天记录，都要重新点击“开始观测”，页面会按当前文件重新识别双方并重算统计，不会沿用上一份记录。

## 隐私提醒

聊天记录通常包含个人信息。建议只在自己的电脑上导出和分析，不要把原始记录上传到陌生网站，也不要把导出文件直接提交到公共代码仓库。分析页面只在浏览器本地读取文件，报告中的原话来自当前导入的数据。
