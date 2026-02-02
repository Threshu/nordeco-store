// ==============================================
// NORDECO STORE - Route Constants
// ==============================================

import type { SupportedLocale } from '@/i18n';

/**
 * Localized route paths for each language.
 * Keys: pl (Polish), en (English), sv (Swedish)
 */
export const LOCALIZED_PATHS: Record<string, Record<SupportedLocale, string>>={
  home: {
    pl: '/',
    en: '/',
    sv: '/',
  },
  products: {
    pl: '/produkty',
    en: '/products',
    sv: '/produkter',
  },
  productDetail: {
    pl: '/produkty/:slug',
    en: '/products/:slug',
    sv: '/produkter/:slug',
  },
  blog: {
    pl: '/blog',
    en: '/blog',
    sv: '/blogg',
  },
  blogPost: {
    pl: '/blog/:slug',
    en: '/blog/:slug',
    sv: '/blogg/:slug',
  },
  about: {
    pl: '/o-nas',
    en: '/about',
    sv: '/om-oss',
  },
  contact: {
    pl: '/kontakt',
    en: '/contact',
    sv: '/kontakt',
  },
  cart: {
    pl: '/koszyk',
    en: '/cart',
    sv: '/varukorg',
  },
  // Footer pages
  careers: {
    pl: '/kariera',
    en: '/careers',
    sv: '/karriar',
  },
  faq: {
    pl: '/faq',
    en: '/faq',
    sv: '/faq',
  },
  shipping: {
    pl: '/dostawa',
    en: '/shipping',
    sv: '/frakt',
  },
  returns: {
    pl: '/zwroty',
    en: '/returns',
    sv: '/returer',
  },
  terms: {
    pl: '/regulamin',
    en: '/terms',
    sv: '/villkor',
  },
  privacy: {
    pl: '/polityka-prywatnosci',
    en: '/privacy-policy',
    sv: '/integritetspolicy',
  },
};

export const ROUTE_NAMES={
  HOME: 'home',
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product-detail',
  BLOG: 'blog',
  BLOG_POST: 'blog-post',
  ABOUT: 'about',
  CONTACT: 'contact',
  CART: 'cart',
  NOT_FOUND: 'not-found',
} as const;

/**
 * Get localized path for a given route and locale.
 * @param routeKey - Key from LOCALIZED_PATHS (e.g., 'products')
 * @param locale - Current locale (pl, en, sv)
 * @param params - Optional route params (e.g., { slug: 'example' })
 */
export function getLocalizedPath (
  routeKey: keyof typeof LOCALIZED_PATHS,
  locale: SupportedLocale,
  params?: Record<string, string>
): string {
  const paths=LOCALIZED_PATHS[routeKey];
  let path=paths?.[locale]??paths?.pl??'/';

  if(params) {
    Object.entries(params).forEach(([key, value]) => {
      path=path.replace(`:${key}`, value);
    });
  }

  // Add locale prefix for non-default locales
  if(locale!=='pl') {
    path=`/${locale}${path}`;
  }

  return path;
}
