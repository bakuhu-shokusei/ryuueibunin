import { defineConfig } from 'vitepress'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { tokenize } from './search/tokenize.mjs'
import { processTerm } from './search/normalize.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sidebar = JSON.parse(
  readFileSync(resolve(__dirname, 'sidebar.json')).toString()
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'ja-JP',
  title: '柳営補任',
  base: '/ryuueibunin/',
  description: '江戸幕府諸役人の任免記録',
  head: [['link', { rel: 'icon', href: '/ryuueibunin/favicon.ico' }]],
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
      { icon: 'github', link: 'https://github.com/bakuhu-shokusei/ryuueibunin' },
    ],
    docFooter: {
      prev: '前のページ',
      next: '次のページ ',
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize,
            processTerm,
          },
          searchOptions: {
            combineWith: 'AND',
          },
        },
        detailedView: false,
        translations: {
          button: {
            buttonText: '検索',
            buttonAriaLabel: '検索',
          },
          modal: {
            noResultsText: '一致する検索結果がありません',
            footer: {
              navigateText: '移動する',
              selectText: '選択する',
              closeText: '閉じる',
            },
          },
        },
        _render(src, env, md) {
          // ignore indexing file itself
          if (env.path.includes('indexing')) return ''

          const newPath = env.path.replace('content', 'indexing')
          if (!newPath.includes('indexing')) {
            return ''
          }
          const newSrc = readFileSync(newPath).toString()
          return md.render(newSrc)
        },
      },
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPLocalSearchBox\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/LocalSearchBox.vue', import.meta.url)
          ),
        },
      ],
    },
  },
})
