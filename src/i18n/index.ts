import { createI18n } from 'vue-i18n';
import pl from './locales/pl.json';
import en from './locales/en.json';
import sv from './locales/sv.json';

export type SupportedLocale='pl'|'en'|'sv';

export const SUPPORTED_LOCALES: SupportedLocale[]=['pl', 'en', 'sv'];

export const LOCALE_NAMES: Record<SupportedLocale, string>={
  pl: 'Polski',
  en: 'English',
  sv: 'Svenska',
};

function getDefaultLocale (): SupportedLocale {
  if(typeof navigator==='undefined') return 'pl';
  const browserLang=navigator.language.split('-')[0];
  if(SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }
  return 'pl';
}

const i18n=createI18n({
  legacy: false, // Use Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    pl,
    en,
    sv,
  },
});

export default i18n;

// ==============================================
// Global i18n helpers for use outside Vue components
// (composables, services, utils)
// ==============================================

/**
 * Get the global i18n instance.
 * Use this in composables or services where useI18n() is not available.
 *
 * @example
 * import { getI18n } from '@/i18n'
 * const { t, locale } = getI18n()
 * console.log(t('common.loading'))
 */
export function getI18n () {
  return i18n.global;
}

/**
 * Global translate function for use outside Vue components.
 * Prefer useI18n() in Vue components for reactivity.
 *
 * @example
 * import { t } from '@/i18n'
 * console.log(t('common.loading'))
 */
export const t=i18n.global.t;
