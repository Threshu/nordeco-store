/**
 * Generic async data composable
 * Handles loading, error states, and data fetching with proper TypeScript support
 */

import { ref, type Ref } from 'vue';

export interface AsyncDataState<T> {
  data: Ref<T|null>;
  isLoading: Ref<boolean>;
  error: Ref<Error|null>;
  execute: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseAsyncDataOptions {
  immediate?: boolean;
}

/**
 * Generic composable for async data fetching
 * @param fetcher - Async function that returns data
 * @param options - Configuration options
 */
export function useAsyncData<T> (
  fetcher: () => Promise<T>,
  options: UseAsyncDataOptions={},
): AsyncDataState<T> {
  const { immediate=true }=options;

  const data=ref<T|null>(null) as Ref<T|null>;
  const isLoading=ref(false);
  const error=ref<Error|null>(null);

  async function execute (): Promise<void> {
    isLoading.value=true;
    error.value=null;

    try {
      data.value=await fetcher();
    } catch(e) {
      error.value=e instanceof Error? e:new Error(String(e));
      console.error('useAsyncData error:', e);
    } finally {
      isLoading.value=false;
    }
  }

  // Alias for execute
  const refresh=execute;

  // Execute immediately if option is set
  if(immediate) {
    execute();
  }

  return {
    data,
    isLoading,
    error,
    execute,
    refresh,
  };
}
