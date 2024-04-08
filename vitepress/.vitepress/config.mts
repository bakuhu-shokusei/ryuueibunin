import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sidebar = readFileSync(resolve(__dirname, 'sidebar.json')).toString()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '柳営補任',
  description: '江戸幕府諸役人の任免記録',
  themeConfig: {
    nav: [],
    sidebar: JSON.parse(sidebar),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Shenmin-Z/edo-jinji' },
    ],
  },
})
