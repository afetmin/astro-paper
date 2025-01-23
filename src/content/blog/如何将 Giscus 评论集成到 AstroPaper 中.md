---
author: FjellOverflow
pubDatetime: 2024-07-25T11:11:53Z
modDatetime: 2024-09-25T12:07:53Z
title: 如何将 Giscus 评论集成到 AstroPaper 中
slug: how-to-integrate-giscus-comments
featured: true
draft: false
tags:
  - astro
description: 在托管于 GitHub Pages 的静态博客上使用 Giscus 实现评论功能。
---

在 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) 等平台上托管一个轻量级静态博客有许多优势，但也失去了一些互动性。幸运的是，[Giscus](https://giscus.app/) 提供了一种在静态网站上嵌入用户评论的方式。

## Giscus 的工作原理

[Giscus 使用 GitHub API](https://github.com/giscus/giscus?tab=readme-ov-file#how-it-works) 来读取和存储 _GitHub_ 用户在仓库的 `Discussions` 中发表的评论。

在你的网站上嵌入 _Giscus_ 的客户端脚本包，并使用正确的仓库 URL 进行配置，用户就可以查看和撰写评论（需要登录 _GitHub_）。

这种方法是无服务器的，因为评论存储在 _GitHub_ 上，并在客户端动态加载，因此非常适合像 _AstroPaper_ 这样的静态博客。

## 设置 Giscus

_Giscus_ 可以在 [giscus.app](https://giscus.app/) 上轻松设置，但我还是会简要概述一下这个过程。

### 前提条件

使用 _Giscus_ 的前提条件是：

- 仓库是 [公开的](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility#making-a-repository-public)
- 安装了 [Giscus 应用](https://github.com/apps/giscus)
- 仓库启用了 [Discussions](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository) 功能

如果由于任何原因无法满足这些条件，很遗憾，_Giscus_ 将无法集成。

### 配置 Giscus

接下来，需要配置 _Giscus_。在大多数情况下，预设的默认值是合适的，只有在有特定原因并且知道自己在做什么时才应该修改它们。不必过于担心做出错误的选择；你以后可以随时调整配置。

不过你需要：

- 选择正确的 UI 语言
- 指定你想要连接的 _GitHub_ 仓库，通常是包含你在 _GitHub Pages_ 上托管的 _AstroPaper_ 博客的仓库
- 在 _GitHub_ 上创建并设置一个 `Announcement` 类型的讨论，以确保没有人可以直接在 _GitHub_ 上创建随机评论
- 定义配色方案

配置完设置后，_Giscus_ 会为你生成一个 `<script>` 标签，你将在接下来的步骤中需要它。

## 简单的脚本标签

你现在应该有一个类似这样的脚本标签：

```html
<script
  src="https://giscus.app/client.js"
  data-repo="[在此处输入仓库]"
  data-repo-id="[在此处输入仓库 ID]"
  data-category="[在此处输入分类名称]"
  data-category-id="[在此处输入分类 ID]"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="en"
  crossorigin="anonymous"
  async
></script>
```

只需将其添加到网站的源代码中。如果你使用的是 _AstroPaper_ 并希望在文章上启用评论，可以导航到 `src/layouts/PostDetails.astro`，并将其粘贴到你希望评论出现的位置，比如在 `Share this post on:` 按钮下方。

```diff
      <ShareLinks />
    </div>

+    <script src="https://giscus.app/client.js"
+        data-repo="[在此处输入仓库]"
+        data-repo-id="[在此处输入仓库 ID]"
+        data-category="[在此处输入分类名称]"
+        data-category-id="[在此处输入分类 ID]"
+        ...
+    </script>

  </main>
  <Footer />
</Layout>
```

这样就完成了！你已成功在 _AstroPaper_ 中集成了评论功能！

## 支持浅色/深色主题的 React 组件

嵌入布局中的脚本标签是静态的，_Giscus_ 的配置（包括 `theme`）都硬编码在布局中。鉴于 _AstroPaper_ 具有浅色/深色主题切换功能，最好让评论能够与网站的其余部分无缝切换浅色和深色主题。为了实现这一点，需要采用更复杂的方法来嵌入 _Giscus_。

首先，我们将安装 _Giscus_ 的 [React 组件](https://www.npmjs.com/package/@giscus/react)：

```bash
npm i @giscus/react
```

然后我们在 `src/components` 中创建一个新的 `Comments.tsx` React 组件：

```tsx
import Giscus, { type Theme } from "@giscus/react";
import { GISCUS } from "@config";
import { useEffect, useState } from "react";

interface CommentsProps {
  lightTheme?: Theme;
  darkTheme?: Theme;
}

export default function Comments({
  lightTheme = "light",
  darkTheme = "dark",
}: CommentsProps) {
  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return currentTheme || browserTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => {
      setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    themeButton?.addEventListener("click", handleClick);

    return () => themeButton?.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="mt-8">
      <Giscus theme={theme === "light" ? lightTheme : darkTheme} {...GISCUS} />
    </div>
  );
}
```

这个 _React_ 组件不仅封装了原生的 _Giscus_ 组件，还引入了额外的属性，即 `lightTheme` 和 `darkTheme`。通过两个事件监听器，_Giscus_ 评论将与网站的主题保持一致，每当网站或浏览器主题发生变化时，动态切换浅色和深色主题。

我们还需要定义 `GISCUS` 配置，最佳位置是在 `src/config.ts` 中：

```ts
import type { GiscusProps } from "@giscus/react";

...

export const GISCUS: GiscusProps = {
  repo: "[在此处输入仓库]",
  repoId: "[在此处输入仓库 ID]",
  category: "[在此处输入分类名称]",
  categoryId: "[在此处输入分类 ID]",
  mapping: "pathname",
  reactionsEnabled: "0",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
  loading: "lazy",
};
```

请注意，在此处指定 `theme` 将覆盖 `lightTheme` 和 `darkTheme` 属性，导致主题设置变为静态，类似于之前使用 `<script>` 标签嵌入 _Giscus_ 的方法。

为了完成这个过程，将新的 Comments 组件添加到 `src/layouts/PostDetails.astro` 中（替换上一步中的 `script` 标签）。

```diff
+ import Comments from "@components/Comments";

      <ShareLinks />
    </div>

+    <Comments client:only="react" />

  </main>
  <Footer />
</Layout>
```

这样就完成了！你已成功在 _AstroPaper_ 中集成了评论功能，并支持浅色/深色主题切换！