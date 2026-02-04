/**
 * Composables barrel export
 */

// Core
export { useAsyncData, type AsyncDataState, type UseAsyncDataOptions } from './useAsyncData';

// Domain-specific
export {
  useProducts,
  useProduct,
  useProductsByCategory,
  type UseProductsReturn,
  type UseProductReturn,
  type UseProductsByCategoryReturn,
} from './useProducts';

export {
  useBlog,
  useBlogPost,
  type UseBlogReturn,
  type UseBlogPostReturn,
} from './useBlog';

export {
  useCategories,
  type UseCategoriesReturn,
} from './useCategories';
