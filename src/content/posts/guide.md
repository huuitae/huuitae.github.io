---
title: Gyoza 使用指南
date: 2024-04-01
lastMod: 2024-08-10T03:58:16.758Z
summary: 欢迎使用 Gyoza，Gyoza 是一款 Astro 博客主题，它保持简洁和可爱的风格。本篇文章将会介绍如何使用并部署 Gyoza。
category: 教程
tags: [Astro, Gyoza]
sticky: 1
---

## 前置条件

- node 版本 >= 18.18.0
- pnpm 版本 > 8.1.0

## 安装

### 克隆仓库

登录 Github 账号，打开 [lxchapu/astro-gyoza](https://github.com/lxchapu/astro-gyoza)，点击右上角的 Fork 按钮，将仓库克隆到你自己的账号下。

复制这个仓库的地址，打开终端，使用 `git clone` 命令将仓库克隆到本地。

> 本项目推荐使用 pnpm 作为你的包管理器，如果你还没有安装 pnpm，请先安装 pnpm。

### 安装依赖

```sh
cd astro-gyoza
pnpm install
```

### 命令介绍

本地运行

```sh
pnpm dev
```

打包静态文件

```sh
pnpm build
```

本地预览

```sh
pnpm preview
```

### 配置项

이 프로젝트의 구성 대부분은 `src/config.json` 파일에 정의되어 있습니다.

탐색 오류를 방지하려면 먼저 `site.url`을 자신의 도메인으로 변경해야 합니다.

다음은 구성 항목에 대한 설명입니다.

```json
{
  "site": {
    "url": "", // 웹사이트 주소
    "title": "", // 웹사이트 제목
    "description": "", // 일반 사이트 설명 SEO
    "keywords": "", // 일반적인 웹사이트 키워드 SEO
    "lang": "zh-CN", // 언어
    "favicon": "", // 공개 디렉토리에 저장된 브라우저 아이콘
    "appleTouchIcon": "" // 공개 디렉토리에 저장된 Apple 기기 아이콘
  },
  "author": {
    "name": "", // 저자 이름
    "twitterId": "", // Open Graph의 경우 @로 시작하는 Twitter 계정 ID
    "avatar": "" // 작성자 아바타 URL
  },
  // 홈 히어로 컴포넌트
  "hero": {
    "name": "", // 显示的名称
    "bio": "", // 一句话介绍
    "description": "", // 补充描述
    // 社交账号
    "socials": [
      {
        "name": "", // 社交平台类型
        "icon": "", // 社交平台图标
        "url": "", // 链接
        "color": "" // 图标颜色
      }
    ],
    "yiyan": "" // 显示一言
  },
  "color": {
    // 强调色，请填写 16 进制颜色值。每次会从中随机取出一组
    "accent": [{ "light": "", "dark": "" }],
    // 背景色
    "bg": {
      "primary": { "light": "", "dark": "" },
      "secondary": { "light": "", "dark": "" }
    },
    // 文字颜色
    "text": {
      "primary": { "light": "", "dark": "" },
      "secondary": { "light": "", "dark": "" }
    },
    // 边框颜色
    "border": {
      "primary": { "light": "", "dark": "" }
    }
  },
  // 顶部导航栏
  "menus": [
    {
      "name": "首页",
      "link": "/",
      "icon": "icon-pantone"
    }
  ],
  "posts": {
    "perPage": 10 // 每一页显示的文章数量
  },
  "footer": {
    "startTime": "" // 博客网站开始时间 请使用 ISO 格式
  },
  // Waline 评论系统，前往 https://waline.js.org/ 查看
  "waline": {
    "serverURL": ""
  },
  // 赞助
  "sponsor": {
    "wechat": "" // 微信赞赏码图片地址
  },
  // 如果需要使用网站数据统计，将 enable 修改为 true，并填写对应的配置
  "analytics": {
    "enable": false,
    // https://analytics.google.com
    "google": {
      "measurementId": ""
    },
    // https://umami.is/docs
    "umami": {
      "serverUrl": "",
      "websiteId": ""
    },
    // https://clarity.microsoft.com/
    "microsoftClarity": {
      "projectId": ""
    }
  }
}
```

## 部署

> 这里只介绍了 Vercel，你当然可以选择其他平台例如：Cloudflare Pages 或你自己的服务器。  
> 部署之前，确保你已经修改 `site.url`。

### 部署到 Vercel

登录 Vercel 账号，点击右上角的 Add new... 选择 Project。然后在 Import Git Repository 中选择刚刚 Fork 的仓库，点击 Import 按钮。

进入项目配置页面，直接点击 Deploy 按钮，静静等待部署完成就 👌 了。

Vercel 会为你分配一个域名，你可以在项目设置中设置自定义域名，更多操作请参考 Vercel 文档。
