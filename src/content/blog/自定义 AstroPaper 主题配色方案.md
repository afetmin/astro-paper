---
author: Sat Naing
pubDatetime: 2022-09-25T15:20:35Z
title: 自定义 AstroPaper 主题配色方案
featured: true
draft: false
tags:
  - astro
description:
    如何启用/禁用浅色和深色模式；以及自定义 AstroPaper 主题的配色方案。
---

这篇文章将解释如何启用/禁用网站的浅色和深色模式。此外，您还将学习如何自定义整个网站的配色方案。


## 启用/禁用浅色和深色模式

AstroPaper 主题默认包含浅色和深色模式。换句话说，将有两种颜色方案\_一种用于浅色模式，另一种用于深色模式。可以在 `src/config.ts` 文件的 SITE 配置对象中禁用此默认行为。

```js
// 文件: src/config.ts
export const SITE = {
  website: "https://astro-paper.pages.dev/",
  author: "Sat Naing",
  desc: "一个极简、响应式且对 SEO 友好的 Astro 博客主题。",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true, // 默认为 true
  postPerPage: 3,
};
```

要禁用 `浅色和深色模式`，请将 `SITE.lightAndDarkMode` 设置为 `false`。

## 选择主颜色方案

默认情况下，如果我们禁用 `SITE.lightAndDarkMode`，我们将只获得系统的 prefers-color-scheme。

因此，要选择主颜色方案而不是 prefers-color-scheme，我们必须在 `public/toggle-theme.js` 中的 primaryColorScheme 变量中设置颜色方案。

```js
/* 文件: public/toggle-theme.js */
const primaryColorScheme = ""; // "light" | "dark"

// 从本地存储获取主题数据
const currentTheme = localStorage.getItem("theme");

// 其他代码等...
```

**primaryColorScheme** 变量可以包含两个值\_ `"light"`, `"dark"`。如果你不想指定主颜色方案，可以保留空字符串（默认）。

- `""` - 系统的 prefers-color-scheme。（默认）
- `"light"` - 使用浅色模式作为主颜色方案。
- `"dark"` - 使用深色模式作为主颜色方案。

<details><summary>为什么 'primaryColorScheme' 不在 config.ts 中？</summary>

> 为了避免页面重新加载时的颜色闪烁，我们必须尽可能早地在页面加载时放置切换开关的 JavaScript 代码。它解决了闪烁问题，但作为权衡，我们不能再使用 ESM 导入。

[点击这里](https://docs.astro.build/en/reference/directives-reference/#isinline) 了解更多关于 Astro 的 `is:inline` 脚本的信息。

</details>

## 自定义颜色方案

AstroPaper 主题的浅色和深色颜色方案都可以自定义。你可以在 `src/styles/base.css` 文件中进行此操作。

```css
/* 文件: src/styles/base.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root,
  html[data-theme="light"] {
    --color-fill: 251, 254, 251;
    --color-text-base: 40, 39, 40;
    --color-accent: 0, 108, 172;
    --color-card: 230, 230, 230;
    --color-card-muted: 205, 205, 205;
    --color-border: 236, 233, 233;
  }
  html[data-theme="dark"] {
    --color-fill: 47, 55, 65;
    --color-text-base: 230, 230, 230;
    --color-accent: 26, 217, 217;
    --color-card: 63, 75, 90;
    --color-card-muted: 89, 107, 129;
    --color-border: 59, 70, 85;
  }
  /* 其他样式 */
}
```

在 AstroPaper 主题中，`:root` 和 `html[data-theme="light"]` 选择器用作浅色颜色方案，`html[data-theme="dark"]` 用作深色颜色方案。如果你想自定义你的颜色方案，你必须在 `:root`,`html[data-theme="light"]` 中指定你的浅色颜色方案，并在 `html[data-theme="dark"]` 中指定深色颜色方案。

颜色以 CSS 自定义属性（CSS 变量）符号声明。颜色属性值以 rgb 值编写。（注意：不是 `rgb(40, 39, 40)`，而是只指定 `40, 39, 40`）

以下是颜色属性的详细说明。

| 颜色属性           | 定义和用法                                                 |
| ------------------ | ---------------------------------------------------------- |
| `--color-fill`     | 网站的主色。通常是主要背景色。                             |
| `--color-text-base`| 网站的次色。通常是文本颜色。                               |
| `--color-accent`   | 网站的强调色。链接颜色、悬停颜色等。                       |
| `--color-card`     | 卡片、滚动条和代码背景颜色（如 `this`）。                  |
| `--color-card-muted`| 卡片和滚动条的悬停状态背景颜色等。                        |
| `--color-border`   | 边框颜色。特别用于水平行（hr）                             |

以下是更改浅色颜色方案的示例。

```css
@layer base {
  /* lobster 颜色方案 */
  :root,
  html[data-theme="light"] {
    --color-fill: 246, 238, 225;
    --color-text-base: 1, 44, 86;
    --color-accent: 225, 74, 57;
    --color-card: 220, 152, 145;
    --color-card-muted: 233, 119, 106;
    --color-border: 220, 152, 145;
  }
}
```

> 查看一些 [预定义的颜色方案](https://astro-paper.pages.dev/posts/predefined-color-schemes/)，AstroPaper 已经为你准备好了。