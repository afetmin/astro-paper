import type { Site, SocialObjects } from "./types";
import type { GiscusProps } from "@giscus/react";

export const SITE: Site = {
  website: "https://afetmin.netlify.app/", // replace this with your deployed domain
  author: "Rion",
  profile: "",
  desc: "从HTML、CSS到JavaScript，以及流行的框架和工具（如React、Vue），我会记录我的学习过程、项目实践和技术心得。",
  title: "DevDino 🦖",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
};

export const LOCALE = {
  lang: "zh-CN", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/afetmin",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:kingpenguins@163.com",
    linkTitle: `发送邮件给 ${SITE.title}`,
    active: true,
  },
  {
    name: "X",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on X`,
    active: false,
  },
];

export const GISCUS: GiscusProps = {
  repo: "afetmin/astro-paper",
  repoId: "R_kgDONZvFHA",
  category: "General",
  categoryId: "DIC_kwDONZvFHM4CmQeT",
  mapping: "pathname",
  reactionsEnabled: "0",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "zh-CN",
  loading: "lazy",
};