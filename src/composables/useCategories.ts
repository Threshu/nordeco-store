/**
 * Categories composable
 * Provides reactive access to category data from Contentful
 */

import { computed, type ComputedRef } from 'vue';
import { useAsyncData, type AsyncDataState } from './useAsyncData';
import { getCategories, type Category } from '@/services/contentful/graphql';

// ============================================================================
// Types
// ============================================================================

export interface UseCategoriesReturn extends AsyncDataState<Category[]> {
  /** All categories */
  categories: ComputedRef<Category[]>;
  /** Find category by slug */
  getCategoryBySlug: (slug: string) => Category|undefined;
}

// ============================================================================
// Composables
// ============================================================================

/**
 * Get all categories
 */
export function useCategories (): UseCategoriesReturn {
  const asyncData=useAsyncData<Category[]>(getCategories);

  const categories=computed(() => asyncData.data.value??[]);

  function getCategoryBySlug (slug: string): Category|undefined {
    return categories.value.find((category) => category.slug===slug);
  }

  return {
    ...asyncData,
    categories,
    getCategoryBySlug,
  };
}
