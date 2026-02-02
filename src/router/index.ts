// ==============================================
// NORDECO STORE - Vue Router with i18n support
// ==============================================

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { LOCALIZED_PATHS, ROUTE_NAMES } from '@/constants/routes';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n';
import i18n, { t } from '@/i18n';

// Lazy-loaded views for better performance
const HomeView=() => import('@/views/HomeView.vue');
const ProductsView=() => import('@/views/ProductsView.vue');
const ProductDetailView=() => import('@/views/ProductDetailView.vue');
const BlogView=() => import('@/views/BlogView.vue');
const BlogPostView=() => import('@/views/BlogPostView.vue');
const AboutView=() => import('@/views/AboutView.vue');
const ContactView=() => import('@/views/ContactView.vue');
const CartView=() => import('@/views/CartView.vue');
const NotFoundView=() => import('@/views/NotFoundView.vue');

/**
 * Route configuration with title keys for i18n.
 */
interface RouteConfig {
  pathKey: keyof typeof LOCALIZED_PATHS;
  name: string;
  component: () => Promise<unknown>;
  titleKey: string;
}

const routeConfigs: RouteConfig[]=[
  { pathKey: 'home', name: ROUTE_NAMES.HOME, component: HomeView, titleKey: 'nav.home' },
  { pathKey: 'products', name: ROUTE_NAMES.PRODUCTS, component: ProductsView, titleKey: 'products.title' },
  { pathKey: 'productDetail', name: ROUTE_NAMES.PRODUCT_DETAIL, component: ProductDetailView, titleKey: 'products.details' },
  { pathKey: 'blog', name: ROUTE_NAMES.BLOG, component: BlogView, titleKey: 'blog.title' },
  { pathKey: 'blogPost', name: ROUTE_NAMES.BLOG_POST, component: BlogPostView, titleKey: 'blog.article' },
  { pathKey: 'about', name: ROUTE_NAMES.ABOUT, component: AboutView, titleKey: 'about.title' },
  { pathKey: 'contact', name: ROUTE_NAMES.CONTACT, component: ContactView, titleKey: 'contact.title' },
  { pathKey: 'cart', name: ROUTE_NAMES.CART, component: CartView, titleKey: 'cart.title' },
];

/**
 * Generate routes for all locales.
 * Default locale (pl) has no prefix: /produkty
 * Other locales have prefix: /en/products, /sv/produkter
 */
function generateLocalizedRoutes (): RouteRecordRaw[] {
  const routes: RouteRecordRaw[]=[];
  const defaultLocale: SupportedLocale='pl';

  SUPPORTED_LOCALES.forEach((locale) => {
    const isDefault=locale===defaultLocale;
    const prefix=isDefault? '':`/${locale}`;

    routeConfigs.forEach((config) => {
      const paths=LOCALIZED_PATHS[config.pathKey];
      const localizedPath=paths?.[locale]??paths?.pl??'/';

      routes.push({
        path: `${prefix}${localizedPath}`,
        name: isDefault? config.name:`${config.name}-${locale}`,
        component: config.component,
        meta: {
          titleKey: config.titleKey,
          locale,
        },
      });
    });
  });

  // 404 route - catches all unmatched paths
  routes.push({
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: NotFoundView,
    meta: { titleKey: 'errors.notFound.title' },
  });

  return routes;
}

const router=createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: generateLocalizedRoutes(),
  scrollBehavior (to, _from, savedPosition) {
    if(savedPosition) {
      return savedPosition;
    }
    if(to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  },
});

// Update document title and sync locale on route change
router.beforeEach((to) => {
  const baseTitle='Nordeco Store';
  const titleKey=to.meta.titleKey as string|undefined;
  const routeLocale=to.meta.locale as SupportedLocale|undefined;

  // Sync i18n locale with route locale
  if(routeLocale&&SUPPORTED_LOCALES.includes(routeLocale)) {
    i18n.global.locale.value=routeLocale;
  }

  document.title=titleKey? `${t(titleKey)} | ${baseTitle}`:baseTitle;
});

export default router;
