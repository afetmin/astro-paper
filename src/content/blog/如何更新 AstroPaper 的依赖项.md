---
title: 如何更新 AstroPaper 的依赖项
author: Sat Naing
pubDatetime: 2023-07-20T15:33:05.569Z
slug: how-to-update-dependencies
featured: true
draft: false
tags:
  - astro
description: 如何更新项目依赖项和 AstroPaper 模板。
---

更新项目的依赖项可能是一件繁琐的事情。然而，忽视更新项目依赖项也不是一个好主意 😬。在这篇文章中，我将分享我通常如何更新我的项目，以 AstroPaper 为例。尽管如此，这些步骤也可以应用于其他 js/node 项目。

## 更新包依赖项

有几种方法可以更新依赖项，我尝试了各种方法以找到最简单的路径。一种方法是使用 `npm install package-name@latest` 手动更新每个包。这是最直接的更新方式，但可能不是最有效的选择。

我推荐的更新依赖项的方法是使用 [npm-check-updates 包](https://www.npmjs.com/package/npm-check-updates)。freeCodeCamp 有一篇很好的[文章](https://www.freecodecamp.org/news/how-to-update-npm-dependencies/)介绍了这个工具，因此我不会详细解释它是什么以及如何使用它。相反，我将展示我通常的做法。

首先，全局安装 `npm-check-updates` 包。

```bash
npm install -g npm-check-updates
```

在进行任何更新之前，最好先检查所有可以更新的新依赖项。

```bash
ncu
```

大多数情况下，补丁依赖项可以在不影响项目的情况下更新。因此，我通常通过运行 `ncu -i --target patch` 或 `ncu -u --target patch` 来更新补丁依赖项。区别在于，`ncu -u --target patch` 会更新所有补丁，而 `ncu -i --target patch` 会提供一个选项来选择要更新的包。你可以决定采用哪种方法。

接下来的部分涉及更新次要依赖项。次要包更新通常不会破坏项目，但最好还是检查相应包的发布说明。这些次要更新通常包含一些可以应用于我们项目的酷炫功能。

```bash
ncu -i --target minor
```

最后但同样重要的是，依赖项中可能会有一些主要包更新。因此，通过运行以下命令检查其余的依赖项更新：

```bash
ncu -i
```

如果有任何主要更新（或你仍然需要进行的更新），上述命令将输出这些剩余的包。如果包是主要版本更新，你必须非常小心，因为这很可能会破坏整个项目。因此，请仔细阅读相应的发布说明（或）文档，并做出相应的更改。

如果你运行 `ncu -i` 并且发现没有更多的包需要更新，_**恭喜！！！**_ 你已经成功更新了项目中的所有依赖项。

## 更新 AstroPaper 模板

与其他开源项目一样，AstroPaper 也在不断发展，修复错误、更新功能等。因此，如果你是将 AstroPaper 作为模板使用的人，你可能也希望在有新版本发布时更新模板。

问题是，你可能已经根据你的喜好更新了模板。因此，我无法确切地展示**“一种适用于所有人的完美方法”**来将模板更新到最新版本。不过，这里有一些提示可以帮助你在不破坏仓库的情况下更新模板。请记住，大多数情况下，更新包依赖项可能就足够了。

### 需要注意的文件和目录

在大多数情况下，你可能不想覆盖的文件和目录（因为你可能已经更新了这些文件）包括 `src/content/blog/`、`src/config.ts`、`src/pages/about.md` 以及其他资源和样式，如 `public/` 和 `src/styles/base.css`。

如果你只是对模板进行最小限度的更新，那么用最新的 AstroPaper 替换所有内容应该是可以的，除了上述文件和目录。这就像纯 Android 操作系统和其他供应商特定的操作系统（如 OneUI）一样。你对基础部分的修改越少，你需要更新的内容就越少。

你可以手动逐个替换每个文件，或者你可以使用 git 的神奇功能来更新所有内容。我不会向你展示手动替换的过程，因为它非常简单。如果你对这种直接且低效的方法不感兴趣，请耐心听我说 🐻。

### 使用 Git 更新 AstroPaper

**重要提示！！！**

> 只有在你知道如何解决合并冲突的情况下才执行以下操作。否则，你最好手动替换文件或仅更新依赖项。

首先，将 astro-paper 添加为你项目的远程仓库。

```bash
git remote add astro-paper https://github.com/satnaing/astro-paper.git
```

为了更新模板，请切换到一个新分支。如果你知道自己在做什么并且对自己的 git 技能有信心，可以省略此步骤。

```bash
git checkout -b build/update-astro-paper
```

然后，通过运行以下命令从 astro-paper 拉取更改：

```bash
git pull astro-paper main
```

如果你遇到 `fatal: refusing to merge unrelated histories` 错误，可以通过运行以下命令解决：

```bash
git pull astro-paper main --allow-unrelated-histories
```

运行上述命令后，你可能会在项目中遇到冲突。你需要手动解决这些冲突，并根据需要进行调整。

解决冲突后，彻底测试你的博客，确保一切按预期工作。检查你的文章、组件以及你进行的任何自定义。

一旦你对结果感到满意，就可以将更新分支合并到主分支中（前提是你在另一个分支中更新模板）。恭喜！你已成功将模板更新到最新版本。你的博客现在是最新的，准备好闪耀了！🎉

## 结论

在本文中，我分享了一些关于更新依赖项和 AstroPaper 模板的见解和过程。我真诚地希望这篇文章对你有价值，并帮助你更高效地管理你的项目。

如果你有任何更新依赖项/AstroPaper 的替代或改进方法，我很乐意听取你的意见。因此，请不要犹豫，在仓库中发起讨论，给我发邮件，或提出问题。你的意见和建议非常受欢迎！

请理解，我最近的时间安排非常紧张，可能无法快速回复。但我保证会尽快回复你。😬

感谢你花时间阅读这篇文章，祝你的项目一切顺利！