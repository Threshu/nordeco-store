import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable that syncs the document's lang attribute with the current locale.
 * Updates <html lang=""> reactively when locale changes.
 */
export function useLocaleHead () {
  const { locale }=useI18n();

  // Update <html lang=""> when locale changes
  const updateHtmlLang=(lang: string) => {
    document.documentElement.lang=lang;
  };

  // Set initial value
  updateHtmlLang(locale.value);

  // Watch for changes
  watch(locale, (newLocale) => {
    updateHtmlLang(newLocale);
  });

  return {
    locale,
  };
}
