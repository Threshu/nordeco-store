/**
 * Products composable
 * Provides reactive access to product data from Contentful
 */

import { computed, ref, watch, type Ref, type ComputedRef } from 'vue';
import { useAsyncData, type AsyncDataState } from './useAsyncData';
import {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  type Product,
} from '@/services/contentful/graphql';

// ============================================================================
// Types
// ============================================================================

interface ProductsData {
  products: Product[];
  total: number;
}

export interface UseProductsReturn extends AsyncDataState<ProductsData> {
  /** All products */
  products: ComputedRef<Product[]>;
  /** Total count of products */
  total: ComputedRef<number>;
  /** Filter products by category slug */
  filterByCategory: (categorySlug: string|null) => void;
  /** Currently active category filter */
  activeCategory: Ref<string|null>;
  /** Filtered products based on active category */
  filteredProducts: ComputedRef<Product[]>;
}

export interface UseProductReturn extends AsyncDataState<Product|null> {
  /** Single product */
  product: ComputedRef<Product|null>;
}

export interface UseProductsByCategoryReturn extends AsyncDataState<ProductsData> {
  /** Products in category */
  products: ComputedRef<Product[]>;
  /** Total count */
  total: ComputedRef<number>;
}

// ============================================================================
// Composables
// ============================================================================

/**
 * Get all products with optional filtering
 */
export function useProducts (): UseProductsReturn {
  const asyncData=useAsyncData<ProductsData>(() => getProducts());

  const activeCategory=ref<string|null>(null);

  const products=computed(() => asyncData.data.value?.products??[]);
  const total=computed(() => asyncData.data.value?.total??0);

  const filteredProducts=computed(() => {
    if(!activeCategory.value) {
      return products.value;
    }
    return products.value.filter(
      (product) => product.category?.slug===activeCategory.value,
    );
  });

  function filterByCategory (categorySlug: string|null): void {
    activeCategory.value=categorySlug;
  }

  return {
    ...asyncData,
    products,
    total,
    filterByCategory,
    activeCategory,
    filteredProducts,
  };
}

/**
 * Get a single product by slug
 * @param slug - Product slug (can be reactive ref)
 */
export function useProduct (slug: Ref<string>|string): UseProductReturn {
  const slugRef=typeof slug==='string'? ref(slug):slug;

  const asyncData=useAsyncData<Product|null>(
    () => getProductBySlug(slugRef.value),
    { immediate: false },
  );

  const product=computed(() => asyncData.data.value);

  // Watch for slug changes and refetch
  watch(
    slugRef,
    () => {
      asyncData.execute();
    },
    { immediate: true },
  );

  return {
    ...asyncData,
    product,
  };
}

/**
 * Get products by category slug
 * @param categorySlug - Category slug (can be reactive ref)
 */
export function useProductsByCategory (
  categorySlug: Ref<string>|string,
): UseProductsByCategoryReturn {
  const slugRef=typeof categorySlug==='string'? ref(categorySlug):categorySlug;

  const asyncData=useAsyncData<ProductsData>(
    () => getProductsByCategory(slugRef.value),
    { immediate: false },
  );

  const products=computed(() => asyncData.data.value?.products??[]);
  const total=computed(() => asyncData.data.value?.total??0);

  // Watch for slug changes and refetch
  watch(
    slugRef,
    () => {
      asyncData.execute();
    },
    { immediate: true },
  );

  return {
    ...asyncData,
    products,
    total,
  };
}
