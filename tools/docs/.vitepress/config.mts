import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sidebar = JSON.parse(
  readFileSync(resolve(__dirname, 'sidebar.json')).toString()
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'ja-JP',
  title: '柳営補任',
  base: '/edo-jinji/',
  description: '江戸幕府諸役人の任免記録',
  themeConfig: {
    nav: [
      {
        text: '索引',
        items: [
          {
            text: '役職名',
            link: 'index',
          },
        ],
      },
      {
        text: '原文',
        link: `/content/${sidebar[0].items[0].link}`,
      },
      {
        text: '本サイトについて',
        link: 'about',
      },
    ],
    sidebar: {
      '/content/': {
        base: '/content/',
        items: sidebar,
      },
    },
    outline: {
      level: 'deep',
      label: '目次',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Shenmin-Z/edo-jinji' },
    ],
    docFooter: {
      prev: '前のページ',
      next: '次のページ ',
    },
  },
})
