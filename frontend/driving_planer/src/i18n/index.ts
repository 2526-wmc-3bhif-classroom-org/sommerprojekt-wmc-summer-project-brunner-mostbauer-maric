import { createI18n } from 'vue-i18n'
import de from './de.json'
import en from './en.json'

const stored = localStorage.getItem('locale')
const savedLocale = stored === 'en' ? 'en' : 'de'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'de',
  messages: { de, en },
})
