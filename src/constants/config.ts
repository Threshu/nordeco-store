// ==============================================
// NORDECO STORE - App Configuration
// ==============================================

export const APP_CONFIG={
  name: 'Nordeco Store',

  // Default locale for Intl APIs (number/date formatting)
  // For UI translations, see src/i18n/
  defaultLocale: 'pl-PL',
  currency: 'PLN',

  // SEO defaults (can be overridden per-page)
  seo: {
    titleSuffix: 'Nordeco Store',
    defaultDescription: 'Nordic sustainable products store', // Fallback for SEO
  },

  // Pagination
  productsPerPage: 12,
  blogPostsPerPage: 6,

  // Performance
  imageFormats: ['webp', 'jpg'] as const,
  lazyLoadOffset: '200px',

  // Contentful
  contentful: {
    spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID??'',
    accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN??'',
    previewToken: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN??'',
    environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT??'master',
  },

  // Adobe Target
  adobeTarget: {
    clientCode: import.meta.env.VITE_ADOBE_TARGET_CLIENT_CODE??'',
    imsOrgId: import.meta.env.VITE_ADOBE_TARGET_IMS_ORG_ID??'',
  },
} as const;

export type AppConfig=typeof APP_CONFIG;
