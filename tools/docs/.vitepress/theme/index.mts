import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Note from '../components/Note.vue'
import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Note', Note)
  },
}
export default theme
