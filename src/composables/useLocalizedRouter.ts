// ==============================================
// useLocalizedRouter - i18n-aware navigation
// ==============================================

import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LOCALIZED_PATHS, ROUTE_NAMES } from '@/constants/routes';
import type { SupportedLocale } from '@/i18n';

/**
 * Composable for i18n-aware routing.
 * Provides localized paths based on current locale.
 */
export function useLocalizedRouter () {
  const router=useRouter();
  const route=useRoute();
  const { locale }=useI18n();

  const currentLocale=computed(() => locale.value as SupportedLocale);

  /**
   * Get localized path for navigation.
   * @param routeKey - Key from LOCALIZED_PATHS
   * @param params - Optional route params (e.g., { slug: 'example' })
   */
  function localePath (
    routeKey: keyof typeof LOCALIZED_PATHS,
    params?: Record<string, string>
  ): string {
    const paths=LOCALIZED_PATHS[routeKey];
    let path=paths?.[currentLocale.value]??paths?.pl??'/';

    if(params) {
      Object.entries(params).forEach(([key, value]) => {
        path=path.replace(`:${key}`, value);
      });
    }

    // Add locale prefix for non-default locales
    if(currentLocale.value!=='pl') {
      path=`/${currentLocale.value}${path}`;
    }

    return path;
  }

  /**
   * Navigate to a localized route.
   */
  function navigateTo (
    routeKey: keyof typeof LOCALIZED_PATHS,
    params?: Record<string, string>
  ) {
    const path=localePath(routeKey, params);
    return router.push(path);
  }

  /**
   * Switch locale and navigate to the equivalent path in new locale.
   */
  function switchLocale (newLocale: SupportedLocale) {
    // Find current route key based on route name
    const currentRouteName=route.name?.toString().replace(/-(?:en|sv)$/, '');

    // Find the matching pathKey
    const routeNameToPathKey: Record<string, keyof typeof LOCALIZED_PATHS>={
      [ROUTE_NAMES.HOME]: 'home',
      [ROUTE_NAMES.PRODUCTS]: 'products',
      [ROUTE_NAMES.PRODUCT_DETAIL]: 'productDetail',
      [ROUTE_NAMES.BLOG]: 'blog',
      [ROUTE_NAMES.BLOG_POST]: 'blogPost',
      [ROUTE_NAMES.ABOUT]: 'about',
      [ROUTE_NAMES.CONTACT]: 'contact',
      [ROUTE_NAMES.CART]: 'cart',
    };

    const pathKey=currentRouteName? routeNameToPathKey[currentRouteName]:'home';

    if(!pathKey) {
      // Fallback to home
      locale.value=newLocale;
      return router.push(newLocale==='pl'? '/':`/${newLocale}/`);
    }

    // Get params from current route (e.g., slug)
    const params=route.params as Record<string, string>;

    // Build new path
    const paths=LOCALIZED_PATHS[pathKey];
    let newPath=paths?.[newLocale]??'/';

    // Replace params in path
    Object.entries(params).forEach(([key, value]) => {
      if(key!=='pathMatch') {
        newPath=newPath.replace(`:${key}`, value);
      }
    });

    // Add prefix for non-default locale
    if(newLocale!=='pl') {
      newPath=`/${newLocale}${newPath}`;
    }

    locale.value=newLocale;
    return router.push(newPath);
  }

  return {
    currentLocale,
    localePath,
    navigateTo,
    switchLocale,
  };
}
