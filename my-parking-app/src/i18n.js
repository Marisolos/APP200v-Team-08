// src/i18n.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import no from './locales/no.json'

export default createI18n({
  legacy: false,
  locale: 'no',
  fallbackLocale: 'en',
  messages: {
    en,
    no
  }
})
